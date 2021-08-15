import 'react-widgets/styles.css';
import DatePicker from 'react-widgets/DatePicker';
import TimeInput from 'react-widgets/TimeInput';

import { useState } from 'react';

function dateToEpoch (date) {
    const timeInEpochSeconds = Date.parse(date)

    // return epoch time in seconds
    return timeInEpochSeconds / 1000
}

// Datetime input using 
// React Widgets DatePicker and TimePicker
function TimePicker(props) {
    const [dateTime, setDateTime] = useState(new Date())
    const [epochTime, setEpochTime] = useState(dateToEpoch(new Date()))

    const updateTime = (newTime) => {
        if (newTime == null || isNaN(newTime)) {
            // handles invalid input from datepicker and timeinput
            setDateTime(new Date())
            setEpochTime(dateToEpoch(new Date()))
        }
        else {
            const timeToEpoch = dateToEpoch(newTime);
            setDateTime(newTime)
            setEpochTime(timeToEpoch)
            props.setParentTimeInput(timeToEpoch)
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