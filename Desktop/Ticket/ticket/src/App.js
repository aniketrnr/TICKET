import React from 'react';
import { BrowserRouter ,Routes, Route, Link } from 'react-router-dom';
import TicketForm from './TicketForm';
import AdminDashboard from './AdminDashboard';
import UserWaitingList from './UserWaitingList';

const App = () => {
  return (
   
        
      
   
    <BrowserRouter>
  <Routes>
    <Route path='/admin' element={<AdminDashboard />}></Route>
    <Route path='/user'  element={<UserWaitingList />}></Route>
    <Route path='/'  element={<TicketForm />}></Route>
  </Routes>
  </BrowserRouter>
  );
};

export default App;
