function pick(object = {}, keys = []) {
  const newObj = {};
  keys.forEach((key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      newObj[key] = object[key];
    }
  });
  if (keys.includes("headers") && "headers" in object) {
    newObj["headers"] = object["headers"];
  }
  return newObj;
}

module.exports = pick;
