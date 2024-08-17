import { LogUtils } from "./LogUtils";

export class AuthUtils {
    static removeAuthItems() {
        LogUtils.trace("removeAuthItems");
        localStorage.removeItem("authenticatedYn");
        localStorage.removeItem("authCode");
        localStorage.removeItem("authCodeName");
        localStorage.removeItem("authorizedYn");
        localStorage.removeItem("username");
        localStorage.removeItem("authList");
        localStorage.removeItem("jwtToken");
    }

    static setAuthItems(header) {
        localStorage.setItem(
            "authenticatedYn",
            header.auth?.authenticatedYn || "0"
        );
        localStorage.setItem("authCode", header.auth?.authCode || "");
        localStorage.setItem("authCodeName", header.auth?.authCodeName || "");
        localStorage.setItem("authorizedYn", header.auth?.authorizedYn || "0");
        localStorage.setItem("username", header.auth?.username || "");
        localStorage.setItem("authList", header.auth?.authList || []);
    }

    static isAuthenticated() {
        return (
            localStorage.getItem("jwtToken") &&
            localStorage.getItem("authenticatedYn") === "1"
        );
    }

    static getUsername() {
        return localStorage.getItem("username");
    }
}
