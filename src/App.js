import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import Home from './Pages/Home';
import './App.css';
import Register from './Pages/Register';
import Login from './Pages/Login';
import AddNotes from './Pages/AddNotes';
import AddFiles from './Pages/AddFiles';
import UserNotes from './Pages/UserNotes';
import UserFiles from './Pages/UserFiles';
import AllFiles from './Pages/AllFiles'; // Import nowego komponentu
import EditNote from './Pages/EditNote'; // Import nowego komponentu

const queryClient = new QueryClient(); 

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path='/addnotes' element={<AddNotes />}/>
            <Route path='/addfiles' element={<AddFiles />}/>
            <Route path='/usernotes/:userId' element={<UserNotes />}/>
            <Route path='/userfiles/:userId' element={<UserFiles />}/>
            <Route path='/allfiles' element={<AllFiles />}/> {/* Nowa trasa */}
            <Route path='/editnote/:id' element={<EditNote />}/> {/* Nowa trasa */}
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
