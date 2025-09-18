import { RadioGroup } from '@radix-ui/react-radio-group';
import { CheckboxField } from './checkbox-field';
import { DatePickerField } from './date-picker-field';
import { InputField } from './input-field';
import { SelectField } from './select-field';
import { NestedSelectField, SelectGroupField } from './select-group-field';
import { TextareaField } from './textarea-field';
import { RadioGroupField } from './radio-field';
import { DaySelectorField } from './day-selector-field';
import { SwitchField } from './switch-field';

export const Field = {
  Text: InputField,
  Select: SelectField,
  Switch: SwitchField,
  SelectGroup: SelectGroupField,
  NestedSelect: NestedSelectField,
  DatePicker: DatePickerField,
  Textarea: TextareaField,
  Checkbox: CheckboxField,
  RadioGroup: RadioGroupField,
  DaySelector: DaySelectorField,
};
