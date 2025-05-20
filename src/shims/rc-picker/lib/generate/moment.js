// Mock implementation of rc-picker/lib/generate/moment
module.exports = {
  default: {
    // Add any necessary mock functions or properties here
    generateConfig: {
      getWeekDay: () => 0,
      getYear: () => new Date().getFullYear(),
      getMonth: () => new Date().getMonth(),
      getDate: () => new Date().getDate(),
      getHour: () => new Date().getHours(),
      getMinute: () => new Date().getMinutes(),
      getSecond: () => new Date().getSeconds(),
      addYear: (date, diff) => date,
      addMonth: (date, diff) => date,
      addDate: (date, diff) => date,
      setYear: (date, year) => date,
      setMonth: (date, month) => date,
      setDate: (date, day) => date,
      setHour: (date, hour) => date,
      setMinute: (date, minute) => date,
      setSecond: (date, second) => date,
      isAfter: (date1, date2) => true,
      isValidate: (date) => true,
      locale: {
        getWeekFirstDay: () => 0,
        getWeekFirstDate: () => new Date(),
        getWeek: () => 1,
        format: (date, format) => "",
        parse: (text, format) => new Date(),
      },
    },
  },
}
