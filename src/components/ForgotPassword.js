import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import '../styles/index.css'

export default function ForgotPassword() {

    const emailRef = useRef()
    const { resetPassword } = useAuth()
    const [error, setError] = useState()
    const [message, setMessage] = useState()
    const [loading, setLoading] = useState(false)

    function handleSubmit(e) {
        e.preventDefault()
        
        ResetPassword()

        async function ResetPassword() {
            try {
                setMessage('')
                setError('')
                setLoading(true)
                await resetPassword(emailRef.current.value)
                setMessage('Check your inbox for further instructions')
            } catch {
                setError('Failed to reset password')
            }
            setLoading(false)
        }
        
    }

    return (
        <>
            <Card className="card">
                <Card.Body className="p-4">
                    <h2 className="text-center mb-4">Password Reset</h2>
                    { error && 
                        <div className="px-3">
                            <Alert variant="danger">{ error }</Alert>
                        </div>}
                    { message && 
                        <div className="px-3">
                            <Alert variant="success">{ message }</Alert>
                        </div>}
                    <Form className="p-3" onSubmit={ handleSubmit }>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control className="mb-2" type="email" ref={emailRef} required />
                        </Form.Group>
                        <Button className="w-100 button mt-2" disable={loading} type="submit">
                            Reset Password
                        </Button>
                    </Form>
                    <div className="w-100 mt-3 text-center">
                        <Link style={{ textDecoration: 'none' }} to="/login">
                            Login
                        </Link>
                    </div>
                </Card.Body>
            </Card>
            <div className="w-100 mt-4 text-center text-white">
                Need an account? <Link  className="bg-white rounded p-1 px-2 mx-1" style={{ textDecoration: 'none', fontSize:"0.9rem"}} to="/signup">Sign Up</Link>
            </div>
        </>
    )
}
