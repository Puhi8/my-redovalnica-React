import {useEffect} from "react";

export default function GradesPopup_newSmallGrade({ myClass, closePopupFunction, addNewItem}) {
   useEffect(()=>{
      addNewItem(0,0,0,"smallGrade")
   },[])
   return <div onClick={(e) => e.stopPropagation()}>
      <nav>
         <h3>Add small grade ({myClass})</h3>
         <button onClick={()=>{closePopupFunction(true)}}><img src="./img/close.png" width={"50px"}/></button>
      </nav>
      <label htmlFor="grade">Grade:</label>
      <input 
         name="grade" 
         type="number" 
         id="grade"
         min={1}
         max={5}
         onChange={(e)=>{addNewItem(e, myClass, "smallGrade")}}
      />
      <label htmlFor="date">Date:</label>
      <input type="date" name="date" defaultValue={new Date().toISOString().split("T")[0]} onChange={(e)=>{addNewItem(e, myClass, "smallGrade")}}/>
      <label htmlFor="reason">Reason:</label>
      <input type="text" name="reason" placeholder="The reason why this grade." onChange={(e)=>{addNewItem(e, myClass, "smallGrade")}}/>
      <button name="addNew" onClick={(e)=>{if(e.target.nodeName == "IMG") e.target = e.target.parentNode; addNewItem(e, myClass, "smallGrade")}}><img src="./img/checkmark-green.png" width={"50px"}/></button>
   </div>
}