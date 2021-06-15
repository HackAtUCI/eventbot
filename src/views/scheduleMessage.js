import { useContext, useEffect, useState } from 'react';
import AppContext from '../AppContext';

function ScheduleMessage() {
    const {slackClient} = useContext(AppContext);
    const [scheduledMessages, setScheduledMessages] = useState([]);
    
    useEffect(()=>{
        loadScheduledMessages();
    }, [])

    const loadScheduledMessages = () => {
        slackClient.getScheduledMessages().then(messages => {
            setScheduledMessages(messages);
        })
    }

    const deleteMessage = async (messageId, channelId) => {
        slackClient.deleteScheduledMessage(messageId, channelId);
        
        // Note this is a race condition, since we don't wait for the delete to finsih
        // TODO: wait for deleteScheduleMessage to finish
        loadScheduledMessages();
    }

    return (
        <div>
            <h1>Schedule message</h1>
            {scheduledMessages.map(message => {
                const {id, channel_id, post_at, text} = message;

                return (
                    <div>
                        <div>
                            <i>{post_at}</i> in {channel_id}
                        </div>
                        <p>{text}</p>
                        <button onClick={()=>{deleteMessage(id, channel_id)}}>Delete</button>
                    </div>
                )
            })}        
        </div>
    );
}

export default ScheduleMessage;
