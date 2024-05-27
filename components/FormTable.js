import { Box,NumberInput, Select, Table, TextInput, Title } from '@mantine/core';
import React from 'react'
import { DatePickerInput, DatesProvider } from '@mantine/dates';
import { parseISO } from 'date-fns';
import ImageFile from './ImageFile';
import { IconCalendar } from '@tabler/icons-react';
import 'dayjs/locale/ja';

const FormTable = (props) => {
    const {column,data,header,form,style,locale}=props;
    const handleDateChange = (e,name) => {
      const formattedDate = e ? e.toISOString().split('T')[0] : '';
      form.setFieldValue(name, formattedDate);
    }; 
    const handleChange = (selectedDate) => {
      const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
      form.setFieldValue('regrind_work_order.regrind_date', formattedDate);
    }; 
    return (<Box style={style}>
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
                const { label, type, rowspan,name,data,defaultValue,colspan,placeholder,precision,disabled,onchange,value } = cell;
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
                if (type=="select" && onchange) {
                  return (
                    <td key={colIndex} rowSpan={rowspan}>
                     <Select label={label}
                     onChange={onchange}
                     value={value}
                     data={data}
                     placeholder={placeholder}
                     readOnly={disabled}
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
                       readOnly={disabled}
                     />
                    </td> 
                  );
                }  
                if (type == "date") {
                  return (
                    <td key={colIndex} rowSpan={rowspan}>
                      <DatesProvider settings={{locale:locale}}>
                     <DatePickerInput
                      icon={<IconCalendar size="0.5cm" stroke={1.5} />}
              placeholder="Pick a Date"
              value={parseISO(form.values[name])||null}
              onChange={(e)=>handleDateChange(e,name)}
            />
            </DatesProvider>
             </td>
                  );
                }
                if (type === "regrinddate") {
                  return (
                    <td key={colIndex} rowSpan={rowspan}>
                      {/* <DatesProvider settings={{locale:locale}}> */}
                     <DatePickerInput
              placeholder="Pick a Date"
              value={
                form.values.regrind_work_order.regrind_date
                  ? parseISO(form.values.regrind_work_order.regrind_date)
                  : null}
              onChange={handleChange}
            />
            {/* </DatesProvider> */}
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