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

export const loginMerchant = async (credentials) => {
  return {
    ownerName: credentials.ownerName || "Salon Owner",
    email: credentials.email,
    mobile: credentials.mobile || "9999999999",
  };
};

export const registerMerchant = async (payload) => {
  return {
    ownerName: payload.ownerName,
    email: payload.email,
    mobile: payload.mobile,
  };
};

export const createSalon = async (payload) => {
  const response = await api.post("/api/salons", payload);
  return response.data;
};

export const createSampleSalons = async () => {
  const sampleSalons = [
    {
      name: "Aura Salon Studio",
      ownerName: "Neha Kapoor",
      mobile: "9876543210",
      address: "12 Market Road, City Center",
      bannerImage:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
      openingTime: "9:00 AM",
      closingTime: "9:00 PM",
      latitude: 28.6139,
      longitude: 77.209,
      rating: 4.7,
    },
    {
      name: "Blush & Bloom Salon",
      ownerName: "Riya Sharma",
      mobile: "9988776655",
      address: "48 Lake View Avenue, Downtown",
      bannerImage:
        "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80",
      openingTime: "10:00 AM",
      closingTime: "8:00 PM",
      latitude: 19.076,
      longitude: 72.8777,
      rating: 4.8,
    },
  ];

  const responses = await Promise.all(sampleSalons.map((salon) => createSalon(salon)));
  return responses;
};

export const createService = async (payload) => {
  const response = await api.post("/api/services", payload);
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
