import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateTimeValidators(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const expirationDateTime = new Date(value);
    return expirationDateTime < new Date() ? {expirationDateTimeInvalid: true} : null
  };
}
