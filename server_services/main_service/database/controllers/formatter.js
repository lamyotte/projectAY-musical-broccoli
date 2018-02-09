function formatMany(elements) {
  let formattedElements =[];
  for(let i = 0; i < elements.length ; i++) {
    formattedElements[i] = elements[i].dataValues;
  }
  return formattedElements;
}

function formatOne(element) {
  return element.dataValues;
}

module.exports = {
	formatMany,
	formatOne

}