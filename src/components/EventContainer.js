import React from 'react'

export default function EventContainer({current, event, start, end, title, desc, closeUpdateModal, setSelectedEvent}) {
    return (
        <div className="eventContainer d-flex text-white">
            <div className="timestamps d-flex flex-column">
                <div className="startTime">{start}</div>
                <div className="endTime">{end}</div>
            </div>
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
                }}>{title}</div>
                <div className="description">{desc}</div>
            </div>
        </div>
    )
}
