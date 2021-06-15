import MessageInput from '../components/messageInput/messageInput'
import { useContext, useEffect, useRef, useState } from 'react';
import AppContext from '../AppContext';

function ScheduleMessage() {
    const {slackClient} = useContext(AppContext);
    const [scheduledMessages, setScheduledMessages] = useState([]);
    const timeInput = useRef(null)
    
    useEffect(()=>{
        loadScheduledMessages();
    }, [])

    const scheduleMessage = (message, channel) => {
        slackClient.scheduleMessage(message, channel, timeInput.current.value);
    }

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
            <input ref={timeInput} placeholder="Epoch time"/>
            <MessageInput submitAction={scheduleMessage} />
            <h3>Scheduled Messages</h3>
            {scheduledMessages.map(message => {
                const {id, channel_id, post_at, text} = message;

                return (
                    <div key={id}>
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
