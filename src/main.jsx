import React from 'react'
import ReactDOM from 'react-dom/client'
import Routes from "./Routes"
import "./css/index.css"
import './css/navbar.css'
import './css/home.css'
import './css/teacherPopups.css'
import './css/grades.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Routes/>
  </React.StrictMode>,
)
