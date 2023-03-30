module.exports.capitalizeWord = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

module.exports.kebabCaseFromArray = (array) => {
  return array.map((i) => i.toString().toLowerCase()).join('-');
};

module.exports.camelCaseFromArray = (array) => {
  return array
    .map((i, index) => {
      if (index === 0) {
        return i.toString().toLowerCase();
      } else {
        return module.exports.capitalizeWord(i.toString().toLowerCase());
      }
    })
    .join('');
};
