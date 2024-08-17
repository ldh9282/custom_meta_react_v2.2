import { useGlobalContext } from "../../context";

const Dimm = () => {
    const { dimm } = useGlobalContext();
    return (
        <div
            id="dimm"
            className={`${dimm.showDimm ? "show-noclick" : "close"}`}
        ></div>
    );
};
export default Dimm;
