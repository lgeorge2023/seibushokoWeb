import { get } from './apiUtils';

const fetchAndTransformData = async (endpoint, transformFn) => {
  const data = await get(endpoint);
  const transformedData = data?.map(transformFn);
  return transformedData;
};

export const fetchAndTransformClientData = async () => {
  return fetchAndTransformData("/client/select/", (item) => ({
    value: item.id,
    label: item.segment_name,
    disabled: item.disabled,
  }));
};

export const fetchAndTransformMFGData = async () => {
  return fetchAndTransformData("/mfg/", (item) => ({
    value: item.id,
    label: item.mfg_no,
  }));
};

export const fetchAndTransformOrderData = async () => {
  return fetchAndTransformData("/order/active", (item) => ({
    value: item.id,
    label: item.order_no,
  }));
};

export const fetchAndTransformRegrindData = async () => {
  return fetchAndTransformData("/regrindtype/select/", (item) => ({
    value: item.id,
    label: item.type,
  }));
};

export const fetchAndTransformStaffData = async (manager) => {
  return fetchAndTransformData(`/staff/select/${manager}`, (item) => ({
    value: item.id,
    label: item.user_full_name,
    disabled: item.disabled,
  }));
};

export const fetchAndTransformWorkOrderData = async () => {
  return fetchAndTransformData("/workorder/all", (item) => ({
    value: item.id,
    label: item.work_order_no,
  }));
};

export const fetchAndTransformCutterData = async () => {
  return fetchAndTransformData("/cutter/select/", (item) => ({
    value: item.id,
    label: item.cutter_no,
  }));
};

export const fetchAndTransformRoleData = async () => {
  return fetchAndTransformData("/role/select/", (item) => ({
    value: item.id,
    label: item.name,
  }));
};