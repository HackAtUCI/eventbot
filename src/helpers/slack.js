class SlackClient {
    constructor(webclient) {
        this.slackClient = webclient;
    }

    async init() {
        const botInfo = await this.validateToken();
        this.userId = botInfo.user_id;

        this.messageHistoryId = await this.getMessageHistoryChannel();
    }

    async postMessage(message, channel, log=true) {
        const resp = await this.slackClient.chat.postMessage({ text: message, channel: channel }).catch((err) => {
            console.error(err, {channel, message});
            alert(err + "\n\nSee the full error message in the console.");
        })

        // Save the message to it's private DMs
        if (log) { this.saveMessageDetails(resp); }
        
        return resp
    }

    async scheduleMessage(text, channel, post_at) {
        await this.slackClient.chat.scheduleMessage({ channel, text, post_at }).catch((err) => {
            console.error(err, {channel, text, post_at});
            alert('Unable to schedule message. Review the error message in the console.');
        })
    }

    async getScheduledMessages() {
        const resp = await this.slackClient.chat.scheduledMessages.list();
        return resp.scheduled_messages;
    }

    async deleteScheduledMessage(scheduled_message_id, channel) {
        await this.slackClient.chat.deleteScheduledMessage({scheduled_message_id, channel}).catch((err) => {
            console.error(err, {scheduled_message_id, channel});
            alert('Unable to delete scheduled message. Review the error message in the console.');
        });
    }

    async getMessageHistoryChannel() {
        // Get a list of all DM conversations
        const resp = await this.slackClient.conversations.list({types: "im"})

        // Reduce that list to the channel id of the conversation with its own id
        var messageHistoryId = resp.channels.reduce((val, convo) => {
            return convo.user === this.userId ? convo.id : val
        }, null);
        
        // If the conversation with itself has not started yet,
        // Create the conversation and save the channel id
        if (!messageHistoryId) {
            messageHistoryId = (await this.postMessage("Starting message history", this.userId, false)).channel;
        }

        return messageHistoryId
    }

    async loadPrevMessages() {
        // All previously sent messages are stored in the bot's DM with itself
        // Load the messages from that private dm channel
        const resp = await this.slackClient.conversations.history({channel: this.messageHistoryId});
        
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

    async saveMessageDetails(resp) {
        const messageDetails = {
            text: resp.message.text,
            ts: resp.ts,
            channel: resp.channel
        }

        // Send a message to it's own user id, containing the message details
        // It can retrieve this message later by reading the conversation with itself
        this.postMessage(JSON.stringify(messageDetails), this.userId, false);
    }

    async validateToken() {
        return await this.slackClient.auth.test()
            .catch(err => {
                return Promise.reject(`Invalid token: '${this.slackClient.token}'`)
            })
    }

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

export default SlackClient;