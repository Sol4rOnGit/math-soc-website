import { careerPaths } from '../data/mockData';
import './Careers.css';

export default function Careers() {
  return (
    <div className="page careers-page">
      <div className="container">
        <div className="section-title">
          <h1>Careers</h1>
        </div>
        <p className="careers-intro">
          Mathematics opens doors far beyond the classroom. Explore a few of the paths
          our alumni have taken.
        </p>

        <div className="careers-grid">
          {careerPaths.map((c) => (
            <div key={c.id} className="card careers-card">
              <h3>{c.title}</h3>
              <p>{c.blurb}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}