// Updated AdminSideBar component
import React, { useState } from 'react';
import styles from './SideBar.module.css';
import logo from '../../Assets/Images/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; 

const AdminSideBar = () => {
  const [active, setActive] = useState('manageUsers'); // State to track active button

  const handleLogout = () => {
    setActive('logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location = '/';
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <div></div><img src={logo} alt="Logo" className={styles.logo} />
        <p className={styles.slogan}>From To-Do to Ta-Da!</p>
      </div>

      <nav className={styles.nav}>
        <button
          className={`${styles.navButton} ${active === 'manageUsers' ? styles.active : ''}`}
          onClick={() => setActive('manageUsers')}
        >
          <FontAwesomeIcon icon={faUserCog} className={styles.icon} />
          Manage Users
        </button>
        <button
          className={`${styles.navButton} ${active === 'logout' ? styles.active : ''}`}
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className={styles.icon} />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default AdminSideBar;
