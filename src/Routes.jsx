import React from "react"
import {HashRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./Navbar"
import Home from "./pages/Home"
import Grades from "./pages/Grades"
import Dates from "./pages/Dates"
import Teachers from "./pages/Teachers"
import Settings from "./pages/Settings"
const API_settings = import.meta.env.VITE_API_settings


export default function myRoutes(){
   //checking mode (mobile/computer) 
   const [isMobile, setIsMobile] = React.useState(false)
   const [settingsData, setSettingsData] = React.useState(null)
   
   React.useEffect(()=>{
      //set device type
      const checkDeviceMode = () =>{
         if(window.innerHeight > window.innerWidth) setIsMobile(true)
         else setIsMobile(false)
      }
      window.addEventListener("resize", checkDeviceMode)
      checkDeviceMode()
      //get settings
      fetch(API_settings)
      .then(res => res.json())
      .then(settingsObject =>{
         setSettingsData(settingsObject)
      })
      .catch(err => console.log(err))
   },[])

   if(settingsData == null){
      return <div>Loading settings...</div>
   }
   return(
      <Router>
         <Routes>
            <Route element={<Navbar isMobile={isMobile} settings={settingsData}/>}>
               <Route path="/" element={<Home isMobile={isMobile} settings={settingsData}/>}/>
               <Route path="/grades" element={<Grades isMobile={isMobile} settings={settingsData}/>}/>
               <Route path="/finalGrades" element={<Grades isMobile={isMobile} settings={settingsData}/>}/>
               <Route path="/dates" element={<Dates isMobile={isMobile} settings={settingsData}s/>}/>
               <Route path="/teachers" element={<Teachers isMobile={isMobile} settings={settingsData}/>}/>
               <Route path="/settings" element={<Settings isMobile={isMobile} settings={settingsData}/>}/>
            </Route>
         </Routes>
      </Router>      
   )
}