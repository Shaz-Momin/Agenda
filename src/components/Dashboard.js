import React, { useState } from 'react'
import DateDocker from './DateDocker'
import { Button } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { useHistory } from 'react-router-dom'
import '../styles/dashboard.css'

export default function Dashboard() {

    const [error, setError] = useState()
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    async function handleLogout() {
        setError('')

        try {
            await logout()
            history.push('/login')
        } catch {
            setError('Failed to log out')
        }
    }

    return (
        <>  
            <div className="bigContainer text-white">
                <div className="dashboardPanel">
                    <DateDocker />
                </div>
                <div className="calendarPanel">
                    <div>{currentUser.email}</div>
                    <Button onClick={handleLogout}>Log Out</Button>
                </div>
            </div>
        </>
    )
}
