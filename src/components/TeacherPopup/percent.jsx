import React, { useState } from "react";

export default function TeacherPopup_percent({ aboutTeacher, myClass, changeTeacherObject, closePopupFunction }) {
   const [percentState, setPercentState] = useState(aboutTeacher.percentState)

   return <div className="teacherPopup-percent" onClick={(e) => e.stopPropagation()}>
      <nav>
         <h3>End by percent ({myClass})</h3>
         <button onClick={closePopupFunction}><img src="./src/img/close.png" width={"50px"} /></button>
      </nav>
      <div>
         <input
            value={false}
            type="radio"
            name="percentState"
            id="percent-no"
            checked={percentState == "false" || percentState == false}
            onChange={(e) => { setPercentState(false); changeTeacherObject(e, myClass) }} />
         <label htmlFor="percent-no">No</label>
         <input
            value={true}
            type="radio"
            name="percentState"
            id="percent-yes"
            checked={percentState == "true" || percentState == true}
            onChange={(e) => { setPercentState(true); changeTeacherObject(e, myClass) }} />
         <label htmlFor="percent-yes">Yes</label>
      </div>
   </div>
}