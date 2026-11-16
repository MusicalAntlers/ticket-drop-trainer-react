import { useState, useEffect } from 'react'
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

function Lobby({ run, onDone, onQuit }) {
  const [left, setLeft] = useState(run.d.lobby);    // 8 seconds

  // 1. start a 1-second timer when the lobby appears
  useEffect(() => {
    const t = setInterval(() => setLeft(l => l - 1), 1000);
    return () => clearInterval(t);                 // cleanup: stop the timer when the lobby goes away
  }, []);

  // 2. when the countdown hits 0, move on
  useEffect(() => {
    if (left <= 0) onDone();
  }, [left, onDone]);

  return (
    <div className="card">
      <h1>Waiting room</h1>
      <p>{run.d.label} · {run.qty} tickets</p>
      <p>Your presale code: <b>{run.code}</b> (memorize it!)</p>
      <p>Card CVV: <b>{run.cvv}</b></p>
      <div className="countdown">{left}</div>
      <button onClick={onQuit}>Quit</button>
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
      {screen === 'setup' && (
        <Setup settings={settings} setSettings={setSettings} onStart={startRun} />
      )}

      {screen === 'lobby' && (
        <Lobby
          run={run}
          onDone={() => {
            setRun(r => ({ ...r, t0: performance.now() }));         // add t0, keep everything else
            setScreen('results');                                   // becomes 'queue' in Step 4
          }}
          onQuit={() => setScreen('setup')}
        />
      )}

      {screen === 'results' && <Results onAgain={() => setScreen('setup')} />}
    </div>
  );
}
