import { CustomMap } from "../model/CustomMap";

export class LogUtils {
    static isDebugEnabled = true;

    static debug(...args) {
        if (LogUtils.isDebugEnabled) {
            let list = [];
            args.forEach((arg) => {
                if (typeof arg === "object" && !Array.isArray(arg)) {
                    let customMap = new CustomMap(arg);
                    list.push(customMap.toString());
                } else {
                    list.push(arg);
                }
            });

            const stack = new Error().stack.split("\n");
            const caller = stack[2]
                ? "source " +
                  stack[2].trim().replace("(", "").replace(")", "") +
                  "\n\n"
                : "";

            console.log(caller, ...list);
        }
    }
    static trace(...args) {
        if (LogUtils.isDebugEnabled) {
            let list = [];
            args.forEach((arg) => {
                if (typeof arg === "object" && !Array.isArray(arg)) {
                    let customMap = new CustomMap(arg);
                    list.push(customMap.toString());
                } else {
                    list.push(arg);
                }
            });

            const stack = new Error().stack.split("\n");
            const caller = stack[3]
                ? "source " +
                  stack[3].trim().replace("(", "").replace(")", "") +
                  "\n\n"
                : "";

            console.log(caller, ...list);
        }
    }
}
