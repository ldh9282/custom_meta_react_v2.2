export class TimeUtils {
    static getTimestamp() {
        let now = new Date();

        let formatter = new Intl.DateTimeFormat("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

        return formatter.format(now);
    }

    static format(date, format, isObject) {
        if (!date || !(date instanceof Date)) {
            return isObject
                ? {
                      year: "",
                      month: "",
                      day: "",
                      hour: "",
                      minute: "",
                      second: "",
                  }
                : "";
        }

        const options = { hourCycle: "h23" };

        const formatMapping = {
            yyyy: "numeric",
            MM: "2-digit",
            dd: "2-digit",
            HH: "2-digit",
            mm: "2-digit",
            ss: "2-digit",
        };

        for (const key in formatMapping) {
            if (format.includes(key)) {
                const optionKey =
                    key[0] === "y"
                        ? "year"
                        : key[0] === "M"
                        ? "month"
                        : key[0] === "d"
                        ? "day"
                        : key[0] === "H"
                        ? "hour"
                        : key[0] === "m"
                        ? "minute"
                        : key[0] === "s"
                        ? "second"
                        : "";
                options[optionKey] = formatMapping[key];
            }
        }

        const formatter = new Intl.DateTimeFormat("ko-KR", options);
        const parts = formatter.formatToParts(date);
        let formattedDate = format;
        let result = {};

        parts.forEach(({ type, value }) => {
            const key =
                type === "year"
                    ? "yyyy"
                    : type === "month"
                    ? "MM"
                    : type === "day"
                    ? "dd"
                    : type === "hour"
                    ? "HH"
                    : type === "minute"
                    ? "mm"
                    : type === "second"
                    ? "ss"
                    : "";
            if (key) {
                formattedDate = formattedDate.replace(key, value);
                if (isObject) {
                    result[type] = value;
                }
            }
        });

        return isObject ? result : formattedDate;
    }
}
