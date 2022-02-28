export interface IValidation {
  isValid: boolean
  message: string
}

export interface IForm {
  fields: Object
  errors: Object
  validations: Object
}
