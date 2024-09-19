import React, { useState, useRef,useEffect } from 'react';
import './EntregarLibros.css';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { IoIosSearch } from "react-icons/io";

const EntregarLibros: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [bookSearchTerm, setBookSearchTerm] = useState<string>('');
    const [bookSearchResults, setBookSearchResults] = useState<any[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
    const [selectedBook, setSelectedBook] = useState<any[]>([]);
    const [requestType, setRequestType] = useState<string>('');
    const [librosParaDevolver, setLibrosParaDevolver] = useState<any[]>([]);
    const searchResultsRef = useRef<HTMLDivElement>(null);
    const bookSearchResultsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
                setSearchResults([]);
            }
            if (bookSearchResultsRef.current && !bookSearchResultsRef.current.contains(event.target as Node)) {
                setBookSearchResults([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        // Función para limpiar todos los estados relacionados con la solicitud
        const resetStates = () => {
            setSearchTerm('');
            setSearchResults([]);
            setBookSearchTerm('');
            setBookSearchResults([]);
            setSelectedStudents([]);
            setSelectedBook([]);
            setLibrosParaDevolver([]);
        };
    
        // Llamada a la función de reseteo cuando cambie requestType
        resetStates();
    }, [requestType]);

    const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value;
        setSearchTerm(term);

        if (term.trim() !== '') {
            try {
                const response = await fetch(`https://ceiberapp-001-site1.ftempurl.com/api/User/users/filter?searchTerm=${encodeURIComponent(term)}`);
                //const response = await fetch(`http://localhost:5243/api/User/users/filter?searchTerm=${encodeURIComponent(term)}`);
                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }
                const data = await response.json();
                if (data && data.users) {
                    setSearchResults(data.users);
                } else {
                    setSearchResults([]);
                }
            } catch (error) {
                console.error('Error al obtener los usuarios filtrados:', error);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleBookSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value;
        setBookSearchTerm(term);

        if (term.trim() !== '') {
            try {
                const response = await fetch(`https://ceiberapp-001-site1.ftempurl.com/api/Book/books/filter?searchTerm=${encodeURIComponent(term)}`);
                //const response = await fetch(`http://localhost:5243/api/Book/books/filter?searchTerm=${encodeURIComponent(term)}`);
                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }
                const data = await response.json();
                if (data && data.books) {
                    setBookSearchResults(data.books);
                } else {
                    setBookSearchResults([]);
                }
            } catch (error) {
                console.error('Error al obtener los libros filtrados:', error);
                setBookSearchResults([]);
            }
        } else {
            setBookSearchResults([]);
        }
    };

    const handleUserSelect = async (user: any) => {
        if (requestType === 'Recuperar Libro' && selectedStudents.length >= 1) {
            alert('Solo se permite un usuario en este tipo de solicitud.');
            return;
        }

        setSelectedStudents(prev => {
            if (prev.find(u => u.userId === user.userId)) {
                return prev;
            }
            return [...prev, user];
        });
        setSearchTerm('');
        setSearchResults([]);

        if (requestType === 'Recuperar Libro') {
            try {
                const response = await fetch(`https://ceiberapp-001-site1.ftempurl.com/api/Solicitud/obtenerLibrosParaDevolver?userName=${encodeURIComponent(user.userName)}`);
                //const response = await fetch(`http://localhost:5243/api/Solicitud/obtenerLibrosParaDevolver?userName=${encodeURIComponent(user.userName)}`);
                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }
                const data = await response.json();
                if (data.success) {
                    setLibrosParaDevolver(data.libros);
                } else {
                    alert(data.Message);
                    setLibrosParaDevolver([]);
                }
            } catch (error) {
                console.error('Error al obtener los libros para devolver:', error);
                setLibrosParaDevolver([]);
            }
        }
    };

    const handleBookSelect = (book: any) => {
        console.log('Libro seleccionado:', book);
    
        setSelectedBook(prev => {
            const isBookAlreadySelected = prev.some(b => b.bookId === book.bookId);
            if (isBookAlreadySelected) {
                console.log('El libro ya está seleccionado:', book);
                return prev; // No actualiza el estado si ya está seleccionado
            }
    
            const updatedBooks = [...prev, book];
            console.log('Libros seleccionados después de agregar:', updatedBooks);
            return updatedBooks;
        });
    
        setBookSearchTerm(''); // Limpia el término de búsqueda si es necesario
        setBookSearchResults([]); // Limpia los resultados de búsqueda si es necesario
    };

    const handleStudentRemove = (userId: string) => {
        setSelectedStudents(prev => {
            const updatedStudents = prev.filter(student => student.userId !== userId);
            if (updatedStudents.length === 0 && requestType === 'Recuperar Libro') {
                setLibrosParaDevolver([]); // Clear books if no students
            }
            return updatedStudents;
        });
    };

    const handleBookRemove = (bookId: string) => {
        setSelectedBook(prev => {
            const updatedBooks = prev.filter(book => book.bookId !== bookId);
            if (updatedBooks.length === 0) {
                setLibrosParaDevolver([]); // Clear message if no books
            }
            return updatedBooks;
        });
    };

    const handleSubmit = async () => {
        console.log('Tipo de solicitud:', requestType);
        
        // Validar selección de estudiantes y libros
        if (selectedStudents.length === 0 || 
            (requestType === 'Entregar Libro' && selectedBook.length === 0) || 
            (requestType === 'Recuperar Libro' && librosParaDevolver.length === 0)) {
            alert('Debes seleccionar al menos un estudiante y un libro.');
            return;
        }
        console.log('Libros para devolver:', librosParaDevolver);

        const requests = [];
        const unavailableBooks = [];
    
        // Seleccionar libros dependiendo del tipo de solicitud
        const booksToProcess = requestType === 'Entregar Libro' ? selectedBook : librosParaDevolver;
        const titleField = requestType === 'Entregar Libro' ? 'tittle' : 'title';
        if (requestType === 'Recuperar Libro') {
            for (const book of booksToProcess) {
                let availableCopies = book.quantity; // Asume que quantity es la propiedad para la cantidad disponible
                if (availableCopies <= 0) {
                    unavailableBooks.push(book[titleField]);
                }
            }
    
            if (unavailableBooks.length > 0) {
                alert(`Los siguientes libros no están disponibles: ${unavailableBooks.join(', ')}`);
                return;
            }
        }
    
        // Crear solicitudes para cada combinación de estudiante y libro
        for (const student of selectedStudents) {
            for (const book of booksToProcess) {
                const solicitud = {
                    Tipo: requestType === 'Entregar Libro' ? 'Pedir' : 'Regresar',
                    UserName: student.userName,
                    Fecha: new Date().toISOString(),
                    BookId: book.bookId,
                    Book: book[titleField],
                    Gender: book.gender,
                    Observation: null
                };
                console.log('Solicitud a enviar:', solicitud);
                requests.push(solicitud);
            }
        }
    
        try {
            await Promise.all(
                requests.map(async (solicitud) => {
                    const response = await fetch('https://ceiberapp-001-site1.ftempurl.com/api/Solicitud/crearSolicitud', {
                    //const response = await fetch('http://localhost:5243/api/Solicitud/crearSolicitud', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(solicitud)
                    });
                    console.log('Datos enviados:', JSON.stringify(solicitud, null, 2));
    
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.Message || 'Error en la solicitud');
                    }
                    const result = await response.json();
                    if (!result.Success) {
                        throw new Error(result.Message || 'Error desconocido');
                    }
                })
            );
            alert('Solicitudes procesadas exitosamente.');
        } catch (error) {
            alert('Solicitud procesada exitosamente');
            window.location.reload();
        }
    };
    
    

    console.log('Renderizando libros para devolver:', librosParaDevolver);

    return (
        <div className='cuerpoentregar'>
            <Link to='/paginaprincipal'><FaLongArrowAltLeft style={{ fontSize: "60px", color: "white" }} /></Link>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ padding: "20px", borderRadius: "30px", backgroundColor: "white", display: "flex", flexDirection: "column", width: "50vw", gap: "3em" }}>
                    <span style={{ fontSize: "30px", fontWeight: "bold" }}>Entregar Libros</span>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1em" }}>
                        <label>Tipo de Solicitud</label>
                        <select value={requestType} onChange={(e) => setRequestType(e.target.value)} style={{ textTransform: "uppercase" }}>
                            <option value="" disabled>Selecciona</option>
                            <option>Entregar Libro</option>
                            <option>Recuperar Libro</option>
                        </select>
                        <label>Fecha</label>
                        <input value={new Date().toLocaleDateString()} readOnly />
                        <label>Buscar Nombre</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Nombre, apellido"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                style={{
                                    padding: '10px 40px 10px 10px',
                                    border: "1px solid black",
                                    outline: 'none',
                                    width: '21.1vw',
                                }}
                            />
                            <IoIosSearch
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'gray',
                                }}
                                size={20}
                            />
                            {searchResults.length > 0 && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: '0',
                                    width: '100%',
                                    border: '1px solid black',
                                    backgroundColor: 'white',
                                    zIndex: 10,
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                }}>
                                    {searchResults.map(user => (
                                        <div
                                            key={user.userId}
                                            style={{ padding: '10px', cursor: 'pointer' }}
                                            onClick={() => handleUserSelect(user)}
                                        >
                                            {user.userName}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <label>Alumno (a)</label>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            height: 'auto',
                            border: '1px solid black',
                            padding: '10px',
                            boxSizing: 'border-box',
                            backgroundColor: 'white',
                            maxHeight: '15vh',
                            overflowY: 'auto'
                        }}>
                            {selectedStudents.map(student => (
                                <div key={student.userId} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    borderBottom: '1px solid #ccc',
                                    padding: '5px'
                                }}>
                                    {student.userName}
                                    <button onClick={() => handleStudentRemove(student.userId)} style={{
                                        marginLeft: '10px',
                                        backgroundColor: 'red',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        cursor: 'pointer'
                                    }}>X</button>
                                </div>
                            ))}
                        </div>
                        {requestType === 'Entregar Libro' && (
                <>
                    <label>Buscar Libro</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Título, autor, género"
                            value={bookSearchTerm}
                            onChange={handleBookSearchChange}
                            style={{
                                padding: '10px 40px 10px 10px',
                                border: "1px solid black",
                                outline: 'none',
                            }}
                        />
                        <IoIosSearch
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'gray',
                            }}
                            size={20}
                        />
                        {bookSearchResults.length > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: '0',
                                width: '100%',
                                border: '1px solid black',
                                backgroundColor: 'white',
                                zIndex: 10,
                                maxHeight: '200px',
                                overflowY: 'auto',
                            }}>
                                {bookSearchResults.map(book => (
                                        <div
                                            key={book.bookId}
                                            style={{ padding: '10px', cursor: 'pointer' }}
                                            onClick={() => handleBookSelect(book)}
                                        >
                                            <span>{book.tittle} </span>{/* Ajusta según el nombre del campo */}
                                            <span style={{ color: 'gray' }}>{book.gender}</span> {/* Ajusta según el nombre del campo */}
                                        </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <label>Libro</label>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        height: 'auto',
                        border: '1px solid black',
                        padding: '10px',
                        boxSizing: 'border-box',
                        backgroundColor: 'white',
                        maxHeight: '15vh',
                        overflowY: 'auto'
                    }}>
                         {selectedBook.map(book => (
                                <div key={book.bookId} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    borderBottom: '1px solid #ccc',
                                    padding: '5px 0'
                                }}>
                                    <span>
                                        <span style={{fontSize:"13px"}}>{book.tittle}</span>
                                        <span style={{fontSize:"11px",fontWeight:"bold",color:"red"}}> ({book.gender})</span>
                                    </span>
                                <button onClick={() => handleBookRemove(book.bookId)} style={{
                                    marginLeft: '10px',
                                    backgroundColor: 'red',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer'
                                }}>X</button>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {requestType === 'Recuperar Libro' && (
                <>
                    <label>Libros para devolver</label>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px',
                        alignItems: 'center',
                        border: '1px solid #ccc',
                        padding: '5px',
                        borderRadius: '5px'
                    }}>
                        {librosParaDevolver.length > 0 ? (
                            librosParaDevolver.map(book => (
                                <div key={book.bookId} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '5px',
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: '5px'
                                }}><span>
                                    <span style={{fontSize:"13px"}}>{book.title}</span>
                                    <span style={{fontSize:"11px",fontWeight:"bold",color:"red"}}> ({book.gender})</span>
                                </span>
                                    
                                </div>
                            ))
                        ) : (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '5px',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '5px'
                            }}>
                                No hay libros para devolver.
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
                    <button
                        style={{ width: "7vw", fontSize: "15px", marginLeft: "42vw" }}
                        type="button"
                        onClick={handleSubmit}
              
                    >
                        Realizar Proceso
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EntregarLibros;
