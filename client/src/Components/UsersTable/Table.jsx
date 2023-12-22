import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Table.module.css';
import LocalStorageFile from '../../Utils/LocalStorageFile';
import axios from 'axios';
import Swal from 'sweetalert2';
import workspaceService from '../../Services/workspaceService';

const UsersTable = () => {

  const workspaceID = LocalStorageFile.getLocalStorageUser().workspaceID; 

  useEffect(() => {
    const fetchUsers = async () => {
      const resUsers = await getUsers();  
      if (resUsers) {
        setUsers(resUsers);
      }
    };
  
    fetchUsers();  
  }, []);

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });
  
  const getUsers = async () => {

    try { 
      
      const res = await workspaceService.getWorkspaceEmployees(workspaceID);
      
      const resUsers = res.data;
      console.log(JSON.stringify(resUsers));
      return resUsers;

    }
    catch(error) {
      Toast.fire({
        icon: 'error',
        title: error.message
      });
    }

  }

  const deleteUser = async (userID) => {

    try {  
 
      const res = await workspaceService.removeUserFromWorkspace(workspaceID, userID);
      
      if (res.status === 200)
        Toast.fire({
          icon: 'success',
          title: 'Removed from workspace successfully!'
        });

      else
        Toast.fire({
          icon: 'error',
          title: res.data.message
        });

    }
    catch(error) {

      console.log(error)

      Toast.fire({
        icon: 'error',
        title: error.message
      });

    }

  }

  const [users, setUsers] = useState([]); 
    
  const [selectedUsers, setSelectedUsers] = useState({});

  const handleSelectAll = (event) => {
    const newSelectedUsers = event.target.checked
      ? users.reduce((acc, user) => ({ ...acc, [user._id]: true }), {})
      : {};
    setSelectedUsers(newSelectedUsers);
  };

  const handleSelect = (id) => {
    setSelectedUsers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const deleteSelected = () => {
    setUsers(users.filter(user => !selectedUsers[user._id]));

    for (const user in selectedUsers) {
      console.log('user ' + user);
      deleteUser(user);
    }

    setSelectedUsers({});
  };

  const isAnyUserSelected = Object.values(selectedUsers).includes(true);

  return (
    <div>
      {isAnyUserSelected && (
        <div className="d-flex justify-content-end mb-2">
          <Button variant="secondary" onClick={deleteSelected} className="btn-sm">
            <Trash />
          </Button>
        </div>
      )}
      <Table striped bordered hover className="text-center">
        <thead>
          <tr>
            <th className={styles.cb}><Form.Check type="checkbox" onChange={handleSelectAll} /></th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td className={styles.cb}>
                <Form.Check
                  type="checkbox"  
                  checked={!!selectedUsers[user._id]}
                  onChange={() => handleSelect(user._id)}
                />
              </td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UsersTable;