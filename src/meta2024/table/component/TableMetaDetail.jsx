import React, { useEffect, useState } from "react";
import { CmmnUtils } from "../../../cmmn/utils/CmmnUtils";
import { nanoid } from "nanoid/non-secure";
import $ from "jquery";
import { AlertUtils } from "../../../cmmn/utils/AlertUtils";
import { useNavigate } from "react-router-dom";
import { LogUtils } from "../../../cmmn/utils/LogUtils";
import { useGlobalContext } from "../../../context";
import { StringUtils } from "../../../cmmn/utils/StringUtils";
import { RefreshCcw, Search } from "lucide-react";

const TableMetaDetail = () => {
    /** 전역상태 */
    const { confirmModal } = useGlobalContext();

    /** detailMap */
    const [detailMap, setDetailMap] = useState({
        tableMetaSno: "",
        schemaName: "",
        tableName: "",
        tableDesc: "",
    });
    /** pk목록 */
    const [pkColumns, setPkColumns] = useState([]);
    /** 컬럼목록 */
    const [columns, setColumns] = useState([]);

    /** 검색모달맵 */
    const [searchModalMap, setSearchModalMap] = useState({
        isOpen: false,
        pkColumnYn: "",
        columnMetaSno: "",
        searchInput: "",
        searchResults: [],
        selectedItem: {},
    });

    const navigate = useNavigate();

    /** 초기조회 */
    useEffect(() => {
        CmmnUtils.setTitle("테이블 상세");

        const queryParams = new URLSearchParams(location.search);

        const theTableMetaSno = queryParams.get("tableMetaSno");

        let requsetMap = {
            tableMetaSno: theTableMetaSno,
        };

        CmmnUtils.axios
            .get(CmmnUtils.url("METTB03"), CmmnUtils.requestParam(requsetMap))
            .then((response) => {
                let header = CmmnUtils.header(response);
                if (header.status === "0000") {
                    let body = CmmnUtils.body(response);
                    let detail = body.detail;

                    setDetailMap({
                        ...detailMap,
                        tableMetaSno: detail.tableMetaInfo.tableMetaSno,
                        schemaName: detail.tableMetaInfo.schemaName,
                        tableName: detail.tableMetaInfo.tableName,
                        tableDesc: detail.tableMetaInfo.tableDesc,
                    });

                    let thePkColumns = [];
                    let theColumns = [];
                    detail.tableColumnList.forEach((item) => {
                        if (item.pkColumnYn === "1") {
                            thePkColumns.push({
                                columnMetaSno: item.columnMetaSno,
                                columnName: item.columnName,
                                columnCamelName: item.columnCamelName,
                                columnSnakeName: item.columnSnakeName,
                                columnType: item.columnType,
                            });
                        } else if (
                            item.pkColumnYn === "0" &&
                            item.sysColumnYn === "0"
                        ) {
                            theColumns.push({
                                columnMetaSno: item.columnMetaSno,
                                columnName: item.columnName,
                                columnCamelName: item.columnCamelName,
                                columnSnakeName: item.columnSnakeName,
                                columnType: item.columnType,
                            });
                        }
                    });
                    setPkColumns(thePkColumns);
                    setColumns(theColumns);
                } else {
                    AlertUtils.showError(header.errorMsg);
                }
            })
            .catch((error) => {
                LogUtils.debug(error.toString());
            });
    }, []);

    /**
     * @function handleAddColumn
     * @desc 컬럼 추가
     */
    const handleAddColumn = (pkColumnYn) => {
        if (pkColumnYn === "1") {
            setPkColumns([
                ...pkColumns,
                {
                    id: nanoid(),
                    columnName: "",
                    columnCamelName: "",
                    columnSnakeName: "",
                    columnType: "",
                },
            ]);
        } else {
            setColumns([
                ...columns,
                {
                    id: nanoid(),
                    columnName: "",
                    columnCamelName: "",
                    columnSnakeName: "",
                    columnType: "",
                },
            ]);
        }
    };

    /**
     * @function handleColumnInputChange
     * @desc 컬럼인풋변경
     * @param {string} pkColumnYn
     * @param {string} columnMetaSno
     * @param {string} fieldName
     * @param {string} value
     */
    const handleColumnInputChange = (
        pkColumnYn,
        columnMetaSno,
        fieldName,
        value
    ) => {
        if (pkColumnYn === "1") {
            const thePkColumns = [...pkColumns];
            thePkColumns.forEach((item) => {
                if (item.columnMetaSno === columnMetaSno) {
                    if (fieldName === "columnCamelName") {
                        item[fieldName] =
                            value.charAt(0).toLowerCase() + value.slice(1);
                        item["columnSnakeName"] =
                            StringUtils.camel2Snake(value);
                    } else {
                        item[fieldName] = value;
                    }
                }
            });

            setPkColumns(thePkColumns);
        } else {
            const theColumns = [...columns];
            theColumns.forEach((item) => {
                if (item.columnMetaSno === columnMetaSno) {
                    if (fieldName === "columnCamelName") {
                        item[fieldName] =
                            value.charAt(0).toLowerCase() + value.slice(1);
                        item["columnSnakeName"] =
                            StringUtils.camel2Snake(value);
                    } else {
                        item[fieldName] = value;
                    }
                }
            });

            setColumns(theColumns);
        }
    };

    /**
     * @function handleRemoveColumn
     * @desc 컬럼 삭제
     * @param {string} pkColumnYn
     * @param {string} columnMetaSno
     */
    const handleRemoveColumn = (pkColumnYn, columnMetaSno) => {
        if (pkColumnYn === "1") {
            const thePkColumns = [...pkColumns];
            const removedPkColumns = thePkColumns.filter(
                (item) => item.columnMetaSno !== columnMetaSno
            );
            setPkColumns(removedPkColumns);
        } else {
            const theColumns = [...columns];
            const removedColumns = theColumns.filter(
                (item) => item.columnMetaSno !== columnMetaSno
            );
            setColumns(removedColumns);
        }
    };

    /**
     * @function handleModify
     * @desc 테이블 수정요청
     * @returns
     */
    const handleModify = () => {
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
        confirmModal.showConfirm("수정하시겠습니까?", function () {
            let requestMap = {
                tableMetaSno: detailMap.tableMetaSno,
                tableDesc: detailMap.tableDesc,
                columnList: columns,
                pkColumnList: pkColumns,
            };
            CmmnUtils.axios
                .post(
                    CmmnUtils.url("METTB06"),
                    CmmnUtils.requestBody(requestMap)
                )
                .then((response) => {
                    let header = CmmnUtils.header(response);
                    if (header.status === "0000") {
                        AlertUtils.showSuccess("수정되었습니다", () =>
                            navigate("/METTB01")
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
     * @function handleResetColumn
     * @desc 컬럼리셋
     */
    const handleResetColumn = (pkColumnYn, columnMetaSno) => {
        if (pkColumnYn === "1") {
            const thePkColumns = [...pkColumns];
            thePkColumns.forEach((item) => {
                if (item.columnMetaSno === columnMetaSno) {
                    item.columnName = "";
                    item.columnCamelName = "";
                    item.columnSnakeName = "";
                    item.columnType = "";
                }
            });

            setPkColumns(thePkColumns);
        } else {
            const theColumns = [...columns];
            theColumns.forEach((item) => {
                if (item.columnMetaSno === columnMetaSno) {
                    item.columnName = "";
                    item.columnCamelName = "";
                    item.columnSnakeName = "";
                    item.columnType = "";
                }
            });

            setColumns(theColumns);
        }

        setSearchModalMap({
            ...searchModalMap,
            pkColumnYn: "",
            selectedItem: {},
        });
    };
    /**
     * @function handleSearchModal
     * @desc 용어검색
     */
    const handleSearchModal = () => {
        CmmnUtils.axios
            .post(
                CmmnUtils.url("METTM04"),
                CmmnUtils.requestBody({
                    termName: searchModalMap.searchInput,
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
                            searchResults: body.termScInfoList,
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
     * @param {string} pkColumnYn
     * @param {string} columnMetaSno
     * @desc 검색모달열림
     */
    const handleOpenModal = (pkColumnYn, columnMetaSno) => {
        setSearchModalMap({
            ...searchModalMap,
            isOpen: true,
            pkColumnYn: pkColumnYn,
            columnMetaSno: columnMetaSno,
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

        if (searchModalMap.pkColumnYn === "1") {
            const thePkColumns = [...pkColumns];
            thePkColumns.forEach((item) => {
                if (item.columnMetaSno === searchModalMap.columnMetaSno) {
                    if (searchModalMap.selectedItem.termSno) {
                        item.termSno = searchModalMap.selectedItem.termSno;
                        item.columnName = searchModalMap.selectedItem.termName;
                        item.columnCamelName =
                            searchModalMap.selectedItem.termCamelName;
                        item.columnSnakeName =
                            searchModalMap.selectedItem.termSnakeName;
                        item.columnType =
                            searchModalMap.selectedItem.domainType;
                    }
                }
            });

            setPkColumns(thePkColumns);
        } else {
            const theColumns = [...columns];
            theColumns.forEach((item) => {
                if (item.columnMetaSno === searchModalMap.columnMetaSno) {
                    if (searchModalMap.selectedItem.termSno) {
                        item.termSno = searchModalMap.selectedItem.termSno;
                        item.columnName = searchModalMap.selectedItem.termName;
                        item.columnCamelName =
                            searchModalMap.selectedItem.termCamelName;
                        item.columnSnakeName =
                            searchModalMap.selectedItem.termSnakeName;
                        item.columnType =
                            searchModalMap.selectedItem.domainType;
                    }
                }
            });

            setColumns(theColumns);
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

    return (
        <>
            <main id="main" className="container mx-auto mt-5">
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h5 className="text-xl mb-4">테이블 생성</h5>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-5 mb-5">
                        <div>
                            <label
                                htmlFor="tableName"
                                className="block text-sm font-medium text-gray-700"
                            >
                                스키마명
                            </label>
                            <input
                                type="text"
                                className="form-input mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={detailMap.schemaName}
                                readOnly
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="tableName"
                                className="block text-sm font-medium text-gray-700"
                            >
                                테이블명
                            </label>
                            <input
                                type="text"
                                className="form-input mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={detailMap.tableName}
                                readOnly
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="tableDesc"
                                className="block text-sm font-medium text-gray-700"
                            >
                                테이블설명
                            </label>
                            <input
                                type="text"
                                className="form-input mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={detailMap.tableDesc}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <button
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            type="button"
                            onClick={() => handleAddColumn("1")}
                        >
                            + PK 컬럼 추가
                        </button>
                        <div>
                            {pkColumns.map((item) => (
                                <div key={item.columnMetaSno}>
                                    <div className="grid gap-6 md:grid-cols-5">
                                        <div className="flex justify-end">
                                            <button
                                                id="btnSearchDomain"
                                                onClick={() =>
                                                    handleOpenModal(
                                                        "1",
                                                        item.columnMetaSno
                                                    )
                                                }
                                                className="mr-2"
                                            >
                                                <Search className="h-4 w-4 text-gray-500" />
                                            </button>
                                            <button
                                                id="btnResetDomain"
                                                onClick={() =>
                                                    handleResetColumn(
                                                        "1",
                                                        item.columnMetaSno
                                                    )
                                                }
                                            >
                                                <RefreshCcw className="h-4 w-4 text-gray-500" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid gap-6 mb-6 md:grid-cols-5">
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium text-gray-900 dark:text-white">
                                                컬럼명
                                            </label>
                                            <input
                                                type="text"
                                                className="form-input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={item.columnName}
                                                onChange={(e) =>
                                                    handleColumnInputChange(
                                                        "1",
                                                        item.columnMetaSno,
                                                        "columnName",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium text-gray-900 dark:text-white">
                                                컬럼카멜명
                                            </label>
                                            <input
                                                type="text"
                                                className="form-input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={item.columnCamelName}
                                                onChange={(e) =>
                                                    handleColumnInputChange(
                                                        "1",
                                                        item.columnMetaSno,
                                                        "columnCamelName",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium text-gray-900 dark:text-white">
                                                컬럼스네이크명
                                            </label>
                                            <input
                                                type="text"
                                                className="form-input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={item.columnSnakeName}
                                                readOnly
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium text-gray-900 dark:text-white">
                                                컬럼타입
                                            </label>
                                            <input
                                                type="text"
                                                className="form-input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={item.columnType}
                                                onChange={(e) =>
                                                    handleColumnInputChange(
                                                        "1",
                                                        item.columnMetaSno,
                                                        "columnType",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <button
                                                type="button"
                                                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                                onClick={() =>
                                                    handleRemoveColumn(
                                                        "1",
                                                        item.columnMetaSno
                                                    )
                                                }
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4">
                        <button
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            type="button"
                            onClick={() => handleAddColumn("0")}
                        >
                            + 컬럼 추가
                        </button>
                        <div>
                            {columns.map((item) => (
                                <div key={item.columnMetaSno}>
                                    <div className="grid gap-6 md:grid-cols-5">
                                        <div className="flex justify-end">
                                            <button
                                                id="btnSearchDomain"
                                                onClick={() =>
                                                    handleOpenModal(
                                                        "0",
                                                        item.columnMetaSno
                                                    )
                                                }
                                                className="mr-2"
                                            >
                                                <Search className="h-4 w-4 text-gray-500" />
                                            </button>
                                            <button
                                                id="btnResetDomain"
                                                onClick={() =>
                                                    handleResetColumn(
                                                        "0",
                                                        item.columnMetaSno
                                                    )
                                                }
                                            >
                                                <RefreshCcw className="h-4 w-4 text-gray-500" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid gap-6 mb-6 md:grid-cols-5">
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium text-gray-900 dark:text-white">
                                                컬럼명
                                            </label>
                                            <input
                                                type="text"
                                                className="form-input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={item.columnName}
                                                onChange={(e) =>
                                                    handleColumnInputChange(
                                                        "0",
                                                        item.columnMetaSno,
                                                        "columnName",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium text-gray-900 dark:text-white">
                                                컬럼카멜명
                                            </label>
                                            <input
                                                type="text"
                                                className="form-input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={item.columnCamelName}
                                                onChange={(e) =>
                                                    handleColumnInputChange(
                                                        "0",
                                                        item.columnMetaSno,
                                                        "columnCamelName",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium text-gray-900 dark:text-white">
                                                컬럼스네이크명
                                            </label>
                                            <input
                                                type="text"
                                                className="form-input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={item.columnSnakeName}
                                                readOnly
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium text-gray-900 dark:text-white">
                                                컬럼타입
                                            </label>
                                            <input
                                                type="text"
                                                className="form-input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                value={item.columnType}
                                                onChange={(e) =>
                                                    handleColumnInputChange(
                                                        "0",
                                                        item.columnMetaSno,
                                                        "columnType",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <button
                                                type="button"
                                                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                                onClick={() =>
                                                    handleRemoveColumn(
                                                        "0",
                                                        item.columnMetaSno
                                                    )
                                                }
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            onClick={handleModify}
                        >
                            수정
                        </button>
                        <button
                            type="button"
                            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                            onClick={() => navigate("/METTB01")}
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
                                용어 검색
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
                                            key={item.termSno}
                                            className={`p-1 bg-gray-50 rounded flex justify-between items-center ${
                                                searchModalMap.selectedItem
                                                    .termSno === item.termSno
                                                    ? "selected"
                                                    : ""
                                            }`}
                                        >
                                            <span className="searchResult">
                                                <span className="termSno text-base font-normal ml-2">
                                                    {item.termSno}
                                                </span>
                                                <span className="termName text-base font-normal ml-2">
                                                    {item.termName}
                                                </span>
                                                <span className="termCamelName text-base font-normal ml-2">
                                                    {item.termCamelName}
                                                </span>
                                                <span className="termSnakeName text-base font-normal ml-2">
                                                    {item.termSnakeName}
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

export default TableMetaDetail;
