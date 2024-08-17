import React, { useEffect, useState } from "react";
import { CmmnUtils } from "../../../cmmn/utils/CmmnUtils";
import { useNavigate } from "react-router-dom";
import { AlertUtils } from "../../../cmmn/utils/AlertUtils";
import { LogUtils } from "../../../cmmn/utils/LogUtils";
import { useGlobalContext } from "../../../context";
import PagingCreator from "../../../cmmn/component/PagingCreator";

/**
 * @function TermList
 * @desc 용어목록 컴포넌트
 * @returns
 */
const TermList = () => {
    /** 전역상태 */
    const { confirmModal } = useGlobalContext();

    /** defaultMap */
    const [defaultMap, setDefaultMap] = useState({
        pageNum: "1",
        rowAmountPerPage: "10",
        termSno: "",
        termName: "",
        termCamelName: "",
        termSnakeName: "",
    });
    /** searchMap */
    const [searchMap, setSearchMap] = useState({
        pageNum: "1",
        rowAmountPerPage: "10",
        termSno: "",
        termName: "",
        termCamelName: "",
        termSnakeName: "",
    });

    /** data */
    const [data, setData] = useState([]);

    /** pagingCreator */
    const [pagingCreator, setPagingCreator] = useState({});

    const navigate = useNavigate();

    /** 초기조회 */
    useEffect(() => {
        CmmnUtils.setTitle("용어 조회");

        CmmnUtils.axios
            .get(CmmnUtils.url("METTM03"), CmmnUtils.requestParam(defaultMap))
            .then((response) => {
                let header = CmmnUtils.header(response);
                if (header.status === "0000") {
                    let body = CmmnUtils.body(response);
                    let requestMap = body.requestMap;
                    let termInfoList = body.termInfoList;
                    let thePagingCreator = body.pagingCreator;

                    setDefaultMap(requestMap);
                    setSearchMap(requestMap);
                    setData(termInfoList);
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
                CmmnUtils.url("METTM03"),
                CmmnUtils.requestParam({ ...searchMap, pageNum: "1" })
            )
            .then((response) => {
                let header = CmmnUtils.header(response);
                if (header.status === "0000") {
                    let body = CmmnUtils.body(response);
                    let requestMap = body.requestMap;
                    let termInfoList = body.termInfoList;
                    let thePagingCreator = body.pagingCreator;

                    setDefaultMap(requestMap);
                    setSearchMap(requestMap);
                    setData(termInfoList);
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
     * @function handleDelete
     * @desc 용어삭제요청
     * @param {string} theDomainSno
     */
    const handleDelete = (theDomainSno, theTermSno) => {
        confirmModal.showConfirm("삭제하시겠습니까?", function () {
            CmmnUtils.axios
                .post(
                    CmmnUtils.url("METTM05"),
                    CmmnUtils.requestBody({
                        domainSno: theDomainSno,
                        termSno: theTermSno,
                    })
                )
                .then((response) => {
                    let header = CmmnUtils.header(response);
                    if (header.status === "0000") {
                        AlertUtils.showSuccess2("삭제되었습니다", function () {
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

    /**
     * @function handleChangeRowAmount
     * @desc 페이지당 행수변경
     * @param {string} theRowAmountPerPage
     */
    const handleChangeRowAmount = (theRowAmountPerPage) => {
        CmmnUtils.axios
            .get(
                CmmnUtils.url("METTM03"),
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
                    let termInfoList = body.termInfoList;
                    let thePagingCreator = body.pagingCreator;

                    setDefaultMap(requestMap);
                    setSearchMap(requestMap);
                    setData(termInfoList);
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
                CmmnUtils.url("METTM03"),
                CmmnUtils.requestParam({ ...defaultMap, pageNum: pageNum })
            )
            .then((response) => {
                let header = CmmnUtils.header(response);

                if (header.status === "0000") {
                    let body = CmmnUtils.body(response);
                    let requestMap = body.requestMap;
                    let termInfoList = body.termInfoList;
                    let thePagingCreator = body.pagingCreator;

                    setDefaultMap(requestMap);
                    setSearchMap(requestMap);
                    setData(termInfoList);
                    setPagingCreator(thePagingCreator);
                } else {
                    AlertUtils.showError(header.errorMsg);
                }
            })
            .catch((error) => {
                LogUtils.debug(error.toString());
            });
    };

    return (
        <div className="text-base font-bold">
            <h5>용어 조회</h5>
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
                        <label htmlFor="termSno">용어일련번호:</label>
                        <input
                            type="text"
                            id="termSno"
                            value={searchMap.termSno}
                            onChange={(e) =>
                                setSearchMap({
                                    ...searchMap,
                                    termSno: e.target.value,
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
                        <label htmlFor="termName">용어명:</label>
                        <input
                            type="text"
                            id="termName"
                            value={searchMap.termName}
                            onChange={(e) =>
                                setSearchMap({
                                    ...searchMap,
                                    termName: e.target.value,
                                })
                            }
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSearch()
                            }
                            className="ml-2 p-2 border w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="termCamelName">용어카멜명:</label>
                        <input
                            type="text"
                            id="termCamelName"
                            value={searchMap.termCamelName}
                            onChange={(e) =>
                                setSearchMap({
                                    ...searchMap,
                                    termCamelName: e.target.value,
                                })
                            }
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSearch()
                            }
                            className="ml-2 p-2 border w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="termSnakeName">용어스네이크명:</label>
                        <input
                            type="text"
                            id="termSnakeName"
                            value={searchMap.termSnakeName}
                            onChange={(e) =>
                                setSearchMap({
                                    ...searchMap,
                                    termSnakeName: e.target.value,
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
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "auto" }} />
                    <col style={{ width: "10%" }} />
                </colgroup>
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">용어일련번호</th>
                        <th className="p-2 border">용어명</th>
                        <th className="p-2 border">용어카멜명</th>
                        <th className="p-2 border">용어스네이크명</th>
                        <th className="p-2 border">도메인명</th>
                        <th className="p-2 border">도메인타입</th>
                        <th className="p-2 border">용어삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => {
                        return (
                            <tr key={item.termSno}>
                                <td className="p-2 border text-center">
                                    {item.termSno}
                                </td>
                                <td className="p-2 border text-center">
                                    {item.termName}
                                </td>
                                <td className="p-2 border text-center">
                                    {item.termCamelName}
                                </td>
                                <td className="p-2 border text-center">
                                    {item.termSnakeName}
                                </td>
                                <td className="p-2 border text-center">
                                    {item.domainName}
                                </td>
                                <td className="p-2 border text-center">
                                    {item.domainType}
                                </td>
                                <td className="p-2 border text-center">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(
                                                item.domainSno,
                                                item.termSno
                                            )
                                        }
                                        className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-md shadow-md hover:from-red-500 hover:to-red-600 transition duration-300 transform hover:scale-105 focus:outline-none"
                                    >
                                        삭제
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

export default TermList;
