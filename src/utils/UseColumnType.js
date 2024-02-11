export const isString = (columnType) => {
  return (columnType.match(/(char)|(blob)|(binary)/g) || []).length > 0
}

export const isText = (columnType) => {
  return (columnType.match(/(text)/g) || []).length > 0
}

export const isNumber = (columnType) => {
  return (columnType.match(/(int)|(float)|(double)|(dec)|(bit)/g) || []).length > 0
}

export const isBoolean = (columnType) => {
  return (columnType.match(/(bool)/g) || []).length > 0
}

export const isEnum = (columnType) => {
  return (columnType.match(/(enum)|(set)/g) || []).length > 0
}

export const isDate = (columnType) => {
  return (columnType.match(/(date)|(time)/g) || []).length > 0
}

export const isJson = (columnType) => {
  return (columnType.match(/(json)/g) || []).length > 0
}