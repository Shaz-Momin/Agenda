import React, { useState, useContext, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useEventContext } from '../contexts/EventContext'
import EventContainer from './EventContainer'
import DateContext from '../contexts/DateContext'
import UpdateEventModal from './UpdateEventModal'
import '../styles/dashboard.css'
import '../styles/eventsPanel.css'


export default function EventsPanel() {

    const date = useContext(DateContext)
    const [openUpdateModal, setOpenUpdateModal] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState({})

    const { pastEvents, setPastEvents, currEvents, setCurrEvents, upcomingEvents, setUpcomingEvents } = useEventContext()
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

    function sortByStartTime(arr) {
        arr.sort((a, b) => {
            return new Date(a.data.startTime) - new Date(b.data.startTime)
        })
    }

    function addToArrayInOrder(arr, newEvent) {
        let added = false
        for (var i = 0; i < arr.length; i++) {
            const event = arr[i]
            if (newEvent.data.startTime < event.data.startTime) {
                arr.splice(i, 0, newEvent)
                added = true
            }
        }
        if (!added) {
            arr.push(newEvent)
        }
        return arr
    }

    useEffect(() => {
        localDb.collection('events').get({keys: true}).then(docs => {
            for (var i = 0; i < docs.length; i++) {
                let event = docs[i]
                //setEvents(arr => [...arr, event.key])
                // Allocating events to either current or upcoming categories        
                var currentlyHappening = date > new Date(event.data.startTime) && date < new Date(event.data.endTime)
                if (currentlyHappening && !hasEvent(currEvents, event.key)) {
                    // events.splice(j, 1)
                    removeFromArr(upcomingEvents, event.key)
                    setCurrEvents(arr => [...arr, event])
                } else if (new Date(event.data.startTime) > date && !hasEvent(upcomingEvents, event.key)) {
                    removeFromArr(currEvents, event.key)
                    setUpcomingEvents(arr => [...arr, event])
                } else if (new Date(event.data.endTime) < date && !hasEvent(pastEvents, event.key)) {
                    removeFromArr(currEvents, event.key)
                    setPastEvents(arr => [...arr, event])
                }
            }
        })

        sortByStartTime(currEvents)
        sortByStartTime(upcomingEvents)

    }, [date.getSeconds()])

    
    return (
        <>
            <hr class="solid line"/>
            <div>
                <div className="sectionTitle">Currently</div>
                <div className="currentEvents">
                    {currEvents.map((event) =>
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
                    {upcomingEvents.map((event) =>
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