import React, { useState, useEffect } from "react";

export default function TeacherPopup_plusMinus({ aboutTeacher, myClass, changeTeacherObject, closePopupFunction }) {
   const [checkboxNone, setCheckboxNone] = useState(false)
   const [checkboxPlus, setCheckboxPlus] = useState(false)
   const [checkboxMinus, setCheckboxMinus] = useState(false)
   const valueToSend = React.useRef(aboutTeacher.plus_minusState)

   useEffect(() => {
      switch (aboutTeacher.plus_minusState) {
         case "none":
            setCheckboxNone(true)
            break
         case "minus":
            setCheckboxMinus(true)
            break
         case "plus":
            setCheckboxPlus(true)
            break
         case "plus&minus":
            setCheckboxMinus(true)
            setCheckboxPlus(true)
            break
      }
   }, [])

   useEffect(()=>{
      if(checkboxPlus){
         let event = {
            "target": document.getElementsByName("plusGrade")[0]
         }
         changeTeacherObject(event, myClass)
         event = {
            "target": document.getElementsByName("plusNumber")[0]
         }
         changeTeacherObject(event, myClass)
      }
   },[checkboxPlus])
   
   useEffect(()=>{
      if(checkboxMinus){
         let event = {
            "target": document.getElementsByName("minusGrade")[0]
         }
         changeTeacherObject(event, myClass)
         event = {
            "target": document.getElementsByName("minusNumber")[0]
         }
         changeTeacherObject(event, myClass)
      }
   },[checkboxMinus])

   const handleChange = (event) => {
      switch (event.target.id) {
         case "checkboxNone":
            setCheckboxNone(true);
            setCheckboxPlus(false);
            setCheckboxMinus(false);
            updateValueToSend(true, false, false);
            break;
         case "checkboxPlus":
            setCheckboxNone(false);
            setCheckboxPlus(!checkboxPlus);
            updateValueToSend(false, !checkboxPlus, checkboxMinus);
            if (!event.target.checked && !checkboxMinus) {
               setCheckboxNone(true);
               updateValueToSend(true, false, false);
            }
            break;
         case "checkboxMinus":
            setCheckboxNone(false);
            setCheckboxMinus(!checkboxMinus);
            updateValueToSend(false, checkboxPlus, !checkboxMinus);
            if (!event.target.checked && !checkboxPlus) {
               setCheckboxNone(true);
               updateValueToSend(true, false, false);
            }
            break;
      }
      event.target.value = valueToSend.current
      changeTeacherObject(event, myClass);
   };

   function updateValueToSend(none, plus, minus) {
      if (plus && minus) valueToSend.current = "plus&minus";
      else if (plus) valueToSend.current = "plus";
      else if (minus) valueToSend.current = "minus";
      else valueToSend.current = "none";
   }

   return <div className="teacherPopup-plusMinus" onClick={(e) => e.stopPropagation()}>
      <nav>
         <h3>Plus / Minus ({myClass})</h3>
         <button onClick={closePopupFunction}><img src="./img/close.png" width={"50px"}/></button>
      </nav>
      <div>
         <input
            type="checkbox"
            id="checkboxNone"
            name="plus_minusState"
            value={valueToSend.current}
            checked={checkboxNone}
            onChange={(e) => { handleChange(e) }} />
         <label htmlFor="checkboxNone">None</label>
         <input
            type="checkbox"
            id="checkboxPlus"
            name="plus_minusState"
            value={valueToSend.current}
            checked={checkboxPlus}
            onChange={(e) => { handleChange(e) }} />
         <label htmlFor="checkboxPlus">Plus</label>
         <input
            type="checkbox"
            id="checkboxMinus"
            name="plus_minusState"
            value={valueToSend.current}
            checked={checkboxMinus}
            onChange={(e) => { handleChange(e) }} />
         <label htmlFor="checkboxMinus">Minus</label>
      </div>
      {checkboxPlus && <div>
         <h4>Plus</h4>
         <label htmlFor="plus-grade">Grade: </label>
         <input 
            defaultValue={aboutTeacher.plusGrade || 5} 
            type="number" 
            id="plus-grade"
            name="plusGrade"
            onChange={(e)=>{changeTeacherObject(e, myClass)}} />
         <label htmlFor="plus-number">Number: </label>
         <input 
            defaultValue={aboutTeacher.plusNumber || 3} 
            type="number" 
            id="plus-number"
            name="plusNumber"
            onChange={(e)=>{changeTeacherObject(e, myClass)}} />
      </div>}
      {checkboxMinus && <div>
         <h4>Minus</h4>
         <label htmlFor="minus-grade">Grade: </label>
         <input 
            defaultValue={aboutTeacher.minusGrade || 1} 
            type="number" 
            id="minus-grade"
            name="minusGrade"
            onChange={(e)=>{changeTeacherObject(e, myClass)}} />
         <label htmlFor="minus-number">Number: </label>
         <input 
            defaultValue={aboutTeacher.minusNumber || 3} 
            type="number" 
            id="minus-number"
            name="minusNumber"
            onChange={(e)=>{changeTeacherObject(e, myClass)}} />
      </div>}
   </div>
}