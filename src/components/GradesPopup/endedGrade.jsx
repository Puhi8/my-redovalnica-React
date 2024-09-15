/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"

export default function GradesPopup_endedGrade({myClass, myClassData, changeNewData}) {
   return <div onClick={(e) => e.stopPropagation()}>
      <nav>
         <p>{myClass}</p>
         <button name="deleteAll" onClick={(e)=>changeNewData(e, myClass, "endedGrade", 0)}>Delete</button>
      </nav>
      <label htmlFor="endedGrade">Final grade: </label>
      <input 
         type="number" 
         name="endedGrade" 
         id="endedGrade" 
         max={5}
         min={1}
         defaultValue={myClassData.endedGrade}
         onChange={(e)=>changeNewData(e, myClass)}
      />
   </div>
}