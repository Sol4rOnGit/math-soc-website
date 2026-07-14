import { Link } from 'react-router-dom';
import './Home.css';

const tiles = [
  { to: '/newsletter', title: 'Newsletter', desc: 'Catch up on the latest society news, in PDF form.' },
  { to: '/challenge', title: 'Challenge of the Week', desc: 'Test yourself against this week\u2019s problem.' },
  { to: '/careers', title: 'Careers', desc: 'Explore where mathematics can take you.' },
  { to: '/leaderboard', title: 'Leaderboard', desc: 'See how you rank against the rest of the society.' },
];

export default function Home() {
  return (
    <div className="page home-page">
      <div className="container">
        <section className="home-hero">
          <span className="tag">EST. 1912</span>
          <h1>Mathematics Society</h1>
          <p className="home-motto">Ad Astra &mdash; to the stars.</p>
          <p>
            Weekly challenges, termly newsletters and everything you need to explore
            where mathematics can take you.
          </p>
        </section>

        <section className="home-grid">
          {tiles.map((t) => (
            <Link to={t.to} key={t.to} className="card home-tile">
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}