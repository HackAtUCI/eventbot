import { useContext, useRef, useState } from 'react';
import AppContext from '../../AppContext';

function MessageTable(props) {
    const {messages, onUpdateMessage, onDeleteMessage, showIdCol=false} = props;

    const {workspace} = useContext(AppContext);
    const [selectedMessageId, setSelectedMessageId] = useState('');
    const selectedMessageTextArea = useRef(null);

    const editMessage = (id) => {
        setSelectedMessageId(id)
    }

    const resetTextArea = (text) => {
        selectedMessageTextArea.current.value = text; 
        setSelectedMessageId('');
    }

    const updateMessage = (oldMessageDetails) => {
        const updatedText = selectedMessageTextArea.current.value;
        onUpdateMessage(oldMessageDetails, updatedText);
        setSelectedMessageId('')
    }

    const generateRow = (message) => {
        const {
            messageDetails: {channel, ts, text}, 
            log_ts
        } = message;

        const selected = selectedMessageId===log_ts;

        return (
            <tr key={log_ts}>
                {showIdCol && <td>{log_ts}</td>}
                <td>#{workspace && workspace.channels[channel].name}</td>
                <td>{new Date(ts*1000).toLocaleString()}</td>
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
                <td><button onClick={()=>{onDeleteMessage(message)}}>Delete</button></td>
            </tr>
        )
    }

    return (
        <table>
            <tbody>
                <tr>
                    {showIdCol && <th>Id</th>}
                    <th>Channel</th>
                    <th>Datetime</th>
                    <th>Timestamp</th>
                    <th>Text</th>
                    <th>Edit</th>
                    <th>Delete Message</th>
                </tr>
                {messages.map(message => generateRow(message)) }
            </tbody>       
        </table>
    )
}

export default MessageTable;