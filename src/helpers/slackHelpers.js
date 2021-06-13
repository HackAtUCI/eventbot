const validateToken = async (slackClient) => {
    await slackClient.auth.test().catch(err => {
        return Promise.reject(`Invalid token: '${slackClient.token}'`)
    })
}

const loadWorkspace = async (slackClient) => {    
    const [channels, team] = await Promise.all([
        // Load channels from Slack Workspace
        // Set selected channel to the first channel in the list
        slackClient.conversations.list()
            .then(result => {
                const channels = result.channels
                .map(channel => ({id: channel.id, name: channel.name}))
                .sort((c1, c2) => (c1.name > c2.name) ? 1 : -1);
                return {channels};
            }
        ),

        // Load team information
        slackClient.team.info()
            .then(result => {
                return {team: {name: result.team.name, icon: result.team.icon.image_230}};
            }
        )
    ])
    
    return {...channels, ...team }
}

export {loadWorkspace, validateToken}