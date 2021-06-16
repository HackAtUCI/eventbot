class SlackClient {
    constructor(webclient) {
        this.slackClient = webclient;
    }

    postMessage(message, channel) {
        this.slackClient.chat.postMessage({ text: message, channel: channel }).catch((err) => {
            console.error(err, {channel, message});
            alert('Unable to post message. Review the error message in the console.');
        })
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

    async validateToken() {
        await this.slackClient.auth.test().catch(err => {
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