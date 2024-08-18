import React, { useEffect, useState } from "react";
import { CmmnUtils } from "../../../cmmn/utils/CmmnUtils";
import { useNavigate } from "react-router-dom";
import { AlertUtils } from "../../../cmmn/utils/AlertUtils";
import { LogUtils } from "../../../cmmn/utils/LogUtils";
import { useGlobalContext } from "../../../context";
import PagingCreator from "../../../cmmn/component/PagingCreator";
import { useMutation, useQuery } from "@tanstack/react-query";

/**
 * @function DomainList
 * @desc 도메인목록 컴포넌트
 * @returns
 */
const DomainList = () => {
    /** 전역상태 */
    const { confirmModal } = useGlobalContext();

    /** searchMap */
    const [searchMap, setSearchMap] = useState({
        pageNum: "1",
        rowAmountPerPage: "10",
        domainSno: "",
        domainName: "",
        domainType: "",
    });

    const navigate = useNavigate();

    /** 초기조회 */
    useEffect(() => {
        CmmnUtils.setTitle("도메인 조회");
    }, []);

    /** 데이터 조회 */
    const { data, error, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ["DomainList", searchMap.pageNum, searchMap.rowAmountPerPage],
        queryFn: async () => {
            const response = await CmmnUtils.axios.get(
                CmmnUtils.url("METDM03"),
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
    const deleteDomain = useMutation({
        mutationFn: async (theDomainSno) => {
            const response = await CmmnUtils.axios.post(
                CmmnUtils.url("METDM05"),
                CmmnUtils.requestBody({ domainSno: theDomainSno })
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
     * @desc 도메인삭제요청
     * @param {string} theDomainSno
     */
    const handleDelete = (theDomainSno) => {
        confirmModal.showConfirm("삭제하시겠습니까?", () => {
            deleteDomain.mutate(theDomainSno);
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
            <h5>도메인 조회</h5>
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
                        <label htmlFor="domainSno">도메인일련번호:</label>
                        <input
                            type="text"
                            id="domainSno"
                            value={searchMap.domainSno}
                            onChange={(e) =>
                                setSearchMap({
                                    ...searchMap,
                                    domainSno: e.target.value,
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
                        <label htmlFor="domainName">도메인명:</label>
                        <input
                            type="text"
                            id="domainName"
                            value={searchMap.domainName}
                            onChange={(e) =>
                                setSearchMap({
                                    ...searchMap,
                                    domainName: e.target.value,
                                })
                            }
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSearch()
                            }
                            className="ml-2 p-2 border w-full"
                        />
                    </div>
                    <div>
                        <label htmlFor="domainType">도메인타입:</label>
                        <input
                            type="text"
                            id="domainType"
                            value={searchMap.domainType}
                            onChange={(e) =>
                                setSearchMap({
                                    ...searchMap,
                                    domainType: e.target.value,
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
                    <col style={{ width: "35%" }} />
                    <col style={{ width: "auto" }} />
                    <col style={{ width: "10%" }} />
                </colgroup>
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">도메인일련번호</th>
                        <th className="p-2 border">도메인명</th>
                        <th className="p-2 border">도메인타입</th>
                        <th className="p-2 border">도메인삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {(isLoading || isFetching) && (
                        <tr>
                            <td colSpan="4" className="text-center py-5">
                                <div className="spinner"></div>
                            </td>
                        </tr>
                    )}
                    {isError && (
                        <tr>
                            <td colSpan="4" className="text-center py-5">
                                잠시 후 시도해주세요.
                            </td>
                        </tr>
                    )}
                    {!isLoading &&
                        !isFetching &&
                        !isError &&
                        data &&
                        data.domainInfoList.map((item) => {
                            return (
                                <tr key={item.domainSno}>
                                    <td className="p-2 border text-center">
                                        {item.domainSno}
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
                                                handleDelete(item.domainSno)
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

export default DomainList;
