import React from 'react';
import { Link } from 'react-router-dom';
import { useTeam } from '../context/TeamContext';
import './Navigation.css';

const Navigation: React.FC = () => {
  const { getTeamSize } = useTeam();
  const teamSize = getTeamSize();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">⚽</span>
          <span className="brand-text">Fantasy Soccer</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Dashboard
          </Link>
          <Link to="/compare" className="nav-link">
            Player Comparison
          </Link>
        </div>

        <div className="navbar-team-info">
          <span className="team-badge">
            👥 {teamSize}/11
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
