import axios from "axios"

export const aipRoute = () => {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return axios.create({
        baseURL: "https://worldgpt.up.railway.app",
        headers,
    });
}