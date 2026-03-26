import { NavLink } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="sw-navbar">
      <NavLink to="/" className="sw-navbar__brand">
        ✦ Swiftify
      </NavLink>
      <NavLink
        to="/albums"
        className={({ isActive }) => `sw-navbar__link${isActive ? ' active' : ''}`}
      >
        Albums
      </NavLink>
      <NavLink
        to="/songs"
        className={({ isActive }) => `sw-navbar__link${isActive ? ' active' : ''}`}
      >
        Songs
      </NavLink>
    </nav>
  );
}
