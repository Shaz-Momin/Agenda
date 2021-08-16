import React, { useContext, useState, useEffect } from 'react'
import firebase from 'firebase/app'
import localbase from 'localbase'
import { auth } from '../firebase'
import { formatISO, isSameDay, isWithinInterval, addDays, subDays } from 'date-fns'

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

    // Gets the user's event data from the firestore db
    async function getEventDocs(user) {
        const snapshot = await db.collection('users').doc(user.uid).collection('events').get()
        snapshot.forEach(doc => {
            var docStartDate = doc.data().startTime
            var docEndDate = doc.data().endTime
            var date = new Date()

            // Save event data to localStorage if its taking place today
            // OLD QUERY: isSameDay(date, docStartDate) || isSameDay(date, docEndDate) || formatISO(date) < docStartDate || formatISO(date) < docEndDate
            // NEW QUERY: isWithinInterval(new Date(docStartDate), { start: subDays(date, 30), end: addDays(date, 30)})
            var within30DaysOffset = isWithinInterval(new Date(docStartDate), { start: subDays(date, 30), end: addDays(date, 30)})
            if (within30DaysOffset) {
                console.log('Setting events from firestore to local db')
                localDb.collection('events').doc(doc.id).get().then(document => {
                    if (document === null) {
                        localDb.collection('events').doc(doc.id).set(doc.data())
                        console.log("New event added to local db")
                    }
                })
                // setEvents( arr => [...arr, doc.data()[1]]);
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
        db,
        login,
        signup,
        logout,
        resetPassword
    }

    return (
        <AuthContext.Provider value={value} >
            {!loading && children }
        </AuthContext.Provider>
    )
}
