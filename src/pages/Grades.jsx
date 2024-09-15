/* eslint-disable no-prototype-builtins */
/* eslint-disable no-case-declarations */
/* eslint-disable react/jsx-key */
import React, { useEffect, useState, useRef } from "react"; React
import { convertUsableDatesToMyDates, make_a_deep_copy, createSendFile, checkIfDateIsInSecondHalf } from "../functions/_generalFunctions"
import {API_grades, API_allClasses} from "../../my_variables.json"
import Grades_tableRow from "../components/Grades-tableRow"
import GradesPopup_plusMinus from "../components/GradesPopup/Plus-minus"
import GradesPopup_newPlusMinus from "../components/GradesPopup/NewPlus_minus"
import GradesPopup_homework from "../components/GradesPopup/Homework"
import GradesPopup_Grade from "../components/GradesPopup/Grade"
import GradesPopup_newGrade from "../components/GradesPopup/NewGrade"
import GradesPopup_smallGrade from "../components/GradesPopup/SmallGrade"
import GradesPopup_newSmallGrade from "../components/GradesPopup/NewSmallGrade"
import GradesPopup_iEstimate from "../components/GradesPopup/iEstimate"
import GradesPopup_endedGrade from "../components/GradesPopup/endedGrade"

function log(object, line) {
   console.log("line: ", line, make_a_deep_copy(object))
}

