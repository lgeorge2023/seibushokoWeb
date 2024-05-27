import React, { useEffect, useState } from "react";
import { Select, Table, TextInput } from "@mantine/core";
import { DatePickerInput, DatesProvider } from "@mantine/dates";
import { parseISO } from "date-fns";
import { useTranslation } from "next-i18next";
import { fetchAndTransformStaffData } from "@/pages/api/Select";
import { locale } from "dayjs";

export default function FormPart4(props) {
  const form = props.form;
  const { t } = useTranslation("common");
  const [ technician, setTechnician ] = useState([]);

  const fetchAllData = async () => {
    try{
      const [technicianData] = await Promise.all([
        fetchAndTransformStaffData(),
      ]);
      setTechnician(technicianData)
    }catch (error) {
      console.error(error);
    }
  }

  useEffect (()=>{
    fetchAllData();
  },[])


  const handleChange = (selectedDate) => {
    const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
    form.setFieldValue('regrind_work_order.test_date', formattedDate);
  };

  return (
    <Table withBorder withColumnBorders style={{ marginTop: 50 }}>
      <thead>
        <tr>
          <th>{t('workOrder.Axis Crossing Angle')}</th>
          <th colSpan={2}>
            <TextInput placeholder={t('workOrder.Axis Crossing Angle')} {...form.getInputProps("regrind_work_order.axis_cross_angle")} />
          </th>
          <th></th>
          <th>{t('workOrder.Date')}</th>
          <th>{t('workOrder.Auto')}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>{t('workOrder.Degree Minutes Second')}</th>
          <td><TextInput placeholder={t('workOrder.Degree')} {...form.getInputProps("regrind_work_order.degree")} /></td>
          <td><TextInput placeholder={t('workOrder.Minutes')} {...form.getInputProps("regrind_work_order.minute")} /></td>
          <td><TextInput placeholder={t('workOrder.Second')} {...form.getInputProps("regrind_work_order.second")} /></td>
          <td rowSpan={5}>
            <DatesProvider settings={{locale:props.locale}}>
            <DatePickerInput
              placeholder="Regrind Date"
              value={form.values.regrind_work_order.test_date ? parseISO(form.values.regrind_work_order.test_date) : null}
              onChange={handleChange}
            />
            </DatesProvider>
          </td>
          <td rowSpan={5}><Select value={form.values.regrind_work_order.technician} data={technician} placeholder={t('workOrder.Technician')} {...form.getInputProps("regrind_work_order.technician")} /></td>
        </tr>
        <tr>
          <th>{t('workOrder.Relational Speed')}</th>
          <td colSpan={2}><TextInput placeholder={t('workOrder.Relational Speed')} {...form.getInputProps("regrind_work_order.relational_speed")} /></td>
          <td></td>
        </tr>
        <tr>
          <th>{t('workOrder.No Of Finished')}</th>
          <td colSpan={2}><TextInput placeholder={t('workOrder.No Of Finished')} {...form.getInputProps("regrind_work_order.no_finished")} /></td>
          <td></td>
        </tr>
        <tr>
          <th>{t('workOrder.Sparkout')}</th>
          <td colSpan={2}><TextInput placeholder="" {...form.getInputProps("regrind_work_order.sparkout")} /></td>
          <td></td>
        </tr>
        <tr>
          <th>{t('workOrder.Diagonal Angle')}</th>
          <td colSpan={2}><TextInput placeholder=""  {...form.getInputProps("regrind_work_order.diagonal_angle")} /></td>
          <td></td>
        </tr>
        <tr>
          <td rowSpan={2}>{t('workOrder.PURANJI')}</td>
          <td>{t('workOrder.First Speed')}</td>
          <td><TextInput placeholder={t('workOrder.1st Speed')}  {...form.getInputProps("regrind_work_order.puranji_speed1")} /></td>
          <td></td>
          <td rowSpan={6}></td>
          <td rowSpan={6}></td>
        </tr>
        <tr>
          <td>{t('workOrder.Second Speed')}</td>
          <td><TextInput placeholder={t('workOrder.2nd Speed')}  {...form.getInputProps("regrind_work_order.puranji_speed2")} /></td>
          <td></td>
        </tr>
        <tr>
          <td rowSpan={4}>{t('workOrder.STROKE')}</td>
          <td>{t('workOrder.Horz Feed')}</td>
          <td><TextInput placeholder={t('workOrder.Lateral Feed')} {...form.getInputProps("regrind_work_order.stroke_lateral_feed")} /></td>
          <td></td>
        </tr>
        <tr>
          <td>T1</td>
          <td><TextInput placeholder="T1"  {...form.getInputProps("regrind_work_order.stroke_t1")} /></td>
          <td></td>
        </tr>
        <tr>
          <td>T2</td>
          <td><TextInput placeholder="T2"  {...form.getInputProps("regrind_work_order.stroke_t2")} /></td>
          <td></td>
        </tr>
        <tr>
          <td>T3</td>
          <td><TextInput placeholder="T3"  {...form.getInputProps("regrind_work_order.stroke_t3")} /></td>
          <td></td>
        </tr>
        <tr>
          <td>BM{t('workOrder.BMAmount')}</td>
          <td colSpan={2}><TextInput placeholder={t('workOrder.Amount')}  {...form.getInputProps("regrind_work_order.bm_amount")} /></td>
          <td></td>
          <td rowSpan={4}></td>
          <td rowSpan={4}></td>
        </tr>
        <tr>
          <td>{t('workOrder.Cut Depth / Times')}</td>
          <td><TextInput placeholder={t('workOrder.Cut Amount')} {...form.getInputProps("regrind_work_order.cut_amount")} /></td>
          <td colSpan={2}><TextInput placeholder={t('workOrder.Notch Amount')}  {...form.getInputProps("regrind_work_order.notch_amount")} /></td>
        </tr>
        <tr>
          <td>{t('workOrder.Matagi / No Of Bear Teeth')}</td>
          <td><TextInput placeholder={t('workOrder.MATAGI')}  {...form.getInputProps("regrind_work_order.matagi")} /></td>
          <td colSpan={2}><TextInput placeholder={t('workOrder.No of Bare Teeth')}  {...form.getInputProps("regrind_work_order.no_bear_teeth")} /></td>
        </tr>
        <tr>
          <td>{t('workOrder.OBD / OBD Diameter')}</td>
          <td><TextInput placeholder="OBD"  {...form.getInputProps("regrind_work_order.obd")} /></td>
          <td colSpan={2}><TextInput placeholder={t('workOrder.OBD Diameter')} {...form.getInputProps("regrind_work_order.obd_dia")} /></td>
        </tr>
      </tbody>
    </Table>
  );
}
