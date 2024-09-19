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
import { AiOutlineDeliveredProcedure } from "react-icons/ai";

import './PaginaPrincipal.css';

const PaginaPrincipal: React.FC = () => {
    const iconSize = 40;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [books, setBooks] = useState<any[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    
    useEffect(() => {

        const storedBooks = JSON.parse(localStorage.getItem('books') || '[]');
        setBooks(storedBooks);
        setFilteredBooks(storedBooks);


        fetch('https://ceiberapp-001-site1.ftempurl.com/api/Book/books')
        //fetch('http://localhost:5243/api/Book/books')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const fetchedBooks = data.books;


                    const updatedBooks = fetchedBooks.map((book: any) => {
                        return fetch(`https://ceiberapp-001-site1.ftempurl.com/api/Book/bookimage/${book.imagen}`)
                        //return fetch(`http://localhost:5243/api/Book/bookimage/${book.imagen}`)
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

        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser.userName) {
            setIsLoggedIn(true);
            setUserName(storedUser.userName);
            setIsAdmin(storedUser.tipo === 'ADMIN');

            fetch(`https://ceiberapp-001-site1.ftempurl.com/api/Book/obtenerLibrosParaDevolver?userName=${storedUser.userName}`)
            //fetch(`http://localhost:5243/api/Book/obtenerLibrosParaDevolver?userName=${storedUser.userName}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const librosParaDevolver = data.libros;
                        const shouldEnableReturnLink = librosParaDevolver.length > 0;

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
            book.author?.toLowerCase().includes(lowercasedSearchTerm) ||
            book.year?.toString().includes(lowercasedSearchTerm) ||
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
        window.location.reload();
    };

    const handlePedir = (bookId: string, userName: string) => {
        if (!isLoggedIn) {
            alert("Por favor, inicie sesión primero.");
            return;
        }
        
        fetch('https://ceiberapp-001-site1.ftempurl.com/api/Book/book/${bookId}')
        //fetch(`http://localhost:5243/api/Book/book/${bookId}`)
        .then(response => response.json())
        .then(bookData => {
            if (bookData.success) {
                const bookTitle = bookData.book.tittle; 
            const bookGender = bookData.book.gender;

                if (!bookTitle || !bookGender) {
                    alert("No se pudieron obtener los detalles del libro.");
                    return;
                }
    

                const solicitud = {
                    tipo: "Pedir",
                fecha: new Date().toISOString(),
                userName,
                bookId,
                book: bookTitle,
                gender: bookGender,
                observation: null
                    };

                console.log("Datos de la solicitud:", solicitud);

                fetch('https://ceiberapp-001-site1.ftempurl.com/api/Solicitud/crearSolicitud', {
                //fetch('http://localhost:5243/api/Solicitud/crearSolicitud', {
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
            } else {
                alert("Error obteniendo los detalles del libro.");
            }
        })
        .catch(error => {
            console.error('Error al obtener los detalles del libro:', error);
            alert("Error al obtener los detalles del libro.");
        });
};

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };


    
    return (
        <div className='PaginaPrincipal'>
            <div className='encabezado'>
            
            <div style={{height:"13vh",width:"30vw",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center",gap:"2em"}}>
  <img style={{height:"13vh"}} src='PALPA.png'/>
  
  {isAdmin ? (
    <div style={{display:"flex",flexDirection:"row",width:"30vw",gap:"2em"}}>
      <Link style={{textDecoration:"none",color:"blue"}} to='/añadir-libros'>
        <FaBookMedical style={{fontSize:"20px"}}/>
        <span style={{fontSize:"20px"}}>Añadir Libros</span>
      </Link>
    </div>
  ) : (
    // div vacío para mantener el layout
    <div style={{width:"30vw"}}></div>
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
                        style={{textDecoration:"none",color:"blue", 
                        }} 
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
                            <span>
                                <span style={{fontSize:"12px"}}>{userName}</span>
                            </span>
                            <button onClick={handleLogout} style={{ marginLeft: '10px', background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>
                                Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
                </div>
            </div>

            <div className='cuerpo'>
                <img style={{height:"18vh",width:"20vw"}} src='JORNADA.png'/>
                <div  className='subcuerpo'>
                {filteredBooks.map((book) => (
                    <Card key={book.bookTitle} sx={{ border:"1px solid gray",boxShadow:"0px 4px 8px rgba(0, 0, 0, 0.2)",width: "20vw", height: "60vh", textAlign: "center", alignItems: "center", display: "flex", flexDirection: "column", margin: '10px' }}>
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
                            {/* Condicional para mostrar el botón según el estado del usuario */}
                    {isAdmin ? (
                       <Link to='/entregarlibros' style={{ textDecoration: 'none' }}>
                            <Button>Entregar Libro</Button>
                        </Link>
                    ) : (
                        <Button onClick={() => handlePedir(book.bookId, userName)}>Pedir</Button>
                    )}
                        </CardActions>
                    </Card>
                ))}
                </div>
            
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
