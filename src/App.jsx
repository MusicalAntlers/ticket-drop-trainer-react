import { useState } from 'react'
import './App.css'

const DIFF = {
  arena: { label: 'Arena', lobby: 8, qMin: 800, qMax: 4000, priceChange: 0 },
  stadium: { label: 'Stadium', lobby: 8, qMin: 8000, qMax: 25000, priceChange: 0.15 },
  chaos: { label: 'Chaos', lobby: 8, qMin: 30000, qMax: 90000, priceChange: 0.4 }
};

function ri(a, b) {
  return Math.floor(a + Math.random() * (b - a + 1));
}

function Seg({ options, value, onPick }) {
  // options looks like: [['map', 'Seat map"], ['list', 'Listings]]
  return (
    <div className="seg">
      {options.map(([v, label]) => (
        <button
          key={v}
          className={v === value ? 'on' : ''}                // 'on' if this option is the selected one, otherwise ''
          onClick={() => onPick(v)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Setup({ settings, setSettings, onStart }) {
  // update one setting, keep the rest
  const pick = (key, value) => setSettings({ ...settings, [key]: value });

  return (
    <div className="card">
      <h1>Ticket Drop Trainer</h1>
      <p>Practice a big onsale until it's muscle memory.</p>

      <p className="label">Flow</p>
      <Seg options={[['map', 'Seat map'], ['list', 'Listings']]}
        value={settings.mode}
        onPick={v => pick('mode', v)} />

      <p className="label">Difficulty</p>
      <Seg options={[['arena', 'Arena'], ['stadium', 'Stadium'], ['chaos', 'Chaos']]}
        value={settings.diff}
        onPick={v => pick('diff', v)} />

      <p className="label">Tickets</p>
      <Seg options={[[1, '1'], [2, '2'], [3, '3'], [4, '4']]}
        value={settings.qty}
        onPick={v => pick('qty', v)} />

      <button className="primary big" onClick={onStart}>Start practice Drop</button>
    </div>
  );
}

function Lobby({ run, onDone }) {
  return (
    <div className="card">
      <h1>Waiting room</h1>
      <p>{run.d.label} · {run.qty} tickets</p>
      <p>Your presale code: <b>{run.code}</b> (memorize it!)</p>
      <p>Card CVV: <b>{run.cvv}</b></p>
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
  const [settings, setSettings] = useState({ diff: 'stadium', qty: 2, mode: 'map' });
  const [run, setRun] = useState(null);

  function startRun() {
    setRun({
      d: DIFF[settings.diff],
      qty: settings.qty,
      mode: settings.mode,
      mistakes: [],
      code: 'TOUR' + ri(1000, 9999),
      cvv: String(ri(100, 999)),
      unlocked: false
    });
    setScreen('lobby');
  }

  return (
    <div id="app">
      {screen === 'setup' && <Setup settings={settings} setSettings={setSettings} onStart={startRun} />}
      {screen === 'lobby' && <Lobby run={run} onDone={() => setScreen('results')} />}
      {screen === 'results' && <Results onAgain={() => setScreen('setup')} />}
    </div>
  );
}