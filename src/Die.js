import "./App.css";
import React from "react";

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
