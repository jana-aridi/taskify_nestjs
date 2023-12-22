import React, { useState } from 'react';
import styles from './SideBar.module.css';
import logo from '../../Assets/Images/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; 

const SideBar = ()=> {

  const [active, setActive] = useState('manageUsers');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location = '/';
  }
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
            <FontAwesomeIcon icon={faClipboard} className={styles.icon} />  
            Task Board
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
    )
}

export default SideBar;
 
