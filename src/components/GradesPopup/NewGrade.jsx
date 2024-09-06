import React, { useState, useEffect } from "react"; React

export default function GradesPopup_newGrade({ myClass, closePopupFunction, addNewItem }) {
   const [displayAboutTest, setDisplayAboutTest] = useState(false)
   const [percent, setPercent] = useState()
   const [allPoints, setAllPoints] = useState(100)
   const [getPoints, setGetPoints] = useState()
   useEffect(()=>{
      addNewItem()
   },[])

   useEffect(()=>{
      if (allPoints && getPoints) {
         setPercent((100 * getPoints) / allPoints);
      } else {
         setPercent(null);
      }
   },[getPoints, allPoints])

   return (<div onClick={(e) => e.stopPropagation()}>
      <nav>
      <h3>Add</h3>
      <button onClick={()=>{closePopupFunction(true)}}><img src="../src/img/close.png" width={"50px"}/></button>
      </nav>
      <label htmlFor="effect">Effect:</label>
      <input
         type="number"
         name="effect"
         id="effect"
         placeholder="In %"
         defaultValue={100}
         min={1}
         max={100}
         onChange={(e)=>{addNewItem(e, myClass, "grades")}}
      />
      <label htmlFor="grade">Grade:</label>
      <input 
         type="number" 
         name="grade" 
         id="grade"
         placeholder="what did you get"
         min={1}
         max={5}
         onChange={(e)=>{addNewItem(e, myClass, "grades")}}
      />
      <label htmlFor="gradeExtra">Extra: </label>
      <select id="gradeExtra" name="gradeExtra" defaultValue={0} onChange={(e)=>{addNewItem(e, myClass, "grades")}}>
         <option value="+">+</option>
         <option value="0">0</option>
         <option value="-">-</option>
      </select>
      <label htmlFor="type">Type:</label>
      <select id="type" name="type" onChange={(e)=>{addNewItem(e, myClass, "grades"); setDisplayAboutTest(e.target.value == "written")}}>
         <option value="talk">Talk</option>
         <option value="written">Written</option>
      </select>
      <label htmlFor="date">Date:</label>
      <input 
         type="date" 
         name="date"
         id="date" 
         defaultValue={new Date().toISOString().split("T")[0]}
         onChange={(e)=>{addNewItem(e, myClass, "grades")}}
      />
      {displayAboutTest && <div>
         <h4>About test</h4>
         <label htmlFor="allPoints">All points:</label>
         <input 
            type="number" 
            name="aboutTest-allPoints" 
            id="allPoints"
            defaultValue={100}
            min={1}
            onChange={(e)=>{addNewItem(e, myClass, "grades"); setAllPoints(e.target.value)}}
         />
         <label htmlFor="getPoints">Points i have:</label>
         <input 
            type="number" 
            name="aboutTest-getPoints" 
            id="getPoints"
            min={1}
            onChange={(e)=>{addNewItem(e, myClass, "grades"); setGetPoints(e.target.value)}}
         />
         <label htmlFor="percent">Percent:</label>
         <input 
            type="number" 
            name="aboutTest-percent" 
            id="percent"
            placeholder="In %"
            defaultValue={percent}
            min={1}
            max={100}
            onChange={(e)=>{addNewItem(e, myClass, "grades")}}
         />
      </div>}
      <button name="addNewGrade" onClick={(e)=>{if(e.target.nodeName == "IMG") e.target = e.target.parentNode; addNewItem(e, myClass, "grades")}}><img src="../src/img/checkmark-green.png" width={"50px"}/></button>
   </div>)
}