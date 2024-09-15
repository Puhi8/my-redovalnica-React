import React from "react";

export default function TeacherPopup_name({ aboutTeacher, myClass, changeTeacherObject, closePopupFunction }) {
   return <div className="teacherPopup-name" onClick={(e) => e.stopPropagation()}>
      <nav>
         <h3>Name ({myClass})</h3>
         <button onClick={closePopupFunction}><img src="./img/close.png" width={"50px"} /></button>
      </nav>
      <input type="text" name="name" defaultValue={aboutTeacher.name} onChange={(e) => changeTeacherObject(e, myClass)} />
   </div>
}