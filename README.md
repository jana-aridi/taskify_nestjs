# taskify_nest

Demo:
------

 
Project Setup Instructions:
---------------------------

    1. Clone the repository: git clone https://github.com/jana-aridi/taskify_nestjs.git
    2. Navigate to the project directory: cd Taskify_nest
    3. Install the required packages to initialize node_modules using npm install in the api and
    client directories
    4. Configure the environment variables: update the .env file with the necessary credentials
    and settings (in the .zip file the necessary credentials and settings are set)
    5. Create a new database in MongoDB and use the link and credentials
    6. In the main terminal run “npm start” which runs the client and API concurrently

    
Running the Application:
------------------------

1. Start the server: npm start
2. Open the application in a web browser at http://localhost:3000 (opens by default, default
react.js port)


API Endpoints and Usage:
------------------------

Authentication:
  /login: POST request to authenticate a user
  /register: POST request to register a new user
  
Users:
  /users/joinWorkspace/:userID: PUT request to join a workspace (update the workspaceID attribute in the user document in the database)
  /users/getTasks/:userID: GET request to retrieve the user tasks
  /users/:userID: DELETE request to delete a user 
  
Tasks:
  /tasks/add: POST request to create a new task
  /tasks/update/:taskID: PUT request to update a task by ID (used to mark isCompleted true or false)
  /tasks/delete/:taskID: DELETE request to delete a task by ID
  /tasks/addSubtask/:userID: POST request to add a subtask 
  /tasks/updateSubtask/:taskID: PUT request to update a subtask 
  
Workspaces:
  /workspaces/: GET request to retrieve all the workspaces for the super admin.
  /workspaces/:workspaceID/users: GET request to retrieve all users within a specific workspace.
  /workspaces/:workspaceID/:userID/otherUsers: GET request to retrieve all non-admin users except for the specified user within a specific workspace.
  /workspaces/:workspaceID/:userID: DELETE request to remove a specific user from a specific workspace.
  
Database Schema Description:
----------------------------

Users Collection
  firstName: String, required
  lastName: String, required
  email: String, required, unique
  password: String, required
  isAdmin: Boolean, default false
  isSuperAdmin: Boolean, default false
  workspaceID: String, references Workspace, default null
  
Tasks Collection
  name: String, default "New Task"
  assignees: Array of ObjectIds, references user
  isCompleted: Boolean, default false
  dueDate: String, default null
  workspaceID: String, references workspace
  subtasks: Array of SubtaskSchema (an internal schema inside the task schema that has name, and isCompleted attributes)
  name: String, required
  isCompleted: Boolean, default false

Workspaces Collection
  _id: String, required
  admin: ObjectId, required, references user
  employees: Array of ObjectIds, references user, default empty array
  
Third-Party Libraries and Tools:
--------------------------------
WebKitSpeechRecognition: A chrome library for speech recognition to implement NLP to handle commands.
Nest js: Used to handle the back end .
Mongoose: An ODM library for MongoDB.
Joi: Used to ensure password complexity
Bootstrap: Imported some components and adjusted them to beautify the UI
Material UI: for built in UI components
Confetti.js: to display confetti upon the completion of the task
Sweet alert 2: to display toasts
Font Awesome: to utilize icons
