import useCount from "../hook/useCount";

/**
 * @function S001_001_counter
 * @desc S001_001_counter UI 컴포넌트 (커스텀 훅 사용하는 샘플코드)
 * @returns
 */
const S001_001_counter = () => {
    const [count, setCount] = useCount();

    return (
        <>
            <p>{count}</p>
            <p>
                <button
                    onClick={() =>
                        setCount((value) => {
                            return value + 1;
                        })
                    }
                >
                    plus
                </button>
            </p>
            <p>
                <button
                    onClick={() =>
                        setCount((value) => {
                            return value + -1;
                        })
                    }
                >
                    minus
                </button>
            </p>
        </>
    );
};
export default S001_001_counter;
