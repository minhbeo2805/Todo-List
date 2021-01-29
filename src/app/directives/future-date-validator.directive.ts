import {AbstractControl, ValidatorFn} from '@angular/forms';

export function futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const isDateValid = currentDate.getTime() <= Date.parse(control.value);
        return isDateValid ? null : {invalidDate: {value: control.value}};
    };
}

