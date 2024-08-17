import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../../context";
import $ from "jquery";
import { useEffect, useState } from "react";
import { CmmnUtils } from "../../../cmmn/utils/CmmnUtils";
import { AlertUtils } from "../../../cmmn/utils/AlertUtils";
import { LogUtils } from "../../../cmmn/utils/LogUtils";
import { StringUtils } from "../../../cmmn/utils/StringUtils";

const ColumnMetaDetail = () => {
    /** 전역상태 */
    const { confirmModal } = useGlobalContext();
    /** detailMap */
    const [detailMap, setDetailMap] = useState({
        tableMetaSno: "",
        columnMetaSno: "",
        columnName: "",
        schemaName: "",
        tableName: "",
        tableDesc: "",
        columnCamelName: "",
        columnSnakeName: "",
    });

    const navigate = useNavigate();

    /**
     * @function handleModify
     * @desc 컬럼 수정요청
     * @returns
     */
    const handleModify = () => {
        // 필수값 입력체크
        var fieldList = [];
        $("input.form-input, select.form-select").each(function () {
            var fieldLabel = $(this).siblings("label").text();
            var fieldValue = $(this).val();
            var fieldObj = { label: fieldLabel, value: fieldValue };
            fieldList.push(fieldObj);
        });
        if (!AlertUtils.checkRequiredFields(fieldList)) {
            return;
        }
        confirmModal.showConfirm("수정하시겠습니까?", function () {
            CmmnUtils.axios
                .post(
                    CmmnUtils.url("METCU03"),
                    CmmnUtils.requestBody(detailMap)
                )
                .then((response) => {
                    let header = CmmnUtils.header(response);
                    if (header.status === "0000") {
                        AlertUtils.showSuccess2("수정되었습니다", () => {
                            window.location.reload();
                        });
                    } else {
                        AlertUtils.showError(header.errorMsg);
                    }
                })
                .catch((error) => {
                    LogUtils.debug(error.toString());
                });
        });
    };

    /** 초기조회 */
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);

        const theTableMetaSno = queryParams.get("tableMetaSno");
        const theColumnMetaSno = queryParams.get("columnMetaSno");

        let requsetMap = {
            tableMetaSno: theTableMetaSno,
            columnMetaSno: theColumnMetaSno,
        };
        CmmnUtils.axios
            .get(CmmnUtils.url("METCU02"), CmmnUtils.requestParam(requsetMap))
            .then((response) => {
                let header = CmmnUtils.header(response);
                if (header.status === "0000") {
                    let body = CmmnUtils.body(response);

                    let columnMetaInfo = body.columnMetaInfo;

                    setDetailMap(columnMetaInfo);
                    CmmnUtils.setTitle(columnMetaInfo.columnName);
                } else {
                    AlertUtils.showError(header.errorMsg);
                }
            })
            .catch((error) => {
                LogUtils.debug(error.toString());
            });
    }, []);

    return (
        <main className="container mx-auto mt-5">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h5 className="text-xl mb-4">컬럼수정</h5>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label
                            htmlFor="columnName"
                            className="block text-sm font-medium text-gray-700"
                        >
                            컬럼명
                        </label>
                        <input
                            type="text"
                            className="form-input mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            id="columnName"
                            name="columnName"
                            value={detailMap.columnName}
                            onChange={(e) =>
                                setDetailMap({
                                    ...detailMap,
                                    columnName: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                        <label
                            htmlFor="schemaName"
                            className="block text-sm font-medium text-gray-700"
                        >
                            스키마명
                        </label>
                        <input
                            type="text"
                            className="form-input mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            id="schemaName"
                            name="schemaName"
                            value={detailMap.schemaName}
                            readOnly
                            onChange={(e) =>
                                setDetailMap({
                                    ...detailMap,
                                    schemaName: e.target.value,
                                })
                            }
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
                            className="form-input mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            id="tableName"
                            name="tableName"
                            value={detailMap.tableName}
                            readOnly
                            onChange={(e) =>
                                setDetailMap({
                                    ...detailMap,
                                    tableName: e.target.value,
                                })
                            }
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
                            className="form-input mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            id="tableDesc"
                            name="tableDesc"
                            value={detailMap.tableDesc}
                            readOnly
                            onChange={(e) =>
                                setDetailMap({
                                    ...detailMap,
                                    tableDesc: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                        <label
                            htmlFor="columnCamelName"
                            className="block text-sm font-medium text-gray-700"
                        >
                            컬럼카멜명
                        </label>
                        <input
                            type="text"
                            className="form-input mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            id="columnCamelName"
                            name="columnCamelName"
                            value={detailMap.columnCamelName}
                            onChange={(e) =>
                                setDetailMap({
                                    ...detailMap,
                                    columnCamelName: e.target.value,
                                    columnSnakeName: StringUtils.camel2Snake(
                                        e.target.value
                                    ),
                                })
                            }
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="columnSnakeName"
                            className="block text-sm font-medium text-gray-700"
                        >
                            컬럼스네이크명
                        </label>
                        <input
                            type="text"
                            className="form-input mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            id="columnSnakeName"
                            name="columnSnakeName"
                            readOnly
                            value={detailMap.columnSnakeName}
                            onChange={(e) =>
                                setDetailMap({
                                    ...detailMap,
                                    columnSnakeName: e.target.value,
                                })
                            }
                        />
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
                        onClick={() => navigate("/METCU01")}
                    >
                        목록
                    </button>
                </div>
            </div>
        </main>
    );
};
export default ColumnMetaDetail;
