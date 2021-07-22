import React, { useState, useContext } from 'react'
import { Calendar } from '@mantine/dates'
import { Button, Dropdown } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { useHistory } from 'react-router-dom'
import DateContext from '../contexts/DateContext'
import '../styles/calendarPanel.css'
import { ThemeIcon } from '@mantine/core'

export default function CalendarPanel({ closeModal }) {
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
                <Button className="addEventBtn" onClick={() => {closeModal(true)}}>Add Event</Button>
            </div>
            <div className="calendarContainer w-100 d-flex align-items-center justify-content-center">
                <div className="calendarHolder">
                    <Calendar
                        value={date}
                        onChange={date}
                        size="lg"
                        fullWidth
                        dayClassName="eachDay"
                        styles={{
                            day: {
                                color: "var(--oxford-blue)",
                                fontSize: "1.5rem",
                                fontWeight: "600",
                                fontFamily: "'Montserrat', sans-serif",
                                /*margin: "0.5rem", */
                            },
                            weekday: {
                                fontWeight: "bold",
                                fontStyle:"italic",
                                fontSize: "1.5rem",
                                color: "rgba(0, 30, 71, 0.4)"
                            },
                            weekdayCell: {
                                height: "6.25rem"
                            },
                            selected: {
                                backgroundColor: "var(--powder-blue)",
                                border: "0.2rem solid var(--oxford-blue)",
                                borderRadius: "0.7rem"
                            },
                            label: {
                                color: "var(--oxford-blue)",
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                                fontFamily: "'Montserrat', sans-serif",
                                letterSpacing: "0.3rem",
                                wordSpacing: "2rem",
                                textTransform: "uppercase"
                            }
                        }}/>
                </div>
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
