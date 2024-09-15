/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, {useState} from "react"
import { convertMyDatesToUsableDates, make_a_deep_copy } from "../../functions/_generalFunctions";

export default function GradesPopup_homework({myClass, myClassData, changeNewData, closePopupFunction, addNewItem}) {
   const [editMode, setEditMode] = useState(false)
   let allHomeworkToDisplay = myClassData.homework.map((individualHomework, index)=>{
      return <div>
         {editMode ?<>
            <label htmlFor="date">Date: </label>
            <input 
               type="date" 
               name="date" 
               id="date" 
               defaultValue={convertMyDatesToUsableDates(individualHomework.date)}
               onChange={(e)=>changeNewData(e, myClass, "homework", make_a_deep_copy(index))}
            />
            <button 
               name="deleteHomework" 
               onClick={(e)=>{if(e.target.nodeName == "IMG") e.target = e.target.parentNode; changeNewData(e, myClass, "homework", index)}}
            >
               <img src="./img/trash-can-red.png" width={"50px"}/>
            </button>
         </>
         :<p>{individualHomework.date}</p>}
      </div>
   })
   if(allHomeworkToDisplay.length == 0){
      allHomeworkToDisplay = [<p>No homework</p>]
   }
   return <div onClick={(e) => e.stopPropagation()}>
      <nav>
         <p>{myClass} (Homework: {myClassData.homework.length})</p>
         <button onClick={() => closePopupFunction(true)}><img src="./img/close.png" width={"50px"} /></button>
         <button onClick={() => setEditMode(!editMode)}>Edit</button>
         {editMode && <button name="date" value={new Date().toISOString().split("T")[0]} onClick={(e)=>{
            addNewItem(e, myClass, "homework")
            e.target = {
               ...e.target,
               name: "addNew"
            }
            addNewItem(e, myClass, "homework")
         }}>add</button>}
      </nav>
      <div>
         {allHomeworkToDisplay}
      </div>
   </div>
}