import React, { useState } from 'react';
import Home from './components/Home';
import {Toaster} from "react-hot-toast";
import Navbar from './components/Navbar';

function App() {

  return(
    <>
      <Navbar/>
      <Toaster position='top-right'/>
      <Home/>
    </>
  );
}

export default App
