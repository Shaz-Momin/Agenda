import React from 'react'
import Signup from './Signup'
import Login from './Login'
import ForgotPassword from './ForgotPassword'
import PrivateRoute from './PrivateRoute'
import Dashboard from './Dashboard'
import { Container } from 'react-bootstrap'
import { AuthProvider } from '../contexts/AuthContext'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

function App() {
  return (
    <div className="d-flex align-items-center justify-content-center mx-0 p-0 w-100"
      style={{ height: "100vh"}}>
      <div className="w-100">
        <Router>
          <AuthProvider>
            <Switch>
              <PrivateRoute exact path="/" component={Dashboard} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </div>
  )
}

export default App;
