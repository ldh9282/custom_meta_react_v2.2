import { createContext, useContext, useState } from "react";

/**
 * @object AppContext
 * @desc 애플리케이션의 전역 상태를 관리하는 Context
 */
export const AppContext = createContext();

/**
 * @function AppProvider
 * @desc 애플리케이션의 전역 상태를 제공하는 Provider
 * @param
 * @returns
 */
export const AppProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [confirmCb, setConfirmCb] = useState(() => () => {});
    const [showDimm, setShowDimm] = useState(false);

    const [isLogined, setIsLogined] = useState(false);

    /**
     * @object globalState
     * @desc 전역상태
     */
    const globalState = {
        /**
         * @object confirmModal
         * @desc 확인모달 object
         */
        confirmModal: {
            /**
             * @variable isOpen
             * @desc 열림유무
             */
            isOpen: isOpen,
            /**
             * @function setIsOpen
             * @desc 열림유무 set
             */
            setIsOpen: setIsOpen,
            /**
             * @variable message
             * @desc 메시지
             */
            message: message,
            /**
             * @function confirmCb
             * @desc 확인 callback
             */
            confirmCb: confirmCb,
            /**
             * @function showConfirm
             * @desc 확인모달 show
             * @param {string} message
             * @param {function} confirmCb
             */
            showConfirm: function (message, confirmCb) {
                setIsOpen(true);
                setShowDimm(true);
                setMessage(message);
                setConfirmCb(() => confirmCb);
            },
        },
        /**
         * @object dimm
         * @desc 딤처리 object
         */
        dimm: {
            /**
             * @variable showDimm
             * @desc 딤처리유무
             */
            showDimm: showDimm,
            /**
             * @function setShowDimm
             * @desc 딤처리유무 set
             */
            setShowDimm: setShowDimm,
        },
    };

    return (
        <AppContext.Provider value={globalState}>
            {children}
        </AppContext.Provider>
    );
};

/**
 * @function useGlobalContext
 * @desc 전역상태사용
 * @returns
 */
export const useGlobalContext = () => {
    return useContext(AppContext);
};
