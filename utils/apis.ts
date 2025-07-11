import axios from "axios"

export const aipRoute = () => {
    return axios.create({
        baseURL: "https://worldgpt.up.railway.app",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        },
    });
}