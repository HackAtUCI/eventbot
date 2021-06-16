import './scheduleMessage.css';

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

    const loadScheduledMessages = () => {
        slackClient.getScheduledMessages().then(messages => {
            setScheduledMessages(messages);
        })
    }

    const scheduleMessage = async (message, channel) => {
        await slackClient.scheduleMessage(message, channel, timeInput.current.value);
        loadScheduledMessages();
    }

    const deleteMessage = async (messageId, channelId) => {
        await slackClient.deleteScheduledMessage(messageId, channelId);
        loadScheduledMessages();
    }

    return (
        <div>
            <h1>Schedule message</h1>
            <input ref={timeInput} placeholder="Epoch time"/>
            <MessageInput submitAction={scheduleMessage} />
            <h3>Scheduled Messages</h3>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Channel</th>
                    <th>Post At</th>
                    <th>Text</th>
                    <th>Delete Message</th>
                </tr>
                {scheduledMessages.map(message => {
                    const {id, channel_id, post_at, text} = message;

                    return (
                        <tr key={id}>
                            <td>{id}</td>
                            <td>{channel_id}</td>
                            <td>{post_at}</td>
                            <td><pre>{text}</pre></td>
                            <td><button onClick={()=>{deleteMessage(id, channel_id)}}>Delete</button></td>
                        </tr>
                    )
                })}        
            </table>
        </div>
    );
}

export default ScheduleMessage;
