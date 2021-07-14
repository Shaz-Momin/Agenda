import React, { useContext } from 'react'
import '../styles/dashboard.css'
import DateContext from '../contexts/DateContext'


export default function EventsPanel() {

    const date = useContext(DateContext)

    return (
        <>
            <div className="sectionTitle">Currently</div>
            <hr class="dotted"/>
            <div className="sectionTitle">Upcoming</div>
        </>
    )
}
