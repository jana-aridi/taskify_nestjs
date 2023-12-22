import React, { useState } from 'react';
import styles from './AdminPanel.module.css'; 
import LocalStorageFile from '../../Utils/LocalStorageFile';
import AdminSideBar from '../../Components/AdminSideBar/SideBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import UsersTable from '../../Components/UsersTable/Table';

const AdminPanel = () => {
  const user = LocalStorageFile.getLocalStorageUser();

  if (!user) {
    window.location = "/";
  }

  if (!user.isAdmin) {
    window.location = '/home';
  }
  
  const fullName = `${user.firstName} ${user.lastName}`;
 
  const workspaceID = user?.workspaceID;

  return (
    <div className={styles.mainContainer}>
      <AdminSideBar />
      <div className={styles.rightContainer}>
        <div className={styles.header}>
          <h3>Welcome Back {fullName}! 😊</h3>
        </div>
        <p className={styles.workspace}>Invite other users to your workspace: <br></br> <span>Workspace ID: {workspaceID}</span></p>
        <div className={styles.table}>
           <UsersTable workspaceID={workspaceID}/>
        </div>
         
      </div>
    </div>
  );
}

export default AdminPanel;