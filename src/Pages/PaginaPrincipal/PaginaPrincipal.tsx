import React, { useState, useEffect } from 'react';
import { CgProfile } from "react-icons/cg";
import Modal from 'react-modal';
import { IoIosSearch } from "react-icons/io";
import { FaBookMedical } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Login from '../Login/Login';
import { Card } from "@mui/material";
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';

import './PaginaPrincipal.css';

const PaginaPrincipal: React.FC = () => {
    const iconSize = 40;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [books, setBooks] = useState<any[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
    const [isReturnLinkEnabled, setIsReturnLinkEnabled] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');

    
    useEffect(() => {

        const storedBooks = JSON.parse(localStorage.getItem('books') || '[]');
        setBooks(storedBooks);
        setFilteredBooks(storedBooks);

        // Verificar almacenamiento local para estado de enlace de devolución
        const storedReturnLinkStatus = localStorage.getItem('isReturnLinkEnabled') === 'true';
        setIsReturnLinkEnabled(storedReturnLinkStatus);
        const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        setIsAdmin(userData.tipo === 'ADMIN');
    }

        fetch('https://ceiberapp-001-site1.ftempurl.com/api/Book/books')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const fetchedBooks = data.books;


                    const updatedBooks = fetchedBooks.map((book: any) => {
                        return fetch(`https://ceiberapp-001-site1.ftempurl.com/api/Book/bookimage/${book.imagen}`)
                            .then(response => response.blob())
                            .then(imageBlob => {
                                const imageUrl = URL.createObjectURL(imageBlob);
                                return { ...book, imageUrl };
                            })
                            .catch(error => {
                                console.error('Error fetching book image:', error);
                                return { ...book, imageUrl: '/default-image.png' }; 
                            });
                    });

                    Promise.all(updatedBooks).then(booksWithImages => {
                        setBooks(booksWithImages);
                        setFilteredBooks(booksWithImages);
                        localStorage.setItem('books', JSON.stringify(booksWithImages));
                    });

                } else {
                    console.error('Error fetching books:', data.message);
                }
            })
            .catch(error => console.error('Error fetching books:', error));

        // Verificar si el usuario está logueado
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser.userName) {
            setIsLoggedIn(true);
            setUserName(storedUser.userName);

            // Verificar si el usuario tiene libros para devolver
            fetch(`https://ceiberapp-001-site1.ftempurl.com/api/Book/obtenerLibrosParaDevolver?userName=${storedUser.userName}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const librosParaDevolver = data.libros;
                        const shouldEnableReturnLink = librosParaDevolver.length > 0;
                        setIsReturnLinkEnabled(shouldEnableReturnLink);
                        localStorage.setItem('isReturnLinkEnabled', shouldEnableReturnLink ? 'true' : 'false'); 
                    } else {
                        console.error('Error fetching returnable books:', data.message);
                    }
                })
                .catch(error => console.error('Error fetching returnable books:', error));
        }
    }, []);

    useEffect(() => {
       
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filtered = books.filter(book =>
            book.tittle.toLowerCase().includes(lowercasedSearchTerm) ||
            book.author.toLowerCase().includes(lowercasedSearchTerm) ||
            book.year.toString().includes(lowercasedSearchTerm) ||
            book.gender.toLowerCase().includes(lowercasedSearchTerm)
        );
        setFilteredBooks(filtered);
    }, [searchTerm, books]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleLoginSuccess = (userName: string) => {
        setUserName(userName);
        setIsLoggedIn(true);

        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setIsAdmin(userData.tipo === 'ADMIN');
        localStorage.setItem('user', JSON.stringify({ userName, tipo: userData.tipo }));
        closeModal();
    };
    

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('isReturnLinkEnabled'); 
        setIsLoggedIn(false);
        setUserName('');
        setIsReturnLinkEnabled(false); 
    };

    const handlePedir = (bookTitle: string) => {
        if (!isLoggedIn) {
            alert("Por favor, inicie sesión primero.");
            return;
        }
    

        const solicitud = {
            tipo: "Pedir",
            fecha: new Date().toISOString(),
            userName,
            book: bookTitle,
            observation: null
        };
    
        fetch('https://ceiberapp-001-site1.ftempurl.com/api/Solicitud/crearSolicitud', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(solicitud),
        })
        .then(response => response.json())
        .then(data => {

            if (data.success) {
                alert("Solicitud realizada con éxito.");
                setIsReturnLinkEnabled(true); // Habilitar el enlace de devolver libro
                localStorage.setItem('isReturnLinkEnabled', 'true'); 
                window.location.reload();
            } else {
                alert(`Error: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error realizando la solicitud:', error);
            alert("Error al realizar la solicitud.");
        });
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };


    
    return (
        <div className='PaginaPrincipal'>
            <div className='encabezado'>
            <div style={{height:"5vh",width:"9vw",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                {isAdmin && (
                        <Link style={{textDecoration:"none",color:"blue"}} to='/añadir-libros'>
                            <FaBookMedical style={{fontSize:"20px"}}/>
                            <span style={{fontSize:"20px"}}>Añadir Libros</span>
                        </Link>
                    )}
                </div>
                <div style={{ position: 'relative', width: '30vw' }}>
                    <input
                        type="text"
                        placeholder="Titulo , autor, genero"
                        style={{
                            width: '26.5vw',
                            padding: '10px 40px 10px 10px',
                            borderRadius: '20px',
                            border:"1px solid black",
                            outline: 'none',
                        }}
                        value={searchTerm}
                        onChange={handleSearchChange}
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
                </div>
                
                <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center",gap:"2em"}}>
                <div style={{ height:"5vh",width:"9vw",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                    <Link 
                        style={{textDecoration:"none",color:"blue", pointerEvents: isReturnLinkEnabled ? 'auto' : 'none', opacity: isReturnLinkEnabled ? 1 : 0.5}} 
                        to='/solicitud-libro'
                    >
                        <span style={{fontSize:"20px"}}>Devolver Libro</span>
                    </Link>
                </div>
                <div className='perfil'>
                    <div style={{
                        borderRadius: "50%", width: `${iconSize}px`, height: `${iconSize}px`, display: "flex",
                        alignItems: "center", justifyContent: "center"
                    }}>
                        <CgProfile style={{ fontSize: `${iconSize}px`, color: "gray" }} />
                    </div>
                    {!isLoggedIn ? (
                        <button onClick={openModal} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
                            Iniciar Sesión
                        </button>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center',flexDirection:"column"}}>
                            <span>Bienvenido {userName}</span>
                            <button onClick={handleLogout} style={{ marginLeft: '10px', background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>
                                Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
                </div>
            </div>

            <div className='cuerpo'>
            {filteredBooks.map((book) => (
                    <Card key={book.bookId} sx={{ border:"1px solid gray",boxShadow:"0px 4px 8px rgba(0, 0, 0, 0.2)",width: "20vw", height: "60vh", textAlign: "center", alignItems: "center", display: "flex", flexDirection: "column", margin: '10px' }}>
                        <CardMedia
                        component="img"
                            sx={{ width: "10vw", height: "25vh",objectFit: 'cover' }}
                            image={book.imageUrl || "/default-image.png"}  
                            alt="Book cover"
                        />
                        <CardContent style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1em" }}>
                            <label>Titulo :</label>
                            <span>{book.tittle}</span>
                            <label>Autor :</label>
                            <span>{book.author}</span>
                            <label>Genero :</label>
                            <span>{book.gender}</span>
                            <label>Año :</label>
                            <span>{book.year}</span>
                            <label>Cantidad :</label>
                            <span>{book.cantidad}</span>
                        </CardContent>
                        <CardActions>
                            <Button onClick={() => handlePedir(book.tittle)}>Pedir</Button>
                        </CardActions>
                    </Card>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Login Modal"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        zIndex: 1000
                    },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        transform: 'translate(-50%, -50%)'
                    }
                }}
            >
                <Login closeModal={closeModal} onLoginSuccess={handleLoginSuccess} />
            </Modal>
        </div>
    );
};

export default PaginaPrincipal;
