function formatDate(date) {
   const d = new Date(date);
   const year = d.getFullYear();
   let month = (d.getMonth() + 1).toString();
   let day = d.getDate().toString();
   let hours = d.getHours().toString();
   let minutes = d.getMinutes().toString();
   let seconds = d.getSeconds().toString();

   month = month.length === 1 ? "0" + month : month;
   day = day.length === 1 ? "0" + day : day;
   hours = hours.length === 1 ? "0" + hours : hours;
   minutes = minutes.length === 1 ? "0" + minutes : minutes;
   seconds = seconds.length === 1 ? "0" + seconds : seconds;

   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

module.exports = {
   formatDate,
};
