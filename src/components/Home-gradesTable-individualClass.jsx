/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react/jsx-key */
import React from "react"

export default function IndividualClassTableDataMaker({ allClassesNames, allClassesForHalf }) {
   let trElements = allClassesNames.map(className => {
      if (!allClassesForHalf.hasOwnProperty(className)) return <td> </td>
      let allGradesNumbers = allClassesForHalf[className].grades.map(grade => {
         let gradeToReturn = <p className={`Home-table-grade gradeType-${grade.type}`}>{grade.grade}</p>
         if (grade.wasFixed) {
            gradeToReturn = (
               <p className={`Home-table-grade gradeType-${grade.typeFixed}`}>
                  {grade.gradeFixed}
                  <b className={`Home-table-gradeFixed ${grade.type}`}>{grade.grade}</b>
               </p>
            )
         }
         return gradeToReturn
      })
      return <td>{allGradesNumbers}</td>
   })
   return <tr>{trElements}</tr>
}