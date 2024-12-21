import S001_001_counter from "../component/S001_001_counter";
import useCount from "../hook/useCount";

/**
 * @function S001_001
 * @desc S001_001 페이지
 * @returns
 */
const S001_001 = () => {
    return (
        <div>
            <S001_001_counter />
            <S001_001_counter />
        </div>
    );
};
export default S001_001;
