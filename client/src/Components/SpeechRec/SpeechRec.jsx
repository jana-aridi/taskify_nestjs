import styles from './style.module.css';
import robot from '../../Assets/Images/voice.png';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './style.module.css';
import LocalStorageFile from '../../Utils/LocalStorageFile';
import taskService from '../../Services/taskService';

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

function SpeechRec({handleTaskCreation}) {
    const [isListening, setIsListening] = useState(false)
    const [note, setNote] = useState(null)
    const [savedNotes, setSavedNotes] = useState([])

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

    const createNewTask = async () => {
        try { 

            const user = LocalStorageFile.getLocalStorageUser();

            const taskAssignees = [user._id]; 
      
            const newTaskData = {
              name: "Newly generated task",
              assignees: taskAssignees,
              workspaceID: user.workspaceID, 
              isCompleted: false,
            };
      
            const res = await taskService.createTask(newTaskData); 
      
            const responseTask = res.data; 
       
            handleTaskCreation(responseTask);
             
          } catch (error) {
      
            Toast.fire({
              icon: 'error',
              title: `Failed to create task: ${error}`
            });
            console.log(error)
            
          }
    }

    const logOut = () => {
        try {
            localStorage.removeItem("user");
            localStorage.removeItem("token");

            Toast.fire({
                icon: 'success',
                title: `Logging Out...`
            });

            setTimeout(()=> {
                window.location = '/';
            }, 2000)
        }
        catch (error) {
            Toast.fire({
                icon: 'error',
                title: `Error logging out...`
            });
        }
    }

    useEffect(() => {
        handleListen()
    }, [isListening])

    const handleListen = () => {
    if (isListening) {
        mic.start()
        mic.onend = () => {
        console.log('continue..')
        mic.start()
        }
    } else {
        mic.stop()
        mic.onend = () => {
        console.log('Stopped Mic on Click');
        const command = note;
        setNote("Loading...") // Set the note to "Loading..." immediately

        setTimeout(() => { // Wait for 2 seconds before executing the next steps
            

            if (command && (command.includes("create a new task") || command.includes("create new task") || command.includes("generate a new task"))) {
                
                console.log('create func');
                createNewTask();

            } else if (command && (command.includes("log out") || command.includes("sign out"))) {
                console.log('log out func');
                logOut();
            }
            
            setNote(""); // Reset the note after the actions are performed
        }, 2000)};
            
    }
    mic.onstart = () => {
        console.log('Mics on')
    }

    mic.onresult = event => {
        const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
        console.log(transcript)
        setNote(transcript) 

        mic.onerror = event => {
        console.log(event.error)
        }
    }
    }

    const handleSaveNote = () => {
    setSavedNotes([...savedNotes, note])
    setNote('')
    }

    return (
    <>
        <div className={styles.container}>
        <div className="box">
            
            <button className={`${styles.btn} ${isListening ? styles.listening : styles.notListening}`} 
            onClick={() => setIsListening(prevState => !prevState)}>

            <img src={robot} width="30px" height="30px"/>

        </button>
        <div>
            <p>{note}</p>
        </div>
        </div>
        </div>
    </>
    )
}

export default SpeechRec