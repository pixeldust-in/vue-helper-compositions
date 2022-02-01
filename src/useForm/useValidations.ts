import { IValidation } from './types'

const MOBILE_REGEX = new RegExp(/^[6-9][\d]{9}$/)
const EMAIL_REGEX = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@([a-z\d]{1,}[a-z+\d_-]*)(([.][a-z]{2,}){1,})$/i,
)

function required(value: any) {
  if (value == undefined) {
    return false
  } else if (typeof value === 'object' && !Object.keys(value).length) {
    return false
  } else if (typeof value == 'string' && value.trim() == '') {
    return false
  } else if (value.constructor === Array && value.length <= 0) {
    return false
  } else {
    return true
  }
}

function email(email: string) {
  if (typeof email == 'string' && email === '') {
    return true
  }
  return EMAIL_REGEX.test(email)
}

function mobile(mobile: string | number) {
  if (typeof mobile == 'string' && mobile === '') {
    return true
  }
  return MOBILE_REGEX.test(`${mobile}`)
}

function integer(integer: string | number) {
  let IntegerRegex = new RegExp(/^\d+$/g)
  return IntegerRegex.test(`${integer}`)
}

function stringToRegex(regexString: string) {
  return /^\/.*\/[gimuy]*$/.test(regexString)
    ? eval(regexString)
    : new RegExp(regexString)
}

function regex(regexString: string, value: string) {
  return stringToRegex(regexString).test(value)
}

function minLength(minLength: number, value: string) {
  if (value) {
    return value.toString().trim().length >= minLength
  } else {
    return false
  }
}

function maxLength(maxLength: number, value: string) {
  if (value) {
    return value.toString().length <= maxLength
  }

  return true
}

const validationRules = {
  email,
  mobile,
  required,
  regex,
  integer,
  minLength,
  maxLength,
}

const ValidationMessages = {
  required: 'This field is required.',
  email: 'Please enter a valid email',
  mobile: 'Please enter a valid 10 digit mobile number',
  regex: 'Please enter a valid value',
  maxLength: 'Character limit exceeded.',
  minLength: 'Not enough characters entered.',
}

function callValidator(validationName: string, validationObj: any, value: any) {
  let isValid = true
  switch (validationName) {
    case 'regex':
      isValid = validationRules[validationName](validationObj.expression, value)
      break
    case 'inverse_regex':
      isValid = validationRules[validationName](validationObj.expression, value)
      break
    case 'maxValue':
      isValid = validationRules[validationName](validationObj.maxValue, value)
      break
    case 'minValue':
      isValid = validationRules[validationName](validationObj.minValue, value)
      break
    case 'customHandler':
      isValid = validationObj.customHandler(value)
      break
    case 'minLength':
      isValid = validationRules[validationName](validationObj.minLength, value)
      break
    case 'maxLength':
      isValid = validationRules[validationName](validationObj.maxLength, value)
      break
    case 'multipleOf':
      isValid = validationRules[validationName](validationObj.multiple, value)
      break
    default:
      if (validationRules[validationName]) {
        isValid = validationRules[validationName](value)
      }
      break
  }
  return isValid
}

function validationHandler(value: any, validationArray: any) {
  let validationObject: IValidation = { isValid: true, message: '' }

  if (Object.prototype.toString.call(validationArray) !== '[object Array]') {
    throw new Error('validationArray should be an array (In Validations.ts)')
    return
  } else {
    for (let i = 0; i < validationArray.length; i++) {
      if (typeof validationArray[i] == 'string') {
        validationObject.isValid = validationRules[validationArray[i]](value)
        validationObject.message = ''
        if (validationObject.isValid == false) {
          validationObject.message = ValidationMessages[validationArray[i]]
        }
      } else if (typeof validationArray[i] == 'object') {
        if (validationArray[i].hasOwnProperty('name')) {
          validationObject.isValid = callValidator(
            validationArray[i].name,
            validationArray[i],
            value,
          )
          validationObject.message = ''
          if (validationObject.isValid == false) {
            // checking if custom message is passed if not then use standard msgs
            if (validationArray[i].hasOwnProperty('message')) {
              validationObject.message = validationArray[i].message
            } else {
              validationObject.message =
                ValidationMessages[validationArray[i].name]
            }
          }
        } else {
          throw new Error('Validation object must have name key')
          return
        }
      } else {
        throw new Error('Valdiation rules can only be of type string or object')
        return
      }

      // breaking if any one validation is false
      if (validationObject.isValid == false) {
        break
      }
    }
    return validationObject
  }
}

export const validate = validationHandler
