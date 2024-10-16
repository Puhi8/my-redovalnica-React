/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react/jsx-key */
import React from "react"
import Home_GradesTable_desktop from "./Home-gradesTable-desktop"
import Home_GradesTable_mobile from "./Home-gradesTable-mobile"
import { Link } from "react-router-dom"
const API_grades = import.meta.env.VITE_API_grades
const API_allClasses = import.meta.env.VITE_API_allClasses

export default function Home_Grades({ isMobile }) {
   let device = isMobile ? "Mobile" : "Computer"
   const [endOfYear, setEndOfYear] = React.useState(false)
   const [allClasses, setAllClasses] = React.useState([])
   const [gradesData, setGradesData] = React.useState({})
   React.useEffect(() => {
      Promise.all([
         fetch(API_allClasses).then(res => res.json()),
         fetch(API_grades).then(res => res.json())
      ])
      .then(([allClassesData, allData]) => {
         setAllClasses(allClassesData);
         setGradesData(allData);
      }) 
   }, [])
   return (
      <Link className={`Home-grades-div ${device}`} to="/grades">
         {isMobile
            ? <Home_GradesTable_mobile gradesData={gradesData} allClasses={allClasses} endOfYear={endOfYear} isMobile={isMobile}/>
            : <Home_GradesTable_desktop gradesData={gradesData} allClasses={allClasses} endOfYear={endOfYear} isMobile={isMobile}/>
         }
      </Link>
   )
}