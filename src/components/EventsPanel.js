import React, { useState, useContext, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { format } from 'date-fns'
import EventContainer from './EventContainer'
import DateContext from '../contexts/DateContext'
import '../styles/dashboard.css'
import '../styles/eventsPanel.css'


export default function EventsPanel() {

    const date = useContext(DateContext)
    const [pastEvents, setPastEvents] = useState([])
    const [currEvents, setCurrEvents] = useState([])
    const [upcomingEvents, setUpcomingEvents] = useState([])

    const { localDb } = useAuth()

    function hasEvent(arr, key) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].key == key) {
                return true
            }
        }
        return false
    }


    useEffect(() => {
        localDb.collection('events').get({keys: true}).then(docs => {
            for (var i = 0; i < docs.length; i++) {
                let event = docs[i]
                if (!currEvents.includes(event.key) && !upcomingEvents.includes(event.key) && !pastEvents.includes(event.key)) {
                    //setEvents(arr => [...arr, event.key])
                    // Allocating events to either current or upcoming categories        
                    var currentlyHappening = date > new Date(event.data.startTime) && date < new Date(event.data.endTime) 
                    if (currentlyHappening && !hasEvent(currEvents, event.key)) {
                        // events.splice(j, 1)
                        setCurrEvents(arr => [...arr, event])
                    } else if (new Date(event.data.startTime) > date && !hasEvent(upcomingEvents, event.key)) {
                        setUpcomingEvents(arr => [...arr, event])
                    } else if (new Date(event.data.startTime) < date && !hasEvent(pastEvents, event.key)) {
                        setPastEvents(arr => [...arr, event])
                    }
                }
            }
        })

        // console.log("currEvents: " + currEvents)
    }, [date.getSeconds()])

    useEffect(() => {
        // Allocating events to either current or upcoming categories        
        /* for (let j = 0; j < events.length; j++) {
            var event = JSON.parse(localStorage.getItem(events[j]))
            if (event != null) {
                var currentlyHappening = date > new Date(event.startTime) && date < new Date(event.endTime) 
                if (currentlyHappening && !currEvents.includes(events[j])) {
                    // events.splice(j, 1)
                    setCurrEvents(arr => [...arr, events[j]])
                } else if (new Date(event.startTime) > date && !upcomingEvents.includes(events[j])) {
                    setUpcomingEvents(arr => [...arr, events[j]])
                }
            }
        } */
        // console.log("current: " + currEvents)
        // console.log("upcoming: " + upcomingEvents)
    }, [])


    
    return (
        <>
            <hr class="solid line"/>
            <div>
                <div className="sectionTitle">Currently</div>
                <div className="currentEvents">
                    {currEvents.map((event) =>
                        <EventContainer
                            current={true}
                            title={event.data.eventTitle}
                            desc={event.data.eventDescription}
                            start={format(new Date(event.data.startTime), 'h:mm a')}
                            end={format(new Date(event.data.endTime), 'h:mm a')}
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
                            title={event.data.eventTitle}
                            desc={event.data.eventDescription}
                            start={format(new Date(event.data.startTime), 'h:mm a')}
                            end={format(new Date(event.data.endTime), 'h:mm a')}
                        />
                    )}
                </div>
            </div>
        </>
    )
}