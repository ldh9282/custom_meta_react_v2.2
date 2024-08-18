import React, { useEffect, useState } from "react";
import { CmmnUtils } from "../../../cmmn/utils/CmmnUtils";
import { useNavigate } from "react-router-dom";
import { AlertUtils } from "../../../cmmn/utils/AlertUtils";
import { LogUtils } from "../../../cmmn/utils/LogUtils";
import { useGlobalContext } from "../../../context";
import PagingCreator from "../../../cmmn/component/PagingCreator";
import { useQuery, useMutation } from "@tanstack/react-query";

/**
 * @function TableMetaList
 * @desc 테이블목록 컴포넌트
 * @returns
 */
const TableMetaList = () => {
    /** 전역상태 */
    const { confirmModal } = useGlobalContext();

    /** searchMap */
    const [searchMap, setSearchMap] = useState({
        pageNum: "1",
        rowAmountPerPage: "10",
        tableMetaSno: "",
        schemaName: "",
        tableName: "",
        tableDesc: "",
    });

    const navigate = useNavigate();

    /** 초기조회 */
    useEffect(() => {
        CmmnUtils.setTitle("테이블 조회");
    }, []);

    /** 데이터 조회 */
    const { data, error, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: [
            "TableMetaList",
            searchMap.pageNum,
            searchMap.rowAmountPerPage,
        ],
        queryFn: async () => {
            const response = await CmmnUtils.axios.get(
                CmmnUtils.url("METTB01"),
                CmmnUtils.requestParam(searchMap)
            );
            const header = CmmnUtils.header(response);
            if (header.status === "0000") {
                return CmmnUtils.body(response);
            } else {
                throw new Error(header.errorMsg);
            }
        },
        enabled: true, // 초기 요청
        retry: 0, // 네트워크 오류시 재요청 횟수
        refetchOnWindowFocus: false, // 알트탭, 탭변경시 재요청
        // refetchInterval: 10000, // 시간간격 ms 재요청
    });

    /** 테이블 삭제 요청 */
    const deleteTableMeta = useMutation({
        mutationFn: async (tableMetaSno) => {
            const response = await CmmnUtils.axios.post(
                CmmnUtils.url("METTB05"),
                CmmnUtils.requestBody({ tableMetaSno })
            );
            const header = CmmnUtils.header(response);
            if (header.status !== "0000") {
                throw new Error(header.errorMsg);
            }
        },
        onSuccess: () => {
            AlertUtils.showSuccess("삭제되었습니다", () => {
                refetch();
            });
        },
        onError: (error) => {
            AlertUtils.showError(error.message);
        },
    });

    const handleDelete = (tableMetaSno) => {
        confirmModal.showConfirm("삭제하시겠습니까?", () => {
            deleteTableMeta.mutate(tableMetaSno);
        });
    };

    /** 검색 핸들러 */
    const handleSearch = () => {
        refetch();
    };

    const handleChangeRowAmount = (theRowAmountPerPage) => {
        setSearchMap({
            ...searchMap,
            pageNum: "1",
            rowAmountPerPage: theRowAmountPerPage,
        });
    };

    const goToPaging = (pageNum) => {
        setSearchMap({
            ...searchMap,
            pageNum,
        });
    };

    const handleDetail = (tableMetaSno) => {
        navigate(`/METTB03?tableMetaSno=${tableMetaSno}`);
    };

    return (
        <div className="text-base font-bold">
            <h5>테이블 조회</h5>
            <form>
                <div className="mb-3">
                    <select
                        id="rowAmountPerPage"
                        value={searchMap.rowAmountPerPage}
                        onChange={(e) => handleChangeRowAmount(e.target.value)}
                        className="ml-2 p-2 border"
                    >
                        <option value="10">10개</option>
                        <option value="20">20개</option>
                        <option value="50">50개</option>
                        <option value="100">100개</option>
                    </select>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                        <label htmlFor="tableMetaSno">
                            테이블메타일련번호:
                        </label>
                        <input
                            type="text"
                            id="tableMetaSno"
                            value={searchMap.tableMetaSno}
                            onChange={(e) =>
                                setSearchMap({
                                    ...searchMap,
                                    tableMetaSno: e.target.value,
                                })
                            }
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSearch()
                            }
                            className="ml-2 p-2 border w-full"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                        <label htmlFor="schemaName">스키마명:</label>
                        <input
                            type="text"
                            id="schemaName"
                            value={searchMap.schemaName}
                            onChange={(e) =>
                                setSearchMap({
                                    ...searchMap,
                                    schemaName: e.target.value,
                                })
                            }
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSearch()
                            }
                            className="ml-2 p-2 border w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="tableName">테이블명:</label>
                        <input
                            type="text"
                            id="tableName"
                            value={searchMap.tableName}
                            onChange={(e) =>
                                setSearchMap({
                                    ...searchMap,
                                    tableName: e.target.value,
                                })
                            }
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSearch()
                            }
                            className="ml-2 p-2 border w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="tableDesc">테이블설명:</label>
                        <input
                            type="text"
                            id="tableDesc"
                            value={searchMap.tableDesc}
                            onChange={(e) =>
                                setSearchMap({
                                    ...searchMap,
                                    tableDesc: e.target.value,
                                })
                            }
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSearch()
                            }
                            className="ml-2 p-2 border w-full"
                        />
                    </div>
                </div>
                <div className="text-right mb-3">
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-md shadow-md hover:from-blue-500 hover:to-blue-600 transition duration-300 transform hover:scale-105 focus:outline-none"
                    >
                        검색
                    </button>
                </div>
            </form>
            <table className="w-full bg-white border mt-3">
                <colgroup>
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "25%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "auto%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                </colgroup>
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">테이블메타일련번호</th>
                        <th className="p-2 border">스키마명</th>
                        <th className="p-2 border">테이블명</th>
                        <th className="p-2 border">테이블설명</th>
                        <th className="p-2 border">테이블상세</th>
                        <th className="p-2 border">테이블삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {(isLoading || isFetching) && (
                        <tr>
                            <td colSpan="6" className="text-center py-5">
                                <div className="spinner"></div>
                            </td>
                        </tr>
                    )}
                    {isError && (
                        <tr>
                            <td colSpan="6" className="text-center py-5">
                                잠시 후 시도해주세요.
                            </td>
                        </tr>
                    )}
                    {!isLoading &&
                        !isFetching &&
                        !isError &&
                        data &&
                        data.tableMetaInfoList.map((item) => (
                            <tr key={item.tableMetaSno}>
                                <td className="p-2 border text-center">
                                    {item.tableMetaSno}
                                </td>
                                <td className="p-2 border text-center">
                                    {item.schemaName}
                                </td>
                                <td className="p-2 border text-center">
                                    {item.tableName}
                                </td>
                                <td className="p-2 border text-center">
                                    {item.tableDesc}
                                </td>
                                <td className="p-2 border text-center">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDetail(item.tableMetaSno)
                                        }
                                        className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white rounded-md shadow-md hover:from-emerald-500 hover:to-emerald-600 transition duration-300 transform hover:scale-105 focus:outline-none"
                                    >
                                        상세
                                    </button>
                                </td>
                                <td className="p-2 border text-center">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(item.tableMetaSno)
                                        }
                                        className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-md shadow-md hover:from-red-500 hover:to-red-600 transition duration-300 transform hover:scale-105 focus:outline-none"
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            {!isLoading && !isFetching && !isError && data && (
                <PagingCreator
                    pagingCreator={data.pagingCreator}
                    goToPaging={goToPaging}
                />
            )}
        </div>
    );
};

export default TableMetaList;
