function anyPercentToNumber(percentValue) {
   if (typeof percentValue == "string") return Number(percentValue.split("%")[0]) / 100
   else return percentValue
}
function anyPercentToString(percentValue) {
   if (typeof percentValue == "number") return (percentValue * 100 + "%")
   else return percentValue
}
function sortArrayByDate(array, dateKey, sortBySecond) {
   array.sort((a, b) => {
      let x = new Date(a[dateKey])
      let y = new Date(b[dateKey])
      if (x < y) return -1
      if (x > y) return 1
      if (a[sortBySecond] < b[sortBySecond]) return -1
      if (a[sortBySecond] > b[sortBySecond]) return 1
      return 0
   })
   return array
}
function convertMyDatesToUsableDates(myDate){
   let [d,m,y] = myDate.split(".")
   return `${y}-${m}-${d}`
}
function convertUsableDatesToMyDates(usableDate){
   let [y,m,d] = usableDate.split("-")
   return `${d}.${m}.${y}`
}
function checkIfDateIsInSecondHalf(date) {
   let [d, m, y] = date.split(".")
   if ((m > 1 || d > 15) && m < 8) return true
   else return false
}
function make_a_deep_copy(item) {
   return JSON.parse(JSON.stringify(item))
}
function createSendFile(myClass, file, type, data){
   return {
      "class":myClass,
      "file":file,
      "type":type,
      "data": data
   }
}

export {
   anyPercentToNumber,
   anyPercentToString,
   sortArrayByDate,
   convertMyDatesToUsableDates,
   convertUsableDatesToMyDates,
   make_a_deep_copy,
   createSendFile,
   checkIfDateIsInSecondHalf,
}