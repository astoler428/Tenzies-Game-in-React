import "./App.css";
import Die from "./Die.js";
import React, { useEffect } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);

  useEffect(checkWin, [dice]);

  function checkWin() {
    let firstValue = dice[0].value;
    let youWin = true;
    for (let die of dice) {
      if (!die.isHeld || die.value !== firstValue) youWin = false;
    }
    if (youWin) setTenzies(true);
  }

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
    } else {
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
    </main>
  );
}
