import './scheduleMessage.css';

import MessageInput from '../components/messageInput/messageInput'
import { useContext, useEffect, useRef, useState } from 'react';
import AppContext from '../AppContext';

function EditMessage() {
    const {slackClient, workspace, isLoading} = useContext(AppContext);
    const [prevMessages, setPrevMessages] = useState([]);
    const [selectedMessageId, setSelectedMessageId] = useState('');
    const selectedMessageTextArea = useRef(null);
    // const timeInput = useRef(null)
    
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

    const updateMessage = (oldMessageDetails) => {
        const updatedText = selectedMessageTextArea.current.value;
        //slackClient.editMessage(oldMessageDetails, updatedText);
    }

    const deleteMessage = async (messageDetails) => {
        //await slackClient.deleteScheduledMessage(messageId, channelId);
        //loadPrevMessages();
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
                        logTs
                    } = message;

                    const selected = selectedMessageId===logTs;

                    return (
                        <tr key={logTs}>
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
                                        <button onClick={()=>{resetTextArea(text)}}>Reset</button>
                                        <button onClick={()=>{updateMessage(message)}}>Update</button>
                                    </div>
                                    :
                                    <button onClick={()=>{editMessage(logTs)}}>Edit</button>
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
