import {useEffect} from "react";

export default function GradesPopup_newPlusMinus({ myClass, closePopupFunction, addNewItem}) {
   useEffect(()=>{
      addNewItem(0,0,0,"plus_minus")
   },[])
   return <div onClick={(e) => e.stopPropagation()}>
      <nav>
         <h3>Add +/- ({myClass})</h3>
         <button onClick={()=>{closePopupFunction(true)}}><img src="./img/close.png" width={"50px"}/></button>
      </nav>
      <label htmlFor="type">Type:</label>
      <select name="type" defaultValue={"plus"} onChange={(e)=>{addNewItem(e, myClass, "plus_minus")}}>
         <option value="plus">+</option>
         <option value="minus">-</option>
      </select>
      <label htmlFor="date">Date:</label>
      <input type="date" name="date" defaultValue={new Date().toISOString().split("T")[0]} onChange={(e)=>{addNewItem(e, myClass, "plus_minus")}}/>
      <label htmlFor="reason">Reason:</label>
      <input type="text" name="reason" placeholder="The reason why i got this." onChange={(e)=>{addNewItem(e, myClass, "plus_minus")}}/>
      <button name="addNew" onClick={(e)=>{if(e.target.nodeName == "IMG") e.target = e.target.parentNode; addNewItem(e, myClass, "plus_minus")}}><img src="./img/checkmark-green.png" width={"50px"}/></button>
   </div>
}