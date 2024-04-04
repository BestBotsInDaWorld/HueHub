export function makeCorrectDate(date) {
  var timeValue = new Date(date);
  var formattedTime;

  var today = new Date();
  var yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  var monthNames = ["янв", "фев", "мар", "апр", "мая", "июня",
                    "июля", "авг", "сен", "окт", "ноя", "дек"];
  var day = timeValue.getDate();
  var year = timeValue.getFullYear();
  var monthName = monthNames[timeValue.getMonth()];
  if (timeValue.toDateString() === today.toDateString()) {
      formattedTime = `сегодня в ${timeValue.getHours().toString().padStart(2, '0')}:${timeValue.getMinutes().toString().padStart(2, '0')}`;
  } else if (timeValue.toDateString() === yesterday.toDateString()) {
      formattedTime = `вчера в ${timeValue.getHours().toString().padStart(2, '0')}:${timeValue.getMinutes().toString().padStart(2, '0')}`;
  } else if (timeValue.getFullYear() === today.getFullYear()) {
      formattedTime = `${day} ${monthName} в ${timeValue.getHours().toString().padStart(2, '0')}:${timeValue.getMinutes().toString().padStart(2, '0')}`;
  } else {
    formattedTime = `${day} ${monthName} ${year}`;
  }
  return formattedTime
}