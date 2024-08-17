import axios from "axios";
import { LogUtils } from "./LogUtils";

const path = "http://localhost:8080/v2/";

export class CmmnUtils {
    static axios = axios.create({
        headers: { "Content-Type": "application/json" },
    });
    static url(url) {
        if (url.charAt(0) === "/") {
            url = url.substring(1);
        }
        LogUtils.trace(`[${url}]`);
        return path + url;
    }
    static outUrl(url) {
        LogUtils.trace(`[${url}]`);
        return url;
    }

    static requestParam(data) {
        LogUtils.trace("[@RequestParam]", data);
        return { params: data };
    }
    static requestBody(data) {
        LogUtils.trace("[@RequestBody]", { ...data });
        return { ...data };
    }

    static header(response) {
        if (response.data?.header.status === "0000") {
            LogUtils.trace("[정상응답]", response.data?.body);
        } else {
            LogUtils.trace("[실패응답]", response.data?.header.errorMsg);
        }
        return response.data?.header;
    }

    static body(response) {
        return response.data?.body;
    }

    static nvl(value, defaultValue) {
        if (typeof value === "boolean") {
            return value;
        }
        if (!value) {
            return defaultValue;
        }
        return value;
    }

    static setTitle(title) {
        document.title = `${title} | 메타관리시스템`;
    }
}

// 요청 인터셉터 추가
CmmnUtils.axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("jwtToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 추가
CmmnUtils.axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("jwtToken");
            window.location.href = "/METLG04";
        }
        return Promise.reject(error);
    }
);
