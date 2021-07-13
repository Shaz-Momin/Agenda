import React, { useState } from 'react'
import DateDocker from './DateDocker'
import CalendarPanel from './CalendarPanel'
import '../styles/dashboard.css'

export default function Dashboard() {

    return (
        <>  
            <div className="bigContainer text-white">
                <div className="dashboardPanel">
                    <DateDocker />
                </div>
                <div className="calendarPanel">
                    <CalendarPanel />
                </div>
            </div>
        </>
    )
}
