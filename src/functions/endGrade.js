/* eslint-disable no-unused-vars */
/* eslint-disable no-inner-declarations */
import { anyPercentToNumber } from "./_generalFunctions"
let roundUpReason = ""
function endGrade(myClass) {
   //check teacher
   if (!myClass) {
      console.log("Can not and grade do to invalid data!")
      return
   }
   let extraGrades = []
   const doHomework = Boolean(myClass.teacher.countsHomework)
   const doPercent = Boolean(myClass.teacher.endsByPercents)
   const doIgnoreFixedGrade = Boolean(myClass.teacher.ignoresFixedGrades)
   const doPlusMinus = Boolean(myClass.teacher.convertPluses)
   const doSmallGrades = Boolean(myClass.teacher.numberOfSmallGrades)

   let roundUp = undefined
   roundUpReason = ""
   function finalRound(grade, roundUp, smallGrade) {
      let decimal = Number("0." + String(sumOfGrades / numberOfGrades).split(".")[1])
      if (decimal < 0.48) return grade.toFixed(2)
      if (roundUp == undefined) return grade.toFixed(2)
      if (smallGrade) {
         if (smallGrade > grade) roundUp = true
         else roundUp = false
      }
      return roundUp ? Math.ceil(grade) : Math.floor(grade)
   }

   if (doHomework) {
      const [gradeToGiveText, numberOfHomeworks] = myClass.teacher.countsHomework.split(":")
      const numberOfHomeworksNotDone = myClass.homework.length
      if (gradeToGiveText == "roundUp") {
         let extraText = (numberOfHomeworksNotDone > 1) ? "s" : ""
         if (numberOfHomeworksNotDone > numberOfHomeworks) {
            roundUp = false
            roundUpReason = `I did not have homework ${numberOfHomeworksNotDone} time${extraText} witch is less than the teacher wants(${numberOfHomeworks}).`
         }
         else {
            roundUp = true
            roundUpReason = `I did not do homework ${numberOfHomeworksNotDone} time${extraText} and the teacher will round down only if I did not have it ${numberOfHomeworks} time${(numberOfHomeworks > 1) ? "s" : ""}.`
         }
      }
      else {
         for (let i = 0; i + numberOfHomeworks < numberOfHomeworksNotDone; i += numberOfHomeworks) {
            extraGrades.push(Number(gradeToGiveText))
         }
      }
   }
   ///converting pluses to grades or set the rounding
   if (doPlusMinus) {
      let numberOfAllItemsObject = {
         "plus": 0,
         "minus": 0
      }
      myClass.plus_minus.forEach(element => {
         if (element.type == "plus") numberOfAllItemsObject.plus++
         else if (element.type == "minus") numberOfAllItemsObject.minus++
      })
      if (myClass.teacher.convertPluses === true) {
         roundUp = (numberOfAllItemsObject.plus > numberOfAllItemsObject.minus)
         roundUpReason = `I have ${numberOfAllItemsObject.plus} plus${numberOfAllItemsObject.plus > 1 ? "es" : ""} and ${numberOfAllItemsObject.minus} minus${numberOfAllItemsObject.minus > 1 ? "es" : "s"}`
      }
      else {
         let allPossibilities = myClass.teacher.convertPluses.split("/")
         allPossibilities.forEach(gradeSpecification => {
            let [type, grade, numberOfNeededItems] = gradeSpecification.split(":")
            while (Number(numberOfNeededItems) > numberOfAllItemsObject[type]) {
               extraGrades.push(Number(grade))
               numberOfAllItemsObject -= numberOfNeededItems
            }
         })
      }
   }
   ///converting small grades
   let smallGradeFinalGrade
   if (doSmallGrades) {
      if (myClass.teacher.convertSmallGrades === true) {
         let sumOfSmallGrades
         let numberOfSmallGrades = myClass.smallGrade.length
         myClass.smallGrades.forEach(smallGrade => {
            sumOfGrades += smallGrade
         })
         smallGradeFinalGrade = Math.round(sumOfSmallGrades / numberOfSmallGrades)
      }
      else {
         const numberOfSmallGradesConverted = myClass.teacher.convertSmallGrades
         for (let i = 0; i + numberOfSmallGradesConverted < myClass.smallGrades.length; i += numberOfSmallGradesConverted) {
            let allSmallGradesGrade
            for (let j = 0; j < numberOfSmallGradesConverted; j++) {
               allSmallGradesGrade += myClass.smallGrades[i + j]
            }
            extraGrades.push(allSmallGradesGrade / numberOfSmallGradesConverted)
         }
      }
   }
   if (doPercent) {
      roundUpReason = "percent"
      function getGradeFromPercent(percent) {
         if (percent < 0.5) return 1
         else if (percent < 0.65) return 2
         else if (percent < 0.8) return 3
         else if (percent < 0.9) return 4
         else if (percent <= 1) return 5
      }
      const getPercentFromGrade = new Map([
         [5, 1],
         [5, 0.89],
         [3, 0.79],
         [2, 0.64],
         [1, 0.49]
      ])
      let numberOfGrades = 0
      let allPercent = 0
      myClass.grades.forEach((grade) => {
         switch(grade.type){
            case "written":
               if (grade.wasFixed) allPercent += anyPercentToNumber(grade.aboutTestFixed.percent)
               if (!grade.wasFixed && !doIgnoreFixedGrade) allPercent += anyPercentToNumber(grade.aboutTest.percent)
               break
            case "talk":
               if (grade.wasFixed) allPercent += getPercentFromGrade.get(grade.gradeFixed)
               if (!grade.wasFixed && !doIgnoreFixedGrade) allPercent += getPercentFromGrade.get(grade.grade)
         }
         numberOfGrades++
      })
      extraGrades.forEach(extraGrade => {
         numberOfGrades++
         allPercent += getPercentFromGrade.get(extraGrade)
      })
      return getGradeFromPercent(allPercent / numberOfGrades)
   }
   //*general output
   let sumOfGrades = 0
   let numberOfGrades = 0
   myClass.grades.forEach(grade => {
      let effectivePercent = anyPercentToNumber(grade.effective)
      if (grade.wasFixed) {
         sumOfGrades += grade.gradeFixed * effectivePercent
         numberOfGrades += effectivePercent
      }
      if (!grade.wasFixed && !doIgnoreFixedGrade) {
         sumOfGrades += grade.grade * effectivePercent
         numberOfGrades += effectivePercent
      }
   })
   extraGrades.forEach(extraGrade => {
      sumOfGrades += extraGrade
      numberOfGrades++
   })
   return finalRound(sumOfGrades / numberOfGrades, roundUp, smallGradeFinalGrade)
}
export {
   endGrade,
   roundUpReason
}