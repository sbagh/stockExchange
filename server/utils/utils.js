function dateFormat(time) {
   let dateOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
   };

   return new Date(time).toLocaleString("en-US", dateOptions);
}

module.exports = {
   dateFormat,
};
