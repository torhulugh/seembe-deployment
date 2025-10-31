import axios from "axios";

const DEFAULT_BASE_URL = "https://torseembe.vercel.app/api";

const api = axios.create({
  baseURL: DEFAULT_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const unauthorizedListeners = new Set();

const registerUnauthorizedHandler = (handler) => {
  unauthorizedListeners.add(handler);
  return () => unauthorizedListeners.delete(handler);
};

const normalizeError = (error) => {
  const message =
    error?.response?.data?.message || error.message || "Unexpected error";
  const normalized = new Error(message);

  normalized.status = error?.response?.status;
  normalized.data = error?.response?.data;

  return normalized;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      unauthorizedListeners.forEach((listener) => {
        try {
          listener();
        } catch (listenerError) {
          console.error("Unauthorized listener failed", listenerError);
        }
      });
    }

    return Promise.reject(normalizeError(error));
  }
);

// Auth
export const loginRequest = (payload) =>
  api.post("/auth/login", payload).then((res) => res.data);

export const registerRequest = (payload) =>
  api.post("/auth/register", payload).then((res) => res.data);

export const logoutRequest = () => api.get("/auth/logout");

// Celebrants
export const fetchCelebrants = () =>
  api.get("/celebrants").then((res) => res.data);

export const createCelebrantRequest = (payload) =>
  api.post("/celebrants", payload).then((res) => res.data);

export const updateCelebrantRequest = (celebrantId, payload) =>
  api.put(`/celebrants/${celebrantId}`, payload).then((res) => res.data);

export const deleteCelebrantRequest = (celebrantId) =>
  api.delete(`/celebrants/${celebrantId}`).then((res) => res.data);

// Events
export const fetchEvents = () => api.get("/events").then((res) => res.data);

export const createEventRequest = (payload) =>
  api.post("/events", payload).then((res) => res.data);

export const updateEventRequest = (eventId, payload) =>
  api.put(`/events/${eventId}`, payload).then((res) => res.data);

export const deleteEventRequest = (eventId) =>
  api.delete(`/events/${eventId}`).then((res) => res.data);

// Messages
export const fetchMessagesByEvent = (eventId) =>
  api.get(`/messages/event/${eventId}`).then((res) => res.data);

export const createMessageRequest = (eventId, payload) =>
  api.post(`/messages/event/${eventId}`, payload).then((res) => res.data);

export const updateMessageRequest = (messageId, payload) =>
  api.put(`/messages/${messageId}`, payload).then((res) => res.data);

export const deleteMessageRequest = (messageId) =>
  api.delete(`/messages/${messageId}`).then((res) => res.data);

export { registerUnauthorizedHandler };

export default api;
