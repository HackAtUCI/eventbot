import 'react-widgets/styles.css';
import DatePicker from 'react-widgets/DatePicker';
import TimeInput from 'react-widgets/TimeInput';

import { useState } from 'react';

function dateToEpoch (date) {
    const timeInEpochMilliseconds = Date.parse(date)

    // return epoch time in seconds for Slack API
    return timeInEpochMilliseconds / 1000
}

// Date and time input using 
// React Widgets DatePicker and TimePicker
function TimePicker() {
    const [dateTime, setDateTime] = useState(new Date())
    const [epochTime, setEpochTime] = useState(dateToEpoch(new Date()))

    const updateTime = (newTime) => {
        if (newTime == null) {
            // timepicker input has an 'X' that when clicked
            // passes in null so reset the Date() to current time
            setDateTime(new Date())
            setEpochTime(dateToEpoch(new Date()))
        }
        else {
            setDateTime(newTime)
            setEpochTime(dateToEpoch(newTime))   
        }
    }

    return (
        <>
            <DatePicker
                value={dateTime}
                valueEditFormat={{ dateStyle: "short" }}
                valueDisplayFormat={{ dateStyle: "short" }}
                onChange={newTime => updateTime(newTime)}
            />

            <TimeInput
                value={dateTime}
                onChange={newTime => updateTime(newTime)}
            />

            <h3>{epochTime}</h3>
        </>
    )
}

export default TimePicker;