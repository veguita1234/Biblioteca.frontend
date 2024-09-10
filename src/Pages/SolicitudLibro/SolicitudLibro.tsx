import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaLongArrowAltLeft } from "react-icons/fa";
import './SolicitudLibro.css';

const SolicitudLibro: React.FC = () => {
    const [librosPedidos, setLibrosPedidos] = useState<any[]>([]);
    const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
    const [observacion, setObservacion] = useState<string>('');
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true); // Estado para el botón

    useEffect(() => {
        const fetchLibrosParaDevolver = async () => {
            const token = localStorage.getItem('token');
            const userName = JSON.parse(localStorage.getItem('user') || '{}').userName;
            
            if (!token || !userName) {
                console.error('Token o nombre de usuario no disponibles');
                return;
            }

            try {
                const response = await fetch(`http://localhost:5243/api/Solicitud/obtenerLibrosParaDevolver?userName=${encodeURIComponent(userName)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await response.json();

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
        setIsButtonDisabled(selectedBooks.length === 0); // Habilita el botón solo si hay libros seleccionados
    }, [selectedBooks]);

    const handleCheckboxChange = (bookTitle: string) => {
        setSelectedBooks(prev => 
            prev.includes(bookTitle) ? prev.filter(title => title !== bookTitle) : [...prev, bookTitle]
        );
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        const userName = JSON.parse(localStorage.getItem('user') || '{}').userName;
    
        if (!token || !userName) {
            console.error('Token o nombre de usuario no disponibles');
            return;
        }
    
        const solicitudes = selectedBooks.map((bookTitle) => ({
            tipo: "Regresar",
            fecha: new Date().toISOString(),
            userName,
            book: bookTitle,
            observation: observacion || null,
        }));
    
        try {
            const responses = await Promise.all(solicitudes.map(solicitud => 
                fetch('http://localhost:5243/api/Solicitud/crearSolicitud', {
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
                
                // Actualizar la lista de libros pedidos para eliminar los libros seleccionados
                setLibrosPedidos(prevLibros =>
                    prevLibros.filter(libro => !selectedBooks.includes(libro.title)) // Asegúrate de que 'title' coincide con el campo correcto
                );
                
                // Limpiar la selección de libros y la observación
                setSelectedBooks([]);
                setObservacion('');
    
                // Opcionalmente, puedes volver a cargar la lista de libros para asegurar que esté actualizada
                // fetchLibrosParaDevolver();
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
                <div style={{ padding:"20px",borderRadius:"30px",backgroundColor:"white", display: "flex", flexDirection: "column", width: "50vw", marginTop: "10vh", gap: "3em" }}>
                    <span style={{ fontSize: "30px" }}>Devolver Libro</span>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1em" }}>
                        <label>Tipo de Solicitud</label>
                        <input value="Regresar" readOnly />
                        <label>Fecha</label>
                        <input value={new Date().toLocaleDateString()} readOnly />
                        <label>Nombre de Usuario</label>
                        <input value={JSON.parse(localStorage.getItem('user') || '{}').userName} readOnly />
                        <label>Libro</label>
                        <div style={{ border: "1px solid",  overflowY: 'scroll' }}>
                            {librosPedidos.map((libro) => (
                                <div key={libro.title}>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedBooks.includes(libro.title)} 
                                        onChange={() => handleCheckboxChange(libro.title)} 
                                    />
                                    <span>{libro.title}</span>
                                </div>
                            ))}
                        </div>
                        <label>Observación</label>
                        <textarea 
                            value={observacion} 
                            onChange={(e) => setObservacion(e.target.value)} 
                        />
                    </div>
                    <button 
                        style={{ width: "7vw", fontSize: "15px", marginLeft: "42vw" }} 
                        onClick={handleSubmit}
                        disabled={isButtonDisabled} // Deshabilitar el botón en base al estado
                    >
                        Solicitar Devolución
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SolicitudLibro;
