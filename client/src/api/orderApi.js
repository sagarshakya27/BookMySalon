import api from "./client";

const readList = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.content)) {
    return payload.content;
  }

  if (Array.isArray(payload?.orders)) {
    return payload.orders;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.payload)) {
    return payload.payload;
  }

  if (Array.isArray(payload?.result)) {
    return payload.result;
  }

  if (Array.isArray(payload?._embedded?.orders)) {
    return payload._embedded.orders;
  }

  return [];
};

const normalizeOrderPayload = (orderPayload) => {
  const salonId = Number(orderPayload?.salon?.id);
  const normalizedSalonId = Number.isNaN(salonId) ? orderPayload?.salon?.id : salonId;

  const payload = {
    customerName: `${orderPayload?.customerName || ""}`.trim(),
    mobile: `${orderPayload?.mobile || ""}`.trim(),
    serviceName: `${orderPayload?.serviceName || ""}`.trim(),
    timeSlot: `${orderPayload?.timeSlot || ""}`.trim(),
    status: `${orderPayload?.status || "PENDING"}`.trim(),
    salon: {
      id: normalizedSalonId,
    },
  };

  return payload;
};

export const createOrder = async (orderPayload) => {
  const response = await api.post("/api/orders", normalizeOrderPayload(orderPayload));
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get("/api/orders");
  return readList(response.data);
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/api/orders/${id}?status=${encodeURIComponent(status)}`);
  return response.data;
};
