import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../../context";
import $ from "jquery";
import { useEffect, useState } from "react";
import { CmmnUtils } from "../../../cmmn/utils/CmmnUtils";
import { AlertUtils } from "../../../cmmn/utils/AlertUtils";
import { LogUtils } from "../../../cmmn/utils/LogUtils";
import { RefreshCcw, Search } from "lucide-react";
import { StringUtils } from "../../../cmmn/utils/StringUtils";

const TermReg = () => {
    /** 전역상태 */
    const { confirmModal } = useGlobalContext();

    /** 검색모달맵 */
    const [searchModalMap, setSearchModalMap] = useState({
        isOpen: false,
        searchInput: "",
        searchResults: [],
        selectedItem: {},
    });

    /** 등록맵 */
    const [regMap, setRegMap] = useState({
        domainSno: "",
        domainName: "",
        termName: "",
        termCamelName: "",
        termSnakeName: "",
    });

    const navigate = useNavigate();

    /**
     * @function handleRegister
     * @desc 용어 등록요청
     * @returns
     */
    const handleRegister = () => {
        // 필수값 입력체크
        var fieldList = [];
        $("#main input.form-input, #main select.form-select").each(function () {
            var fieldLabel = $(this).siblings("label").text();
            var fieldValue = $(this).val();
            var fieldObj = { label: fieldLabel, value: fieldValue };
            fieldList.push(fieldObj);
        });
        if (!AlertUtils.checkRequiredFields(fieldList)) {
            return;
        }
        confirmModal.showConfirm("등록하시겠습니까?", function () {
            CmmnUtils.axios
                .post(
                    CmmnUtils.url("METTM02"),
                    CmmnUtils.requestBody({ ...regMap })
                )
                .then((response) => {
                    let header = CmmnUtils.header(response);
                    if (header.status === "0000") {
                        AlertUtils.showSuccess("등록되었습니다", () =>
                            navigate("/METTM03")
                        );
                    } else {
                        AlertUtils.showError(header.errorMsg);
                    }
                })
                .catch((error) => {
                    LogUtils.debug(error.toString());
                });
        });
    };

    /**
     * @function handleResetDomain
     * @desc 도메인리셋
     */
    const handleResetDomain = () => {
        setRegMap({ ...regMap, domainSno: "", domainName: "" });
        setSearchModalMap({ ...searchModalMap, selectedItem: {} });
    };

    /**
     * @function handleSearchModal
     * @desc 도메인검색
     */
    const handleSearchModal = () => {
        CmmnUtils.axios
            .post(
                CmmnUtils.url("METDM04"),
                CmmnUtils.requestBody({
                    domainName: searchModalMap.searchInput,
                })
            )
            .then((response) => {
                let header = CmmnUtils.header(response);
                if (header.status === "0000") {
                    let body = CmmnUtils.body(response);
                    setSearchModalMap({
                        ...searchModalMap,
                        searchResults: [],
                    });

                    if (body.count == "0") {
                        AlertUtils.showInfo("조회된 내용이 없습니다.");
                    } else {
                        setSearchModalMap({
                            ...searchModalMap,
                            searchResults: body.domainScInfoList,
                        });
                    }
                } else {
                    AlertUtils.showError(header.errorMsg);
                }
            })
            .catch((error) => {
                LogUtils.debug(error.toString());
            });
    };

    /**
     * @function handleOpenModal
     * @desc 검색모달열림
     */
    const handleOpenModal = () => {
        setSearchModalMap({
            ...searchModalMap,
            isOpen: true,
            searchInput: "",
            searchResults: [],
            selectedItem: {},
        });
    };

    /**
     * @function handleConfirmModal
     * @desc 검색모달확인
     */
    const handleConfirmModal = () => {
        setSearchModalMap({
            ...searchModalMap,
            isOpen: false,
        });
        if (searchModalMap.selectedItem.domainSno) {
            setRegMap({
                ...regMap,
                domainSno: searchModalMap.selectedItem.domainSno,
                domainName: searchModalMap.selectedItem.domainName,
            });
        }
    };

    /**
     * @function handleCloseModal
     * @desc 검색모달닫힘
     */
    const handleCloseModal = () => {
        setSearchModalMap({
            ...searchModalMap,
            isOpen: false,
        });
    };

    /** 초기조회 */
    useEffect(() => {
        CmmnUtils.setTitle("용어 생성");
    }, []);
    return (
        <>
            <main id="main" className="container mx-auto mt-5">
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h5 className="text-xl mb-4">용어 생성</h5>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        <div>
                            <div className="text-right">
                                <button
                                    id="btnSearchDomain"
                                    onClick={handleOpenModal}
                                >
                                    <Search className="h-4 w-4 text-gray-500" />
                                </button>
                                <button
                                    id="btnResetDomain"
                                    className="ml-4"
                                    onClick={handleResetDomain}
                                >
                                    <RefreshCcw className="h-4 w-4 text-gray-500" />
                                </button>
                            </div>

                            <label
                                htmlFor="domainName"
                                className="block text-sm font-medium text-gray-700"
                            >
                                도메인명
                            </label>
                            <input
                                type="text"
                                className="form-input mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                id="domainName"
                                name="domainName"
                                value={regMap.domainName}
                                onChange={(e) =>
                                    setRegMap({
                                        ...regMap,
                                        domainName:
                                            e.target.value.toUpperCase(),
                                    })
                                }
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        <div>
                            <label
                                htmlFor="termName"
                                className="block text-sm font-medium text-gray-700"
                            >
                                용어명
                            </label>
                            <input
                                type="text"
                                className="form-input mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                id="termName"
                                name="termName"
                                value={regMap.termName}
                                onChange={(e) =>
                                    setRegMap({
                                        ...regMap,
                                        termName: e.target.value.toUpperCase(),
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="termCamelName"
                                className="block text-sm font-medium text-gray-700"
                            >
                                용어카멜명
                            </label>
                            <input
                                type="text"
                                className="form-input mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                id="termCamelName"
                                name="termCamelName"
                                value={regMap.termCamelName}
                                onChange={(e) =>
                                    setRegMap({
                                        ...regMap,
                                        termCamelName:
                                            e.target.value
                                                .charAt(0)
                                                .toLowerCase() +
                                            e.target.value.slice(1),
                                        termSnakeName: StringUtils.camel2Snake(
                                            e.target.value
                                        ),
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="termSnakeName"
                                className="block text-sm font-medium text-gray-700"
                            >
                                용어스네이크명
                            </label>
                            <input
                                type="text"
                                className="form-input mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                id="termSnakeName"
                                name="termSnakeName"
                                value={regMap.termSnakeName}
                                onChange={(e) =>
                                    setRegMap({
                                        ...regMap,
                                        termSnakeName:
                                            e.target.value.toUpperCase(),
                                    })
                                }
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            onClick={handleRegister}
                        >
                            등록
                        </button>
                        <button
                            type="button"
                            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                            onClick={() => navigate("/METDM03")}
                        >
                            목록
                        </button>
                    </div>
                </div>
            </main>
            <div
                className={`fixed inset-0 z-50 overflow-y-auto ${
                    searchModalMap.isOpen ? "block" : "hidden"
                }`}
                aria-labelledby="searchModalLabel"
                aria-hidden={!searchModalMap.isOpen}
            >
                <div className="flex items-center justify-center min-h-screen">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h5
                                className="text-lg font-medium"
                                id="searchModalLabel"
                            >
                                도메인 검색
                            </h5>
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={handleCloseModal}
                                aria-label="Close"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-4">
                            <input
                                type="text"
                                className="form-input mb-5 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                id="searchInput"
                                placeholder="검색어를 입력하세요"
                                value={searchModalMap.searchInput}
                                onChange={(e) =>
                                    setSearchModalMap({
                                        ...searchModalMap,
                                        searchInput:
                                            e.target.value.toUpperCase(),
                                    })
                                }
                            />
                            <div className="flex justify-end mb-3">
                                <button
                                    type="button"
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                    id="btnSearchResults"
                                    onClick={handleSearchModal}
                                >
                                    검색
                                </button>
                            </div>
                            <ul
                                className="list-disc list-inside space-y-2"
                                id="searchResults"
                            >
                                {searchModalMap.searchResults.map((item) => {
                                    return (
                                        <li
                                            key={item.domainSno}
                                            className={`p-1 bg-gray-50 rounded flex justify-between items-center ${
                                                searchModalMap.selectedItem
                                                    .domainSno ===
                                                item.domainSno
                                                    ? "selected"
                                                    : ""
                                            }`}
                                        >
                                            <span className="searchResult">
                                                <span className="domainSno text-base font-normal ml-2">
                                                    {item.domainSno}
                                                </span>
                                                <span className="domainName text-base font-normal ml-2">
                                                    {item.domainName}
                                                </span>
                                                <span className="domainType text-base font-normal ml-2">
                                                    {item.domainType}
                                                </span>
                                            </span>
                                            <button
                                                type="button"
                                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                                onClick={() =>
                                                    setSearchModalMap({
                                                        ...searchModalMap,
                                                        selectedItem: item,
                                                    })
                                                }
                                            >
                                                선택
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div className="flex justify-end p-4 border-t">
                            <button
                                type="button"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                id="btnConfirmSelection"
                                onClick={handleConfirmModal}
                            >
                                확인
                            </button>
                            <button
                                type="button"
                                className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                onClick={handleCloseModal}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default TermReg;
