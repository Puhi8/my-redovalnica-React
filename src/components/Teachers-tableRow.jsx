/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

export default function Teachers_tableRow({ teacherObject, myClass, popupFunction, settings }) {
   let teacherRow = []
   //name
   if (settings.name) teacherRow.push(<td><button onClick={popupFunction} name={`name-${myClass}`}>{Boolean(teacherObject.name) ? teacherObject.name : "no name"}</button></td>)
   //class
   if (settings.class) teacherRow.push(<td>{myClass}</td>)
   //homework
   if (settings.homework) {
      let homeworkText
      if (teacherObject.homeworkState !== "none") {
         if (teacherObject.homeworkState == "roundUp") homeworkText = "Round"
         else homeworkText = `Grade:${teacherObject.homeworkNumber}`
      }
      else homeworkText = "None"
      teacherRow.push(<td><button onClick={popupFunction} name={`homework-${myClass}`}>{homeworkText}</button></td>)
   }
   //percent
   if (settings.percent) teacherRow.push(<td><button onClick={popupFunction} name={`percent-${myClass}`}>{(teacherObject.percentState == "true" || teacherObject.percentState == true) ? "yes" : "no"}</button></td>)
   //ignore fixed grades
   if (settings.ignoresFixedGrades) teacherRow.push(<td><button onClick={popupFunction} name={`ignoreFixedGrades-${myClass}`}>{(teacherObject.ignoreState == "true" || teacherObject.ignoreState == true) ? "yes" : "no"}</button></td>)
   //small grades
   if(settings.smallGrades){
      let smallGradeText
      switch (teacherObject.smallGradeState) {
         case "none":
            smallGradeText = "None"
            break
         case "round":
            smallGradeText = "Round"
            break
         case "convert":
            smallGradeText = `Convert: ${teacherObject.smallGradeConvertNumber}`
            break
      }
      teacherRow.push(<td><button onClick={popupFunction} name={`smallGrades-${myClass}`}>{smallGradeText}</button></td>)
   }
   //plus minus
   if(settings.plusMinus){
   let plus_minusParagraph
   if (teacherObject.plus_minusState == "none") {
      plus_minusParagraph = "None"
   }
   else {
      plus_minusParagraph = teacherObject.plus_minusState.split("&").map(element => {
         return <div>{`${element[0].toUpperCase() + element.slice(1)}:${teacherObject[`${element}Number`]}`}</div>
      })
   }
   teacherRow.push(<td>
      <button
         onClick={(e) => {
            if (e.target.nodeName == "DIV") e.target = e.target.parentNode
            popupFunction(e)
         }}
         name={`plusMinus-${myClass}`}
      >
         {plus_minusParagraph}
      </button></td>)
   }
   return <tr>{teacherRow}</tr>
}