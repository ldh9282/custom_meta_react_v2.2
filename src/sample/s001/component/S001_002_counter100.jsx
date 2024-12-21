import { useCounterContext } from "../context/counterContext";
import counterReducer from "../reducer/CounterReducer";

const S001_002_counter100 = () => {
    const { counter } = useCounterContext();

    return (
        <div>
            <p>
                <button
                    onClick={() =>
                        counter.dispatch({
                            type: counterReducer.actionMap.A003,
                        })
                    }
                >
                    PLUS 100
                </button>
            </p>
            <p>
                <button
                    onClick={() =>
                        counter.dispatch({
                            type: counterReducer.actionMap.A004,
                        })
                    }
                >
                    MINUS 100
                </button>
            </p>
        </div>
    );
};
export default S001_002_counter100;
