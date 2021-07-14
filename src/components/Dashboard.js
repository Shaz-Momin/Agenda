import React, { useState, useEffect } from 'react'
import DateDocker from './DateDocker'
import CalendarPanel from './CalendarPanel'
import EventsPanel from './EventsPanel'
import DateContext from '../contexts/DateContext'
import '../styles/dashboard.css'

export default function Dashboard() {

    const [date, setDate] = useState(new Date())

    useEffect(() => {
        var timer = setInterval(() => {
            setDate(new Date())
        }, 1000)

        return function cleanup() {
            clearInterval(timer)
        }
    }, [])

    return (
        <> 
            <DateContext.Provider value={date}>
                <div className="bigContainer">
                    <div className="dashboardPanel d-flex flex-column">
                        <div className="dateDocker">
                            <DateDocker />
                        </div>
                        <hr class="rounded"/>
                        <div className="eventsPanel">
                            <EventsPanel />
                        </div>
                    </div>
                    <div className="calendarPanel">
                        <CalendarPanel />
                    </div>
                </div>
            </DateContext.Provider>
        </>
    )
}
