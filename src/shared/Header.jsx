import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "../assets/logo.png";

function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.appHeaderContent}>
        <img src={logo} alt="WordWonder Logo" className={styles.appLogo} />
        <h1 className={styles.headerTitle}>WordWonder</h1>
      </div>
      <nav className={styles.navbar}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? styles.activeNavLink : styles.inactiveNavLink
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? styles.activeNavLink : styles.inactiveNavLink
          }
        >
          About
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
