const Message = ({ children }) => {
    return <span dangerouslySetInnerHTML={{ __html: children }}></span>;
};
export default Message;
