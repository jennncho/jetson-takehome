import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

export const getEmployees = async (params) => {
    try {
        const response = await api.get("/overview/employees", { params });
        console.log("Employees response HITTING:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching top ten employees:", error);
        throw error;
    }
};

export const getHoursMetrics = async (params) => {
    try {
        console.log("Params being sent:", params); // Add this line
        const response = await api.get("/overview/hours-metrics", { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching overview data:", error);
        console.error("Error details:", error.response?.data); // Add this line
        throw error;
    }
};

export const getPTOMetrics = async (params) => {
    try {
        const response = await api.get("/overview/pto-metrics", { params });
        console.log("PTO metrics HITTING:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching PTO metrics:", error);
        throw error;
    }
};

export const getDepartments = async () => {
    try {
        const response = await api.get("/departments");
        return response.data;
    } catch (error) {
        console.error("Error fetching departments:", error);
        throw error;
    }
};
