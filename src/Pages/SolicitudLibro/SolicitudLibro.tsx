import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaLongArrowAltLeft } from "react-icons/fa";
import './SolicitudLibro.css';

const SolicitudLibro: React.FC = () => {
    const [librosPedidos, setLibrosPedidos] = useState<{ title: string, gender: string}[]>([]);
    const [selectedBooks, setSelectedBooks] = useState<{ title: string, gender: string }[]>([]);
    const [observacion, setObservacion] = useState<string>('');
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true); 

    useEffect(() => {
        const fetchLibrosParaDevolver = async () => {
            const token = localStorage.getItem('token');
            const userName = JSON.parse(localStorage.getItem('user') || '{}').userName;
            console.log('Token:', token);
    console.log('UserName:', userName);

            if (!token || !userName) {
                console.error('Token o nombre de usuario no disponibles');
                return;
            }

            try {
                const response = await fetch(`https://ceiberapp-001-site1.ftempurl.com/api/Solicitud/obtenerLibrosParaDevolver?userName=${encodeURIComponent(userName)}`, {
                //const response = await fetch(`http://localhost:5243/api/Solicitud/obtenerLibrosParaDevolver?userName=${encodeURIComponent(userName)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                console.log("Datos recibidos:", data);
                if (data.success) {
                    setLibrosPedidos(data.libros);
                } else {
                    console.error('Error al obtener los libros para devolver:', data.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchLibrosParaDevolver();
    }, []);

    useEffect(() => {
        setIsButtonDisabled(selectedBooks.length === 0); 
    }, [selectedBooks]);

    const handleCheckboxChange = (bookTitle: string, bookGender: string) => {
        setSelectedBooks(prev => {
            const isSelected = prev.some(book => book.title === bookTitle && book.gender === bookGender);
            
            if (isSelected) {
                return prev.filter(book => !(book.title === bookTitle && book.gender === bookGender));
            } else {
                return [...prev, { title: bookTitle, gender: bookGender }];
            }
        });
    };
    

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        const userName = JSON.parse(localStorage.getItem('user') || '{}').userName;
    
        if (!token || !userName) {
            console.error('Token o nombre de usuario no disponibles');
            return;
        }
    
        const solicitudes = selectedBooks.map(({title, gender}) => ({
            tipo: "Regresar",
            fecha: new Date().toISOString(),
            userName,
            book: title,
            gender: gender,
            observation: observacion || null,
        }));
    
        try {
            const responses = await Promise.all(solicitudes.map(solicitud => 
                fetch('https://ceiberapp-001-site1.ftempurl.com/api/Solicitud/crearSolicitud', {
                //fetch('http://localhost:5243/api/Solicitud/crearSolicitud', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(solicitud),
                })
            ));
    
            const results = await Promise.all(responses.map(response => response.json()));
    
            const allSuccess = results.every(result => result.success);
            if (allSuccess) {
                alert("Solicitudes de devolución realizadas con éxito.");
                
                setLibrosPedidos(prevLibros =>
                    prevLibros.filter(libro => !selectedBooks.some(selected => selected.title === libro.title && selected.gender === libro.gender))
                );
                
                setSelectedBooks([]);
                setObservacion('');
    
                
            } else {
                const errorMessage = results.find(result => !result.success)?.message || "Error al realizar la solicitud.";
                alert(`Error: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error realizando la solicitud:', error);
            alert("Error al realizar la solicitud.");
        }
    };

    return (
        <div className='cuerposolicitud'>
            <Link to='/paginaprincipal'><FaLongArrowAltLeft style={{ fontSize: "60px",color:"white" }} /></Link>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ padding:"20px",borderRadius:"30px",backgroundColor:"white", display: "flex", flexDirection: "column", width: "50vw",  gap: "3em" }}>
                    <span style={{ fontSize: "30px",fontWeight:"bold" }}>Devolver Libro</span>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1em" }}>
                        <label>Tipo de Solicitud</label>
                        <input value="Regresar" readOnly />
                        <label>Fecha</label>
                        <input value={new Date().toLocaleDateString()} readOnly />
                        <label>Nombre de Usuario</label>
                        <input value={JSON.parse(localStorage.getItem('user') || '{}').userName} readOnly />
                        <label>Libro</label>
                        <div style={{ border: "1px solid",  overflowY: 'auto',height:"15vh" }}>
                            {librosPedidos.map((libro) => (
                                <div key={`${libro.title}-${libro.gender}`} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <input 
                                    
                                        type="checkbox" 
                                        checked={selectedBooks.some(selected => selected.title === libro.title && selected.gender === libro.gender)} 
                                        onChange={() => handleCheckboxChange(libro.title, libro.gender)} 
                                     
                                    />
                                    <span>
                                        <span style={{fontSize:"15px"}}>{libro.title}</span>
                                        <span style={{fontSize:"12px",fontWeight:"bold",color:"red"}}> ({libro.gender})</span>
                                    </span>
                                    
                                </div>
                            ))}
                        </div>
                        <label>Observación</label>
                        <textarea  style={{height:"20vh"}}
                            value={observacion} 
                            onChange={(e) => setObservacion(e.target.value)} 
                        />
                    </div>
                    <button 
                        style={{ width: "7vw", fontSize: "15px", marginLeft: "42vw" }} 
                        onClick={handleSubmit}
                        disabled={isButtonDisabled} 
                    >
                        Solicitar Devolución
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SolicitudLibro;
