import $ from "jquery";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Message from "../component/Message";
import { LogUtils } from "./LogUtils";

export class AlertUtils {
    static checkRequiredFields(fieldList) {
        let missingFields = [];

        for (let idx in fieldList) {
            if (!fieldList[idx].value) {
                missingFields.push(fieldList[idx]);
            }
        }

        if (missingFields.length > 0) {
            let message = "다음 필수값을 입력해주세요:\n\n";
            missingFields.forEach(function (field) {
                message += "- " + field.label + "\n";
            });
            if (!AlertUtils) {
                alert(message);
            } else {
                AlertUtils.showError(message);
            }

            return false;
        }

        return true;
    }

    /**
     * @function showInfo
     * @desc onOpen callback. navigate 할때 사용
     * @param {string} message
     * @param {Function} callback
     */
    static showInfo(message, callback) {
        toast.info(
            <Message>{message?.toString().replace(/\n/g, "<br>")}</Message>,
            {
                onOpen: callback,
            }
        );
    }
    /**
     * @function showInfo2
     * @desc onClose callback. 페이지 새로고침 및 이동시 사용
     * @param {string} message
     * @param {Function} callback
     */
    static showInfo2(message, callback) {
        toast.info(
            <Message>{message?.toString().replace(/\n/g, "<br>")}</Message>,
            {
                onClose: callback,
            }
        );
    }
    /**
     * @function showError
     * @desc onOpen callback. navigate 할때 사용
     * @param {string} message
     * @param {Function} callback
     */
    static showError(message, callback) {
        toast.error(
            <Message>{message?.toString().replace(/\n/g, "<br>")}</Message>,
            {
                onOpen: callback,
            }
        );
    }
    /**
     * @function showError2
     * @desc onClose callback. 페이지 새로고침 및 이동시 사용
     * @param {string} message
     * @param {Function} callback
     */
    static showError2(message, callback) {
        toast.error(
            <Message>{message?.toString().replace(/\n/g, "<br>")}</Message>,
            {
                onClose: callback,
            }
        );
    }
    /**
     * @function showSuccess
     * @desc onOpen callback. navigate 할때 사용
     * @param {string} message
     * @param {Function} callback
     */
    static showSuccess(message, callback) {
        toast.success(
            <Message>{message?.toString().replace(/\n/g, "<br>")}</Message>,
            {
                onOpen: callback,
            }
        );
    }
    /**
     * @function showSuccess2
     * @desc onClose callback. 페이지 새로고침 및 이동시 사용
     * @param {string} message
     * @param {Function} callback
     */
    static showSuccess2(message, callback) {
        toast.success(
            <Message>{message?.toString().replace(/\n/g, "<br>")}</Message>,
            {
                onClose: callback,
            }
        );
    }
}
