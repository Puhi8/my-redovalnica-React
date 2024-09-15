/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react"
import { convertMyDatesToUsableDates } from "../../functions/_generalFunctions"

export default function GradesPopup_plusMinus({ index, myClass, myClassData, closePopupFunction, changeNewData }) {   
   const [editMode, setEditMode] = useState(false)
   const typeToDisplayMap = new Map([
      ["plus", "+"],
      ["minus", "-"]
   ])
   return <div onClick={(e) => e.stopPropagation()}>
      <nav>
         <h3>{myClass} ({typeToDisplayMap.get(myClassData.plus_minus[index].type)})</h3>
         <button onClick={()=>{closePopupFunction(true)}}><img src="./img/close.png" width={"50px"}/></button>
         <button onClick={() => { setEditMode(!editMode) }}>Edit</button>
         {editMode && <button onClick={() => closePopupFunction(false, myClass, "plus_minus", index)}><img src="./img/checkmark-green.png" width={"50px"} /></button>}
      </nav>
      {editMode ? <>
         <label htmlFor="type">Type:</label>
         <select name="type" defaultValue={myClassData.plus_minus[index].type} onChange={(e)=>{changeNewData(e, myClass, "plus_minus", index)}}>
            <option value="plus">+</option>
            <option value="minus">-</option>
         </select>
         <label htmlFor="date">Date:</label>
         <input 
            type="date" 
            name="date" 
            defaultValue={convertMyDatesToUsableDates(myClassData.plus_minus[index].date)} 
            onChange={(e)=>{changeNewData(e, myClass, "plus_minus", index)}}
         />
         <label htmlFor="reason">Reason:</label>
         <input 
            type="text" 
            name="reason" 
            placeholder="The reason why i got this." 
            defaultValue={myClassData.plus_minus[index].reason} 
            onChange={(e)=>{changeNewData(e, myClass, "plus_minus", index)}}
         />
      </>
      :<>
         <p>Type: {typeToDisplayMap.get(myClassData.plus_minus[index].type)}</p>
         <p>Date: {myClassData.plus_minus[index].date}</p>
         <p>Reason: {(myClassData.plus_minus[index].reason) ?myClassData.plus_minus[index].reason : "No reason"}</p>
      </>}
   </div>
}