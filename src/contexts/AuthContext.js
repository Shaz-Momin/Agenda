import React, { useContext, useState, useEffect } from 'react'
import firebase from 'firebase/app'
import { auth } from '../firebase'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState()
    const [currentUsername, setCurrentUsername] = useState()
    const [loading, setLoading] = useState(true)
    const db = firebase.firestore()

    function signup(email, password, name) {
        auth.createUserWithEmailAndPassword(email, password).then(cred => {
            return db.collection('users').doc(cred.user.uid).set({
                name: name
            })
        }).then(() => {
            // Data successfully saved
        })
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }

    function logout() {
        return auth.signOut()
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            db.collection('users').doc(user.uid).get().then(doc => {
                setCurrentUsername(doc.data().name)
            })
            /* db.collection('users').doc(user.uid).get().then(doc => {
                console.log(doc.data().name);
            }) */
            setLoading(false)
        })

        return unsubscribe
    }, [])
    

    const value = {
        currentUser,
        currentUsername,
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
