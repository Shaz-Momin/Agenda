import React, { useRef, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useEventContext } from '../contexts/EventContext'
import { formatISO } from 'date-fns'
import '../styles/modal.css'

export default function CreateEventModal({ closeModal }) {

    const eventTitleRef = useRef()
    const eventDesRef = useRef()
    const startTimeRef = useRef()
    const endTimeRef = useRef()

    const [error, setError] = useState()
    const { saveEvent } = useEventContext()


    //console.log(formatISO(new Date()))

    function handleSubmit(e) {
        e.preventDefault()
        setError()

        // Event Validation: event title is empty
        if (eventTitleRef.current.value.length == 0) {
            setError("Event Title is required")
            return 0
        }

        // Event Validation: startTime >= endTime or endTime > currentTime
        if (Date.parse(startTimeRef.current.value) >= Date.parse(endTimeRef.current.value)
            || Date.parse(endTimeRef.current.value) < new Date()) {
            setError("Please enter a valid timeslot")
            return 0
        }

        // Create event data object
        const eventObj = {
            eventTitle: eventTitleRef.current.value,
            eventDescription: eventDesRef.current.value,
            startTime: startTimeRef.current.value,
            endTime: endTimeRef.current.value
        }
        
        // Save the data in the database & locally
        saveEvent(eventObj)

        closeModal(false) // Close modal after saving the event
    }

    return (
        <div className="modalBackground">
            <div className="modalContainer p-4">
                <div className="title p-2 text-center">
                    <div style={{fontWeight:"bold", fontSize:"1.5rem"}}>Add Event</div>
                </div>
                <div className="body d-flex flex-column align-items-center">
                    <div className="w-75 font-weight-bold">
                        <input 
                            className="w-100 eventTitle"
                            type="text" 
                            placeholder="Event Title" 
                            ref={eventTitleRef} />
                    </div>
                    <div className="w-75">
                        <textarea 
                            rows="3"
                            className="w-100 eventDes" 
                            type="text"
                            placeholder="Event Description"
                            ref={eventDesRef}/>
                    </div>
                    <div className="w-100 mt-3 d-flex flex-column align-items-center timeInputs">
                        <div className="d-flex startTime mb-3">
                            <div className="justify-content-center m-auto">
                                <label>Starts</label>
                            </div>
                            <input 
                                defaultValue={formatISO(new Date()).substr(0, 16)}
                                className="mx-3"
                                type="datetime-local"
                                ref={startTimeRef}/>
                        </div>
                        <div className="d-flex endTime">
                            <div className="justify-content-center m-auto">
                                <label>Ends</label>
                            </div>
                            <input
                                defaultValue={formatISO(new Date()).substr(0, 16)}
                                className="mx-3"
                                type="datetime-local"
                                ref={endTimeRef}/>
                        </div>
                    </div>
                </div>
                {error != null &&
                <div className="text-danger text-center w-100 mb-3">
                    <div style={{fontWeight: 500}}>* {error} *</div>
                </div>}
                <div className="footer p-2 px-4 d-flex justify-content-between">
                    <Button className="cancelBtn" onClick={() => {closeModal(false)}} variant="danger">Cancel</Button>
                    <Button className="addEventBtn" onClick={ handleSubmit }>Add Event</Button>
                </div>
            </div>
        </div>
    )
}
