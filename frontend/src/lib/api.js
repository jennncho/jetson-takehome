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
// Function to get overview data
export const getOverview = async (params) => {
    try {
        const response = await api.get("/overview", { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching overview data:", error);
        throw error;
    }
};

export const getTopTenEmployees = async (params) => {
    try {
        const response = await api.get("/overview/top-employees", { params });
        console.log("Top ten employees response HITTING:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching top ten employees:", error);
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
