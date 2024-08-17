import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CmmnUtils } from "../../cmmn/utils/CmmnUtils";
import { LogUtils } from "../../cmmn/utils/LogUtils";
import { AlertUtils } from "../../cmmn/utils/AlertUtils";
import { AuthUtils } from "../../cmmn/utils/AuthUtils";

const Login = () => {
    const [loginMap, setLoginMap] = useState({
        username:
            localStorage.getItem("rememberUsernameYn") === "1"
                ? CmmnUtils.nvl(localStorage.getItem("rememberUsername"), "")
                : "",
        password: "",
        rememberUsernameYn: CmmnUtils.nvl(
            localStorage.getItem("rememberUsernameYn"),
            "0"
        ),
    });
    const navigate = useNavigate();

    /** 초기조회 */
    useEffect(() => {
        CmmnUtils.setTitle("로그인");
    }, []);
    /**
     * @function handleLogin
     * @desc 로그인처리
     */
    const handleLogin = () => {
        let requestMap = {
            username: loginMap.username,
            password: loginMap.password,
        };

        CmmnUtils.axios
            .post(
                CmmnUtils.url("METLG05"),
                CmmnUtils.requestBody({
                    ...requestMap,
                })
            )
            .then((response) => {
                let header = CmmnUtils.header(response);
                if (header.status === "0000") {
                    let body = CmmnUtils.body(response);
                    AuthUtils.setAuthItems(header);
                    localStorage.setItem("jwtToken", body.jwtToken);

                    AlertUtils.showSuccess("인증되었습니다", () => {
                        navigate("/");
                    });
                } else {
                    AuthUtils.removeAuthItems();
                    AlertUtils.showError(header.errorMsg);
                }
            })
            .catch((error) => {
                AlertUtils.showError("잠시후 시도해주세요.");
                AuthUtils.removeAuthItems();
                LogUtils.debug(error.toString());
            });
    };

    return (
        <main className="min-h-screen flex items-center justify-center py-4 bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <div className="text-center mb-6">
                    <h5 className="text-xl font-bold mb-2">로그인</h5>
                    <p className="text-sm text-gray-600">
                        아이디와 비밀번호를 입력해주세요
                    </p>
                </div>

                <form className="space-y-4">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                        >
                            아이디
                        </label>
                        <div className="relative mt-1">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={loginMap.username}
                                onChange={(e) => {
                                    setLoginMap({
                                        ...loginMap,
                                        username: e.target.value,
                                    });
                                    if (loginMap.rememberUsernameYn === "1") {
                                        localStorage.setItem(
                                            "rememberUsername",
                                            e.target.value
                                        );
                                    }
                                }}
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            비밀번호
                        </label>
                        <div className="relative mt-1">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={loginMap.password}
                                onChange={(e) =>
                                    setLoginMap({
                                        ...loginMap,
                                        password: e.target.value,
                                    })
                                }
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="remember-me"
                            name="remember-me"
                            checked={loginMap.rememberUsernameYn === "1"}
                            onChange={(e) => {
                                let theRememberUsernameYn =
                                    loginMap.rememberUsernameYn === "1"
                                        ? "0"
                                        : "1";
                                setLoginMap({
                                    ...loginMap,
                                    rememberUsernameYn: theRememberUsernameYn,
                                });
                                localStorage.setItem(
                                    "rememberUsernameYn",
                                    theRememberUsernameYn
                                );
                                if (
                                    localStorage.getItem(
                                        "rememberUsernameYn"
                                    ) === "1"
                                ) {
                                    localStorage.setItem(
                                        "rememberUsername",
                                        loginMap.username
                                    );
                                }
                            }}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label
                            htmlFor="remember-me"
                            className="ml-2 block text-sm text-gray-900"
                        >
                            아이디 저장
                        </label>
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={handleLogin}
                            className="w-full py-2 px-4 bg-blue-500 text-white text-lg font-bold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            로그인
                        </button>
                    </div>

                    <div className="text-center text-sm text-gray-600 mt-4">
                        계정이 없으신가요?{" "}
                        <a href="/" className="text-blue-500 hover:underline">
                            계정만들기
                        </a>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Login;
