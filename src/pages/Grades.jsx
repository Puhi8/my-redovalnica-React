/* eslint-disable no-prototype-builtins */
/* eslint-disable no-case-declarations */
/* eslint-disable react/jsx-key */
import React, { useEffect, useState, useRef } from "react"; React
import { convertUsableDatesToMyDates } from "../functions/_generalFunctions";
import createSendFile from "../functions/createSendFile";
import Grades_tableRow from "../components/Grades-tableRow"
import GradesPopup_plusMinus from "../components/GradesPopup/Plus-minus"
import GradesPopup_Grade from "../components/GradesPopup/Grade"
import GradesPopup_newGrade from "../components/GradesPopup/NewGrade"
import GradesPopup_iEstimate from "../components/GradesPopup/iEstimate"

function log(object, line) {
   console.log("line: ", line, JSON.stringify(object))
}
function make_a_deep_copy(item) {
   return JSON.parse(JSON.stringify(item))
}

export default function Grades() {
   function popupRouter(myClass, popupName, index, allData) {
      const componentMapping = {
         "newGrade": GradesPopup_newGrade,
         "plu_minus": GradesPopup_plusMinus,
         "grades": GradesPopup_Grade,
         "iEstimate": GradesPopup_iEstimate
      }
      const SelectedComponent = componentMapping[popupName]
      return (<SelectedComponent
         myClass={myClass}
         index={index}
         myClassData={allData[myClass]}
         closePopupFunction={closePopup}
         changeNewData={changeNewData}
         addNewItem={addNewItem}
      />
      )
   }

   const [allClasses, setAllClasses] = useState()
   const [allData, setAllData] = useState()
   const [displayPopup, setDisplayPopup] = useState(false)
   const [popupElement, setPopupElement] = useState()
   const [moreDataToGve, setMoreDataToGive] = useState(false)
   const newAllData = useRef({})
   const newItemToAdd = useRef({})
   useEffect(() => {
      Promise.all([
         fetch(import.meta.env.VITE_API_allClasses).then(res => res.json()),
         fetch(import.meta.env.VITE_API_grades).then(res => res.json())
      ])
         .then(([allClassesData, allData]) => {
            setAllClasses(allClassesData)
            setAllData(allData)
            newAllData.current = JSON.parse(JSON.stringify(allData))
         })
   }, [])

   //_useEffect(()=>{
   //_   console.log("change in newAllData");
   //_}, [newAllData])
   //_useEffect(()=>{
   //_   console.log("change in allData");
   //_}, [allData])

   function popupHandle(event, index) {
      //_console.log("popupHandle");
      let [name, myClass] = event.target.name.split("-")
      setDisplayPopup(true)
      setPopupElement(<div className="popup-background" onClick={() => closePopup(false, myClass, name, index)}>
         {popupRouter(myClass, name, index, newAllData.current)}
      </div>)
   }

   function closePopup(discardAll, myClass, arrayName, index) {
      let singleData = arrayName == "iEstimate"
      console.log("singleData:", singleData)
      if (!discardAll) {
         if (singleData) {
            if (!newAllData.current[myClass][arrayName]) return
            if (allData[myClass][arrayName] != newAllData.current[myClass][arrayName]) {
               setAllData(newAllData.current)
               console.log("sending: ", createSendFile(myClass, "grades", arrayName, { "grade": newAllData.current[myClass][arrayName] }))
               fetch(import.meta.env.VITE_API_grades, {
                  method: "POST",
                  headers: { "Content-type": "application/json; charset=UTF-8" },
                  body: JSON.stringify(createSendFile(myClass, "grades", arrayName, { "grade": Number(newAllData.current[myClass][arrayName]) }))
               })
                  .then(console.log("send"))
                  .then((response) => response.json())
                  .then((json) => console.log(json))
            }
         }
         else {
            if (!checkIfAllDataIsCorrect(newAllData.current[myClass][arrayName][index])) return
            //_console.log("allData: ",allData[myClass][arrayName][index])
            //_console.log("newAllData: ",newAllData.current[myClass][arrayName][index])
            //_log(allData[myClass][arrayName][index],78)
            //_log(newAllData.current[myClass][arrayName][index],79)
            //_console.log("compare: ",compareOldWithNewData(allData[myClass][arrayName][index], newAllData.current[myClass][arrayName][index]))
            if (compareOldWithNewData(allData[myClass][arrayName][index], newAllData.current[myClass][arrayName][index])/* && confirm("Do you want to save changes?")*/) {
               console.log("writing new data")
               setAllData(newAllData.current)
               sendFileEdit(newAllData.current[myClass][arrayName][index], myClass, index, arrayName)
            }
            else {
               console.log("'newAllData' set to 'allData' on the compare & confirm")
               newAllData.current = {
                  ...make_a_deep_copy(allData)
               }
               //_log(newAllData.current[myClass][arrayName][index], 87)
               //_log(allData[myClass][arrayName][index], 88)
            }
         }
      }
      else if (confirm("Do you want leave without saving?")) {
         console.log("'newAllData' set to 'allData' on discardAll")
         newAllData.current = {
            ...make_a_deep_copy(allData)
         }
      }
      setDisplayPopup(false)
   }

   
   function changeNewData(event, myClass, arrayName, index) {
      console.log("changing data:", event.target.name)
      //_console.log("changing data value:", event.target.value)
      if (event.target.name.includes("delete")) {
         let sendData
         switch (event.target.name) {
            case "deleteAll":
               //make a send file
               sendData = {
                  "category": arrayName,
                  "index": index
               }
               break
         }
         let dataToSend = createSendFile(myClass, "grades", "delete", sendData)
         //send the file
         fetch(import.meta.env.VITE_API_grades, {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify(dataToSend),
         })
            .then(console.log("send"))
            .then((response) => response.json())
            .then((json) => console.log(json))
         //update newAllData
         //the catch will run when the item is not ann array 
         try {
            delete newAllData.current[myClass][arrayName][index]
         }
         catch (err) {
            newAllData.current[myClass] = {...newAllData.current[myClass], [arrayName]: null}
         }
         console.log("new data: ", newAllData.current[myClass]);
         //close popup
         setDisplayPopup(false)
      }
      else if (event.target.name == "iEstimate") {
         newAllData.current[myClass] = {
            ...newAllData.current[myClass],
            iEstimate: event.target.value
         }
      }
      else {
         let aboutTest
         event.target.name.includes("Fixed") ? aboutTest = "aboutTestFixed" : aboutTest = "aboutTest"
         if (event.target.name.includes("aboutTest")) {
            newAllData.current[myClass][arrayName][index][aboutTest] = {
               ...newAllData.current[myClass][arrayName][index][aboutTest],
               [event.target.name.split("-")[1]]: event.target.value
            }
         }
         else {
            //_console.log("log at the start of changing the data:");
            //_log(newAllData.current[myClass][arrayName][index])
            //_log(allData[myClass][arrayName][index])
            newAllData.current[myClass][arrayName][index] = {
               ...newAllData.current[myClass][arrayName][index],
               [event.target.name]: event.target.name.includes("date") ? convertUsableDatesToMyDates(event.target.value) : event.target.value
            }
            //_console.log("log at the end of changing the data:")
            //_log(newAllData.current[myClass][arrayName][index])
            //_log(allData[myClass][arrayName][index])
            if (event.target.value == "talk") delete newAllData.current[myClass][arrayName][index][aboutTest]
            else {
               try {
                  newAllData.current[myClass][arrayName][index] = {
                     ...newAllData.current[myClass][arrayName][index],
                     [aboutTest]: {
                        "allPoints": allData[myClass][arrayName][index][aboutTest].allPoints,
                        "getPoints": allData[myClass][arrayName][index][aboutTest].getPoints,
                        "percent": 0
                     }
                  }
               }
               catch (err) {
                  newAllData.current[myClass][arrayName][index] = {
                     ...newAllData.current[myClass][arrayName][index],
                     [aboutTest]: {
                        "allPoints": 0,
                        "getPoints": 0,
                        "percent": 0
                     }
                  }
               }
               setDisplayPopup(true)
               //_log(newAllData.current[myClass][arrayName][index], 176);
               setMoreDataToGive(true)
            }
         }
         //update / rerender popup with new data
         setPopupElement(<div className="popup-background" onClick={() => closePopup(false, myClass, arrayName, index)}>
            {popupRouter(myClass, arrayName, index, newAllData.current)}
         </div>)
      }
   }
   function addNewItem(event, myClass, arrayName) {
      //_event && console.log("date: ", event.target.value);
      //_console.log(!event.target.name.includes("addNew"))
      if (!event) {
         //run on startup
         newItemToAdd.current = {
            "effective": "100%",
            "grade": null,
            "gradeExtra": 0,
            "type": "talk",
            "date": convertUsableDatesToMyDates(new Date().toISOString().split("T")[0]),
            "wasFixed": false
         }
      }
      else if (!event.target.name.includes("addNew")) {
         if (event.target.name.includes("aboutTest")) {
            let aboutTest
            event.target.name.includes("Fixed") ? aboutTest = "aboutTestFixed" : aboutTest = "aboutTest"
            newItemToAdd.current[aboutTest] = {
               ...newItemToAdd.current[aboutTest],
               [event.target.name.split("-")[1]]: event.target.value
            }
         }
         else {
            newItemToAdd.current = {
               ...newItemToAdd.current,
               [event.target.name]: event.target.name.includes("date") ? convertUsableDatesToMyDates(event.target.value) : event.target.name.includes("effective") ? `${event.target.value}%` : event.target.value
            }
         }
      }
      else {
         checkIfAllDataIsCorrect(newItemToAdd)
         //push the new item to the "newAllData" 
         newAllData.current[myClass][arrayName] = [
            ...newAllData.current[myClass][arrayName],
            newItemToAdd.current
         ]
         //send data
         const type = `gradeTalk`
         console.log("sending: ", createSendFile(myClass, "grades", type, newItemToAdd.current))
         fetch(import.meta.env.VITE_API_grades, {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify(createSendFile(myClass, "grades", type, newItemToAdd.current)),
         })
            .then((response) => response.json())
            .then((res) => {
               if (res.massage.includes("It does not have") || res.massage.includes("Invalid")) {
                  alert(res.massage)
               }
               else setDisplayPopup(false)
            })
      }
   }
   function checkIfAllDataIsCorrect(newData) {
      let isCorrect = true
      let inExtraField = false
      let extraField
      let field
      Object.keys(newData).forEach(dataField => {
         //it will mark it as incorrect when: the value is faulty and is not a 0 or a boolean or when it include undefined
         if (!newData[dataField] && typeof newData[dataField] != "boolean" && newData[dataField] != 0 || String(newData[dataField]).includes("undefined")) { isCorrect = false; field = dataField }
      })
      if (newData.typeFixed == "written") {
         console.log(newData.aboutTestFixed);
         Object.keys(newData.aboutTestFixed).forEach(key => {
            if (!newData.aboutTestFixed[key] && newData.aboutTestFixed[key] != 0) {
               isCorrect = false
               inExtraField = true
               field = "aboutTestFixed"
               extraField = key
            }
         })
      }
      if (newData.type == "written") {
         Object.keys(newData.aboutTest).forEach(key => {
            if (!newData.aboutTest[key] && newData.aboutTest[key] != 0) {
               isCorrect = false
               inExtraField = true
               field = "aboutTest"
               extraField = key
            }
         })
      }
      if (!isCorrect) {
         //the data is not valid
         setMoreDataToGive(true)
         if (inExtraField) console.log("more data: ", extraField, newData[field][extraField])
         else console.log("more data: ", field, newData[field])
         return false
      }
      else {
         //the data is valid
         setMoreDataToGive(false)
         console.log("All data is correct")
         return true
      }
   }
   function compareOldWithNewData(oldData, newData,) {
      //_console.log("oldData: ",oldData)
      //_console.log("newData: ",newData)
      //!The "keyChanged" is just for testing
      let keyChanged = ""
      let changeHappened = false
      //check all values (not objects)
      Object.keys(newData).forEach(key => {
         if (newData[key] != oldData[key]) {
            keyChanged = key
            changeHappened = true
         }
      })
      if (!changeHappened) {
         //check "aboutTest" object
         if (newData.hasOwnProperty("aboutTest") || oldData.hasOwnProperty("aboutTest")) {
            Object.keys(newData.aboutTest).forEach(key => {
               if (newData.aboutTest[key] != oldData.aboutTest[key]) {
                  keyChanged = key
                  changeHappened = true
               }
            })
         }
         //check "aboutTestFixed" object
         if (newData.hasOwnProperty("aboutTestFixed") || oldData.hasOwnProperty("aboutTestFixed")) {
            try {
               Object.keys(newData.aboutTestFixed).forEach(key => {
                  if (newData.aboutTestFixed[key] != oldData.aboutTestFixed[key]) {
                     keyChanged = key
                     changeHappened = true
                  }
               })
            }
            catch (err) {
               keyChanged = "aboutTestFixed"
               changeHappened = true
            }
         }
      }
      if (changeHappened) console.log("Something changed in: ", keyChanged)
      else console.log("No change")
      return changeHappened
   }
   function sendFileEdit(newData, myClass, index, category) {
      let editDataToSend = {
         "category": category,
         "index": index,
         "newData": newData
      }
      let dataToSend = createSendFile(myClass, "grades", "edit", editDataToSend)
      console.log("sending: ", dataToSend);
      fetch(import.meta.env.VITE_API_grades, {
         method: "POST",
         headers: { "Content-type": "application/json; charset=UTF-8" },
         body: JSON.stringify(dataToSend),
      })
      //_.then(console.log("send"))
      //_.then((response) => response.json())
      //_.then((json) => console.log(json))
   }
   //make the table row for all classes
   let allTableRows
   if (allClasses) {
      allTableRows = allClasses.map(individualClass => {
         return <Grades_tableRow
            allClassData={newAllData.current[individualClass]}
            myClass={individualClass}
            popupFunction={popupHandle}
         />
      })
   }
   //final export
   return (<>
      <table>
         <tr>
            <th>Class</th>
            <th>Name</th>
            <th>Plus / minus</th>
            <th>Homework</th>
            <th>Grades 1</th>
            <th>Grades 2</th>
            <th>Small grades</th>
            <th>Fixing</th>
            <th>Final grades</th>
            <th>Final grade</th>
         </tr>
         {allTableRows}
      </table>
      {displayPopup && popupElement}
   </>)
}