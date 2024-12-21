import S001_002_counter from "../component/S001_002_counter";
import S001_002_counter100 from "../component/S001_002_counter100";
import { CounterProvider } from "../context/counterContext";

const S001_002 = () => {
    return (
        <div>
            <CounterProvider>
                <S001_002_counter />
                <S001_002_counter100 />
            </CounterProvider>
        </div>
    );
};
export default S001_002;
