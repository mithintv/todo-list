function getDate() {
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  return new Date().toLocaleDateString("en-US", options);
}

exports.getDate = getDate;

function getDay() {
  const options = {
    weekday: "long",
  };
  return new Date().toLocaleDateString("en-US", options);
}

exports.getDay = getDay;