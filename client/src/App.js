import {Route, Routes, Navigate} from 'react-router-dom';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Home from './Pages/UserHome/Home';
import AdminPanel from './Pages/AdminPanel/AdminPanel';

function App() {

  const user = localStorage.getItem('user'); 

  return (
    <Routes> 

      <Route path="/login" exact element={<Login/>}/>
      <Route path="/signup" exact element={<Signup/>}/> 

      {user && <Route path="/home" exact element={<Home/>} />}
      {user && <Route path="/admin-panel" exact element={<AdminPanel/>} />}

      {!user && <Route path="/" exact element={<Login/>}/>}

      {user && user.isAdmin && <Route path="/" exact element={<AdminPanel/>}/>}
      {user && !user.isAdmin && <Route path="/" exact element={<Home/>}/>}

      {user && user.isAdmin && <Route path="/home" exact element={<AdminPanel/>}/>}
      {user && !user.isAdmin && <Route path="/admin-panel" exact element={<Home/>}/>}
      
    </Routes>
  );
}

export default App;
