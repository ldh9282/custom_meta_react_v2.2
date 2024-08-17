import React, { useEffect, useState } from "react";
import { CmmnUtils } from "../../../cmmn/utils/CmmnUtils";
import { useNavigate } from "react-router-dom";
import { AlertUtils } from "../../../cmmn/utils/AlertUtils";
import { LogUtils } from "../../../cmmn/utils/LogUtils";
import { useGlobalContext } from "../../../context";
import PagingCreator from "../../../cmmn/component/PagingCreator";

/**
 * @function ColumnMetaList
 * @desc 컬럼목록 컴포넌트
 * @returns
 */
const ColumnMetaList = () => {
    /** 전역상태 */
    const { confirmModal } = useGlobalContext();

    /** defaultMap */
    const [defaultMap, setDefaultMap] = useState({
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

    /** data */
    const [data, setData] = useState([]);

    /** pagingCreator */
    const [pagingCreator, setPagingCreator] = useState({});

    const navigate = useNavigate();

    /** 초기조회 */
    useEffect(() => {
        CmmnUtils.setTitle("컬럼 조회");

        CmmnUtils.axios
            .get(CmmnUtils.url("METCU01"), CmmnUtils.requestParam(defaultMap))
            .then((response) => {
                let header = CmmnUtils.header(response);
                if (header.status === "0000") {
                    let body = CmmnUtils.body(response);
                    let requestMap = body.requestMap;
                    let columnMetaInfoList = body.columnMetaInfoList;
                    let thePagingCreator = body.pagingCreator;

                    setDefaultMap(requestMap);
                    setSearchMap(requestMap);
                    setData(columnMetaInfoList);
                    setPagingCreator(thePagingCreator);
                } else {
                    AlertUtils.showError(header.errorMsg);
                }
            })
            .catch((error) => {
                LogUtils.debug(error.toString());
            });
    }, []);

    /**
     * @function handleSearch
     * @desc 검색
     */
    const handleSearch = () => {
        CmmnUtils.axios
            .get(
                CmmnUtils.url("METCU01"),
                CmmnUtils.requestParam({ ...searchMap, pageNum: "1" })
            )
            .then((response) => {
                let header = CmmnUtils.header(response);
                if (header.status === "0000") {
                    let body = CmmnUtils.body(response);
                    let requestMap = body.requestMap;
                    let columnMetaInfoList = body.columnMetaInfoList;
                    let thePagingCreator = body.pagingCreator;

                    setDefaultMap(requestMap);
                    setSearchMap(requestMap);
                    setData(columnMetaInfoList);
                    setPagingCreator(thePagingCreator);
                } else {
                    AlertUtils.showError(header.errorMsg);
                }
            })
            .catch((error) => {
                LogUtils.debug(error.toString());
            });
    };

    /**
     * @function handleChangeRowAmount
     * @desc 페이지당 행수변경
     * @param {string} theRowAmountPerPage
     */
    const handleChangeRowAmount = (theRowAmountPerPage) => {
        CmmnUtils.axios
            .get(
                CmmnUtils.url("METCU01"),
                CmmnUtils.requestParam({
                    ...defaultMap,
                    pageNum: "1",
                    rowAmountPerPage: theRowAmountPerPage,
                })
            )
            .then((response) => {
                let header = CmmnUtils.header(response);
                if (header.status === "0000") {
                    let body = CmmnUtils.body(response);
                    let requestMap = body.requestMap;
                    let columnMetaInfoList = body.columnMetaInfoList;
                    let thePagingCreator = body.pagingCreator;

                    setDefaultMap(requestMap);
                    setSearchMap(requestMap);
                    setData(columnMetaInfoList);
                    setPagingCreator(thePagingCreator);
                } else {
                    AlertUtils.showError(header.errorMsg);
                }
            })
            .catch((error) => {
                LogUtils.debug(error.toString());
            });
    };

    /**
     * @function goToPaging
     * @desc 페이징 처리
     */
    const goToPaging = (pageNum) => {
        CmmnUtils.axios
            .get(
                CmmnUtils.url("METCU01"),
                CmmnUtils.requestParam({ ...defaultMap, pageNum: pageNum })
            )
            .then((response) => {
                let header = CmmnUtils.header(response);
                if (header.status === "0000") {
                    let body = CmmnUtils.body(response);
                    let requestMap = body.requestMap;
                    let columnMetaInfoList = body.columnMetaInfoList;
                    let thePagingCreator = body.pagingCreator;

                    setDefaultMap(requestMap);
                    setSearchMap(requestMap);
                    setData(columnMetaInfoList);
                    setPagingCreator(thePagingCreator);
                } else {
                    AlertUtils.showError(header.errorMsg);
                }
            })
            .catch((error) => {
                LogUtils.debug(error.toString());
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
                    {data.map((item) => {
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
            <PagingCreator
                pagingCreator={pagingCreator}
                goToPaging={goToPaging}
            />
        </div>
    );
};

export default ColumnMetaList;
