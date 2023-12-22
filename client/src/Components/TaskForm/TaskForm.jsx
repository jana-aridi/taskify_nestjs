import React, { useState, useEffect } from 'react'; 
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Swal from 'sweetalert2'; 
import styles from './TaskForm.module.css';
import workspaceService from '../../Services/workspaceService';
import taskService from '../../Services/taskService';
 
const TaskForm = ({ handleTaskCreation, user }) => { 
 
  const workspaceID = user.workspaceID;

  const [taskName, setTaskName] = useState(''); 
  const [selectedAssignees, setSelectedAssignees] = useState([user._id]);
  const [assignees, setAssignees] = useState([]);

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  useEffect(() => {
    const getOtherEmployees = async () => {
      try {
        
        const response = await workspaceService.getOtherWorkspaceEmployees(workspaceID, user._id);
        
        setAssignees(response.data);

      } catch (error) {
        Toast.fire({
          icon: 'error',
          title: error.message
        });
      }
    };

    getOtherEmployees();
  }, [workspaceID, user._id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try { 
      const taskAssignees = (selectedAssignees.length > 0) ? selectedAssignees : [user._id]; 

      const newTaskData = {
        name: taskName,
        assignees: taskAssignees,
        workspaceID: workspaceID, 
        isCompleted: false,
      };

      const res = await taskService.createTask(newTaskData); 

      const responseTask = res.data; 
 
      handleTaskCreation(responseTask);

      setTaskName('');
      setSelectedAssignees([user._id]);

    } catch (error) {

      Toast.fire({
        icon: 'error',
        title: `Failed to create task: ${error}`
      });
      console.log(error)
      
    }
  };
 
  const handleChangeMultiple = (event) => {
    setSelectedAssignees(event.target.value);
  };

  const renderAssigneeNames = (selected) => {
    // Return placeholder if only the current user is selected
    if (selected.length === 1 && selected[0] === user._id) {
      return 'Select Other Assignees';
    }

    // Map selected IDs to names and join with comma only if there are multiple names
    const assigneeNames = selected.map(id => {
      const assignee = assignees.find(a => a._id === id);
      return assignee ? `${assignee.firstName} ${assignee.lastName}` : '';
    });

    return assigneeNames.length > 2 ? assigneeNames.join(', ') : assigneeNames.join('');
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.taskForm}>
        <TextField
          label="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
          autoComplete="off"
          className={styles.taskNameField}
        />
        
        <FormControl className={styles.assigneeSelect}>
          <InputLabel id="assignee-select-label">Assignees</InputLabel>
          <Select
            labelId="assignee-select-label"
            multiple
            value={selectedAssignees}
            onChange={handleChangeMultiple}
            renderValue={renderAssigneeNames}
          >
            {assignees.map((assignee) => (
              <MenuItem key={assignee._id} value={assignee._id}>
                {`${assignee.firstName} ${assignee.lastName}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#1f95bf' } }} variant="contained" className={styles.submitButton}>
          Add
        </Button>
      </form>
    </div>
  );
};

export default TaskForm;
