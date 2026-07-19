import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.webp';
import './Navbar.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/newsletter', label: 'Newsletter' },
  { to: '/challenge', label: 'Challenge' },
  { to: '/careers', label: 'Careers' },
  { to: '/leaderboard', label: 'Leaderboard' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser, role, setRole, isRealTeacher, logout } = useAuth();

  const closeMenu = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          <img src={logo} alt="Mathematics Society crest" />
          <span>Maths Society</span>
        </NavLink>

        <nav className={`navbar-links ${open ? 'is-open' : ''}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `navbar-link ${isActive ? 'is-active' : ''}`}
              onClick={closeMenu}
            >
              {link.label}
            </NavLink>
          ))}

          <div className="navbar-mobile-auth">
            {isRealTeacher && <RoleSwitcher role={role} setRole={setRole} />}
            <AuthButton currentUser={currentUser} logout={logout} closeMenu={closeMenu} />
          </div>
        </nav>

        <div className="navbar-actions">
          {isRealTeacher && <RoleSwitcher role={role} setRole={setRole} />}
          <AuthButton currentUser={currentUser} logout={logout} closeMenu={closeMenu} />
        </div>

        <button
          className={`navbar-toggle ${open ? 'is-open' : ''}`}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

function RoleSwitcher({ role, setRole }) {
  return (
    <div className="role-switcher" title="Demo only: simulates teacher vs student permissions">
      <button className={role === 'student' ? 'is-active' : ''} onClick={() => setRole('student')}>
        Student
      </button>
      <button className={role === 'teacher' ? 'is-active' : ''} onClick={() => setRole('teacher')}>
        Teacher
      </button>
    </div>
  );
}

function AuthButton({ currentUser, logout, closeMenu }) {
  if (currentUser) {
    return (
      <button
        className="btn btn-secondary navbar-auth-btn"
        onClick={() => {
          logout();
          closeMenu();
        }}
      >
        Log out
      </button>
    );
  }
  return (
    <NavLink to="/login" className="btn btn-primary navbar-auth-btn" onClick={closeMenu}>
      Log in
    </NavLink>
  );
}