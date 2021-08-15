import './scheduleMessage.css';

import MessageInput from '../components/messageInput/messageInput';
import TimePicker from '../components/timepicker/timePicker'
import { useContext, useEffect, useState } from 'react';
import AppContext from '../AppContext';

function ScheduleMessage() {
    const {slackClient, workspace, isLoading} = useContext(AppContext);
    const [scheduledMessages, setScheduledMessages] = useState([]);
    const [timeInput, setTimeInput] = useState(null)
    
    useEffect(()=>{
        if (!isLoading) {loadScheduledMessages()};
    }, [isLoading])

    const loadScheduledMessages = () => {
        slackClient.getScheduledMessages().then(messages => {
            setScheduledMessages(messages);
        })
    }

    const scheduleMessage = async (message, channel) => {
        await slackClient.scheduleMessage(message, channel, timeInput);
        loadScheduledMessages();
    }

    const deleteMessage = async (messageId, channelId) => {
        await slackClient.deleteScheduledMessage(messageId, channelId);
        loadScheduledMessages();
    }

    return (
        <div>
            <h1>Schedule message</h1>
            <div className="datepicker-container">
                <TimePicker setParentTimeInput={setTimeInput}/>
            </div>
            
            <MessageInput submitAction={scheduleMessage} />
            <h3>Scheduled Messages</h3>
            <table>
                <tbody>
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
                            <td>#{workspace && workspace.channels[channel_id].name}</td>
                            <td>{post_at}</td>
                            <td><pre>{text}</pre></td>
                            <td><button onClick={()=>{deleteMessage(id, channel_id)}}>Delete</button></td>
                        </tr>
                    )
                })}        
                </tbody>       
            </table>
        </div>
    );
}

export default ScheduleMessage;
