import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";
import Layout from "./cmmn/component/Layout";
import TableMetaList from "./meta2024/table/component/tableMetaList";
import TableMetaReg from "./meta2024/table/component/TableMetaReg";

import ConfirmModal from "./cmmn/component/ConfirmModal";
import { Slide, ToastContainer } from "react-toastify";
import ColumnMetaList from "./meta2024/column/component/ColumnMetaList";
import Dimm from "./cmmn/component/Dimm";
import SeqMetaList from "./meta2024/seq/component/seqMetaList";
import SchemaMetaReg from "./meta2024/schema/component/SchemaMetaReg";
import ColumnMetaDetail from "./meta2024/column/component/ColumnMetaDetail";
import DomainReg from "./meta2024/domain/component/domainReg";
import DomainList from "./meta2024/domain/component/DomainList";
import TermReg from "./meta2024/term/component/TermReg";
import TermList from "./meta2024/term/component/TermList";
import PrivateRoute from "./cmmn/component/PrivateRoute";
import Login from "./login/component/Login";
import TableMetaDetail from "./meta2024/table/component/TableMetaDetail";

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
