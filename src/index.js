import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import './styles/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'


ReactDOM.render(
  <React.StrictMode>
    <div className="cardHolder">
      <App />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);