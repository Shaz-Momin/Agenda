import React, { useRef } from 'react'
import { Form, Button, Card } from 'react-bootstrap'
import '../styles/index.css'

export default function Signup() {

    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();

    return (
        <>
            <Card className="card">
                <Card.Body className="p-4">
                    <h2 className="text-center mb-3">Sign Up</h2>
                    <Form className="p-4">
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
                        <Button className="w-100 mb-4 button" type="submit">Sign Up</Button>
                    </Form>
                    <div className="w-100 text-center">
                        Already have an account? Log In
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}
