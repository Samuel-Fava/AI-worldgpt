import axios from "axios"

export const aipRoute = () => {
    return axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        },
    });
}