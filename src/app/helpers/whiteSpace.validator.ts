import { AbstractControl, ValidationErrors } from '@angular/forms';

export class WhiteSpaceValidator {
    static cannotContainSpace(control: AbstractControl): ValidationErrors | null {

        if ((control.value as string).indexOf(' ') >= 0) {
            if (!control.value.trim()) {
                return { cannotContainSpace: true }
            }
            return null;
        }
        return null;
    }
}