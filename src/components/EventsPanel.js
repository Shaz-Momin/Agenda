import React, { useState, useContext, useEffect } from 'react'
import EventContainer from './EventContainer'
import DateContext from '../contexts/DateContext'
import '../styles/dashboard.css'
import '../styles/eventsPanel.css'


export default function EventsPanel() {

    const date = useContext(DateContext)
    const [events, setEvents] = useState([])
    const [currEvents, setCurrEvents] = useState([])
    const [upcomingEvents, setUpcomingEvents] = useState([])

    function getTitle(eventId) {
        var data = JSON.parse(localStorage.getItem(eventId))
        if (data != null) {
            return data.eventTitle
        }
        return "Sample Title"
    }

    function getDes(eventId) {
        var data = JSON.parse(localStorage.getItem(eventId))
        if (data != null) {
            return data.eventDescription
        }
        return "Sample Description"
    }

    function getStartTime(eventId) {
        var data = localStorage.getItem(eventId)
        if (data != null) {
            var date = new Date(JSON.parse(data).startTime)
            let clock = 'AM'
            let hours = date.getHours()
            if (hours >= 12) {
                clock = 'PM'
                if (hours > 12) {
                    hours -= 12
                }
            }
            let minutes = date.getMinutes() / 10 > 0 ? date.getMinutes() : "0" + date.getMinutes()
            return hours + ":" + minutes + " " + clock
        }
        // Default return
        return "12:30 PM"
    }

    function getEndTime(eventId) {
        var data = localStorage.getItem(eventId)
        if (data != null) {
            var date = new Date(JSON.parse(data).endTime)
            let clock = 'AM'
            let hours = date.getHours()
            if (hours >= 12) {
                clock = 'PM'
                if (hours > 12) {
                    hours -= 12
                }
            }
            let minutes = date.getMinutes() / 10 > 0 ? date.getMinutes() : "0" + date.getMinutes()
            return hours + ":" + minutes + " " + clock
        }
        // Default return
        return "2:30 PM"
    }

    function isValidJSONString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    useEffect(() => {
        var keys = Object.keys(localStorage)
        for (let i = 0; i < keys.length; i++) {
            var key = keys[i]
            var obj = localStorage.getItem(key)
            if (isValidJSONString(obj)) {
                var jsonObj = JSON.parse(obj)
                var validObj = 'eventTitle' in jsonObj && 'eventDescription' in jsonObj && 'startTime' in jsonObj && 'endTime' in jsonObj
                if (validObj && !events.includes(key)) {
                    setEvents(arr => [...arr, key])
                }
            }
        }
        // console.log("events: " + events)
    }, [date.getSeconds()])

    useEffect(() => {
        // Allocating events to either current or upcoming categories        
        for (let j = 0; j < events.length; j++) {
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
        }
        // console.log("current: " + currEvents)
        // console.log("upcoming: " + upcomingEvents)
    }, [date.getSeconds()])


    
    return (
        <>
            <hr class="solid line"/>
            <div>
                <div className="sectionTitle">Currently</div>
                <div className="currentEvents">
                    {currEvents.map((eventId) =>
                        <EventContainer
                            current={true}
                            title={getTitle(eventId)}
                            desc={getDes(eventId)}
                            start={getStartTime(eventId)}
                            end={getEndTime(eventId)}
                        />
                    )}
                </div>
            </div>
            <hr class="dotted line"/>
            <div>
                <div className="sectionTitle">Upcoming</div>
                <div className="upcomingEvents">
                    {upcomingEvents.map((eventId) =>
                        <EventContainer
                            current={false}
                            title={getTitle(eventId)}
                            desc={getDes(eventId)}
                            start={getStartTime(eventId)}
                            end={getEndTime(eventId)}
                        />
                    )}
                </div>
            </div>
        </>
    )
}