/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { endGrade, roundUpReason } from "../functions/endGrade"
import { sortArrayByDate } from "../functions/_generalFunctions";
import { Link } from "react-router-dom";

export default function Grades_tableRow({ allClassData, myClass, popupFunction }) {
   let classRow = []
   allClassData.grades = sortArrayByDate(allClassData.grades, "date", "dateFixed")
   //class
   classRow.push(<td>{myClass}</td>)
   //teacher name
   let teacherNameText = allClassData.teacher.name
   if (!teacherNameText) teacherNameText = "No name"
   classRow.push(<td><Link to="/teachers">{teacherNameText}</Link></td>)
   //plus / minus
   let plusMinusIndex = 0
   let allPlusesMinuses
   if (allClassData.plus_minus.length == 0) allPlusesMinuses = 0
   else {
      allPlusesMinuses = allClassData.plus_minus.map(element => {
         let htmlToSend = <button name={`plus_minus-${myClass}`} onClick={(e) => { popupFunction(e, plusMinusIndex) }}>{(element.type == "plus") ? "+" : "-"}</button>
         plusMinusIndex++
         return htmlToSend
      })
   }
   classRow.push(<td>{allPlusesMinuses}</td>)
   //homework
   classRow.push(<td>{allClassData.homework.length}</td>)
   //grades
   let hasFixingToDo = false
   let gradesIndex = 0
   let all1Grades = []
   let all2Grades = []
   allClassData.grades.forEach(individualGrade => {
      if (individualGrade.grade == 1 && (!individualGrade.wasFixed || individualGrade.gradeFixed == 1)) hasFixingToDo = true
      let newIndex = gradesIndex
      let htmlToReturn = <button name={`grades-${myClass}`} onClick={(e) => { popupFunction(e, newIndex) }}>
         {individualGrade.wasFixed ? <>{individualGrade.gradeFixed}<b style={{ fontSize: "8px" }} onClick={(e) => { e.target = e.target.parentNode; popupFunction(e, newIndex) }}>{individualGrade.grade}</b></> : individualGrade.grade}
      </button>
      gradesIndex++
      individualGrade.isSecondHalf ? all2Grades.push(htmlToReturn) : all1Grades.push(htmlToReturn)
   })
   classRow.push(<td className="addGrade" style={{ maxWidth: "170px" }}>
      {all1Grades}<img name={`newGrade-${myClass}`} className="addGrade" width={"20px"} src="../src/img/plus-green.png" onClick={(e) => popupFunction(e)} />
   </td>)
   classRow.push(<td className="addGrade" style={{ maxWidth: "170px" }}>
      {all2Grades}<img name={`newGrade-${myClass}`} className="addGrade" width={"20px"} src="../src/img/plus-green.png" onClick={(e) => popupFunction(e)} />
   </td>)
   //small grades
   if (allClassData.smallGrade.length == 0) {
      classRow.push(<td>No small grades</td>)
   }
   else {
      let allSmallGradesHtml = []
      let smallGradesIndex = 0
      allClassData.smallGrade.forEach(smallGrade => {
         let newIndex = smallGradesIndex
         allSmallGradesHtml.push(<button name={`smallGrades-${myClass}`} onClick={(e) => { popupFunction(e, newIndex) }}>{smallGrade.grade}</button>)
         smallGradesIndex++
      })
      classRow.push(<td>{allSmallGradesHtml}</td>)
   }
   //fixing
   classRow.push(<td><img style={{ width: "50px" }} src={`../src/img/${hasFixingToDo ? "close-red" : "checkmark-green"}.png`} /></td>)
   //final grades
   let finalGradeAutoText = endGrade(allClassData)
   let estimation = allClassData.iEstimate
   classRow.push(<td>
      <p>Auto: {finalGradeAutoText}</p>
      <p>Estimate: <button onClick={popupFunction} name={`iEstimate-${myClass}`}>{!estimation ? "No est." : estimation}</button></p>
   </td>)
   //FINAL GRADE
   classRow.push(<td><button onClick={popupFunction} name={`endedGrade-${myClass}`}>{!allClassData.endedGrade ? "Not finished" : allClassData.endedGrade}</button></td>)
   return <tr>{classRow}</tr>
}