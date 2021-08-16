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

    const [openUpdateModal, setOpenUpdateModal] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState({})

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
        var stateArrays = [currEvents, upcomingEvents, futureEvents, pastEvents]
        for (var i = 0; i < stateArrays.length; i++) {
            for (var j = 0; j < stateArrays[i].length; j++) {
                if (stateArrays[i][j].key == docId) {
                    stateArrays[i][j].data = eventObj
                    return
                }
            }
        }
    }

    // Delete the user's event in the db
    async function deleteEvent(docId) {
        await db.collection('users').doc(currentUser.uid).collection('events').doc(docId).delete()
        localDb.collection('events').doc(docId).delete()
        
        // Deleting that event from the events array state
        var stateArrays = [currEvents, upcomingEvents, futureEvents, pastEvents]
        for (var i = 0; i < stateArrays.length; i++) {
            spliceFromArr(stateArrays[i], docId)
        }

        function spliceFromArr(arr, docId) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].key == docId) {
                    arr.splice(i, 1)
                }
            }
        }
    }


    useEffect(() => {
        
    }, [])


    const value = {
        pastEvents, setPastEvents,
        currEvents, setCurrEvents,
        upcomingEvents, setUpcomingEvents,
        futureEvents, setFutureEvents,
        openUpdateModal, setOpenUpdateModal,
        selectedEvent, setSelectedEvent,
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
