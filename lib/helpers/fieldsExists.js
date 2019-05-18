const fieldsExists = (fields, objCheck) => {
  let result = true
  const objKeys = Object.keys(objCheck)

  for (let i = 0; i < fields.length; i++) {
    if (!objKeys.includes(fields[i])) {
      result = false
      break
    }
  }

  return result
}

module.exports = fieldsExists
