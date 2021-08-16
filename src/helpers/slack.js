import { WebClient } from "@slack/web-api";

class SlackClient {
    /**
     * Initializer
     * This function must be called after constructing a new object.
     *
     * Afterwards, the following attributes are loaded on the SlackClient
     *  slackClient - the Slack WebClient used to communicate with the Web API
     *  userId      - Bot's ID, used to send DMs to the Bot's channel.
     *  logChannel  - Channel ID for the bot's log 
     */
    async init(token) {
        // Create WebClient to interface with Slack API
        this.slackClient = new WebClient(token);

        // Remove User-Agent Header since it causes a CORS error on Safari and Firefox
        delete this.slackClient["axios"].defaults.headers["User-Agent"];

        const botInfo = await this.validateToken();
        this.userId = botInfo.user_id;

        this.logChannel = await this._getLogChannel();
    }

    logout() {
        delete this.slackClient;
    }

    /**
     * Post Message
     * 
     * @param {string} message      - text to send
     * @param {string} channel      - channel id to send to
     * @param {boolean=true} log    - log the message, so it can be edited or deleted later
     * @returns the response from the Slack API call
     */
    async postMessage(message, channel, log=true) {
        const resp = await this.slackClient.chat.postMessage({ text: message, channel: channel }).catch((err) => {
            console.error(err, {channel, message});
            alert(err + "\n\nSee the full error message in the console.");
        })

        // Save the message to it's private DMs
        if (log) { this._logMessage(resp.ts, resp.channel, resp.message.text); }
        
        return resp
    }

    /**
     * Edit Message
     * 
     * @param {string} channel  - channel id of the message
     * @param {string} ts       - timestamp of the message
     * @param {string} text     - updated text to send
     * @param {string} [log_ts] - timestamp of the assosiated log message
     */
    async editMessage(channel, ts, text, log_ts) {
        this.slackClient.chat.update({channel, ts, text})
        
        // Update the message history DM to have the new text
        if (log_ts) { this._updateLogMessage(log_ts, channel, ts, text) }
    }

    /**
     * Delete Message
     * 
     * @param {string} channel  - channel id of the message
     * @param {string} ts       - timestamp of the message
     * @param {string} log_ts   - timestamp of the assosiated log message
     */
    async deleteMessage(channel, ts, log_ts) {
        this.slackClient.chat.delete({channel, ts})

        // Delete the message 
        if (log_ts) { await this._deleteLogMessage(log_ts) }
    }

    /**
     * Schedule Message
     * Schedule a message to send at a future time
     * 
     * @param {string} text     - text to send
     * @param {string} channel  - channel id to send to
     * @param {string} post_at  - epoch timestamp to send the message at
     */
    async scheduleMessage(text, channel, post_at) {
        await this.slackClient.chat.scheduleMessage({ channel, text, post_at }).catch((err) => {
            console.error(err, {channel, text, post_at});
            alert('Unable to schedule message. Review the error message in the console.');
        })
    }

    /**
     * Delete Scheduled Message
     * 
     * @param {string} scheduled_message_id - id of the scheduled message
     * @param {string} channel              - channel id of the message
     */
     async deleteScheduledMessage(scheduled_message_id, channel) {
        await this.slackClient.chat.deleteScheduledMessage({scheduled_message_id, channel}).catch((err) => {
            console.error(err, {scheduled_message_id, channel});
            alert('Unable to delete scheduled message. Review the error message in the console.');
        });
    }

    /**
     * Update Scheduled Message
     * There is no slack api to update a scheduled message. 
     * Instead we must delete the old message a schedule a new one at the same timestamp.
     * 
     * @param {string} scheduled_message_id - id of the scheduled message
     * @param {string} channel              - channel id of the message
     * @param {string} updated_text         - updated text to send
     * @param {string} post_at              - epoch timestamp to send the message at
     */
    async updateScheduledMessage(scheduled_message_id, channel, updated_text, post_at) {
        await this.deleteScheduledMessage(scheduled_message_id, channel);
        await this.scheduleMessage(updated_text, channel, post_at);
    }

    /**
     * Get Scheduled Messages
     * 
     * @returns a list of scheduled messages sorted by timestamp
     */
    async getScheduledMessages() {
        const resp = await this.slackClient.chat.scheduledMessages.list();

        // Sort the scheduled messages by post_at time
        // Earliest messages will appear first
        const scheduledMessages = resp.scheduled_messages.sort((m1, m2) => m1.post_at-m2.post_at);

        return scheduledMessages;
    }

