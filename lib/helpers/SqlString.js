const moment = require('moment')
const messql = {}

messql.CHAR_REGEX = /[\0\b\t\n\r"'\\]/g
messql.CHAR_MAP = {
  '\0': '\\0',
  '\b': '\\b',
  '\t': '\\t',
  '\n': '\\n',
  '\r': '\\r',
  '"': '\\"',
  '\'': '\\\'',
  '\\': '\\\\'
}

// who the fuck uses this :( -- me that's why i remade this

messql.isMsAccess = (bool) => {
  if (bool) {
    messql.CHAR_MAP['\''] = '\'\''
    messql.CHAR_MAP['"'] = '"'
  } else {
    messql.CHAR_MAP['\''] = '\\\''
    messql.CHAR_MAP['"'] = '\\"'
  }
}

messql.escapeString = (value) => {
  let chunkIndex = messql.CHAR_REGEX.lastIndex = 0
  let escapedVal = ''
  let match
  while ((match = messql.CHAR_REGEX.exec(value))) {
    escapedVal = `${escapedVal}${value.slice(chunkIndex, match.index)}${messql.CHAR_MAP[match[0]]}`
    chunkIndex = messql.CHAR_REGEX.lastIndex
  }

  if (chunkIndex === 0) {
    return `'${value}'`
  }

  if (chunkIndex < value.length) {
    return `'${escapedVal}${value.slice(chunkIndex)}'`
  }

  return `${escapedVal}`
}

messql.escape = (value) => {
  if (!value) {
    return 'NULL'
  }

  const dataType = value.constructor.name
  if (dataType == 'Boolean') {
    return (value) ? 1 : 0

  } else if (dataType == 'String') {
    return messql.escapeString(value)

  } else if (dataType == 'Number') {
    return value + ''

  } else if (dataType == 'Date') {
    return messql.dateToString(value)

  } else {
    return value.toString()
  }
}

messql.dateToString = (date) => {
  return `'${moment(date).format('YYYY-MM-DD HH:mm:ss')}'`
}

messql.format = (sql, values) => {
  if (values == null) {
    return sql
  }

  if (values.constructor.name !== 'Array') {
    values = [values]
  }

  const placeholdersRegex = /\?+/g

  let chunkIndex = 0
  let result = ''
  let valuesIndex = 0
  let match

  while (valuesIndex < values.length && (match = placeholdersRegex.exec(sql))) {
    if (match[0].length > 2) {
      continue
    }

    const value = messql.escape(values[valuesIndex])

    result = `${result}${sql.slice(chunkIndex, match.index)}${value}`
    chunkIndex = placeholdersRegex.lastIndex
    valuesIndex += 1
  }

  if (chunkIndex === 0) {
    return sql
  }

  if (chunkIndex < sql.length) {
    return `${result}${sql.slice(chunkIndex)}`
  }

  return result
}

module.exports = messql
