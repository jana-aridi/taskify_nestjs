import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import styles from './JoinWorkspace.module.css';
import Swal from 'sweetalert2';
import LocalStorageFile from '../../Utils/LocalStorageFile';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import userService from '../../Services/userService';
import { useNavigate  } from 'react-router-dom';
import logo from '../../Assets/Images/logo.png';

const JoinWorkspace = ({ user, setUser, toggleJoinWorkspace }) => {  
  const [workspaceID, setWorkspaceID] = useState('');
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const navigate = useNavigate();

  const handleJoinWorkspace = async (event) => {
    event.preventDefault(); 

    try {
       console.log('joining ws')
      const res = await userService.joinWorkspace(user._id, {workspaceID})
      console.log('res ' + JSON.stringify(res))

      if(res.status === 200) { 

        const updatedUser = { ...user, workspaceID: workspaceID };
        LocalStorageFile.setLocalStorageUser(updatedUser); 
        user = updatedUser;  

        Toast.fire({
            icon: 'success',
            title: 'Joined workspace successfully!'
        });

        window.location.reload();
      }
      else {
        console.log(res)
        Toast.fire({
          icon: 'error',
          title: res.message
        });
      }
    
 
    } catch (error) { 
        console.log('err ' + error)
        Toast.fire({
            icon: 'error',
            title: error.message
        });
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <IconButton onClick={toggleJoinWorkspace} className={styles.closeButton}>
          <CloseIcon />
        </IconButton>
        <img src={logo} alt="Logo" className={styles.logo} /> 
        <form onSubmit={handleJoinWorkspace} className={styles.form}>
            <div className={styles.formDiv}>
              <div>
                  <TextField
                  className={styles.formControl}
                  label="Workspace ID"
                  variant="outlined"
                  value={workspaceID}
                  autoComplete='off'
                  onChange={(e) => setWorkspaceID(e.target.value)}
                  required
                  />
              </div> 
              <br></br>
              <div>
                <Button type="submit" variant="contained" color="primary" className={styles.submitButton}>
                Join Workspace
                </Button>
              </div>
            </div>
        </form>
      </div>
    </div>
  );
};

export default JoinWorkspace;
