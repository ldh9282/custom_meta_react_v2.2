import { useEffect, useState } from "react";
import { TimeUtils } from "../utils/TimeUtils";

const Timer = () => {
    const [time, setTime] = useState(
        TimeUtils.format(new Date(), "yyyy-MM-dd HH:mm:ss")
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(TimeUtils.format(new Date(), "yyyy-MM-dd HH:mm:ss"));
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    return <div>{time}</div>;
};
export default Timer;
