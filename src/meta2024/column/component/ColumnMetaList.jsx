import React, { useEffect, useState } from "react";
import { CmmnUtils } from "../../../cmmn/utils/CmmnUtils";
import { useNavigate } from "react-router-dom";
import { AlertUtils } from "../../../cmmn/utils/AlertUtils";
import { LogUtils } from "../../../cmmn/utils/LogUtils";
import { useGlobalContext } from "../../../context";
import PagingCreator from "../../../cmmn/component/PagingCreator";
import { useQuery } from "@tanstack/react-query";

/**
 * @function ColumnMetaList
 * @desc 컬럼목록 컴포넌트
 * @returns
 */
const ColumnMetaList = () => {
    /** 전역상태 */
    const { confirmModal } = useGlobalContext();

    /** searchMap */
    const [searchMap, setSearchMap] = useState({
        pageNum: "1",
        rowAmountPerPage: "10",
        columnMetaSno: "",
        columnName: "",
        columnCamelName: "",
        columnSnakeName: "",
        schemaName: "",
        tableName: "",
        tableDesc: "",
    });

    const navigate = useNavigate();

    /** 초기조회 */
    useEffect(() => {
        CmmnUtils.setTitle("컬럼 조회");
    }, []);

    /** 데이터 조회 */
    const { data, error, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: [
            "ColumnMetaList",
            searchMap.pageNum,
            searchMap.rowAmountPerPage,
        ],
        queryFn: async () => {
            const response = await CmmnUtils.axios.get(
                CmmnUtils.url("METCU01"),
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

    /**
     * @function handleSearch
     * @desc 검색
     */
    const handleSearch = () => {
        refetch();
    };

    /**
     * @function handleChangeRowAmount
     * @desc 페이지당 행수변경
     * @param {string} theRowAmountPerPage
     */
    const handleChangeRowAmount = (theRowAmountPerPage) => {
        setSearchMap({
            ...searchMap,
            pageNum: "1",
            rowAmountPerPage: theRowAmountPerPage,
        });
    };

    /**
     * @function goToPaging
     * @desc 페이징 처리
     */
    const goToPaging = (pageNum) => {
        setSearchMap({
            ...searchMap,
            pageNum,
        });
    };

    const handleDetail = (tableMetaSno, columnMetaSno) => {
        navigate(
            `/METCU02?tableMetaSno=${tableMetaSno}&columnMetaSno=${columnMetaSno}`
        );
    };

    return (
        <div className="text-base font-bold">
            <h5>컬럼 조회</h5>
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
                        <label htmlFor="columnMetaSno">컬럼메타일련번호:</label>
                        <input
                            type="text"
                            id="columnMetaSno"
                            value={searchMap.columnMetaSno}
                            onChange={(e) =>
                                setSearchMap({
                                    ...searchMap,
                                    columnMetaSno: e.target.value,
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
                        <label htmlFor="columnName">컬럼명:</label>
                        <input
                            type="text"
                            id="columnName"
                            value={searchMap.columnName}
                            onChange={(e) =>
                                setSearchMap({
                                    ...searchMap,
                                    columnName: e.target.value,
                                })
                            }
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSearch()
                            }
                            className="ml-2 p-2 border w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="columnCamelName">컬럼카멜명:</label>
                        <input
                            type="text"
                            id="columnCamelName"
                            value={searchMap.columnCamelName}
                            onChange={(e) =>
                                setSearchMap({
                                    ...searchMap,
                                    columnCamelName: e.target.value,
                                })
                            }
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSearch()
                            }
                            className="ml-2 p-2 border w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="columnSnakeName">컬럼스네이크명:</label>
                        <input
                            type="text"
                            id="columnSnakeName"
                            value={searchMap.columnSnakeName}
                            onChange={(e) =>
                                setSearchMap({
                                    ...searchMap,
                                    columnSnakeName: e.target.value,
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
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "auto" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "10%" }} />
                </colgroup>
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">컬럼메타일련번호</th>
                        <th className="p-2 border">컬럼명</th>
                        <th className="p-2 border">컬럼카멜명</th>
                        <th className="p-2 border">컬럼스네이크명</th>
                        <th className="p-2 border">스키마명</th>
                        <th className="p-2 border">테이블명</th>
                        <th className="p-2 border">테이블설명</th>
                        <th className="p-2 border">컬럼상세</th>
                    </tr>
                </thead>
                <tbody>
                    {(isLoading || isFetching) && (
                        <tr>
                            <td colSpan="8" className="text-center py-5">
                                <div className="spinner"></div>
                            </td>
                        </tr>
                    )}
                    {isError && (
                        <tr>
                            <td colSpan="8" className="text-center py-5">
                                잠시 후 시도해주세요.
                            </td>
                        </tr>
                    )}
                    {!isLoading &&
                        !isFetching &&
                        !isError &&
                        data &&
                        data.columnMetaInfoList.map((item) => {
                            return (
                                <tr key={item.columnMetaSno}>
                                    <td className="p-2 border text-center">
                                        {item.columnMetaSno}
                                    </td>
                                    <td className="p-2 border text-center">
                                        {item.columnName}
                                    </td>
                                    <td className="p-2 border text-center">
                                        {item.columnCamelName}
                                    </td>
                                    <td className="p-2 border text-center">
                                        {item.columnSnakeName}
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
                                                handleDetail(
                                                    item.tableMetaSno,
                                                    item.columnMetaSno
                                                )
                                            }
                                            className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-md shadow-md hover:from-emerald-500 hover:to-emerald-600 transition duration-300 transform hover:scale-105 focus:outline-none"
                                        >
                                            상세
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
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

export default ColumnMetaList;
