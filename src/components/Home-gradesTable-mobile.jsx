import React from "react";
export default function Home_GradesTable_mobile({gradesData, allClasses, endOfYear, isMobile}){
   const [allTableRows, setAllTableRows] = React.useState([])
   let device = isMobile ? "Mobile" : "Computer"
   
   React.useEffect(()=>{
      let allItems = []
      allClasses.forEach(myClass => {
         let allGradesText = []
         gradesData[myClass].grades.forEach(grade=>{
            if(grade.wasFixed){
               allGradesText.push(
               <p className={`Home-table-grade ${device} gradeType-${grade.typeFixed}`}>
                  {grade.gradeFixed}
                  <b className={`Home-table-gradeFixed ${device} gradeType-${grade.type}`}>{grade.grade}</b>
               </p>
               )
            }
            allGradesText.push(<p className={`Home-table-grade ${device} gradeType-${grade.type}`}>{grade.grade}</p>)
         })
         allItems.push(<tr>
            <th>{myClass}</th>
            <td>{allGradesText}</td>
            {endOfYear && <td>XX</td>}
         </tr>)
      })
      setAllTableRows(allItems)
   }, [gradesData, allClasses])
   
   
   return (
   <table className={`Home-grades-table ${device}`}>
      {allTableRows}
   </table>
   )
}

//Home-tableDesktop-grade gradeType-written