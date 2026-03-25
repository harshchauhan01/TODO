import React, { useState } from 'react';
import Home from './components/Home';
import {Toaster} from "react-hot-toast";
import Navbar from './components/Navbar';
import {Routes,Route} from "react-router-dom";
import Todo from './components/Todo';
import PrivateRoute from "./components/PrivateRoute";

function App() {

  return(
    <>
      <Navbar/>
      <Toaster position='top-right'/>
      <Routes>
        <Route path="" element={<Home/>}/>
        <Route path="/todo" element={
          <PrivateRoute>
            <Todo/>
          </PrivateRoute>
        }/>
      </Routes>
    </>
  );
}

export default App
