import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'

export default function EventContainer({current, event, closeUpdateModal, setSelectedEvent}) {

    return (
        <div className="eventContainer d-flex text-white">
            {format(new Date(event.data.startTime), 'h:mm a') == format(new Date(event.data.endTime), 'h:mm a') ?
                <div className="single-timestamp d-flex flex-column">   
                    <div className="startTime">All-day</div>
                </div> : 
                <div className="timestamps d-flex flex-column">
                    <div className="startTime">{format(new Date(event.data.startTime), 'h:mm a')}</div>
                    <div className="endTime">{format(new Date(event.data.endTime), 'h:mm a')}</div>
                </div>
            }
            <div className="event"  style={{
                backgroundColor: current ? "var(--powder-blue)" : "rgba(255, 255, 255, 0.1)",
                color: current ? "var(--cyber-grape)" : "white"
            }}>
                <span className="edit" title="Edit Event" onClick={() => {
                    setSelectedEvent(event)
                    closeUpdateModal(true)
                }} style={{
                    backgroundColor: "rgba(255, 255, 255, " + (current ? "0.5)" : "0.2)")
                }}>&#9998;</span>
                <div className="title" style={{
                    fontWeight: current ? "bold" : 400
                }}>{event.data.eventTitle}</div>
                <div className="description">{event.data.eventDescription}</div>
            </div>
        </div>
    )
}
