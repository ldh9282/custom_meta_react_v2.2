import React from "react";
import {
    Navigate,
    Route,
    BrowserRouter as Router,
    Routes,
} from "react-router-dom";
import TableMetaReg from "./meta2024/table/page/TableMetaReg";

import { Slide, ToastContainer } from "react-toastify";
import ConfirmModal from "./cmmn/component/ConfirmModal";
import Dimm from "./cmmn/component/Dimm";
import PrivateRoute from "./cmmn/component/PrivateRoute";
import Login from "./login/component/Login";
import ColumnMetaDetail from "./meta2024/column/page/ColumnMetaDetail";
import ColumnMetaList from "./meta2024/column/page/ColumnMetaList";
import DomainList from "./meta2024/domain/page/DomainList";
import DomainReg from "./meta2024/domain/page/DomainReg";
import SchemaMetaReg from "./meta2024/schema/page/SchemaMetaReg";
import SeqMetaList from "./meta2024/seq/page/SeqMetaList";
import TableMetaDetail from "./meta2024/table/page/TableMetaDetail";
import TableMetaList from "./meta2024/table/page/TableMetaList";
import TermList from "./meta2024/term/page/TermList";
import TermReg from "./meta2024/term/page/TermReg";
import S001_001 from "./sample/s001/page/s001_001";
import S001_002 from "./sample/s001/page/S001_002";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/METLG04" element={<Login />} />
                    <Route path="/" element={<Navigate to="/METTB02" />} />
                    <Route
                        path="/METDM01"
                        element={<PrivateRoute element={DomainReg} />}
                    />
                    <Route
                        path="/METDM03"
                        element={<PrivateRoute element={DomainList} />}
                    />
                    <Route
                        path="/METTM01"
                        element={<PrivateRoute element={TermReg} />}
                    />
                    <Route
                        path="/METTM03"
                        element={<PrivateRoute element={TermList} />}
                    />
                    <Route
                        path="/METSC02"
                        element={<PrivateRoute element={SchemaMetaReg} />}
                    />
                    <Route
                        path="/METTB03"
                        element={<PrivateRoute element={TableMetaDetail} />}
                    />
                    <Route
                        path="/METTB02"
                        element={<PrivateRoute element={TableMetaReg} />}
                    />
                    <Route
                        path="/METTB01"
                        element={<PrivateRoute element={TableMetaList} />}
                    />
                    <Route
                        path="/METCU01"
                        element={<PrivateRoute element={ColumnMetaList} />}
                    />
                    <Route
                        path="/METCU02"
                        element={<PrivateRoute element={ColumnMetaDetail} />}
                    />
                    <Route
                        path="/METSE01"
                        element={<PrivateRoute element={SeqMetaList} />}
                    />
                    <Route path="/S001_001" element={<S001_001 />} />
                    <Route path="/S001_002" element={<S001_002 />} />
                </Routes>
            </Router>
            {/* https://fkhadra.github.io/react-toastify/introduction/ */}
            <ToastContainer
                position="top-center"
                limit={1}
                autoClose={1500}
                hideProgressBar={true}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                theme="light"
                transition={Slide}
            />
            <ConfirmModal />
            <Dimm />
        </>
    );
}

export default App;
