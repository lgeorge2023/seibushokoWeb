import { Box,NumberInput, Select, Table, TextInput, Title } from '@mantine/core';
import React from 'react'
import { DatePickerInput } from '@mantine/dates';
import { parseISO } from 'date-fns';
import ImageFile from './ImageFile';
import { IconCalendar } from '@tabler/icons-react';
const FormTable = (props) => {
    const {column,data,header,form}=props;
    const handleDateChange = (e,name) => {
      const formattedDate = e ? e.toISOString().split('T')[0] : '';
      form.setFieldValue(name, formattedDate);
    }; 
    const handleChange = (selectedDate) => {
      const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
      form.setFieldValue('regrind_work_order.regrind_date', formattedDate);
    }; 
    return (<Box>
      { header && <Title order={5}>{header}</Title>}
      <Table withColumnBorders withBorder style={{marginTop:"30px"}}>
        <thead>
          <tr>
            {column.map((row, i) => (
              <th key={i} colSpan={row?.colspan}>
                {row.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {row.map((cell, colIndex) => {
                const { label, type, rowspan,name,data,defaultValue,colspan,placeholder,precision,disabled } = cell;
                if (type=="number") {
                  return (
                    <td key={colIndex} rowSpan={rowspan} colSpan={colspan}>
                     <NumberInput label={label}
                     min={0}
                     {...form.getInputProps(name)}
                     removeTrailingZeros
                      precision={precision}
                       placeholder={placeholder}
                     />
                    </td> 
                  );
                }  
                if (type=="select") {
                  return (
                    <td key={colIndex} rowSpan={rowspan}>
                     <Select label={label}
                     {...form.getInputProps(name)}
                     data={data}
                     placeholder={placeholder}
                     readOnly={disabled}
                     />
                    </td> 
                  );
                }  
                if (type=="input") {
                  return (
                    <td key={colIndex} rowSpan={rowspan} colSpan={colspan}>
                     <TextInput label={label}
                     {...form.getInputProps(name)}
                       defaultValue={defaultValue}
                       placeholder={placeholder}
                     />
                    </td> 
                  );
                }  
                if (type == "date") {
                  return (
                    <td key={colIndex} rowSpan={rowspan}>
                     <DatePickerInput
                      icon={<IconCalendar size="0.5cm" stroke={1.5} />}
              placeholder="Pick a Date"
              value={parseISO(form.values[name])||null}
              onChange={(e)=>handleDateChange(e,name)}
            />
             </td>
                  );
                }
                if (type === "regrinddate") {
                  return (
                    <td key={colIndex} rowSpan={rowspan}>
                     <DatePickerInput
              placeholder="Pick a Date"
              value={
                form.values.regrind_work_order.regrind_date
                  ? parseISO(form.values.regrind_work_order.regrind_date)
                  : null}
              onChange={handleChange}
            />
             </td>
                  );
                }
  
                 if (type=="file") {
                  const imageUrl = (form.values[name]!=null && typeof(form.values[name]) == "object")
                  ? URL.createObjectURL(form.values[name])
                  : form.values[name];
                  return (
                    <td key={colIndex} rowSpan={rowspan}>
                      <ImageFile name={name} form={form} label={label} {...props}/>
                    </td> 
                  );
                }
                else {
                  return <td key={colIndex} rowSpan={rowspan}>{label}</td>;
                }
              })}
            </tr>
          ))}
        </tbody>
      </Table>
      </Box>
    );
  };

export default FormTable