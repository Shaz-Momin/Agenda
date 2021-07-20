import React, { useState, useEffect } from 'react'
import DateDocker from './DateDocker'
import CalendarPanel from './CalendarPanel'
import EventsPanel from './EventsPanel'
import DateContext from '../contexts/DateContext'
import '../styles/dashboard.css'
import CreateEventModal from './CreateEventModal'

export default function Dashboard() {

    const [date, setDate] = useState(new Date())
    const [openModal, setOpenModal] = useState(false)

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
                        <div className="eventsPanel">
                            <EventsPanel />
                        </div>
                    </div>
                    <div className="calendarPanel">
                        <CalendarPanel closeModal={setOpenModal}/>
                    </div>
                    {openModal && <CreateEventModal closeModal={setOpenModal}/>}
                </div>
            </DateContext.Provider>
        </>
    )
}
