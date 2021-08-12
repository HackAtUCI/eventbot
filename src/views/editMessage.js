import './scheduleMessage.css';

import MessageTable from '../components/messageTable/messageTable';
import { useContext, useEffect, useState } from 'react';
import AppContext from '../AppContext';

function EditMessage() {
    const {slackClient, isLoading} = useContext(AppContext);
    const [prevMessages, setPrevMessages] = useState([]);
    
    useEffect(()=>{
        if (!isLoading) {loadPrevMessages()};
    }, [isLoading])

    const loadPrevMessages = () => {
        slackClient.loadLog().then(messages => {
            setPrevMessages(messages)
        })
    }

    const updateMessage = async (oldMessageDetails, updatedText) => {
        const {messageDetails: {channel, ts}, log_ts } = oldMessageDetails;
        await slackClient.editMessage(channel, ts, updatedText, log_ts);
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
            <MessageTable 
                messages={prevMessages}
                onUpdateMessage={updateMessage}
                onDeleteMessage={deleteMessage}
            />
            {/* <h3>Manual Edit</h3>
            <p>If the message you want to edit is missing from the list above, you can also manually enter the message below.</p>
            <p><em>Note: You can only edit messages sent by the bot</em></p>
            <input placeholder="Timestamp"/>
            <MessageInput submitAction={scheduleMessage} /> */}
        </div>
    );
}

export default EditMessage;
