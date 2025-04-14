import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './css/App.css'
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://ggejlhdyfdqokvmlrnue.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnZWpsaGR5ZmRxb2t2bWxybnVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNDYzMjQsImV4cCI6MjA1OTgyMjMyNH0.3GUqjZrQ2JKB1btfmoxU7Q2jQUlVW5FGnFgCJl0MVwE");

function App() {
  const [count, setCount] = useState(0);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    getProfiles();
  }, []);

  async function getProfiles() {
    const { data } = await supabase.from("profiles").select("username");
    setProfiles(data);
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <h2 className='text-amber-400'>List Usernames</h2>
      <ul>
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <li key={profile.username}>{profile.username}</li>
          ))
        ) : (
          <li>Loading or no data...</li>
        )}
      </ul>
    </>
  )
}

export default App
