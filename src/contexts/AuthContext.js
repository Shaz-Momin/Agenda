import React, { useContext, useState, useEffect } from 'react'
import firebase from 'firebase/app'
import { auth } from '../firebase'
import { formatISO } from 'date-fns'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    const db = firebase.firestore()

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
        })
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    // 

    // Save the event data in the db 
    async function saveEvent(eventObj) {
        console.log("Saving event in firestore")
        const doc = await db.collection('users').doc(currentUser.uid).collection('events').add({
            eventTitle: eventObj.eventTitle,
            eventDescription: eventObj.eventDescription,
            startTime: eventObj.startTime,
            endTime: eventObj.endTime
        })
        
        // Saving the data locally
        localStorage.setItem(doc.id, JSON.stringify(eventObj))
    }

    // Gets the user's event data from the db
    async function getEventDocs(user) {
        const snapshot = await db.collection('users').doc(user.uid).collection('events').get()
        snapshot.forEach(doc => {
            var docStartDate = doc.data().startTime.split('T')[0]
            var docEndDate = doc.data().endTime.split('T')[0]
            var date = new Date()
            var current = formatISO(date, { representation: 'date' })

            // Save event data to localStorage if its taking place today
            if (current == docStartDate || current == docEndDate || (formatISO(date) > doc.data().startTime && formatISO(date) < doc.data().endTime)) {
                console.log('Getting events from db')
                let eventArr = JSON.parse(localStorage.getItem('events'))

                if (localStorage.getItem(doc.id) === null) {
                    localStorage.setItem(doc.id, JSON.stringify(doc.data()))
                    console.log("New event added to localStorage")
                }
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
        login,
        signup,
        logout,
        resetPassword,
        saveEvent
    }

    return (
        <AuthContext.Provider value={value} >
            {!loading && children }
        </AuthContext.Provider>
    )
}
