import api from "./client";

const DEMO_SALONS = [
  {
    id: "demo-aura-salon",
    name: "Aura Salon Studio",
    address: "12 Market Road, City Center",
    location: "City Center",
    latitude: 28.6139,
    longitude: 77.209,
    rating: 4.7,
    bannerImage:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "demo-blush-bloom",
    name: "Blush & Bloom Salon",
    address: "48 Lake View Avenue, Downtown",
    location: "Downtown",
    latitude: 28.6328,
    longitude: 77.2197,
    rating: 4.8,
    bannerImage:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80",
  },
];

const DEMO_SERVICES_BY_SALON = {
  "demo-aura-salon": [
    { id: "aura-haircut", name: "Haircut", price: 299, duration: 30 },
    { id: "aura-spa", name: "Hair Spa", price: 799, duration: 45 },
    { id: "aura-facial", name: "Facial", price: 999, duration: 60 },
  ],
  "demo-blush-bloom": [
    { id: "blush-cut", name: "Layer Cut", price: 399, duration: 40 },
    { id: "blush-color", name: "Hair Color", price: 1499, duration: 90 },
    { id: "blush-beauty", name: "Glow Facial", price: 1199, duration: 60 },
  ],
};

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

  return [];
};

export const getSalons = async () => {
  try {
    const response = await api.get("/api/salons");
    const salons = readList(response.data);
    return salons.length > 0 ? salons : DEMO_SALONS;
  } catch (error) {
    return DEMO_SALONS;
  }
};

export const getSalonServices = async (salonId) => {
  try {
    const response = await api.get(`/api/salons/${salonId}/services`);
    const services = readList(response.data);
    return services.length > 0 ? services : DEMO_SERVICES_BY_SALON[salonId] || [];
  } catch (error) {
    return DEMO_SERVICES_BY_SALON[salonId] || [];
  }
};
