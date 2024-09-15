import React, { useState, useEffect } from "react";

export default function TeacherPopup_smallGrades({ aboutTeacher, myClass, changeTeacherObject, closePopupFunction }) {
   const [smallGradeState, setSmallGradeState] = useState(aboutTeacher.smallGradeState)

   useEffect(() => {
      if (smallGradeState == "convert") {
         let event = {
            "target": document.getElementsByName("smallGradeConvertNumber")[0]
         }
         changeTeacherObject(event, myClass)
      }
   }, [smallGradeState])
   return <div className="teacherPopup-smallGrades" onClick={(e) => e.stopPropagation()}>
      <nav>
         <h3>Small grades ({myClass})</h3>
         <button onClick={closePopupFunction}><img src="./img/close.png" width={"50px"} /></button>
      </nav>
      <div>
         <input
            value={"none"}
            type="radio"
            name="smallGradeState"
            id="smallGrades-none"
            checked={smallGradeState == "none"}
            onChange={(e) => { setSmallGradeState(e.target.value); changeTeacherObject(e, myClass) }}
         />
         <label htmlFor="smallGrades-none">None</label>
         <input
            value={"convert"}
            type="radio"
            name="smallGradeState"
            id="smallGrades-convert"
            checked={smallGradeState == "convert"}
            onChange={(e) => { setSmallGradeState(e.target.value); changeTeacherObject(e, myClass) }}
         />
         <label htmlFor="smallGrades-convert">Convert</label>
         <input
            value={"round"}
            type="radio"
            name="smallGradeState"
            id="smallGrades-round"
            checked={smallGradeState == "round"}
            onChange={(e) => { setSmallGradeState(e.target.value); changeTeacherObject(e, myClass) }}
         />
         <label htmlFor="smallGrades-round">Round</label>
      </div>
      {smallGradeState == "convert" && <>
         <label htmlFor="smallGradesConvertNumber">Number:</label>
         <input
            type="number"
            name="smallGradeConvertNumber"
            defaultValue={aboutTeacher.smallGradeConvertNumber || 3}
            id="smallGradesConvertNumber"
            onChange={(e) => { changeTeacherObject(e, myClass) }}
         />
      </>}
   </div>
}