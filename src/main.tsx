import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Tracker from "./routes/Tracker";
import AddTracker from "./routes/AddTracker";
import EditTracker from "./routes/EditTracker";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/add" element={<AddTracker />} />
                <Route path="/:id/edit" element={<EditTracker />} />
                <Route path="/:id" element={<Tracker />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
