/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from "react"
import { Link } from "react-router-dom"
import {sortArrayByDate} from "../functions/_generalFunctions"
let eventTitleMap = new Map([
   ["written", "test"],
   ["writtenFixed", "test popravljanje"],
   ["talk", "spraševanje"],
   ["talkFixed", "spraševanje popravljanje"],
   ["smallGrade", "mala ocena"],
   ["plus_minus", "za plus"]
])

export default function Home_Dates({isMobile}){
   let device = isMobile ? "Mobile" : "Computer"
   const [allDatesData, setAllDatesData] = useState()
   const [allDatesParagraphs, setAllDatesParagraphs] = useState()
   useEffect(()=>{
      fetch(import.meta.env.VITE_API_dates)
         .then(res => res.json())
         .then(data => setAllDatesData(data))
   }, [])
   
   useEffect(()=>{
      if(!allDatesData)return
      let allDatesDiv = sortArrayByDate(allDatesData.grades, "date", "time").map((myEvent=>{
         let [day, month, year] = myEvent.date.split(".")
         let type = `${myEvent.type}${myEvent.fixing ?"Fixed" : ""}`
         return <div><p>{`${day}.${month}. (${myEvent.class}) - ${eventTitleMap.get(type)} (${myEvent.classroom}, ${myEvent.time}.ura)`}</p></div>
      }))
      setAllDatesParagraphs(allDatesDiv)
   }, [allDatesData])
   return(
      <Link className={`Home-dates-div ${device}`} to="/dates">
         {allDatesParagraphs}
      </Link>
   )
}