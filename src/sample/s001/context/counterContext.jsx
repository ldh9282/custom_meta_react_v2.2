import { createContext, useContext, useReducer } from "react";
import counterReducer from "../reducer/CounterReducer";

/**
 * @object CounterContext
 * @desc 카운터의 전역 상태를 관리하는 Context
 */
export const CounterContext = createContext();

/**
 * @function CounterProvider
 * @desc 카운터의 전역 상태를 제공하는 Provider
 * @param
 * @returns
 */
export const CounterProvider = ({ children }) => {
    const [counterState, counterDispatch] = useReducer(
        counterReducer.reducer,
        counterReducer.initState
    );
    /**
     * @object globalState
     * @desc 전역상태
     */
    const globalState = {
        /**
         * @object counter
         * @desc 카운터 object
         */
        counter: {
            /**
             * @variable actionMap
             * @desc 액션 맵
             */
            actionMap: counterReducer.actionMap,
            /**
             * @variable state
             * @desc 상태
             */
            state: counterState,
            /**
             * @variable dispatch
             * @desc 디스패치
             */
            dispatch: counterDispatch,
        },
    };

    return (
        <CounterContext.Provider value={globalState}>
            {children}
        </CounterContext.Provider>
    );
};

/**
 * @function useCounterContext
 * @desc 전역상태사용
 * @returns
 */
export const useCounterContext = () => {
    return useContext(CounterContext);
};
