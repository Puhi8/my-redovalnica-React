import React from "react"
import {HashRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./Navbar"
import Home from "./pages/Home"
import Grades from "./pages/Grades"
import Dates from "./pages/Dates"
import Teachers from "./pages/Teachers"
import Settings from "./pages/Settings"


export default function myRoutes(){
   //checking mode (mobile/computer) 
   const [isMobile, setIsMobile] = React.useState(false)
   React.useEffect(()=>{
      const checkDeviceMode = () =>{
         if(window.innerHeight > window.innerWidth) setIsMobile(true)
         else setIsMobile(false)
      }
      window.addEventListener("resize", checkDeviceMode)
      checkDeviceMode()
   },[])


   return(
      <Router>
         <Routes>
            <Route element={<Navbar isMobile={isMobile}/>}>
               <Route path="/" element={<Home isMobile={isMobile}/>}/>
               <Route path="/grades" element={<Grades isMobile={isMobile}/>}/>
               <Route path="/finalGrades" element={<Grades isMobile={isMobile}/>}/>
               <Route path="/dates" element={<Dates isMobile={isMobile}s/>}/>
               <Route path="/teachers" element={<Teachers isMobile={isMobile}/>}/>
               <Route path="/settings" element={<Settings isMobile={isMobile}/>}/>
            </Route>
         </Routes>
      </Router>
   )
}