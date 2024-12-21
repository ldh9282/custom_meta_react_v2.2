import { useEffect, useState } from "react";
import { LogUtils } from "../../../cmmn/utils/LogUtils";

/**
 * @function useCount
 * @desc useCount 커스텀 훅 샘플코드
 * @returns
 */
const useCount = () => {
    const [count, setCount] = useState(0);

    // LogUtils.debug(count);
    useEffect(() => {
        LogUtils.debug(count);
    }, [count]);
    return [count, setCount];
};
export default useCount;
