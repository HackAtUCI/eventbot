import './scheduleMessage.css';

import MessageInput from '../components/messageInput/messageInput'
import { useContext, useEffect, useRef, useState } from 'react';
import AppContext from '../AppContext';

function EditMessage() {
    const {slackClient, workspace, isLoading} = useContext(AppContext);
    const [prevMessages, setPrevMessages] = useState([]);
    const [selectedMessageId, setSelectedMessageId] = useState('');
    const selectedMessageTextArea = useRef(null);
    
    useEffect(()=>{
        if (!isLoading) {loadPrevMessages()};
    }, [isLoading])

    const loadPrevMessages = () => {
        slackClient.loadPrevMessages().then(messages => {
            setPrevMessages(messages)
        })
    }

    const editMessage = (id) => {
        setSelectedMessageId(id)
    }

    const resetTextArea = (text) => {
        selectedMessageTextArea.current.value = text; 
        setSelectedMessageId('');
    }

    const updateMessage = async (oldMessageDetails) => {
        const {messageDetails: {channel, ts}, log_ts } = oldMessageDetails;
        const updatedText = selectedMessageTextArea.current.value;
        await slackClient.editMessage(channel, ts, updatedText, log_ts);
        setSelectedMessageId('')
        loadPrevMessages();
    }

    const deleteMessage = async (oldMessageDetails) => {
        const {messageDetails: {channel, ts}, log_ts } = oldMessageDetails;
        await slackClient.deleteMessage(channel, ts, log_ts);
        loadPrevMessages();
    }

    return (
        <div>
            <h1>Edit message</h1>
            <p>Select a message below to edit or delete.</p>
            <h3>Previous Messages</h3>
            <table>
                <tbody>
                <tr>
                    <th>Channel</th>
                    <th>Timestamp</th>
                    <th>Text</th>
                    <th>Edit</th>
                    <th>Delete Message</th>
                </tr>
                {prevMessages.map(message => {
                    const {
                        messageDetails: {channel, ts, text}, 
                        log_ts
                    } = message;

                    const selected = selectedMessageId===log_ts;

                    return (
                        <tr key={log_ts}>
                            <td>#{workspace && workspace.channels[channel].name}</td>
                            <td>{ts}</td>
                            <td>
                                <textarea 
                                    defaultValue={text} 
                                    readOnly={!selected} 
                                    ref={selected ? selectedMessageTextArea : null}
                                />
                            </td>
                            <td>
                                { selected ?
                                    <div>
                                        <button onClick={()=>{resetTextArea(text)}}>Cancel</button>
                                        <button onClick={()=>{updateMessage(message)}}>Update</button>
                                    </div>
                                    :
                                    <button onClick={()=>{editMessage(log_ts)}}>Edit</button>
                                }
                            </td>
                            <td><button onClick={()=>{deleteMessage(message)}}>Delete</button></td>
                        </tr>
                    )
                })}        
                </tbody>       
            </table>
            {/* <h3>Manual Edit</h3>
            <p>If the message you want to edit is missing from the list above, you can also manually enter the message below.</p>
            <p><em>Note: You can only edit messages sent by the bot</em></p>
            <input placeholder="Timestamp"/>
            <MessageInput submitAction={scheduleMessage} /> */}
        </div>
    );
}

export default EditMessage;
