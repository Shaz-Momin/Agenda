import React, { useState, useContext } from 'react'
import { Button, Dropdown } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { useHistory } from 'react-router-dom'
import DateContext from '../contexts/DateContext'
import '../styles/calendarPanel.css'

export default function CalendarPanel() {
    const [error, setError] = useState()
    const { currentUser, currentUsername, logout } = useAuth()
    const history = useHistory()
    const date = useContext(DateContext)

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
            <div className="cta-header w-100">
                <div className="currentTime">
                    {date.toLocaleString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric'})}
                </div>
                <Button className="addEventBtn">Add Event</Button>
            </div>
            <div className="calendarContainer w-100">
                Calendar
            </div>
            <div className="cta-footer">
                <Dropdown drop="up">
                    <Dropdown.Toggle variant="info" id="dropdown-basic">
                        {currentUsername + " "}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="#" onClick={handleLogout}>Log Out</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </>
    )
}
