import React, { useState, useEffect } from 'react'
import { EventProvider, useEventContext } from '../contexts/EventContext'
import { useDateContext } from '../contexts/DateContext'
import { useMediaPredicate } from 'react-media-hook'
import '../styles/datePopover.css'
import { isBefore, isSameDay, isWithinInterval } from 'date-fns'


export default function EventPopover({ XY, currSelected }) {

    const { pastEvents, currEvents, upcomingEvents, futureEvents,
            setOpenUpdateModal, selectedEvent, setSelectedEvent  } = useEventContext()
    const { date } = useDateContext()

    const [events, setEvents] = useState([])

    useEffect(() => {
        if (new Date(currSelected) < new Date(date.toDateString())) {
            setEvents(pastEvents.filter((e) => getFilteredEvents(e)))
        } else if (new Date(currSelected) > new Date(date.toDateString())) {
            setEvents(futureEvents.filter((e) => getFilteredEvents(e)))
        } else if (isSameDay(new Date(currSelected), date)) {
            setEvents(pastEvents.filter((e) => {
                return isSameDay(new Date(e.data.startTime), new Date(currSelected))
            }))
            setEvents(arr => [...arr, ...currEvents, ...upcomingEvents])
        }

        // Decides whether a particular event needs to be displayed from event-state arrays
        function getFilteredEvents(e) {
            var singleDay = isSameDay(new Date(e.data.startTime),new Date(e.data.endTime))

            if (singleDay) {
                return isSameDay(new Date(e.data.startTime), new Date(currSelected))
            }
            return isWithinInterval(new Date(currSelected), { start: new Date(e.data.startTime), end: new Date(e.data.endTime)})
        }
    }, [currSelected])


    const styles = {
        top: XY.y + XY.height + "px",
        left: XY.x - (useMediaPredicate("(max-width: 750px)") ? 96 : 128) + XY.width/2 + "px"
    }


    return (
        <div className="popoverContainer" style={styles}>
            <div className="arrow"></div>
            <div id="eventPopover">
                <div className="title">{new Date(currSelected).toDateString()}</div>
                <div className="body">
                    {events.length == 0 && 
                        <div className="p-2" style={{fontStyle: "italic"}}>
                            No events scheduled for this day
                        </div>
                    }
                    {events.sort((a, b) => {
                        return new Date(a.data.startTime) - new Date(b.data.startTime)
                    }).map((event) => {
                        return (
                            <>
                                <div className="eventItem">
                                    <span className="edit" title="Edit Event" onClick={() => {
                                        setSelectedEvent(event)
                                        setOpenUpdateModal(true)
                                    }}>&#9998;</span>
                                    <div className="text">{event.data.eventTitle}</div>
                                </div>
                            </>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
