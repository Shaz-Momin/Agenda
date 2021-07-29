import React, { useContext, useState, useEffect } from 'react'
import firebase from 'firebase/app'
import localbase from 'localbase'
import { auth } from '../firebase'
import { formatISO, isSameDay } from 'date-fns'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    const db = firebase.firestore()
    const localDb = new localbase('db')
    localDb.config.debug = false // to disable localbase logs


    function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password)
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password).then((cred) => {
            // Login successful
            getEventDocs(cred.user)
        })
    }

    function logout() {
        return auth.signOut().then(() => {
            // SignOut successful
            localStorage.clear()
            localDb.delete()
        })
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

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

    // Delete the user's event in the db
    async function deleteEvent(docId) {
        await db.collection('users').doc(currentUser.uid).collection('events').doc(docId).delete()
        localDb.collection('events').doc(docId).delete()
    }

    // Gets the user's event data from the db
    async function getEventDocs(user) {
        const snapshot = await db.collection('users').doc(user.uid).collection('events').get()
        snapshot.forEach(doc => {
            var docStartDate = doc.data().startTime
            var docEndDate = doc.data().endTime
            var date = new Date()

            // Save event data to localStorage if its taking place today
            if (isSameDay(date, docStartDate) || isSameDay(date, docEndDate) || formatISO(date) < docStartDate || formatISO(date) < docEndDate) {
                console.log('Setting events from firestore to local db')
                localDb.collection('events').doc(doc.id).get().then(document => {
                    if (document === null) {
                        localDb.collection('events').doc(doc.id).set(doc.data())
                        console.log("New event added to local db")
                    }
                })
                //setEvents( arr => [...arr, doc.data()[1]]);
            }
        })
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            /* db.collection('users').doc(user.uid).get().then(doc => {
                console.log(doc.data().name);
            }) */
            setLoading(false)
        })

        return unsubscribe
    }, [])


    const value = {
        currentUser,
        localDb,
        login,
        signup,
        logout,
        resetPassword,
        saveEvent,
        updateEvent,
        deleteEvent
    }

    return (
        <AuthContext.Provider value={value} >
            {!loading && children }
        </AuthContext.Provider>
    )
}
