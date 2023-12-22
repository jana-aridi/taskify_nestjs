import * as React from 'react';
import { useState } from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse'; 
import IconButton from '@mui/material/IconButton'; 
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore'; 
import styles from './TaskList.module.css'
import Swal from 'sweetalert2';
import { Checkbox } from '@mui/material';
import confetti from 'canvas-confetti'; 
import taskService from '../../Services/taskService';


const TaskList = ({ tasks, setTasks }) => {
      
  const [openSubtask, setOpenSubtask] = useState({});  

  // Function to toggle subtask collapse
  const handleClickSubtask = (id) => {
    setOpenSubtask((prevOpen) => ({
      ...prevOpen,
      [id]: !prevOpen[id],
    }));
  }; 


  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });

  const toggleTaskCompletion = async (task) => {
    try {
       
      
      await taskService.updateTask(task._id, { isCompleted: !task.isCompleted });
      
      setTasks(tasks.map(t => t._id === task._id ? { ...t, isCompleted: !t.isCompleted } : t)); 
      
      if (!task.isCompleted) {
        confetti({
          particleCount: 100,
          spread: 170,
          origin: { y: 0.6 }
        });
 
      }

    } catch (error) {
      Toast.fire({
        icon: 'error',
        title: error.message
      });
    }
  }; 

  const deleteTask = async (taskID) => {
    try {
      
      await taskService.deleteTask(taskID);

      // Remove the task from the state
      setTasks(tasks.filter(t => t._id !== taskID));

      Toast.fire({
        icon: 'success',
        title: 'Task deleted successfully!'
      });

    } catch (error) {
      Toast.fire({
        icon: 'error',
        title: error.message
      });
    }
  };

  return (
    <div className={styles.list}>
      <br></br>
      <List
        sx={{ width: '100%', bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Tasks
          </ListSubheader>
        }
      >
        {tasks && tasks.map((task) => (
          <React.Fragment key={task?._id}>
            <ListItemButton>

              <ListItemIcon onChange={() => toggleTaskCompletion(task)}>
                <Checkbox checked={task?.isCompleted}/>
              </ListItemIcon>

              <ListItemText primary={task.name} />
              <ListItemText secondary={task.assignees.map(a => (a.firstName + " " + a.lastName)).join(', ')} />
              <IconButton aria-label="delete" onClick={() => deleteTask(task._id)}>
                <DeleteIcon/>
              </IconButton>
              {task.subtasks.length > 0 ? (
                openSubtask[task._id] ? <ExpandLess /> : <ExpandMore />
              ) : null}
            </ListItemButton>
            {task.subtasks.length > 0 && (
              <Collapse in={openSubtask[task._id] || false} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {task.subtasks.map((subtask) => (
                    <ListItemButton key={subtask._id} sx={{ pl: 4 }}>
                      <ListItemIcon onChange={() => toggleTaskCompletion(subtask)}>
                        <Checkbox checked={subtask.isCompleted}/>
                      </ListItemIcon>
                      <ListItemText primary={subtask.name} />
                      <IconButton aria-label="delete" onClick={() => deleteTask(subtask._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </div>
  );
  }

  export default TaskList;