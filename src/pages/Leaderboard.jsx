import { leaderboardEntries } from '../data/mockData';
import './Leaderboard.css';

export default function Leaderboard() {
  const ranked = [...leaderboardEntries].sort((a, b) => b.points - a.points);

  return (
    <div className="page leaderboard-page">
      <div className="container">
        <div className="section-title">
          <h1>Leaderboard</h1>
        </div>

        <div className="card leaderboard-table">
          {ranked.map((entry, i) => (
            <div key={entry.id} className={`leaderboard-row ${i < 3 ? 'is-top' : ''}`}>
              <span className="leaderboard-rank">#{i + 1}</span>
              <span className="leaderboard-name">{entry.name}</span>
              <span className="leaderboard-points">{entry.points} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}