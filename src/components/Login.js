import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import '../styles/index.css'

export default function Login() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    function handleSubmit(e) {
        e.preventDefault()
        
        logIn()

        async function logIn() {
            try {
                setError('')
                setLoading(true)
                await login(emailRef.current.value, passwordRef.current.value)
                history.push('/')
            } catch {
                setError('Failed to sign in')
            }
            setLoading(false)
        }
        
    }

    return (
        <>
            <Card className="card">
                <Card.Body className="p-4">
                    <h2 className="text-center mb-4">Log In</h2>
                    { error && 
                        <div className="px-3">
                            <Alert variant="danger">{ error }</Alert>
                        </div>}
                    <Form className="p-3" onSubmit={ handleSubmit }>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control className="mb-2" type="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control className="mb-2" type="password" ref={passwordRef} required />
                        </Form.Group>
                        <Button className="w-100 button mt-2" disable={loading} type="submit">
                            Log In
                        </Button>
                    </Form>
                    <div className="w-100 mt-3 text-center">
                        <Link style={{ textDecoration: 'none' }} to="/forgot-password">
                            Forgot Password?
                        </Link>
                    </div>
                </Card.Body>
            </Card>
            <div className="w-100 mt-4 text-center text-white">
                Need an account? <Link className="bg-white rounded p-1 px-2 mx-1" style={{ textDecoration: 'none', fontSize:"0.9rem" }}  to="/signup">Sign Up</Link>
            </div>
        </>
    )
}
