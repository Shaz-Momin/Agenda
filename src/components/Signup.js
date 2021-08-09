import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import '../styles/index.css'

export default function Signup() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    function handleSubmit(e) {
        e.preventDefault()

        // check if the password & passwordConfirm match
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match')
        }
        
        signUp()

        async function signUp() {
            try {
                setError('')
                setLoading(true)
                await signup(emailRef.current.value, passwordRef.current.value)              
                history.push('/')
            } catch {
                setError('Failed to create an account')
            }
            setLoading(false)
        }
        
    }

    return (
        <>
            <Card className="card">
                <Card.Body className="p-4">
                    <h2 className="text-center mb-4">Sign Up</h2>
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
                        <Form.Group id="password-confirm">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control className="mb-4" type="password" ref={passwordConfirmRef} required />
                        </Form.Group>
                        <Button className="w-100 button mt-2" disable={loading} type="submit">
                            Sign Up
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 mt-4 text-center text-white">
                Already have an account? <Link className="bg-white rounded p-1 px-2 mx-1" style={{ textDecoration: 'none', fontSize:"0.9rem"}}   to="/login">Log In</Link>
            </div>
        </>
    )
}
