import React, { useEffect, useState } from "react";
import { CmmnUtils } from "../../../cmmn/utils/CmmnUtils";
import { useNavigate } from "react-router-dom";
import { AlertUtils } from "../../../cmmn/utils/AlertUtils";
import { LogUtils } from "../../../cmmn/utils/LogUtils";
import { useGlobalContext } from "../../../context";
import PagingCreator from "../../../cmmn/component/PagingCreator";
import { useMutation, useQuery } from "@tanstack/react-query";

/**
 * @function TermList
 * @desc 용어목록 컴포넌트
 * @returns
 */
const TermList = () => {
    /** 전역상태 */
    const { confirmModal } = useGlobalContext();

    /** searchMap */
    const [searchMap, setSearchMap] = useState({
        pageNum: "1",
        rowAmountPerPage: "10",
        termSno: "",
        termName: "",
        termCamelName: "",
        termSnakeName: "",
    });

    const navigate = useNavigate();

    /** 초기조회 */
    useEffect(() => {
        CmmnUtils.setTitle("용어 조회");
    }, []);

    /** 데이터 조회 */
    const { data, error, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ["TermList", searchMap.pageNum, searchMap.rowAmountPerPage],
        queryFn: async () => {
            const response = await CmmnUtils.axios.get(
                CmmnUtils.url("METTM03"),
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

    /** 도메인 삭제 요청 */
    const deleteTerm = useMutation({
        mutationFn: async (theDomainSno, theTermSno) => {
            const response = await CmmnUtils.axios.post(
                CmmnUtils.url("METDM05"),
                CmmnUtils.requestBody({
                    domainSno: theDomainSno,
                    termSno: theTermSno,
                })
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

    /**
     * @function handleDelete
     * @desc 용어삭제요청
     * @param {string} theDomainSno
     * @param {string} theTermSno
     */
    const handleDelete = (theDomainSno, theTermSno) => {
        confirmModal.showConfirm("삭제하시겠습니까?", () => {
            deleteTerm.mutate(theDomainSno, theTermSno);
        });
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
                    {(isLoading || isFetching) && (
                        <tr>
                            <td colSpan="7" className="text-center py-5">
                                <div className="spinner"></div>
                            </td>
                        </tr>
                    )}
                    {isError && (
                        <tr>
                            <td colSpan="7" className="text-center py-5">
                                잠시 후 시도해주세요.
                            </td>
                        </tr>
                    )}
                    {!isLoading &&
                        !isFetching &&
                        !isError &&
                        data &&
                        data.termInfoList.map((item) => {
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
            {!isLoading && !isFetching && !isError && data && (
                <PagingCreator
                    pagingCreator={data.pagingCreator}
                    goToPaging={goToPaging}
                />
            )}
        </div>
    );
};

export default TermList;