    /**
     * Load Log
     *
     * @returns a list of messages in the log channel
     */
    async loadLog() {
        // All previously sent messages are stored in the bot's DM with itself
        // Load the messages from that private dm channel
        const resp = await this.slackClient.conversations.history({channel: this.logChannel});
        
        const prevMessages = resp.messages.reduce((messages, message) => {
                try {
                    const {text, ts} = message
                    // For all messages in the channel,
                    // convert them to JSON and add them to the list 
                    messages.push({messageDetails: JSON.parse(text), log_ts: ts})
                    return messages
                } catch {
                    // If the JSON.parse threw an error, ignore that message
                    return messages
                }
            }, []);

        return prevMessages
    }

    /**
     * Log Message
     * Save the text, timestamp, and channel of a posted message to the bot's log,
     * in JSON format, so it can be retrieved later
     * 
     * Format looks like {text: '{text}', ts: '{ts}', channel: '{channel}'}
     * 
     * @param {string} ts - timestamp of the assosiated log message
     * @param {string} channel - channel the message was sent in
     * @param {string} text - text of the message
     */
    async _logMessage(ts, channel, text) {
        const messageDetails = { text, ts, channel }

        // Send a message to it's own user id, containing the message details
        // It can retrieve this message later by reading the conversation with itself
        this.postMessage(JSON.stringify(messageDetails), this.userId, false);
    }

    /**
     * Update Log Message
     * Updates the log message assosiated with a real message
     * This should be called when a message is edited
     * 
     * @param {string} log_ts - timestamp of the assosiated log message
     * @param {string} channel - channel the original message was sent in
     * @param {string} message_ts - timestamp of the original message
     * @param {string} text - updated text of the message
     */
    async _updateLogMessage(log_ts, channel, message_ts, text) {
        const messageDetails = { channel, ts: message_ts, text }
        this.editMessage(this.logChannel, log_ts, JSON.stringify(messageDetails))
    }

    /**
     * Delete Log Message
     * Removes message from the log
     * This should be called when a message is deleted
     * 
     * @param {string} log_ts - the timestamp of the logged message (not when the actual message was posted)
     */
    async _deleteLogMessage(log_ts) {
        await this.slackClient.chat.delete({channel: this.logChannel, ts: log_ts})
    }

    /**
     * Get Log Channel
     * The log is stored under the Bot's DMs
     * This fetches the channel id for that
     * If the conversation doesn't exist yet, this will start it
     * 
     * @returns the channel id for the log (Bot's own DMs)
     */
    async _getLogChannel() {
        // Get a list of all DM conversations
        const resp = await this.slackClient.conversations.list({types: "im"})

        // Reduce that list to the channel id of the conversation with its own id
        var logChannel = resp.channels.reduce((val, convo) => {
            return convo.user === this.userId ? convo.id : val
        }, null);
        
        // If the conversation with itself has not started yet,
        // Create the conversation and save the channel id
        if (!logChannel) {
            logChannel = (await this.postMessage("Starting message history", this.userId, false)).channel;
        }

        return logChannel
    }

    /**
     * Validate Token
     * Verify that the token is still valid, but sending a test request
     * 
     * @returns the response from the auth.test api call
     */
    async validateToken() {
        return await this.slackClient.auth.test()
            .catch(err => {
                return Promise.reject(`Invalid token: '${this.slackClient.token}'`)
            })
    }

    /**
     * Load Workspace
     * Fetch the channels and team information for the worksapce
     * 
     * @returns an object containg the dictionary of channels and team information
     * {channels: {id: {id, name}}, team: {team info}}
     */
    async loadWorkspace() {    
        const [channels, team] = await Promise.all([
            // Load channels from Slack Workspace
            // Set selected channel to the first channel in the list
            this.slackClient.conversations.list()
                .then(result => {
                    const channels = result.channels
                    .map(channel => ({id: channel.id, name: channel.name}))
                    .sort((c1, c2) => (c1.name > c2.name) ? 1 : -1)
                    .reduce((channelDict, channel) => {
                        channelDict[channel.id] = {...channel};
                        return channelDict;
                    }, {});
                    return {channels};
                }
            ),

            // Load team information
            this.slackClient.team.info()
                .then(result => {
                    return {team: {name: result.team.name, icon: result.team.icon.image_230}};
                }
            )
        ])
        
        return {...channels, ...team }
    }
}

const slackClient = new SlackClient();
export default slackClient;
