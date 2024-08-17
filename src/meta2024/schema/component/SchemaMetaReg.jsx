import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../../context";
import $ from "jquery";
import { useEffect, useState } from "react";
import { CmmnUtils } from "../../../cmmn/utils/CmmnUtils";
import { AlertUtils } from "../../../cmmn/utils/AlertUtils";
import { LogUtils } from "../../../cmmn/utils/LogUtils";

const SchemaMetaReg = () => {
    /** 전역상태 */
    const { confirmModal } = useGlobalContext();

    /** 스키마명 */
    const [schemaName, setSchemaName] = useState("");

    const navigate = useNavigate();

    /**
     * @function handleRegister
     * @desc 스키마 등록요청
     * @returns
     */
    const handleRegister = () => {
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
        confirmModal.showConfirm("등록하시겠습니까?", function () {
            let requestMap = {
                schemaName: schemaName,
            };
            CmmnUtils.axios
                .post(
                    CmmnUtils.url("METSC04"),
                    CmmnUtils.requestBody(requestMap)
                )
                .then((response) => {
                    let header = CmmnUtils.header(response);
                    if (header.status === "0000") {
                        AlertUtils.showSuccess("등록되었습니다", () =>
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

    /** 초기조회 */
    useEffect(() => {
        CmmnUtils.setTitle("스키마 생성");
    }, []);
    return (
        <main className="container mx-auto mt-5">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h5 className="text-xl mb-4">스키마 생성</h5>

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
                            value={schemaName}
                            onChange={(e) =>
                                setSchemaName(e.target.value.toUpperCase())
                            }
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
                        onClick={() => navigate("/METTB01")}
                    >
                        목록
                    </button>
                </div>
            </div>
        </main>
    );
};
export default SchemaMetaReg;
