import Home from './components/Home';
import {Toaster} from "react-hot-toast";
import Navbar from './components/Navbar';
import {Routes,Route} from "react-router-dom";
import Todo from './components/Todo';
import PrivateRoute from "./components/PrivateRoute";
import ClockPage from './components/ClockPage';

function App() {

  return(
    <div className="app-shell">
      <Navbar/>
      <Toaster position='top-right'/>
      <Routes>
        <Route path="" element={<Home/>}/>
        <Route path="/clock" element={<ClockPage/>}/>
        <Route path="/todo" element={
          <PrivateRoute>
            <Todo/>
          </PrivateRoute>
        }/>
        
      </Routes>
    </div>
  );
}

export default App
