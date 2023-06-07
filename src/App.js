import "./App.css";
import Die from "./Die.js";
import React, { useEffect } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  //dice is an array of 10 objects containing die value, isHeld boolean and an id
  const [dice, setDice] = React.useState(allNewDice());
  //holds the status of the game
  const [tenzies, setTenzies] = React.useState(false);
  //custom feature - holds the number of rolls
  const [rolls, setRolls] = React.useState(0);
  //custom feature - holds the records in local storage
  const [records, setRecords] = React.useState(getRecords());

  //variables that will store the start and end date of the game
  //start is determined when dice is rolled
  let start = React.useRef(0);
  //end is determined when you win
  let end = React.useRef(0);

  //checks for win condition every time dice change
  useEffect(() => {
    let firstValue = dice[0].value;
    let youWin = true;
    for (let die of dice) {
      if (!die.isHeld || die.value !== firstValue) youWin = false;
    }
    if (youWin) {
      end.current = Date.now();
      let time = (end.current - start.current) / 1000.0;
      setTenzies(true);
      if (
        localStorage.getItem("minRolls") === null ||
        rolls < localStorage.getItem("minRolls")
      ) {
        localStorage.setItem("minRolls", rolls);
        setRecords(getRecords());
      }
      if (
        localStorage.getItem("minTime") === null ||
        time < localStorage.getItem("minTime")
      ) {
        localStorage.setItem("minTime", time);
        setRecords(getRecords());
      }
    }
  }, [dice]);

  function allNewDice() {
    let newDice = [];
    for (let index = 0; index < 10; index++) newDice.push(newDie());
    return newDice;
  }

  function newDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function rollDice() {
    if (tenzies) {
      setTenzies(false);
      setDice(allNewDice());
      setRolls(0);
    } else {
      if (rolls === 0) start.current = Date.now();
      setRolls((oldRolls) => oldRolls + 1);
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : newDie();
        })
      );
    }
  }

  function holdDie(id) {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
        })
      );
    }
  }

  function resetRecords() {
    localStorage.removeItem("minRolls");
    localStorage.removeItem("minTime");
    setRecords(getRecords());
  }

  function getRecords() {
    return {
      minRolls: localStorage.getItem("minRolls"),
      minTime: localStorage.getItem("minTime"),
    };
  }

  let diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDie={() => holdDie(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button onClick={rollDice} className="roll-btn">
        {tenzies === true ? "New Game" : "Roll"}
      </button>
      <div className="num-rolls">Number of Rolls: {rolls}</div>

      {tenzies && (
        <div className="time">
          Time to Win: {(end.current - start.current) / 1000.0 + " secs"}
        </div>
      )}
      <div className="records">
        <div>
          Fewest Rolls:{" "}
          <div className="record-value">
            {records.minRolls !== null && records.minRolls}
          </div>
        </div>
        <div>
          Shortest Time:{" "}
          <div className="record-value">
            {" "}
            {records.minTime !== null && records.minTime}
          </div>
        </div>
      </div>
      <button onClick={resetRecords} className="reset-records-btn">
        Reset Records
      </button>
    </main>
  );
}
