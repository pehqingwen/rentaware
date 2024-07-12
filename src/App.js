import './App.css';
import Navbar from './components/navbar';
import React, {useState} from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Marketing from './components/marketing';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footerfooter from './components/footer'; 

function App() {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className='CenteringContainer'>
      <div className="App">
        <div>
          <Navbar searchResults={searchResults} setSearchResults={setSearchResults} />
        </div>

        {/* set this to only appear in App.js main page & not in child routes like bakeware/cookware.js */}
        {location.pathname === '/' && <Marketing />}

        <Outlet />

        <div>
          <Footerfooter />
        </div>
      </div>
    </div>
  );
}

export default App;
