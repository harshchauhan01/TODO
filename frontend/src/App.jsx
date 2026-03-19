import React, { useState } from 'react';
import Home from './components/Home';
import {Toaster} from "react-hot-toast";

function App() {

  return(
    <>
      <Toaster position='top-right'/>
      <Home/>
    </>
  );
}

export default App
