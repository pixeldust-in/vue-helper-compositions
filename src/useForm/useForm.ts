import { IForm, IValidation } from './types'
import { validate } from './useValidations'

export default function useForm(form: IForm) {
  const validateField = (fieldKey: keyof IForm['fields'], showError = true) => {
    const { fields, validations } = form
    const validationArray = validations[fieldKey]
    if (validationArray && validationArray.length) {
      const fieldValud = fields[fieldKey]
      const { isValid, message } = validate(
        fieldValud,
        validationArray,
      ) as IValidation
      if (!isValid && message && showError) {
        Object.assign(form.errors, { [fieldKey]: [message] })
      } else {
        Object.assign(form.errors, { [fieldKey]: [] })
      }
      return isValid
    }
    return true
  }

  const validateForm = (showError = true) => {
    const { fields, validations } = form
    const isValid = Object.keys(fields)
      .map((key: any) => validateField(key, showError))
      .every(i => i)
    return isValid
  }

  return {
    validateField,
    validateForm,
  }
}
