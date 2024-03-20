function pick(object = {}, keys = []) {
  const newObj = {};
  keys.forEach((key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      newObj[key] = object[key];
    }
  });
  return newObj;
}

module.exports = pick;
