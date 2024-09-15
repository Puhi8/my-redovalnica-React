/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react"
import { convertMyDatesToUsableDates } from "../../functions/_generalFunctions"

export default function GradesPopup_smallGrade({ index, myClass, myClassData, closePopupFunction, changeNewData }) {   
   const [editMode, setEditMode] = useState(false)
   return <div onClick={(e) => e.stopPropagation()}>
      <nav>
         <h3>{myClass} ({myClassData.smallGrade[index].grade})</h3>
         <button onClick={()=>{closePopupFunction(true)}}><img src="./img/close.png" width={"50px"}/></button>
         <button onClick={() => { setEditMode(!editMode) }}>Edit</button>
         {editMode && <button onClick={() => closePopupFunction(false, myClass, "smallGrade", index)}><img src="./img/checkmark-green.png" width={"50px"} /></button>}
      </nav>
      {editMode ? <>
         <label htmlFor="grade">Grade:</label>
         <input 
            name="grade" 
            type="number" 
            id="grade"
            min={1}
            max={5}
            defaultValue={myClassData.smallGrade[index].grade}
            onChange={(e)=>{changeNewData(e, myClass, "smallGrade", index)}}
         />
         <label htmlFor="date">Date:</label>
         <input 
            type="date" 
            name="date" 
            defaultValue={convertMyDatesToUsableDates(myClassData.smallGrade[index].date)} 
            onChange={(e)=>{changeNewData(e, myClass, "smallGrade", index)}}
         />
         <label htmlFor="reason">Reason:</label>
         <input 
            type="text" 
            name="reason" 
            placeholder="The reason why i got this." 
            defaultValue={myClassData.smallGrade[index].reason} 
            onChange={(e)=>{changeNewData(e, myClass, "smallGrade", index)}}
         />
      </>
      :<>
         <p>Grade: {myClassData.smallGrade[index].grade}</p>
         <p>Date: {myClassData.smallGrade[index].date}</p>
         <p>Reason: {(myClassData.smallGrade[index].reason) ?myClassData.smallGrade[index].reason : "No reason"}</p>
      </>}
   </div>
}