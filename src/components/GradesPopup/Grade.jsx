/* eslint-disable react/prop-types */
import { useState } from "react"
import { anyPercentToString, anyPercentToNumber,convertMyDatesToUsableDates } from "../../functions/_generalFunctions"

export default function GradesPopup_Grade({ myClass, index, myClassData, closePopupFunction, changeNewData }) {
   let currantGrade = myClassData.grades[index]
   const [displayAboutTest, setDisplayAboutTest] = useState(false)
   const [displayAboutTestFixed, setDisplayAboutTestFixed] = useState(false)
   const [displayFixedGrade, setDisplayFixedGrade] = useState(currantGrade.wasFixed)
   const [editMode, setEditMode] = useState(false)

   return <div onClick={(e) => e.stopPropagation()}>
      <nav>
         <h3>{myClass} ({currantGrade.grade}{displayFixedGrade ? ` => ${currantGrade.gradeFixed}` : ""})</h3>
         <button onClick={() => closePopupFunction(true)}><img src="./img/close.png" width={"50px"} /></button>
         <button onClick={() => { setEditMode(!editMode) }}>Edit</button>
         {editMode && <button onClick={() => closePopupFunction(false, myClass, "grades", index)}><img src="./img/checkmark-green.png" width={"50px"} /></button>}
      </nav>
      {editMode
      ? <>{displayFixedGrade && <div>
         <h4>Fixed grade ({currantGrade.gradeFixed})</h4>
         <label htmlFor="gradeFixed">Grade: </label>
         <input 
            defaultValue={currantGrade.gradeFixed} 
            name="gradeFixed" 
            id="gradeFixed" 
            type="number" 
            min={1} 
            max={5}
            onClick={(e)=>{changeNewData(e, myClass, "grades", index)}} 
         />
         <div>
            <label>Type:</label>
            <input 
               value={"written"} 
               type="radio" 
               id="typeFixed-written"
               defaultChecked={currantGrade.typeFixed == "written"} 
               onClick={(e)=>{changeNewData(e, myClass, "grades", index)}} 
               name="typeFixed" 
            />
            <label htmlFor="typeFixed-written">Written</label>
            <input 
               value={"talk"} 
               type="radio" 
               id="typeFixed-talk"
               defaultChecked={currantGrade.typeFixed == "talk"} 
               onClick={(e)=>{changeNewData(e, myClass, "grades", index)}} 
               name="typeFixed" 
            />
            <label htmlFor="typeFixed-talk">Talk</label>
         </div>
         <label htmlFor="dateFixed">Date: </label>
         <input 
            defaultValue={convertMyDatesToUsableDates(currantGrade.dateFixed)} 
            onChange={(e)=>{changeNewData(e, myClass, "grades", index)}} 
            type="date" 
            name="dateFixed" 
            id="dateFixed" 
         />
         <label htmlFor="gardeExtraFixed">Extra: </label>
         <select id="gradeExtraFixed" name="gradeExtraFixed" defaultValue={currantGrade.gradeExtraFixed} onChange={(e)=>{changeNewData(e, myClass, "grades", index)}}>
            <option value="+">+</option>
            <option value="0">0</option>
            <option value="-">-</option>
         </select>
         {currantGrade.typeFixed == "written" && <>
            <p>About test: </p>
            <label htmlFor="percent">Percent: </label>
            <input
               onChange={(e)=>{changeNewData(e, myClass, "grades", index)}}
               defaultValue={!currantGrade.aboutTestFixed ?0 :anyPercentToNumber(currantGrade.aboutTestFixed.percent) * 100} 
               name="aboutTestFixed-percent"
               id="percent"
               placeholder="In: %" 
               type="number" 
               min={0} 
               max={100} 
            />
            <label htmlFor="allPoints">All points: </label>
            <input
               onChange={(e)=>{changeNewData(e, myClass, "grades", index)}}
               defaultValue={currantGrade.aboutTestFixed.allPoints} 
               name="aboutTestFixed-allPoints"
               id="allPoints"
               type="number" 
               min={0} 
            />
            <label htmlFor="getPoints">My points</label>
            <input
               onChange={(e)=>{changeNewData(e, myClass, "grades", index)}}
               defaultValue={currantGrade.aboutTestFixed.getPoints} 
               name="aboutTestFixed-getPoints"
               id="getPoints"
               type="number" 
               max={currantGrade.aboutTestFixed.allPoints} 
            />
      </>}
      </div>}
      <div>
         <h4>Original grade ({currantGrade.grade})</h4>
         <label>Effectiveness</label>
         <input 
            onChange={(e)=>{changeNewData(e, myClass, "grades" ,index)}}
            defaultValue={anyPercentToNumber(currantGrade.effective) * 100} 
            name="effective"
            placeholder="In: %" 
            type="number" 
            min={0} 
            max={100} 
         />
         <label htmlFor="grade">Grade: </label>
         <input 
            onChange={(e)=>{changeNewData(e, myClass, "grades" ,index)}}
            defaultValue={currantGrade.grade} 
            name="grade" 
            id="grade" 
            type="number" 
            min={1} 
            max={5} 
         />
         <div>
            <label>Type:</label>
            <input 
               value={"written"} 
               type="radio" 
               id="type-written"
               defaultChecked={currantGrade.type == "written"} 
               onClick={(e)=>{changeNewData(e, myClass, "grades", index)}} 
               name="type" 
            />
            <label htmlFor="type-written">Written</label>
            <input 
               value={"talk"} 
               type="radio" 
               id="type-talk"
               defaultChecked={currantGrade.type == "talk"} 
               onClick={(e)=>{changeNewData(e, myClass, "grades", index)}} 
               name="type" 
            />
            <label htmlFor="type-talk">Talk</label>
         </div>
         <label htmlFor="date">Date: </label>
         <input 
            onChange={(e)=>{changeNewData(e, myClass, "grades", index)}}
            defaultValue={convertMyDatesToUsableDates(currantGrade.date)} 
            type="date" 
            name="date" 
            id="date" 
         />
         <label htmlFor="gradeExtra">Extra: </label>
         <select id="gradeExtra" name="gradeExtra" onChange={(e)=>{changeNewData(e, myClass, "grades", index)}}>
            <option selected={currantGrade.gradeExtra == "+"} value="+">+</option>
            <option selected={currantGrade.gradeExtra == "0"} value="0">0</option>
            <option selected={currantGrade.gradeExtra == "-"} value="-">-</option>
         </select>
         {currantGrade.type == "written" && <>
            <p>About test: </p>
            <label>Percent: </label>
            <input
               onChange={(e)=>{changeNewData(e, myClass, "grades", index)}}
               name="aboutTest-percent"
               defaultValue={anyPercentToNumber(currantGrade.aboutTest.percent) * 100} 
               placeholder="In: %" 
               type="number" 
               min={0} 
               max={100} 
            />
            <label>All points: </label>
            <input
               onChange={(e)=>{changeNewData(e, myClass, "grades", index)}}
               name="aboutTest-allPoints"
               defaultValue={currantGrade.aboutTest.allPoints} 
               type="number" 
               min={0} 
            />
            <label>My points</label>
            <input
               onChange={(e)=>{changeNewData(e, myClass, "grades", index)}}
               name="aboutTest-getPoints"
               defaultValue={currantGrade.aboutTest.getPoints} 
               type="number" 
               max={currantGrade.aboutTest.allPoints} 
            />
         </>}
      </div>
      <button name="deleteAll" onClick={(e)=>{changeNewData(e, myClass, "grades", index)}}>{displayFixedGrade ?"Del all" :"Del"}</button>
      {displayFixedGrade 
      ?<button name="deleteFixeGrade" onClick={(e)=> changeNewData(e, myClass, "grades", index)}>Del fixed</button> 
      :<button name="fixeGrade" onClick={(e)=>{
         changeNewData(e, myClass, "grades", index)
         setDisplayFixedGrade(!displayFixedGrade)
      }}>Fixe</button>}
      </>
      : <>{displayFixedGrade && <div>
         <h4>Fixed grade ({currantGrade.gradeFixed})</h4>
         <p>Type: {currantGrade.typeFixed}</p>
         <p>Date: {currantGrade.dateFixed}</p>
         <p>Extra: {currantGrade.gradeExtraFixed}</p>
         {currantGrade.typeFixed == "written" && <div>
            <p onClick={() => { setDisplayAboutTestFixed(!displayAboutTestFixed) }}>AboutTest</p>
            {displayAboutTestFixed && <ul>
               <li>Percent: {anyPercentToString(currantGrade.aboutTestFixed.percent)}</li>
               <li>All points: {currantGrade.aboutTestFixed.allPoints}</li>
               <li>My points: {currantGrade.aboutTestFixed.getPoints}</li>
            </ul>}
         </div>}
      </div>}
      <div>
         <h4>Original grade ({currantGrade.grade})</h4>
         <p>Effective: {anyPercentToString(currantGrade.effective)}</p>
         <p>Type: {currantGrade.type}</p>
         <p>Date: {currantGrade.date}</p>
         <p>Extra: {currantGrade.gradeExtra}</p>
         {currantGrade.type == "written" && <div>
            <p onClick={() => { setDisplayAboutTest(!displayAboutTest) }}>AboutTest</p>
            {displayAboutTest && <ul>
               <li>Percent: {anyPercentToString(currantGrade.aboutTest.percent)}</li>
               <li>All points: {currantGrade.aboutTest.allPoints}</li>
               <li>My points: {currantGrade.aboutTest.getPoints}</li>
            </ul>}
         </div>}
      </div>
      </>
   }
   </div>
}