import React, { useState } from "react";

export default function TeacherPopup_ignoreFixedGrades({ aboutTeacher, myClass, changeTeacherObject, closePopupFunction }) {
   const [fixedGradesState, setFixedGradesState] = useState(aboutTeacher.ignoreState)
   return <div className="teacherPopup-ignoreFixedGrades" onClick={(e) => e.stopPropagation()}>
      <nav>
         <h3>Ignore fixed grades ({myClass})</h3>
         <button onClick={closePopupFunction}><img src="./src/img/close.png" width={"50px"} /></button>
      </nav>
      <div>
         <input
            value={false}
            type="radio"
            name="ignoreState"
            id="ignoreFixedGrades-no"
            checked={fixedGradesState == false || fixedGradesState == "false"}
            onChange={(e) => { setFixedGradesState(false); changeTeacherObject(e, myClass) }} />
         <label htmlFor="ignoreFixedGrades-no">No</label>
         <input
            value={true}
            type="radio"
            name="ignoreState"
            id="ignoreFixedGrades-yes"
            checked={fixedGradesState == true || fixedGradesState == "true"}
            onChange={(e) => { setFixedGradesState(true); changeTeacherObject(e, myClass) }} />
         <label htmlFor="ignoreFixedGrades-yes">Yes</label>
      </div>
   </div>
}