import React, { useState, useContext } from 'react'
import { Calendar } from '@mantine/dates'
import { Button, Dropdown } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { useHistory } from 'react-router-dom'
import { useDateContext } from '../contexts/DateContext'
import { isSameDay } from 'date-fns'
import '../styles/calendarPanel.css'
import '../styles/datePopover.css'


export default function CalendarPanel({ closeModal }) {

    const [XY, setXY] = useState({})
    const [lastSelected, setLastSelected] = useState()
    const [opened, setOpened] = useState(false)
    const [currSelected, setCurrSelected] = useState()


    const [error, setError] = useState()
    const { logout } = useAuth()
    const history = useHistory()

    const { date } = useDateContext()

    async function handleLogout() {
        setError('')

        try {
            await logout()
            history.push('/login')
        } catch {
            setError('Failed to log out')
        }
    }

    function onDateChange(e) {
        setCurrSelected(e)
        if (opened && isSameDay(e, lastSelected)) {
            setOpened(false)
        } else {
            setOpened(true)
        }

        setLastSelected(e)
    }

    function setupCoordinates(e) {
        var firstElementsY = document.getElementsByClassName("mantine-calendar-day")[0].getBoundingClientRect().y
        if (e.target.getBoundingClientRect().y >= firstElementsY) {
            setXY(e.target.getBoundingClientRect())

        }
    }

    // onClick & hover events for each day in the calendar
    /* var days = document.getElementsByClassName('mantine-calendar-day')
    for (var i = 0; i < days.length; i++) {
        let element = days[i]
        element.onclick = () => {
            let monthYear = document.getElementsByClassName('mantine-calendar-label')[0].innerHTML
            let d = new Date(element.innerHTML + " " + monthYear)
            
            console.log(d.toUTCString())
        }
        element.onmouseover = () => {
            element.title = element.innerHTML
        }
    } */

    return (
        <>
            <div className="cta-header w-100">
                <div className="currentTime">
                    {date.toLocaleString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric'})}
                </div>
                <Button className="addEventBtn" onClick={() => {closeModal(true)}}>Add Event</Button>
            </div>
            <div className="calendarContainer w-100 d-flex align-items-center justify-content-center">
                { opened &&
                    <div className="popoverContainer" style={{top: XY.y + XY.height + "px", left: XY.x - 128 + XY.width/2 + "px"}}>
                        <div className="arrow"></div>
                        <div id="eventPopover">
                            <div className="title">{new Date(currSelected).toDateString()}</div>
                            <div className="body">
                                Sample Paragraph info
                            </div>
                        </div>
                    </div>}
                <div className="calendarHolder">
                    <Calendar
                        value={date}
                        onMouseDown={setupCoordinates}
                        onChange={onDateChange}
                        onMonthChange={() => setOpened(false)}
                        size="lg"
                        fullWidth
                        dayClassName="eachDay"
                        previousMonthLabel="arrow"
                        nextMonthLabel="arrow"
                        disableOutsideEvents
                        styles={{
                            day: {
                                color: "var(--oxford-blue)",
                                fontSize: "1.5rem",
                                fontWeight: "600",
                                fontFamily: "'Montserrat', sans-serif",
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
                        }}
                    />
                </div>
            </div>
            <div className="cta-footer">
                <Dropdown drop="up">
                    <Dropdown.Toggle variant="info" id="dropdown-basic">Profile </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item href="#" onClick={handleLogout}>Log Out</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </>
    )
}
