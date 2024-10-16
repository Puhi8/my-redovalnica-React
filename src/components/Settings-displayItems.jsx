/* eslint-disable react/jsx-key */
import React, { useRef, useState } from "react"
const API_settings = import.meta.env.VITE_API_settings
const displayableTextMap = new Map([
   ["dates", "Dates"],
   ["teachers", "Teachers"],
   ["final", "Final"],
   ["class", "Class"],
   ["teacherName", "Teacher name"],
   ["homework", "Homework"],
   ["smallGrades", "Small grades"],
   ["plusMinus", "Plus / minus"],
   ["grades", "Grades"],
   ["gradesSingle", "Display grades in single box"],
   ["finalGrade", "Finale grade"],
   ["computerEstimation", "Computer estimation"],
   ["estimation", "Estimation"],
   ["fixing", "Show if the class needs fixing"],
   ["name", "Name"],
   ["ignoresFixedGrades", "Ignores fixed grades"],
   ["percent", "Percent"]
])

export default function ItemDisplaySettings({ settings, isMobile }) {
   const oldSettings = useRef(settings)
   const mySettings = useRef(settings)
   const [changeMobile, setChangeMobile] = useState(isMobile)
   const [displaySaveButtons, setDisplayButtons] = useState({
      displayNavbar: false,
      displayGrades: false,
      displayTeacher: false
   })

   function changeSettings(event) {
      const [valueChanged, groupChanged] = event.target.name.split("-")
      const deviceGroup = `display${changeMobile ? "Mobile" : "Desktop"}`
      mySettings.current = {
         ...mySettings.current,
         [deviceGroup]:{
            ...mySettings.current[deviceGroup],
            [groupChanged]: {
               ...mySettings.current[deviceGroup][groupChanged],
               [valueChanged]: event.target.checked
            }
         }
      }
      checkIfAnythingChanged(groupChanged)
   }

   function checkIfAnythingChanged(listName) {
      const deviceGroup = `display${changeMobile ? "Mobile" : "Desktop"}`
      let changeHappened = false
      Object.keys(mySettings.current[deviceGroup][listName]).forEach(value=>{
         if(mySettings.current[deviceGroup][listName][value] != oldSettings.current[deviceGroup][listName][value]){
            changeHappened = true
            return
         }
      })
      if(changeHappened){
         setDisplayButtons({
            ...displaySaveButtons,
            [listName]: true
         })
      }
      else setDisplayButtons({
         ...displaySaveButtons,
         [listName]: false
      })
   }

   function saveSettings(event){
      const sendData = {
         "type": "settingsChange",
         "dataChanged": event.target.name,
         "forMobile": changeMobile,
         "data": mySettings.current[`display${changeMobile ? "Mobile" : "Desktop"}`][event.target.name]
      }
      console.log("sending: ", sendData)     
      fetch(API_settings, {
         method: "POST",
         headers: { "Content-type": "application/json; charset=UTF-8" },
         body: JSON.stringify(sendData)
      })
         .then(console.log("send"))
         .then((response) => response.json())
         .then((json) => console.log(json))
         .then(window.location.reload())
   }

   const makeItems = (displayGroup) => (<>
      <ul>{Object.keys(mySettings.current[`display${changeMobile ? "Mobile" : "Desktop"}`][displayGroup]).map(displayItem => {
         return <li>
            <input
               type="checkbox"
               name={`${displayItem}-${displayGroup}`}
               id={displayItem}
               checked={mySettings.current[`display${changeMobile ? "Mobile" : "Desktop"}`][displayGroup][displayItem]}
               onChange={(e) => changeSettings(e)}
            />
            <label htmlFor={displayItem}>{displayableTextMap.get(displayItem)}</label>
         </li>
      })}</ul>
      {displaySaveButtons[displayGroup] && <button name={displayGroup} onClick={(e)=>saveSettings(e)}>Save changes</button>}
   </>)

   return (<div>
      <div className="selectDevice">
         <h3>Computer</h3>
         <label className="switch">
            <input type="checkbox" checked={changeMobile} />
            <span className="slider round" onClick={() => setChangeMobile(!changeMobile)}></span>
         </label>
         <h3>Mobile</h3>
      </div>
      <div>
         <h3>Navbar</h3>
         {makeItems("displayNavbar")}
      </div>
      <div>
         <h3>Grades</h3>
         {makeItems("displayGrades")}
      </div>
      {mySettings.current[`display${changeMobile ? "Mobile" : "Desktop"}`].displayNavbar.teachers && <div>
         <h3>Teachers</h3>
         {makeItems("displayTeacher")}
      </div>}
   </div>
   )
}