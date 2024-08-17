import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Timer from "./Timer";
import { AuthUtils } from "../utils/AuthUtils";
import { BiLogOut } from "react-icons/bi";
import { AlertUtils } from "../utils/AlertUtils";
import { useGlobalContext } from "../../context";

const Sidebar = () => {
    const { confirmModal } = useGlobalContext();
    const location = useLocation();
    const currentUrl = location.pathname;
    const navigate = useNavigate();

    const handleLogout = () => {
        confirmModal.showConfirm("로그아웃하시겠습니까?", () => {
            AuthUtils.removeAuthItems();
            AlertUtils.showSuccess("로그아웃되었습니다.", () =>
                navigate("/METLG04")
            );
        });
    };

    return (
        <aside className="flex flex-col h-screen bg-gray-900 text-white w-64">
            <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 p-6 mb-3 rounded-lg shadow-lg mx-3 mt-3">
                <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 mb-3">
                        {AuthUtils.getUsername()}님 안녕하세요
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                        <Timer />
                    </div>
                </div>
                <div
                    className="flex items-center justify-center bg-gray-800 text-white py-3 px-5 rounded-full mt-4 cursor-pointer shadow hover:shadow-lg hover:bg-gray-700 transition duration-300"
                    onClick={handleLogout}
                >
                    <BiLogOut className="text-base mr-3" />
                    <span className="text-base font-medium">로그아웃</span>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
                <div className="text-lg font-semibold text-gray-200 mb-4 mt-4">
                    도메인
                </div>
                <ul className="space-y-2">
                    <li>
                        <Link
                            to="/METDM01"
                            className={`block py-2 px-4 rounded-sm transition-colors duration-200 hover:bg-gray-800 ${
                                currentUrl === "/METDM01" ? "bg-gray-800" : ""
                            }`}
                        >
                            도메인생성
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/METDM03"
                            className={`block py-2 px-4 rounded-sm transition-colors duration-200 hover:bg-gray-800 ${
                                currentUrl === "/METDM03" ? "bg-gray-800" : ""
                            }`}
                        >
                            도메인조회
                        </Link>
                    </li>
                </ul>
                <div className="text-lg font-semibold text-gray-200 mb-4 mt-6">
                    용어
                </div>
                <ul className="space-y-2">
                    <li>
                        <Link
                            to="/METTM01"
                            className={`block py-2 px-4 rounded-sm transition-colors duration-200 hover:bg-gray-800 ${
                                currentUrl === "/METTM01" ? "bg-gray-800" : ""
                            }`}
                        >
                            용어생성
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/METTM03"
                            className={`block py-2 px-4 rounded-sm transition-colors duration-200 hover:bg-gray-800 ${
                                currentUrl === "/METTM03" ? "bg-gray-800" : ""
                            }`}
                        >
                            용어조회
                        </Link>
                    </li>
                </ul>
                <div className="text-lg font-semibold text-gray-200 mb-4 mt-6">
                    스키마
                </div>
                <ul className="space-y-2">
                    <li>
                        <Link
                            to="/METSC02"
                            className={`block py-2 px-4 rounded-sm transition-colors duration-200 hover:bg-gray-800 ${
                                currentUrl === "/METSC02" ? "bg-gray-800" : ""
                            }`}
                        >
                            스키마생성
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/METTB02"
                            className={`block py-2 px-4 rounded-sm transition-colors duration-200 hover:bg-gray-800 ${
                                currentUrl === "/METTB02" ? "bg-gray-800" : ""
                            }`}
                        >
                            테이블생성
                        </Link>
                    </li>
                </ul>
                <div className="text-lg font-semibold text-gray-200 mb-4 mt-6">
                    DB오브젝트관리
                </div>
                <ul className="space-y-2">
                    <li>
                        <Link
                            to="/METTB01"
                            className={`block py-2 px-4 rounded-sm transition-colors duration-200 hover:bg-gray-800 ${
                                currentUrl === "/METTB01" ? "bg-gray-800" : ""
                            }`}
                        >
                            테이블조회
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/METCU01"
                            className={`block py-2 px-4 rounded-sm transition-colors duration-200 hover:bg-gray-800 ${
                                currentUrl === "/METCU01" ? "bg-gray-800" : ""
                            }`}
                        >
                            컬럼조회
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/METSE01"
                            className={`block py-2 px-4 rounded-sm transition-colors duration-200 hover:bg-gray-800 ${
                                currentUrl === "/METSE01" ? "bg-gray-800" : ""
                            }`}
                        >
                            시퀀스조회
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
