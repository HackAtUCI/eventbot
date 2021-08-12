import './scheduleMessage.css';

import MessageInput from '../components/messageInput/messageInput'
import { useContext, useEffect, useRef, useState } from 'react';
import AppContext from '../AppContext';
import MessageTable from '../components/messageTable/messageTable';

function ScheduleMessage() {
    const {slackClient, isLoading} = useContext(AppContext);
    const [scheduledMessages, setScheduledMessages] = useState([]);
    const timeInput = useRef(null)
    
    useEffect(()=>{
        if (!isLoading) {loadScheduledMessages()};
    }, [isLoading])

    const loadScheduledMessages = () => {
        slackClient.getScheduledMessages().then(messages => {
            // The list of messages needs to match the structure of messages from slackClient.loadLog()
            // This map reformats the messages accordingly. The scheduled message id is used as the "log_ts".
            // I realize isn't ideal... maybe we should rework this? 
            const formattedMessages = messages.map(message => {
                return {
                    messageDetails: {
                        channel: message.channel_id,
                        ts: message.post_at,
                        text: message.text
                    },
                    log_ts: message.id
                }
            });

            setScheduledMessages(formattedMessages);
        })
    }

    const scheduleMessage = async (message, channel) => {
        await slackClient.scheduleMessage(message, channel, timeInput.current.value);
        loadScheduledMessages();
    }

    const updateMessage = async (oldMessageDetails, updatedText) => {
        const {messageDetails: {channel, ts}, log_ts } = oldMessageDetails;
        await slackClient.updateScheduledMessage(log_ts, channel, updatedText, ts);
    }

    const deleteMessage = async (oldMessageDetails) => {
        const {messageDetails: {channel}, log_ts } = oldMessageDetails;
        await slackClient.deleteScheduledMessage(log_ts, channel);
        loadScheduledMessages();
    }

    return (
        <div>
            <h1>Schedule message</h1>
            <input ref={timeInput} placeholder="Epoch time"/>
            <MessageInput submitAction={scheduleMessage} />
            <h3>Scheduled Messages</h3>
            <MessageTable
                messages={scheduledMessages}
                onUpdateMessage={updateMessage}
                onDeleteMessage={deleteMessage}
                showIdCol={true}
            />
        </div>
    );
}

export default ScheduleMessage;
