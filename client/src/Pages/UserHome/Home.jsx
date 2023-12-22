import React from 'react'
import SideBar from '../../Components/UserSideBar/SideBar';
import TaskList from '../../Components/TaskList/TaskList'; 
import TaskForm from '../../Components/TaskForm/TaskForm';
import JoinWorkspace from '../../Components/JoinWorkspace/JoinWorkspace';
import styles from './Home.module.css';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; 
import LocalStorageFile from '../../Utils/LocalStorageFile';
import userService from '../../Services/userService';
import SpeechRec from '../../Components/SpeechRec/SpeechRec';

const Home = () => {
  const [user, setUser] = useState(LocalStorageFile.getLocalStorageUser()); 

  if (user === null)
    window.location = '/';

  if (user.isAdmin)
    window.location = '/admin-panel';

  const fullName = user ? `${user.firstName} ${user.lastName}` : ' ';

  const [tasks, setTasks] = useState([]);
  const [showJoinWorkspace, setShowJoinWorkspace] = useState(false);

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  useEffect(() => { 
    if (user && user.workspaceID) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
        
      const res = await userService.getUserTasks(user._id);
      
      setTasks(res.data);
      
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        Toast.fire({
          icon: 'error',
          title: error.message
        });
      }
    }
  };
  
  const handleTaskCreation = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const toggleJoinWorkspace = () => {
    setShowJoinWorkspace(!showJoinWorkspace);  
  };

  return (
    <div className={styles.mainContainer}>
      <SideBar />
      
        {(user.workspaceID === null) ? (
          <>
          <div className={styles.rightContainer_join}>
            <div className={styles.header_join}>
              <h3>Welcome Back {fullName}! 😊</h3>
              <div className={styles.addButtonDiv}>
                <div className={styles.notfound}> </div>
                <button onClick={toggleJoinWorkspace} className={styles.addButton}>+</button>
                <span onClick={toggleJoinWorkspace} className={styles.joinText}>Join Workspace</span>
              </div>
            </div>
            {
            showJoinWorkspace && <div className={styles.modalBackdrop}>
                                    <div className={styles.joinWorkspaceForm}>
                                      <JoinWorkspace user={user} toggleJoinWorkspace={toggleJoinWorkspace} />
                                    </div>
                                  </div>
            } 
          </div>
          </>
        ) : (
          <>
            <div className={styles.rightContainer}>
            <div className={styles.header}>
              <h3>Welcome Back {fullName}! 😊</h3>
              <TaskForm handleTaskCreation={handleTaskCreation} user={user} setUser={setUser}/>
            </div>
            <TaskList tasks={tasks} setTasks={setTasks} /> 
            <SpeechRec handleTaskCreation={handleTaskCreation} className={styles.sr}></SpeechRec>
            </div>

           
          </>
        )} 
    </div>
  );
}

export default Home;