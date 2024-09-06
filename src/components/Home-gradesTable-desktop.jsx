import React, {useState} from "react";
import IndividualClassTableDataMaker from "./Home-gradesTable-individualClass";

export default function Home_GradesTable_desktop(props) {
   const [firstGradesData, setFirstGradesData] = useState({})
   const [secondGradesData, setSecondGradesData] = useState({})
   function checkIfDateIsInSecondHalf(date) {
      let [day, month, year] = date.split(".")
      if ((month > 1 || day > 15) && month < 8) {
         return true
      }
      else return false
   }
   React.useEffect(() => {
      if (!props.gradesData || !props.allClasses) return
      const newFirstGradesData = {};
      const newSecondGradesData = {};
      props.allClasses.forEach(myClass => {
         if (!props.gradesData.hasOwnProperty(myClass)) {
            return;
         }
         props.gradesData[myClass].grades.forEach(individualGrade => {
            if (individualGrade.isSecondHalf || checkIfDateIsInSecondHalf(individualGrade.date)) {
               if (!newSecondGradesData.hasOwnProperty(myClass)) {
                  newSecondGradesData[myClass] = { grades: [] };
               }
               newSecondGradesData[myClass].grades.push(individualGrade);
            } else {
               if (!newFirstGradesData.hasOwnProperty(myClass)) {
                  newFirstGradesData[myClass] = { grades: [] };
               }
               newFirstGradesData[myClass].grades.push(individualGrade);
            }
         });
      });
      setFirstGradesData(newFirstGradesData);
      setSecondGradesData(newSecondGradesData);
   }, [props.gradesData, props.allClasses])
   let tableHeadingItems = props.allClasses.map((element) => <th>{element}</th>)

   return (
   <table className="Home-grades-table">
      <tr>{tableHeadingItems}</tr>
      <IndividualClassTableDataMaker allClassesForHalf={firstGradesData} allClassesNames={props.allClasses} />
      <IndividualClassTableDataMaker allClassesForHalf={secondGradesData} allClassesNames={props.allClasses} />
      {props.endOfYear && <tr>final grades</tr>}
   </table>)
}