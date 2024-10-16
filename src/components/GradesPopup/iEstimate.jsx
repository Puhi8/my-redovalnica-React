/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"

export default function GradesPopup_iEstimate({myClass, myClassData, changeNewData}) {
   return <div onClick={(e) => e.stopPropagation()}>
      <nav>
         <p>{myClass}</p>
         <button name="deleteAll" onClick={(e)=>changeNewData(e, myClass, "iEstimate", 0)}>Delete</button>
      </nav>
      <label htmlFor="iEstimate">Estimate:</label>
      <input 
         type="number" 
         name="iEstimate" 
         id="iEstimate" 
         max={5}
         min={1}
         defaultValue={myClassData.iEstimate}
         onChange={(e)=>changeNewData(e, myClass)}
      />
   </div>
}