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
    const currentDate = new Date();
    currentDate.setSeconds(0);

    const [dateTime, setDateTime] = useState(currentDate)
    const [epochTime, setEpochTime] = useState(dateToEpoch(currentDate))

    const updateTime = (newTime) => {
        if (newTime == null || isNaN(newTime)) {
            // handles invalid input from datepicker and timeinput
            setDateTime(currentDate)
            setEpochTime(dateToEpoch(currentDate))
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
                precision="seconds"
                use12HourClock={true}
                onChange={newTime => updateTime(newTime)}
            />

            <h4>Timestamp: {epochTime}</h4>
        </>
    )
}

export default TimePicker;