import React from "react"; React
import Home_Grades from "../components/Home-grades";
import Home_Dates from "../components/Home-dates";
export default function Home({isMobile}){
   let device = isMobile ? "Mobile" : "Computer"
   return(
      <div className={`Home-main ${device}`}>
         <Home_Grades isMobile={isMobile}/>
         <Home_Dates isMobile={isMobile}/>
      </div>
   )
}