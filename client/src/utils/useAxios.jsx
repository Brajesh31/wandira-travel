import axios from "axios";
import { useAuth } from "../contexts/shared/Auth";


const useAxios = () => {
    const { token, settoken } = useAuth();

    const axiosInstance = axios.create({
        baseURL: "https://wandria-server-production.up.railway.app",
        // timeout: 20000,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        withCredentials: true,
    });

    axiosInstance.interceptors.request.use(
        (config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const refresh = await axios.get("https://wandria-server-production.up.railway.app/api/refresh", { withCredentials: true });

                    const newToken = refresh.data.newAccessToken;
                    settoken(refresh.data.newAccessToken);

                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return axiosInstance(originalRequest);
                } catch (error) {
                    return Promise.reject(error);
                }
            }

            return Promise.reject(error);
        }
    );

    return axiosInstance;
}

export default useAxios
