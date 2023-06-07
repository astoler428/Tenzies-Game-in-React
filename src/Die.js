import "./App.css";
import React from "react";

//Die component that displays the value on the die, the appropriate color and an onClick to change die state

function Die(props) {
  let styles = {
    backgroundColor: props.isHeld ? "#59E391" : "white",
  };
  return (
    <div onClick={props.holdDie} className="die" style={styles}>
      <span className="die-value">{props.value}</span>
    </div>
  );
}

export default Die;
