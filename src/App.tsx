import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PaginaPrincipal from './Pages/PaginaPrincipal/PaginaPrincipal';
import Login from './Pages/Login/Login';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<PaginaPrincipal />}></Route>
          <Route path='/paginaprincipal' element={<PaginaPrincipal />}></Route>
          <Route path='/login' element={<Login />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
