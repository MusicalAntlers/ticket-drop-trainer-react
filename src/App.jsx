import { useState } from 'react'
import './App.css'

function Setup({ onStart }) {
  return (
    <div className="card">
      <h1>Ticket Drop Trainer</h1>
      <p>Practice a big onsale until it's muscle memory.</p>
      <button className="primary big" onClick={onStart}>Start Practice drop</button>
    </div>
  );
}

function Lobby({ onDone }) {
  return (
    <div className="card">
      <h1>Waiting room</h1>
      <button className="primary big" onClick={onDone}>Results</button>
    </div>
  );
}

function Results({ onAgain }) {
  return (
    <div className="card">
      <h1>Results</h1>
      <button className="primary big" onClick={onAgain}>Play again</button>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState('setup');      // which screen we're on

  return (
    <div id="app">
      {screen === 'setup' && <Setup onStart={() => setScreen('lobby')} />}
      {screen === 'lobby' && <Lobby onDone={() => setScreen('results')} />}
      {screen === 'results' && <Results onAgain={() => setScreen('setup')} />}
    </div>
  );
}