import logo from "./logo.svg";
import "./Style/App.css";
import * as socketIO from "socket.io-client";
import io from "socket.io-client";
import Board from "./Board";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";
import { useEffect, useRef, useState, createContext } from "react";
import { Routes, Route, Link, Outlet } from "react-router-dom";

import Home from "./Home";
import HomePage from "./HomePage";
import Room from "./Room";
const socket: any = socketIO.connect("http://localhost:4000");

export const socketData: any = createContext("");
function App() {
  return (
    <div className="App">
      <socketData.Provider value={socket}>
        <ReactKeycloakProvider authClient={keycloak}>
          <div>
            <Home></Home>
          </div>

          <Routes>
            <Route path="/" element={<HomePage></HomePage>} />
            <Route path="/board" element={<Board></Board>} />
            <Route path="/room" element={<Room></Room>} />
          </Routes>
        </ReactKeycloakProvider>
        <Outlet />
      </socketData.Provider>
    </div>
  );
}

export default App;
