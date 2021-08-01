import React, { useState, useEffect } from 'react'
import DateDocker from './DateDocker'
import CalendarPanel from './CalendarPanel'
import EventsPanel from './EventsPanel'
import DateContext from '../contexts/DateContext'
import '../styles/dashboard.css'
import CreateEventModal from './CreateEventModal'
import { EventProvider } from '../contexts/EventContext'
import { useMediaPredicate } from "react-media-hook";

export default function Dashboard() {

    const [date, setDate] = useState(new Date())
    const [openAddModal, setOpenAddModal] = useState(false)
    const [calendarView, setCalendarView] = useState(false)
    const smallerThan750 = useMediaPredicate("(max-width: 750px)");


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
                <EventProvider>
                    { smallerThan750 && 
                    <div id="toggleCal" onClick={() => setCalendarView(!calendarView)}>
                        {calendarView ? <span>&#9776;</span> : <span>&#9783;</span>}
                    </div>}
                    {!smallerThan750 ?
                    (<div className="bigContainer">
                        <div className="dashboardPanel">
                            <div className="dateDocker">
                                <DateDocker />
                            </div>
                            <div className="eventsPanel">
                                <EventsPanel />
                            </div>
                        </div>
                        <div className="calendarPanel">
                            <CalendarPanel closeModal={setOpenAddModal}/>
                        </div>
                    </div>) : 
                    (!calendarView ?
                    (<div className="bigContainer">
                        <div className="dashboardPanel">
                            <div className="dateDocker">
                                <DateDocker />
                            </div>
                            <div className="eventsPanel">
                                <EventsPanel />
                            </div>
                        </div>
                    </div>) :
                    (<div className="bigContainer">
                        <div className="calendarPanel">
                            <CalendarPanel closeModal={setOpenAddModal}/>
                        </div>
                    </div>))}
                    {openAddModal && <CreateEventModal closeModal={setOpenAddModal}/>}
                </EventProvider>
            </DateContext.Provider>
        </>
    )
}
