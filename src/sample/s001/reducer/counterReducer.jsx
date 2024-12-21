const actionMap = {
    /**
     * @variable A001
     * @desc PLUS 카운터 증가
     */
    A001: "PLUS",
    /**
     * @variable A002
     * @desc MINUS 카운터 감소
     */
    A002: "MINUS",
    /**
     * @variable A003
     * @desc PLUS100 카운터 100 증가
     */
    A003: "PLUS100",
    /**
     * @variable A004
     * @desc MINUS100 카운터 100 감소
     */
    A004: "MINUS100",
};

const initState = {
    count: 0,
};

const reducer = (state, action) => {
    if (action.type === actionMap.A001) {
        return { ...state, count: state.count + 1 };
    } else if (action.type === actionMap.A002) {
        return { ...state, count: state.count - 1 };
    } else if (action.type === actionMap.A003) {
        return { ...state, count: state.count + 100 };
    } else if (action.type === actionMap.A004) {
        return { ...state, count: state.count - 100 };
    } else {
        return { ...state };
    }
};

/**
 * @object counterReducer
 * @desc 카운터 리듀서
 */
const counterReducer = {
    /**
     * @object actionMap
     * @desc 리듀서 액션 구분코드 맵
     */
    actionMap,
    /**
     * @object initState
     * @desc 리듀서 초기상태
     */
    initState,
    /**
     * @function reducer
     * @desc 리듀서
     */
    reducer,
};

export default counterReducer;
