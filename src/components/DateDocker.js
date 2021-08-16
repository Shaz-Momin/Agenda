import React from 'react'
import { useDateContext } from '../contexts/DateContext'
import '../styles/dashboard.css'

export default function DateDocker() {

    const { date } = useDateContext()

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const weekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
        'Saturday']
    

    return (
        <div className="d-flex flex-row align-items-center justify-content-center">
            <div className="mainDate mx-2">{date.getDate()}</div>
            <div className="text-left mx-4">
                <div className="mainMonth">{monthNames[date.getMonth()]}</div>
                <div className="mainWeek">{weekNames[date.getDay()]}</div>
            </div>
        </div>
    )
}
