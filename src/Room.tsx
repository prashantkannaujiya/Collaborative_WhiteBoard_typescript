import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./Style/Room.css";
import { socketData } from "./App";

const Room = () => {
  const [roomno, setroomno] = useState<any>(0);

  const socket: any = useContext(socketData);
  const navigate = useNavigate();
  useEffect(() => {
    socket.on("Loggedin", (data: number) => {
      console.log(data);
      console.log(typeof data);

      navigate("/board", { state: data }); // display whiteboard after joining with socket
    });
  }, []);

  function join(ev: any) {                       // function to join a room
    ev.preventDefault();
    let room = parseInt(roomno);            //type converting string to number
    console.log("joinedRoom :" + room);
    socket.emit("join", { room: room });
  }
  function newRoom() {                               // function to create new room
    let room = Math.floor(Math.random() * 10);            //generating random room number for new user
    console.log(typeof room);

    setroomno(room);
    console.log("newRoom:" + room);
    socket.emit("join", { room: room });
  }
  return (
    <div className="room">
      <h1>DeskBoard</h1>
      <div>
        <p>Kindly Provide the info </p>
        <h3></h3>
        <form
          onSubmit={(e: any) => {
            join(e);
          }}
        >
          <p>Room number</p>
          <input
            type="number"
            onChange={(e: any) => {
              setroomno(e.target.value);
            }}
          />
          <p>
            <button id="formButton">Submit</button>
          </p>
        </form>
        <p>
          <button id="newroomButton" onClick={newRoom}>
            New Room
          </button>
        </p>
      </div>
    </div>
  );
};
export default Room;
