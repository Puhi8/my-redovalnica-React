/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from "react"
import Teachers_tableRow from "../components/Teachers-tableRow"
import { convertTeacherDataToTeacherObject, convertIndividualTeacherObjectToTeacherData } from "../functions/convertTeacherData"
import createSendFile from "../functions/createSendFile"
import TeacherPopup_name from "../components/TeacherPopup/name"
import TeacherPopup_homework from "../components/TeacherPopup/homework"
import TeacherPopup_percent from "../components/TeacherPopup/percent"
import TeacherPopup_ignoreFixedGrades from "../components/TeacherPopup/ignoreFixedGrades"
import TeacherPopup_smallGrades from "../components/TeacherPopup/smallGrade"
import TeacherPopup_plusMinus from "../components/TeacherPopup/plusMinus"

function popupRouter(myClass, popupName, teachersObject, changeTeacherObjectFunction, closePopupFunction) {
   switch (popupName) {
      case "name":
         return <TeacherPopup_name aboutTeacher={teachersObject[myClass]} myClass={myClass} changeTeacherObject={changeTeacherObjectFunction} closePopupFunction={closePopupFunction} />
      case "homework":
         return <TeacherPopup_homework aboutTeacher={teachersObject[myClass]} myClass={myClass} changeTeacherObject={changeTeacherObjectFunction} closePopupFunction={closePopupFunction} />
      case "percent":
         return <TeacherPopup_percent aboutTeacher={teachersObject[myClass]} myClass={myClass} changeTeacherObject={changeTeacherObjectFunction} closePopupFunction={closePopupFunction} />
      case "ignoreFixedGrades":
         return <TeacherPopup_ignoreFixedGrades aboutTeacher={teachersObject[myClass]} myClass={myClass} changeTeacherObject={changeTeacherObjectFunction} closePopupFunction={closePopupFunction} />
      case "smallGrades":
         return <TeacherPopup_smallGrades aboutTeacher={teachersObject[myClass]} myClass={myClass} changeTeacherObject={changeTeacherObjectFunction} closePopupFunction={closePopupFunction} />
      case "plusMinus":
         return <TeacherPopup_plusMinus aboutTeacher={teachersObject[myClass]} myClass={myClass} changeTeacherObject={changeTeacherObjectFunction} closePopupFunction={closePopupFunction} />
   }
}
export default function Teachers() {
   const [allClasses, setAllClasses] = useState([])
   const [aboutTeacherObject, setAboutTeacherObject] = useState({})
   const [popupElement, setPopupElement] = useState()
   const [displayPopup, setDisplayPopup] = useState(false)
   const popupEventListener = React.useRef(false)
   const newTeacherObjectRef = React.useRef({})

   useEffect(() => {
      Promise.all([
         fetch(import.meta.env.VITE_API_allClasses).then(res => res.json()),
         fetch(import.meta.env.VITE_API_grades).then(res => res.json())
      ])
         .then(([allClassesData, allData]) => {
            const teacherObject = convertTeacherDataToTeacherObject(allData, allClassesData)
            setAllClasses(allClassesData)
            setAboutTeacherObject({ ...teacherObject })
            newTeacherObjectRef.current = { ...teacherObject }
         })
   }, [])
   let enterKeyPressed = false
   useEffect(() => {
      const handleKeyDown = (e) => {
         if (e.key === 'Enter' && !enterKeyPressed) {
            closePopup()
            popupEventListener.current = true
            enterKeyPressed = true
            document.removeEventListener('keydown', handleKeyDown)
            setTimeout(() => {
               enterKeyPressed = false
            }, 200)
         }
      }
      if (displayPopup) {
         document.addEventListener('keydown', handleKeyDown)
      } else {
         document.removeEventListener('keydown', handleKeyDown)
      }
      return () => {
         enterKeyPressed = false
      }
   }, [displayPopup])

   function sendTeacherObject(newTeacherObject, myClass) {
      let dataToSend = createSendFile(myClass, "grades", "teacher", convertIndividualTeacherObjectToTeacherData(newTeacherObject))
      fetch(import.meta.env.VITE_API_grades, {
         method: "POST",
         headers: { "Content-type": "application/json; charset=UTF-8" },
         body: JSON.stringify(dataToSend),
      })
      //_.then((response) => response.json())
      //_.then((json) => console.log(json))
   }

   function closePopup() {
      setDisplayPopup(false)
      compareOldAndNewTeacherObject()
   }

   function compareOldAndNewTeacherObject() {
      let somethingChanged = false
      let classChanged
      let allKeys = Object.keys(aboutTeacherObject[allClasses[0]])
      allClasses.forEach(myClass => {
         allKeys.forEach(individualKey => {
            if (aboutTeacherObject[myClass][individualKey] != newTeacherObjectRef.current[myClass][individualKey]) {
               somethingChanged = true
               classChanged = myClass
               return
            }
         })
         if (somethingChanged) {
            return
         }
      })
      if (somethingChanged) {
         sendTeacherObject(newTeacherObjectRef.current[classChanged], classChanged)
         setAboutTeacherObject({ ...aboutTeacherObject, [classChanged]: newTeacherObjectRef.current[classChanged] })
      }
   }

   function setNewTeacherObject(event, myClass) {
      const updatedTeacher = {
         ...newTeacherObjectRef.current[myClass],
         [event.target.name]: event.target.value
      }
      newTeacherObjectRef.current = {
         ...newTeacherObjectRef.current,
         [myClass]: updatedTeacher
      }
   }

   function popupHandle(event) {
      let [name, myClass] = event.target.name.split("-")
      if(!popupEventListener.current) setDisplayPopup(true)
      popupEventListener.current = false
      setPopupElement(<div className="popup-background" onClick={() => closePopup(myClass)}>{popupRouter(myClass, name, aboutTeacherObject, setNewTeacherObject, closePopup)}</div>)
   }
   let allTableRows = allClasses.map(myClass => {
      return <Teachers_tableRow
         teacherObject={aboutTeacherObject[myClass]}
         myClass={myClass}
         popupFunction={popupHandle}
      />
   })
   return (
      <>
         <table>
            <tr>
               <th>Name</th>
               <th>Class</th>
               <th>Homework</th>
               <th>Percent</th>
               <th>Ignore fixed grades</th>
               <th>Small grades</th>
               <th>Plus minus</th>
            </tr>
            {allTableRows}
         </table>
         {displayPopup && popupElement}
      </>
   )
}