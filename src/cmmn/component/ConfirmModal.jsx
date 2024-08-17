import React from "react";
import Modal from "react-modal";
import { useGlobalContext } from "../../context";

// 모달 스타일 정의
const customStyles = {
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        zIndex: 50, // z-index 값 설정
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "10vh",
    },
    content: {
        width: "400px",
        maxWidth: "90%",
        padding: "24px",
        borderRadius: "10px",
        boxShadow: "0px 20px 30px rgba(0, 0, 0, 0.2)",
        backgroundColor: "#ffffff",
        position: "relative",
        border: "none",
    },
};

// 모달 컴포넌트
const ConfirmModal = () => {
    const { confirmModal, dimm } = useGlobalContext();

    const handleConfirm = () => {
        confirmModal.setIsOpen(false);
        dimm.setShowDimm(false);
        if (confirmModal.confirmCb) {
            confirmModal.confirmCb();
        }
    };

    const handleClose = () => {
        confirmModal.setIsOpen(false);
        dimm.setShowDimm(false);
    };

    return (
        <Modal
            isOpen={confirmModal.isOpen}
            onRequestClose={handleClose}
            style={customStyles}
            contentLabel="Confirm Modal"
            ariaHideApp={false}
        >
            <div className="flex flex-col p-6">
                <div className="mb-6 text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        알림
                    </h2>
                    <p className="text-base text-gray-600 mb-6">
                        {confirmModal.message}
                    </p>
                </div>
                <div className="flex justify-center gap-6">
                    <button
                        className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white rounded-md shadow-md hover:from-emerald-500 hover:to-emerald-600 transition duration-300 transform hover:scale-105 focus:outline-none"
                        onClick={handleConfirm}
                    >
                        확인
                    </button>
                    <button
                        className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-md shadow-md hover:from-red-500 hover:to-red-600 transition duration-300 transform hover:scale-105 focus:outline-none"
                        onClick={handleClose}
                    >
                        취소
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
