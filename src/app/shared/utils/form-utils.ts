import { FormArray, FormGroup, ValidationErrors } from "@angular/forms";

export class FormUtils {
  // Expresiones regulares
  static idRoomPattern = '^(?!\.{1,2}$)[^\/\u0000-\u001F\u007F]{1,50}$';

  static getTextError(errors: ValidationErrors) {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;

        case 'maxlength':
          return `Máximo de ${errors['maxlength'].requiredLength} caracteres.`;

        case 'min':
          return `Valor mínimo de ${errors['min'].min}`;

        case 'max':
          return `Valor maximo de ${errors['max'].max}`;

        case 'email':
          return `El valor ingresado no es un correo electrónico`;

        case 'customEmail':
          return `El valor ingresado no es un correo electrónico válido`;

        case 'passwordStrength':
          return `La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y símbolo.`;

        case 'pattern':
          if (errors['pattern'].requiredPattern === FormUtils.idRoomPattern) {
            return 'El formato del id no es valido';
          }
          return 'Error de patrón contra expresión regular';

        default:
          return `Error de validación no controlado ${key}`;
      }
    }

    return null;
  }

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return !!form.controls[fieldName].errors && form.controls[fieldName].touched

  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  static isValidFieldInArray(formArray: FormArray, index: number) {
    return (
      formArray.controls[index].errors && formArray.controls[index].touched
    );
  }

  static getFieldErrorInArray(
    formArray: FormArray,
    index: number
  ): string | null {
    if (formArray.controls.length === 0) return null;

    const errors = formArray.controls[index].errors ?? {};

    return FormUtils.getTextError(errors);
  }


}
