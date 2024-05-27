import { DatePickerInput,DatesProvider } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import React from 'react';
import { format, parseISO } from 'date-fns';
import 'dayjs/locale/ja';

const DatePicker = ({  name, form, locale, ...props }) => {
  const value = form.values[name] ? parseISO(form.values[name]) : null;

  const handleChange = (selectedDate) => {
    const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
    form.setFieldValue(name, formattedDate);
  };

  return (
    <DatesProvider settings={{locale:locale}}>
    <DatePickerInput
      icon={<IconCalendar size="0.5cm" stroke={1.5} />}
      value={value}
      onChange={handleChange}
      placeholder="Pick a date"
      {...props}
    />
    </DatesProvider>
  );
};

export default DatePicker;
