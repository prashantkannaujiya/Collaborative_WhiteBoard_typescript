import React, { useRef, useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import "./board.css";
import { socketData } from "./App";

const Board = () => {
  const socket: any = useContext(socketData);
  const canvasRef = useRef(null);
  const colorsRef = useRef(null);

  const location = useLocation();

  const room = location.state;
console.log(room)
  var brushSize = useRef(2);
  useEffect(() => {
    const canvas: any = canvasRef.current;
    const test = colorsRef.current;
    const context = canvas.getContext("2d"); // getContext() method

    const colors = document.getElementsByClassName("color"); //get colors
    console.log(colors, "the colors");
    console.log(test);
    // set the current color
    const current: any = {
      color: "black",
    };

    const onColorUpdate = (e: any) => {
      //update the current color
      current.color = e.target.className.split(" ")[1];
    };

    for (let i = 0; i < colors.length; i++) {
      // add the click event listeners
      colors[i].addEventListener("click", onColorUpdate, false);
    }
    let drawing = false;

    const drawLine = (
      x0: any,
      y0: any,
      x1: any,
      y1: any,
      width: any,
      color: any,
      emit: any
    ) => {
      // create the drawing
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.lineWidth = width;
      context.stroke();
      context.closePath();

      if (!emit) {
        return;
      }
      const w = canvas.width;
      const h = canvas.height;
      const coordinates = {
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        width,
        color,
      };

      socket.emit("drawing", { draw: coordinates, room:room });
    };

    const onMouseDown = (e: any) => {
      drawing = true;
      current.x = e.clientX || e.touches[0].clientX;
      current.y = e.clientY || e.touches[0].clientY;
    };

    const onMouseMove = (e: any) => {
      if (!drawing) {
        return;
      }
      drawLine(
        current.x,
        current.y,
        e.clientX || e.touches[0].clientX,
        e.clientY || e.touches[0].clientY,
        brushSize.current,
        current.color,
        true
      );
      current.x = e.clientX || e.touches[0].clientX;
      current.y = e.clientY || e.touches[0].clientY;
    };

    const onMouseUp = (e: any) => {
      if (!drawing) {
        return;
      }
      drawing = false;
      drawLine(
        current.x,
        current.y,
        e.clientX || e.touches[0].clientX,
        e.clientY || e.touches[0].clientY,
        brushSize.current,
        current.color,
        true
      );
    };

    const throttle = (callback: any, delay: any) => {
      let previousCall = new Date().getTime();
      return function () {
        const time = new Date().getTime();

        if (time - previousCall >= delay) {
          previousCall = time;
          callback.apply(null, arguments);
        }
      };
    };

    canvas.addEventListener("mousedown", onMouseDown, false);
    canvas.addEventListener("mouseup", onMouseUp, false);
    canvas.addEventListener("mouseout", onMouseUp, false);
    canvas.addEventListener("mousemove", throttle(onMouseMove, 10), false);

    canvas.addEventListener("touchstart", onMouseDown, false);
    canvas.addEventListener("touchend", onMouseUp, false);
    canvas.addEventListener("touchcancel", onMouseUp, false);
    canvas.addEventListener("touchmove", throttle(onMouseMove, 10), false);

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", onResize, false);
    onResize();

    const onDrawingEvent = (data: any) => {
      const w = canvas.width;
      const h = canvas.height;
      drawLine(
        data.x0 * w,
        data.y0 * h,
        data.x1 * w,
        data.y1 * h,
        data.width,
        data.color,
     null
      );
    };

    socket.on("messageResponse", (data: any) => {
      console.log(data)
      onDrawingEvent(data);
      
    });
  }, []);

  const decreaseSize = () =>
    //decrease brush size
    {
      if (brushSize.current > 2) {
        brushSize.current = brushSize.current - 2;
      }
    };

  return (
    <div>
      <canvas ref={canvasRef} className="whiteboard" />
<h4 style={{position:'relative',top:'4vh'}}>Room : {room}</h4>
      <div ref={colorsRef} className="colors">
        <div className="color black" />
        <div className="color red" />
        <div className="color green" />
        <div className="color blue" />
        <div className="color yellow" />

        <p>
          <button
            id="sizeIncrease"
            onClick={() => {
              brushSize.current = brushSize.current + 2;
            }}
          >
            +
          </button>
          <button id="sizeDecrease" onClick={decreaseSize}>
            -
          </button>
        </p>
      </div>
    </div>
  );
};

export default Board;
