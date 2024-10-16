import { anyPercentToNumber } from "./_generalFunctions"
const aboutTeacher = {
   "name": null,
   "homeworkState": "none",
   "homeworkGrade": null,
   "homeworkNumber": null,
   "percentState": null,
   "ignoreState": null,
   "smallGradeState": "none",
   "smallGradeConvertNumber": null,
   "plus_minusState": "none",
   "plusGrade": null,
   "plusNumber": null,
   "minusGrade": null,
   "minusNumber": null
}
function convertTeacherDataToTeacherObject(allData, allClasses) {
   if (!allData || !allClasses) return
   let teacherObject = {}
   //convert data
   allClasses.forEach((myClass => {
      teacherObject[myClass] = aboutTeacher
      const aboutCourantTeacher = allData[myClass].teacher
      //set "name"
      if (aboutCourantTeacher.name) teacherObject[myClass] = {...teacherObject[myClass], "name":aboutCourantTeacher.name}
      else teacherObject[myClass].name = ""
      //set "homework"
      if (aboutCourantTeacher.countsHomework) {
         let [text, number] = aboutCourantTeacher.countsHomework.split(":")
         if (text == "roundUp") {
            teacherObject[myClass] = {
               ...teacherObject[myClass],
               "homeworkState": text,
               "homeworkNumber": Number(number)
            }
         }
         else {
            teacherObject[myClass] = {
               ...teacherObject[myClass],
               "homeworkState": "getGrade",
               "homeworkGrade": Number(text),
               "homeworkNumber": Number(number)
            }
         }
      }
      else teacherObject[myClass].homeworkState = "none"
      //set "end by percent"
      if (aboutCourantTeacher.endsByPercents) teacherObject[myClass] = {...teacherObject[myClass], "percentState":true}
      else teacherObject[myClass] = {...teacherObject[myClass], "percentState":false}
      //set "ignoring fixed grades"
      if (aboutCourantTeacher.ignoresFixedGrades) teacherObject[myClass] = {...teacherObject[myClass], "ignoreState": true}
      else teacherObject[myClass] = {...teacherObject[myClass], "ignoreState": false}
      //set "plus and minus"
      if (aboutCourantTeacher.convertPluses) {
         let hasPlus
         let hasMinus
         aboutCourantTeacher.convertPluses.split("/").forEach(element => {
            const [type, grade, number] = element.split(":")
            if (type == "minus") hasMinus = true
            if (type == "plus") hasPlus = true
            teacherObject[myClass] = {...teacherObject[myClass],[`${type}Grade`]: grade}
            teacherObject[myClass] = {...teacherObject[myClass],[`${type}Number`]: number}
         })
         let text = ""
         if (hasPlus && hasMinus) text = "plus&minus"
         else if (hasPlus) text = "plus"
         else if (hasMinus) text = "minus"
         teacherObject[myClass] = {...teacherObject[myClass], "plus_minusState": text}
      }
      else teacherObject[myClass].plus_minusState = "none"
      //set "small grade"
      if (aboutCourantTeacher.convertSmallGrades) {
         if (aboutCourantTeacher.convertSmallGrades == true) teacherObject[myClass] = {...teacherObject[myClass], "smallGradeState":"round"}
         else {
            const [numberOfSmallGradesToConvert, smallGradeEffect] = aboutCourantTeacher.convertSmallGrades.split("-")
            teacherObject[myClass] = {...teacherObject[myClass], "smallGradeState":"convert", "smallGradeConvertNumber":numberOfSmallGradesToConvert , "smallGradeConvertEffect":Number(smallGradeEffect || 1)}
         }
      }
      else teacherObject[myClass] = {...teacherObject[myClass], "smallGradeState": "none"}
   }))
   return teacherObject
}

function convertIndividualTeacherObjectToTeacherData(teacherObject) {
   let teacherData = {
      "name": "",
      "countsHomework": null,
      "endsByPercents": null,
      "ignoresFixedGrades": null,
      "convertSmallGrades": null,
      "convertPluses": null
   }
   //set "name"
   teacherData = {...teacherData, "name": teacherObject.name}
   //set "homework"
   if (teacherObject.homeworkState != "none") {
      if (teacherObject.homeworkState == "roundUp")teacherData={...teacherData, "countsHomework": `roundUp:${teacherObject.homeworkNumber}`}
      else teacherData = {...teacherData, "countsHomework": `${teacherObject.homeworkGrade}:${teacherObject.homeworkNumber}`}
   }
   else teacherData = {...teacherData, "countsHomework": false}
   //set "percent" and "ignoring fixed"
   teacherData={
      ...teacherData,
      "endsByPercents": (teacherObject.percentState == "true" || teacherObject.percentState == true),
      "ignoresFixedGrades": (teacherObject.ignoreState == "true" || teacherObject.ignoreState == true)
   }
   //set "small grades"
   if (teacherObject.smallGradeState != "none") {
      if (teacherObject.smallGradeState == "round") teacherData = {...teacherData, "convertSmallGrades": true}
      else teacherData={...teacherData, "convertSmallGrades": `${teacherObject.smallGradeConvertNumber}-${(anyPercentToNumber(teacherObject.smallGradeConvertEffect) || 1)}`}
   }
   else teacherData = {...teacherData, "convertSmallGrades": false}
   //set "pluses and minuses"
   if (teacherObject.plus_minusState != "none") {
      if (teacherObject.plus_minusState == "plus" || teacherObject.plus_minusState == "minus") {
         let type = teacherObject.plus_minusState
         teacherData = {...teacherData, "convertPluses": `${type}:${teacherObject[`${type}Grade`]}:${teacherObject[`${type}Number`]}`}
      }
      else teacherData={...teacherData, "convertPluses": `plus:${teacherObject.plusGrade}:${teacherObject.plusNumber}/minus:${teacherObject.minusGrade}:${teacherObject.minusNumber}`}
   }
   else teacherData = {...teacherData, "convertPluses": false}
   return teacherData
}

export {
   convertTeacherDataToTeacherObject,
   convertIndividualTeacherObjectToTeacherData
}