import React, { useContext, useState, useEffect } from 'react'

const DateContext = React.createContext()

export function useDateContext() {
    return useContext(DateContext);
}

export function DateProvider({ children }) {
    
    const [date, setDate] = useState(new Date())

    useEffect(() => {
        var timer = setInterval(() => {
            setDate(new Date())
        }, 1000)

        return function cleanup() {
            clearInterval(timer)
        }
    }, [])

    const value = { date }

    return (
        <DateContext.Provider value={value} >
            { children }
        </DateContext.Provider>
    )
}

