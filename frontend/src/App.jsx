import React, { useState } from 'react';
import Home from './components/Home';
import {Toaster} from "react-hot-toast";
import Navbar from './components/Navbar';
import {Routes,Route} from "react-router-dom";
import Todo from './components/Todo';

function App() {

  return(
    <>
      <Navbar/>
      <Toaster position='top-right'/>
      <Routes>
        <Route path="" element={<Home/>}/>
        <Route path="/todo" element={<Todo/>}/>
      </Routes>
    </>
  );
}

export default App
