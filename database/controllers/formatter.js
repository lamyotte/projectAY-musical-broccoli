function formatMany(elements) {
  let formattedElements =[];
  for(let i = 0; i < elements.length ; i++) {
    formattedElements[i] = elements[i].dataValues;
    delete formattedElements[i].createdAt;
  	delete formattedElements[i].updatedAt;
  }
  return formattedElements;
}

function formatOne(element) {
  if (element)
    return element.dataValues;
  else
    return {};
}

module.exports = {
	formatMany,
	formatOne

}