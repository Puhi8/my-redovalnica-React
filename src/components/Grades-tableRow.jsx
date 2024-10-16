/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { endGrade, roundUpReason } from "../functions/endGrade"
import { sortArrayByDate } from "../functions/_generalFunctions";
import { Link } from "react-router-dom";

export default function Grades_tableRow({ allClassData, myClass, popupFunction, displaySettings, isMobile }) {
   let classRow = []
   allClassData.grades = sortArrayByDate(allClassData.grades, "date", "dateFixed")
   //class
   if(displaySettings.class){
      classRow.push(<td className="grades-Class">{myClass}</td>)
   }
   //teacher name
   if(displaySettings.teacherName){
      let teacherNameText = allClassData.teacher.name
      if (!teacherNameText) teacherNameText = "No name"
      classRow.push(<td className="grades-Name"><Link to="/teachers">{teacherNameText}</Link></td>)
   }
   //plus / minus
   if(displaySettings.plusMinus){
      let allPlusesMinuses
      if (allClassData.plus_minus.length == 0) allPlusesMinuses = ""
      else {
         allPlusesMinuses = allClassData.plus_minus.map((element, index) => {
            let htmlToSend = <button name={`plus_minus-${myClass}`} onClick={(e) => { popupFunction(e, index) }}>{(element.type == "plus") ? "+" : "-"}</button>
            return htmlToSend
         })
      }
      classRow.push(<td className={`add plus_minus ${isMobile ?"Mobile":""} grades-PlusMinus`} style={{ maxWidth: "170px" }}>
         {allPlusesMinuses}<img name={`newPlus_minus-${myClass}`} className={`add plus_minus ${isMobile ?"Mobile":""}`} width={"20px"} src="./img/plus-green.png" onClick={(e) => popupFunction(e, 0)} />
      </td>)
   }
   //homework
   if(displaySettings.homework){
      classRow.push(<td className="grades-Homework"><button name={`homework-${myClass}`} onClick={(e)=>popupFunction(e)}>{allClassData.homework.length}</button></td>)
   }
   //grades
   let hasFixingToDo = false
   if(displaySettings.grades){
      let gradesIndex = 0
      let all1Grades = []
      let all2Grades = []
      allClassData.grades.forEach(individualGrade => {
         if (individualGrade.grade == 1 && (!individualGrade.wasFixed || individualGrade.gradeFixed == 1)) hasFixingToDo = true
         let newIndex = gradesIndex
         let htmlToReturn = <button name={`grades-${myClass}`} onClick={(e) => popupFunction(e, newIndex)}>
            {individualGrade.wasFixed ? <>
               {individualGrade.gradeFixed}
               <b style={{ fontSize: "8px" }} onClick={(e) => { e.target = e.target.parentNode; popupFunction(e, newIndex) }}>{individualGrade.grade}</b>
            </> : individualGrade.grade}
         </button>
         gradesIndex++
         individualGrade.isSecondHalf ? all2Grades.push(htmlToReturn) : all1Grades.push(htmlToReturn)
      })
      if(displaySettings.gradesSingle){
         classRow.push(<td className={`add Grade ${isMobile ?"Mobile":""} grades-Grades`} style={{ maxWidth: "170px" }}>
            {[...all1Grades, ...all2Grades]}<img name={`newGrade-${myClass}`} className={`add Grade ${isMobile ?"Mobile":""}`} width={"20px"} src="./img/plus-green.png" onClick={(e) => popupFunction(e, 0)} />
         </td>)
      }
      else{
         classRow.push(<td className={`add Grade ${isMobile ?"Mobile":""} grades-GradesHalf`} style={{ maxWidth: "170px" }}>
            {all1Grades}<img name={`newGrade-${myClass}`} className={`add Grade ${isMobile ?"Mobile":""}`} width={"20px"} src="./img/plus-green.png" onClick={(e) => popupFunction(e, 0)} />
         </td>)
         classRow.push(<td className={`add Grade ${isMobile ?"Mobile":""} grades-GradesHalf`} style={{ maxWidth: "170px" }}>
            {all2Grades}<img name={`newGrade-${myClass}`} className={`add Grade ${isMobile ?"Mobile":""}`} width={"20px"} src="./img/plus-green.png" onClick={(e) => popupFunction(e, 0)} />
         </td>)
      }
   }
   //small grades
   if(displaySettings.smallGrades){
      let allSmallGradesHtml = []
      if (allClassData.smallGrade.length == 0) allSmallGradesHtml.push(<td></td>)
      else {
         allClassData.smallGrade.forEach((smallGrade, index) => {
            allSmallGradesHtml.push(<button name={`smallGrade-${myClass}`} onClick={(e) => { popupFunction(e, index) }}>{smallGrade.grade}</button>)
         })
      }
      classRow.push(<td className={`add smallGrade ${isMobile ?"Mobile":""} grades-SmallGrades`} >
         {allSmallGradesHtml}<img name={`newSmallGrade-${myClass}`} className={`add smallGrade ${isMobile ?"Mobile":""}`} width={"20px"} src="./img/plus-green.png" onClick={(e) => popupFunction(e, 0)}/>
      </td>)
   }
   //fixing
   if(displaySettings.fixing) classRow.push(<td className="grades-Fixing"><img style={{ width: "50px" }} src={`./img/${hasFixingToDo ? "close-red" : "checkmark-green"}.png`} /></td>)
   //final grades
   if(displaySettings.computerEstimation || displaySettings.estimation){
      let estimation = allClassData.iEstimate
      classRow.push(<td className="grades-FinalGrades">
         {displaySettings.computerEstimation && <p>Auto: {endGrade(allClassData)}</p>}
         {displaySettings.estimation && <p>Estimate: <button onClick={popupFunction} name={`iEstimate-${myClass}`}>{!estimation ? "No est." : estimation}</button></p>}
      </td>)
   }
   //FINAL GRADE
   if(displaySettings.finalGrade) {
      classRow.push(<td className="grades-endedGrade"><button onClick={popupFunction} name={`endedGrade-${myClass}`}>{!allClassData.endedGrade ? "Not finished" : allClassData.endedGrade}</button></td>)
   }
   return <tr className="individualClassRow">{classRow}</tr>
}