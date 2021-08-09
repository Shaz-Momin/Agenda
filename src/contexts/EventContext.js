import React, { useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const EventContext = React.createContext()

export function useEventContext() {
    return useContext(EventContext);
}

export function EventProvider({ children }) {

    const [pastEvents, setPastEvents] = useState([])
    const [currEvents, setCurrEvents] = useState([])
    const [upcomingEvents, setUpcomingEvents] = useState([])
    const [futureEvents, setFutureEvents] = useState([])

    const { currentUser, db, localDb } = useAuth()

    // Save the event data in the db 
    async function saveEvent(eventObj) {
        console.log("Saving event in firestore")
        const doc = await db.collection('users').doc(currentUser.uid).collection('events').add({
            eventTitle: eventObj.eventTitle,
            eventDescription: eventObj.eventDescription,
            startTime: eventObj.startTime,
            endTime: eventObj.endTime
        })
        
        // Saving the data locally in indexDb
        // localStorage.setItem(doc.id, JSON.stringify(eventObj))
        localDb.collection('events').doc(doc.id).set(eventObj)
    }

    // Update the event data in the db
    async function updateEvent(eventObj, docId) {
        // Updating the data in the events array (state)
        updateEventsArr(eventObj, docId)

        console.log("Updating event in firestore")
        const doc = await db.collection('users').doc(currentUser.uid).collection('events').doc(docId).update({
            eventTitle: eventObj.eventTitle,
            eventDescription: eventObj.eventDescription,
            startTime: eventObj.startTime,
            endTime: eventObj.endTime
        })
        
        // Updating the data locally in indexDb
        localDb.collection('events').doc(docId).update(eventObj)
    }

    // Updating the data in the events array (state)
    function updateEventsArr(eventObj, docId) {
        for (var i = 0; i < currEvents.length; i++) {
            if (currEvents[i].key == docId) {
                currEvents[i].data = eventObj
                return
            }
        }
        for (var i = 0; i < upcomingEvents.length; i++) {
            if (upcomingEvents[i].key == docId) {
                upcomingEvents[i].data = eventObj
                return
            }
        }
    }

    // Delete the user's event in the db
    async function deleteEvent(docId) {
        await db.collection('users').doc(currentUser.uid).collection('events').doc(docId).delete()
        localDb.collection('events').doc(docId).delete()
        
        // Deleting that event from the events array state
        if (spliceFromArr(upcomingEvents, docId)) {
            return
        }
        spliceFromArr(currEvents, docId)

        function spliceFromArr(arr, docId) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].key == docId) {
                    arr.splice(i, 1)
                    return true
                }
            }
        }
    }


    useEffect(() => {
        
    }, [])


    const value = {
        pastEvents,
        setPastEvents,
        currEvents,
        setCurrEvents,
        upcomingEvents,
        setUpcomingEvents,
        futureEvents,
        setFutureEvents,
        saveEvent,
        updateEvent,
        deleteEvent
    }

    return (
        <EventContext.Provider value={value} >
            { children }
        </EventContext.Provider>
    )
}