export default function Grades() {
   function popupRouter(myClass, popupName, index, allData) {
      const componentMapping = {
         "plus_minus": GradesPopup_plusMinus,
         "newPlus_minus" : GradesPopup_newPlusMinus,
         "homework": GradesPopup_homework,
         "grades": GradesPopup_Grade,
         "newGrade": GradesPopup_newGrade,
         "smallGrade": GradesPopup_smallGrade,
         "newSmallGrade": GradesPopup_newSmallGrade,
         "iEstimate": GradesPopup_iEstimate,
         "endedGrade": GradesPopup_endedGrade,
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
   const singleDataElements = ["iEstimate", "endedGrade"]
   const aboutTestNeededArrays = ["grades", "smallGrade"]
   const itemsToDeleteWhenDeletingFixedGrade = ["gradeFixed", "gradeExtraFixed", "typeFixed", "dateFixed", "aboutTestFixed"]
   useEffect(() => {
      Promise.all([
         fetch(API_allClasses).then(res => res.json()),
         fetch(API_grades).then(res => res.json())
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
      makePopupElement(myClass, name, index)
   }
   function makePopupElement(myClass, name, index){
      setPopupElement(<div className="popup-background" onClick={() => closePopup(false, myClass, name, index)}>
            {popupRouter(myClass, name, index, newAllData.current)}
      </div>)
   }

   function closePopup(discardAll, myClass, arrayName, index) {
      let singleData = singleDataElements.includes(arrayName)
      //_console.log("singleData: ",singleData);
      //_console.log("discardAll: ", discardAll)
      //_console.log("myClass: ", myClass)
      //_console.log("arrayName: ", arrayName)
      //_console.log("index: ", index)
      //_console.log("newAllData: ", make_a_deep_copy(newAllData.current[myClass]))
      //_console.log("allData: ", make_a_deep_copy(allData[myClass]))
      if (!discardAll) {
         if (singleData) {
            console.log(newAllData.current[myClass][arrayName]);
            if (!newAllData.current[myClass][arrayName]) return
            console.log(allData[myClass][arrayName] != newAllData.current[myClass][arrayName]);
            if (allData[myClass][arrayName] != newAllData.current[myClass][arrayName]) {
               setAllData(make_a_deep_copy(newAllData.current))
               console.log("sending: ", createSendFile(myClass, "grades", arrayName, { "grade": newAllData.current[myClass][arrayName] }))
               sendFile(myClass, arrayName, { "grade": Number(newAllData.current[myClass][arrayName]) })
            }
         }
         else if (arrayName == "homework") {
            let allDataCounts = countDates(allData[myClass][arrayName])
            let newAllDataCounts = countDates(newAllData.current[myClass][arrayName])
            let allDataHomework_copy = make_a_deep_copy(allData[myClass][arrayName])
            let newAllDataHomework_copy = make_a_deep_copy(newAllData.current[myClass][arrayName])
            //_ console.log("allData: ",allDataCounts);
            //_ console.log("newAllData: ",newAllDataCounts);
            let repeatDeleting = true
            // Check for 'delete': dates in array1 but not in array2 or with higher count
            while(repeatDeleting){
               try {if(!Object.keys(allDataHomework_copy[0])[0]) repeatDeleting = false}
               catch (err) {repeatDeleting = false}
               // recount for correct index
               allDataCounts = countDates(allDataHomework_copy)
               newAllDataCounts = countDates(newAllDataHomework_copy)
               // check for delete
               for (let date in allDataCounts) { // for each key in the "allDataCounts" (date)
                  const dataToSend = {
                     "category": arrayName,
                     "index": allDataCounts[date].index
                  }
                  if (!(date in newAllDataCounts)) { // if the "date" key exists ony in old data: log...
                     console.log('delete:', { date , index: allDataCounts[date].index})
                     sendFile(myClass, "delete", dataToSend)
                     allDataHomework_copy.splice(allDataCounts[date].index, 1)
                     break
                  } else if (allDataCounts[date].num > newAllDataCounts[date].num) { // if the number of individual dates are different
                     console.log('delete:', { date , index: allDataCounts[date].index})
                     sendFile(myClass, "delete", dataToSend)
                     allDataHomework_copy.splice(allDataCounts[date].index, 1)
                     break
                  }
                  else{ // if there is no extra dates in the old data stop the loop
                     console.log("end of loop");
                     repeatDeleting = false
                  }
               }
            }
            // Check for 'add': dates in array2 but not in array1 or with higher count
            for (let date in newAllDataCounts) {
               if (!(date in allDataCounts)) {
                  for (let i = 0; i < newAllDataCounts[date].num; i++) {
                     console.log('add:', { date })
                     sendFile(myClass, "homework", {date: date})
                  }
               } else if (newAllDataCounts[date].num > allDataCounts[date].num) {
                  for (let i = 0; i < newAllDataCounts[date].num - allDataCounts[date].num; i++) {
                     console.log('add:', { date })
                     sendFile(myClass, "homework", {date: date})
                  }
               }
            }
         }
         else {
            if (!checkIfAllDataIsCorrect(newAllData.current[myClass][arrayName][index])) return
            //_console.log("compare: ",allData[myClass][arrayName][index], newAllData.current[myClass][arrayName][index])
            if (compareOldWithNewData(allData[myClass][arrayName][index], newAllData.current[myClass][arrayName][index])/* && confirm("Do you want to save changes?")*/) {
               let dataToSend
               let typeOfSendFile
               //todo: check the "wasFixed", compare if it is in the old one
               if(newAllData.current[myClass][arrayName][index].wasFixed && !allData[myClass][arrayName][index].wasFixed){
                  typeOfSendFile = (newAllData.current[myClass][arrayName][index].typeFixed == "talk") ? "gradeTalkFixed" : "gradeWrittenFixed"
                  if(newAllData.current[myClass][arrayName][index].wasFixed == "written") dataToSend = {"aboutTestFixed": newAllData.current[myClass][arrayName][index].aboutTestFixed}
                  dataToSend = {
                     ...dataToSend,
                     "indexFixed": index,
                     "gradeFixed": newAllData.current[myClass][arrayName][index].gradeFixed,
                     "gradeExtraFixed":newAllData.current[myClass][arrayName][index].gradeExtraFixed,
                     "typeFixed": newAllData.current[myClass][arrayName][index].typeFixed,
                     "dateFixed": newAllData.current[myClass][arrayName][index].dateFixed
                  }
               }
               else {
                  typeOfSendFile = "edit"
                  dataToSend = {
                     "category": arrayName,
                     "index": index,
                     "newData": newAllData.current[myClass][arrayName][index]
                  }
               }

               console.log("writing new data")
               setAllData(make_a_deep_copy(newAllData.current))
               sendFile(myClass, typeOfSendFile, dataToSend)
            }
            else {
               console.log("'newAllData' set to 'allData' on the compare & confirm")
               newAllData.current = {
                  ...make_a_deep_copy(allData)
               }
            }
         }
      }
      else if (confirm("Do you want to leave without saving?")) {
         console.log("'newAllData' set to 'allData' on discardAll")
         newAllData.current = {
            ...make_a_deep_copy(allData)
         }
      }
      setDisplayPopup(false)
   }


   function changeNewData(event, myClass, arrayName, index) {
      //_console.log("changing data:", event.target.name)      
      //_console.log("changing data value:", event.target.value)
      if (event.target.name.includes("delete")) {
         let sendData
         switch (event.target.name) {
            case "deleteAll":
            case "deleteHomework":
               if (event.target.name == "deleteAll"){
                  // make a send file
                  sendData = {
                     "category": arrayName,
                     "index": index
                  }
                  sendFile(myClass, "delete", sendData)
                  setDisplayPopup(false)
               }
               try {newAllData.current[myClass][arrayName].splice(index, 1)}
               catch (err) {newAllData.current[myClass] = { ...newAllData.current[myClass], [arrayName]: null }}
               break
            case "deleteFixeGrade":
               itemsToDeleteWhenDeletingFixedGrade.forEach(key=>{
                  delete newAllData.current[myClass][arrayName][index][key]
               })
               newAllData.current[myClass][arrayName][index] = {
                  ...newAllData.current[myClass][arrayName][index],
                  wasFixed: false
               }
               break
         }
         console.log("new data: ", newAllData.current[myClass][arrayName][index]);
         if (arrayName == "homework")makePopupElement(myClass, arrayName, index) 
      }
      else if (singleDataElements.includes(event.target.name)) {
         newAllData.current[myClass] = {
            ...newAllData.current[myClass],
            [event.target.name]: event.target.value
         }
      }
      else if(event.target.name == "fixeGrade"){
         newAllData.current[myClass][arrayName][index] = {
            ...newAllData.current[myClass][arrayName][index],
            "wasFixed": true,
            "gradeFixed": null,
            "gradeExtraFixed":0,
            "typeFixed": "talk",
            "dateFixed": convertUsableDatesToMyDates(new Date().toISOString().split("T")[0])
         }
      }
      else {
         let aboutTest = event.target.name.includes("Fixed") ?  "aboutTestFixed" :  "aboutTest"
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
               [event.target.name]: event.target.value
            }
            if(event.target.name.includes("date")){
               const myDate = convertUsableDatesToMyDates(event.target.value)
               newAllData.current[myClass][arrayName][index] = {
                  ...newAllData.current[myClass][arrayName][index],
                  [event.target.name]: myDate,
                  "isSecondHalf": checkIfDateIsInSecondHalf(myDate)
               }
            }
            //_console.log("log at the end of changing the data:")
            //_log(newAllData.current[myClass][arrayName][index])
            //_log(allData[myClass][arrayName][index])
            if (event.target.value == "talk") delete newAllData.current[myClass][arrayName][index][aboutTest]
            else if (event.target.value == "written" /*&& !aboutTestNeededArrays.includes(arrayName)*/){
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
                  console.log("aboutTest set to 0");
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
         makePopupElement(myClass, arrayName, index)
      }
   }
   function addNewItem(event, myClass, arrayName, defaultItem) {
      //_console.log("event target: ", event.target)
      //_event && console.log("date: ", event.target.value);
      //_console.log(!event.target.name.includes("addNew"))
      if (!event) {
         const currentDate = convertUsableDatesToMyDates(new Date().toISOString().split("T")[0])
         const defaultItemMap = new Map([
            ["grade", {
               "effective": "100%",
               "grade": null,
               "gradeExtra": 0,
               "type": "talk",
               "date": currentDate,
               "wasFixed": false
            }],
            ["plus_minus", {
               "type": "plus",
               "date": currentDate,
               "reason": ""
            }],
            ["smallGrade", {
               "grade": null,
               "date": currentDate,
               "reason": ""
            }]
         ])
         // run on startup
         newItemToAdd.current = defaultItemMap.get(defaultItem)
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
         console.log("new item: ", newItemToAdd.current);
         
         if (!checkIfAllDataIsCorrect(newItemToAdd.current)) return
         // push the new item to the "newAllData" 
         newAllData.current[myClass][arrayName] = [
            ...newAllData.current[myClass][arrayName],
            newItemToAdd.current
         ]
         // send data
         const typeMap = new Map([
            ["grades", newItemToAdd.current.type ? makeGradeType(newItemToAdd.current) : "unknown"],
            ["plus_minus", "plus_minus"],
            ["smallGrade", "smallGrade"],
            ["homework", "homework"]
         ])
         if (arrayName != "homework") {
            console.log("sending: ", createSendFile(myClass, "grades", typeMap.get(arrayName), newItemToAdd.current))
            fetch(API_grades, {
               method: "POST",
               headers: { "Content-type": "application/json; charset=UTF-8" },
               body: JSON.stringify(createSendFile(myClass, "grades", typeMap.get(arrayName), newItemToAdd.current)),
            })
               .then((response) => response.json())
               .then((res) => {
                  console.log(res)
                  if (res.massage.includes("It does not have") || res.massage.includes("Invalid")) {
                     alert(res.massage)
                  }
                  else setDisplayPopup(false)
               })
         }
         else makePopupElement(myClass, arrayName, 0)
      }
   }
   function checkIfAllDataIsCorrect(newData) {
      let isCorrect = true
      let inExtraField = false
      let extraField
      let field
      Object.keys(newData).forEach(dataField => {
         // it will mark it as incorrect when: the value is faulty and is not a 0 or a boolean or when it include undefined
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
         // the data is not valid
         setMoreDataToGive(true)
         if (inExtraField) console.log("more data: ", extraField, newData[field][extraField])
         else console.log("more data: ", field, newData[field])
         return false
      }
      else {
         // the data is valid
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
      // check all values (not objects)
      Object.keys(newData).forEach(key => {
         if (typeof newData[key] == "object") return
         if (newData[key] != oldData[key]) {
            keyChanged = key
            changeHappened = true
         }
      })
      //_console.log(newData)
      //_console.log("change: ",changeHappened);
      //_console.log("change key: ",keyChanged);
      
      if (!changeHappened) {
         // check "aboutTest" object
         if (newData.hasOwnProperty("aboutTest") || oldData.hasOwnProperty("aboutTest")) {
            Object.keys(newData.aboutTest).forEach(key => {
               if (newData.aboutTest[key] != oldData.aboutTest[key]) {
                  keyChanged = key
                  changeHappened = true
               }
            })
         }
         // check "aboutTestFixed" object
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
   function sendFile(myClass, type, data) {
      console.log("sending: ", createSendFile(myClass, "grades", type, data))      
      fetch(API_grades, {
         method: "POST",
         headers: { "Content-type": "application/json; charset=UTF-8" },
         body: JSON.stringify(createSendFile(myClass, "grades", type, data))
      })
         .then(console.log("send"))
         .then((response) => response.json())
         .then((json) => console.log(json))
   }
   function makeGradeType(grade) {
      const type = grade.type.charAt(0).toUpperCase() + grade.type.slice(1)
      return `grade${type}${grade.wasFixed ? "Fixed" : ""}`
   }
   function countDates(arr) {
      const dateCounts = {}
      arr.forEach((obj, index) => {
         if (dateCounts[obj.date]) dateCounts[obj.date].num += 1
         else dateCounts[obj.date] = { num: 1, index: index }
      })
      return dateCounts
   }
   // make the table row for all classes
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
   // final export
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