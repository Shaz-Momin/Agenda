import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useEventContext } from '../contexts/EventContext'
import EventContainer from './EventContainer'
import { useDateContext } from '../contexts/DateContext'
import UpdateEventModal from './UpdateEventModal'
import '../styles/dashboard.css'
import '../styles/eventsPanel.css'
import { endOfDay } from 'date-fns'


export default function EventsPanel() {

    const { date } = useDateContext()

    const [openUpdateModal, setOpenUpdateModal] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState({})

    const { pastEvents, setPastEvents,
            currEvents, setCurrEvents,
            upcomingEvents, setUpcomingEvents,
            futureEvents, setFutureEvents } = useEventContext()
    const { localDb } = useAuth()

    function hasEvent(arr, key) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].key == key) {
                return true
            }
        }
        return false
    }

    function removeFromArr(arr, key) {
        var i = 0;
        while (i < arr.length && arr[i].key != key) {
            i++
        }
        if (i < arr.length) {
            arr.splice(i, 1)
        }
    }

    useEffect(() => {
        localDb.collection('events').get({keys: true}).then(docs => {
            for (var i = 0; i < docs.length; i++) {
                let event = docs[i]
                let starts = new Date(event.data.startTime)
                //setEvents(arr => [...arr, event.key])
                // Allocating events to either current or upcoming categories        
                var currentlyHappening = date > starts && date < new Date(event.data.endTime)
                if (currentlyHappening && !hasEvent(currEvents, event.key)) {
                    // events.splice(j, 1)
                    removeFromArr(upcomingEvents, event.key)
                    setCurrEvents(arr => [...arr, event])
                } else if (starts > date && starts < endOfDay(date) && !hasEvent(upcomingEvents, event.key)) {
                    removeFromArr(currEvents, event.key)
                    setUpcomingEvents(arr => [...arr, event])
                } else if (starts > endOfDay(date) && !hasEvent(futureEvents, event.key) ) {
                    setFutureEvents(arr => [...arr, event])
                } else if (new Date(event.data.endTime) < date && !hasEvent(pastEvents, event.key)) {
                    removeFromArr(currEvents, event.key)
                    removeFromArr(upcomingEvents, event.key)
                    setPastEvents(arr => [...arr, event])
                }
            }
        })

    }, [date.getSeconds()])

    
    return (
        <>
            <hr class="solid line"/>
            <div>
                <div className="sectionTitle">Currently</div>
                <div className="currentEvents">
                    {currEvents.sort((a, b) => {
                        return new Date(a.data.startTime) - new Date(b.data.startTime)
                    }).map((event) =>
                        <EventContainer
                            current={true}
                            event={event}
                            closeUpdateModal={setOpenUpdateModal}
                            setSelectedEvent={setSelectedEvent}
                        />
                    )}
                </div>
            </div>
            <hr class="dotted line"/>
            <div>
                <div className="sectionTitle">Upcoming</div>
                <div className="upcomingEvents">
                    {upcomingEvents.sort((a, b) => {
                        return new Date(a.data.startTime) - new Date(b.data.startTime)
                    }).map((event) =>
                        <EventContainer
                            current={false}
                            event={event}
                            closeUpdateModal={setOpenUpdateModal}
                            setSelectedEvent={setSelectedEvent}
                        />
                    )}
                </div>
            </div>
            {openUpdateModal && <UpdateEventModal closeModal={setOpenUpdateModal} selectedEvent={selectedEvent}/>}
        </>
    )
}