import { useEffect } from "react";
import { CmmnUtils } from "../utils/CmmnUtils";
import { LogUtils } from "../utils/LogUtils";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthUtils } from "../utils/AuthUtils";
import Layout from "./Layout";
import { AlertUtils } from "../utils/AlertUtils";

const PrivateRoute = ({ element: Element, ...rest }) => {
    const navigate = useNavigate();

    // 초기 조회
    useEffect(() => {
        if (AuthUtils.isAuthenticated()) {
            CmmnUtils.axios
                .get(CmmnUtils.url("METLG06"), CmmnUtils.requestParam({}))
                .then((response) => {
                    let header = CmmnUtils.header(response);
                    if (header.status === "0000") {
                        let body = CmmnUtils.body(response);
                        if (header.auth.authenticatedYn === "1") {
                            AuthUtils.setAuthItems(header);
                        } else {
                            AuthUtils.removeAuthItems();
                        }
                    } else {
                        AuthUtils.removeAuthItems();
                        AlertUtils.showError(header.errorMsg);
                    }
                })
                .catch((error) => {
                    AuthUtils.removeAuthItems();
                    LogUtils.debug(error.toString());
                    AlertUtils.showError("로그인 시간이 만료되었습니다", () =>
                        navigate("/METLG04")
                    );
                });
        }
    }, []);

    if (AuthUtils.isAuthenticated()) {
        return (
            <Layout>
                <Element {...rest} />
            </Layout>
        );
    } else {
        AuthUtils.removeAuthItems();
        AlertUtils.showError("로그인 시간이 만료되었습니다", () =>
            navigate("/METLG04")
        );
    }
};

export default PrivateRoute;
