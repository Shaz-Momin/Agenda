import React from 'react'

export default function EventContainer({current, start, end, title, desc }) {
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
                <div className="title" style={{
                    fontWeight: current ? "bold" : 400
                }}>{title}</div>
                <div className="description">{desc}</div>
            </div>
        </div>
    )
}
