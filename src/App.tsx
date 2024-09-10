import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PaginaPrincipal from './Pages/PaginaPrincipal/PaginaPrincipal';
import Login from './Pages/Login/Login';
import './App.css';
import AñadirLibros from './Pages/AñadirLibros/AñadirLibros';
import SolicitudLibro from './Pages/SolicitudLibro/SolicitudLibro';

function App() {
  return (
    <Router >
      <div className="App">
        <Routes>
          <Route path='/' element={<PaginaPrincipal />}></Route>
          <Route path='/paginaprincipal' element={<PaginaPrincipal />}></Route>
          {/*<Route path='/login' element={<Login />}></Route>*/}
          <Route path='/añadir-libros' element={<AñadirLibros />}></Route>
          <Route path='/solicitud-libro' element={<SolicitudLibro />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
