import React, { useState, useEffect } from "react";

export default function TeacherPopup_homework({ aboutTeacher, myClass, changeTeacherObject, closePopupFunction }) {
   const [homeworkState, setHomeworkState] = useState(aboutTeacher.homeworkState)

   useEffect(()=>{
      if(homeworkState == "getGrade"){
         let event = {
            "target": document.getElementsByName("homeworkGrade")[0]
         }
         changeTeacherObject(event, myClass)
      }
      if(homeworkState == "getGrade" || homeworkState == "roundUp"){
         let event = {
            "target": document.getElementsByName("homeworkNumber")[0]
         }
         changeTeacherObject(event, myClass)
      }
   },[homeworkState])


   return <div className="teacherPopup-homework" onClick={(e) => e.stopPropagation()}>
      <nav>
         <h3>Homework ({myClass})</h3>
         <button onClick={closePopupFunction}><img src="./src/img/close.png" width={"50px"}/></button>
      </nav>
      <div>
         <input
            type="radio"
            name="homeworkState"
            value="none"
            id="none"
            checked={homeworkState == "none"}
            onChange={(e) => { setHomeworkState(e.target.value); changeTeacherObject(e, myClass) }}
         />
         <label htmlFor="none">None</label>
         <input
            type="radio"
            name="homeworkState"
            value="getGrade"
            id="grade"
            checked={homeworkState == "getGrade"}
            onChange={(e) => { setHomeworkState(e.target.value); changeTeacherObject(e, myClass) }}
         />
         <label htmlFor="grade">Grades</label>
         <input
            type="radio"
            name="homeworkState"
            value="roundUp"
            id="round"
            checked={homeworkState == "roundUp"}
            onChange={(e) => { setHomeworkState(e.target.value); changeTeacherObject(e, myClass) }}
         />
         <label htmlFor="round">Round</label>
      </div>
      {homeworkState !== "none" && <div>
         {homeworkState == "getGrade" && <>
            <label htmlFor="homeworkGrade">Grade:</label>
            <input
               type="number"
               name="homeworkGrade"
               id="homeworkGrade"
               defaultValue={aboutTeacher.homeworkGrade || 1}
               onChange={(e) => { changeTeacherObject(e, myClass) }} />
         </>}
         <label htmlFor="homeworkNumber">Number:</label>
         <input
            type="number"
            name="homeworkNumber"
            id="homeworkNumber"
            defaultValue={aboutTeacher.homeworkNumber || 5}
            onChange={(e) => { changeTeacherObject(e, myClass) }} />
      </div>}
   </div>
}