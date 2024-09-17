import React, { useState, useEffect } from 'react';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { Card } from "@mui/material";
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import { Link } from 'react-router-dom';
import './AñadirLibros.css';

const AñadirLibros: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [books, setBooks] = useState<any[]>([]);
    const [bookDetails, setBookDetails] = useState({
        titulo: '',
        autor: '',
        genero: '',
        año: '',
        cantidad: ''
    });
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        fetch('https://ceiberapp-001-site1.ftempurl.com/api/Book/books')
        //fetch('http://localhost:5243/api/Book/books')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setBooks(data.books);
                } else {
                    console.error('Error fetching books:', data.message);
                }
            })
            .catch(error => console.error('Error fetching books:', error));
    }, []);

    useEffect(() => {
        if (selectedBookId) {
            fetch(`https://ceiberapp-001-site1.ftempurl.com/api/Book/getbookimage/${selectedBookId}`)
            //fetch(`http://localhost:5243/api/Book/getbookimage/${selectedBookId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.image) {
                        setImageUrl(`https://ceiberapp-001-site1.ftempurl.com/api/Book/bookimage/${data.image}`);
                        //setImageUrl(`http://localhost:5243/api/Book/bookimage/${data.image}`);
                    } else {
                        setImageUrl(null);
                    }
                })
                .catch(error => console.error('Error fetching book image:', error));
        }
    }, [selectedBookId]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBookDetails({ ...bookDetails, [name]: value });
    };

    const handleAddOrUpdateBook = async () => {
        if (!bookDetails.titulo || !bookDetails.autor || !bookDetails.genero || !bookDetails.año || isNaN(Number(bookDetails.cantidad))) {
            alert('Por favor, complete todos los campos correctamente.');
            return;
        }
        
        let imageName = '';
        if (selectedImage) {
            const formData = new FormData();
            formData.append('imageFile', selectedImage);
    
            try {
                const uploadResponse = await fetch('https://ceiberapp-001-site1.ftempurl.com/api/Book/uploadbookimage', {
                //const uploadResponse = await fetch('http://localhost:5243/api/Book/uploadbookimage', {
                    method: 'POST',
                    body: formData
                });
                const uploadData = await uploadResponse.json();
                if (uploadData.success) {
                    imageName = uploadData.fileName;
                } else {
                    console.error('Error uploading image:', uploadData.message);
                    alert(`Error al subir la imagen: ${uploadData.message}`);
                    return;
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Error al subir la imagen.');
                return;
            }
        }
    
        const bookData = {
            Tittle: bookDetails.titulo,
            Author: bookDetails.autor,
            Gender: bookDetails.genero,
            Year: bookDetails.año,
            Cantidad: parseInt(bookDetails.cantidad, 10),
            Imagen: imageName || (imageUrl ? imageUrl.split('/').pop() || '' : '')
        };
    
        const url = isUpdating && selectedBookId
            ? `https://ceiberapp-001-site1.ftempurl.com/api/Book/updatebookdata/${selectedBookId}`
            : 'https://ceiberapp-001-site1.ftempurl.com/api/Book/addbookdata';
            //? `http://localhost:5243/api/Book/updatebookdata/${selectedBookId}`
            //: 'http://localhost:5243/api/Book/addbookdata';
        const method = isUpdating && selectedBookId ? 'PUT' : 'POST';
    
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookData)
            });
            const data = await response.json();
            if (data.success) {
                alert(isUpdating ? 'Libro actualizado con éxito' : 'Libro añadido con éxito');
                setBookDetails({
                    titulo: '',
                    autor: '',
                    genero: '',
                    año: '',
                    cantidad: ''
                });
                setSelectedBookId(null);
                setSelectedImage(null);
                setImageUrl(null);
                setIsUpdating(false);
                const booksResponse = await fetch('https://ceiberapp-001-site1.ftempurl.com/api/Book/books');
                //const booksResponse = await fetch('http://localhost:5243/api/Book/books');
                const booksData = await booksResponse.json();
                if (booksData.success) {
                    setBooks(booksData.books);
                } else {
                    console.error('Error fetching books after update:', booksData.message);
                }
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error adding/updating book:', error);
            alert('Ocurrió un error al añadir o actualizar el libro.');
        }
    };

    const handleUpdateClick = (book: any) => {
        setSelectedBookId(book.bookId);
        setBookDetails({
            titulo: book.tittle,
            autor: book.author,
            genero: book.gender,
            año: book.year.toString(),
            cantidad: book.cantidad.toString(),
        });
        setSelectedImage(null);
        setImageUrl(book.imagen ? `https://ceiberapp-001-site1.ftempurl.com/api/Book/bookimage/${book.imagen}` : null);
        //setImageUrl(book.imagen ? `http://localhost:5243/api/Book/bookimage/${book.imagen}` : null);
        setIsUpdating(true);
    };

    const handleAddBookClick = () => {
        setSelectedBookId(null);
        setBookDetails({
            titulo: '',
            autor: '',
            genero: '',
            año: '',
            cantidad: ''
        });
        setSelectedImage(null);
        setImageUrl(null);
        setIsUpdating(false);
    };

    const styles = {
        headerCell: {
            padding: '10px',
            border: '1px solid black',
            backgroundColor: '#f0f0f0',
            fontWeight: 'bold' as 'bold',
        },
        cell: {
            padding: '10px',
            border: '1px solid black',
            textAlign: 'center' as 'center',
        },
        buttonCell: {
            padding: '10px',
            border: '1px solid black',
            textAlign: 'center' as 'center',
        },
        button: {
            padding: '5px 10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
        },
    };

    return (
        <div className='body'>
            <div><Link to='/paginaprincipal'><FaLongArrowAltLeft style={{fontSize:"60px"}} /></Link></div>
            <div className='cuerpoañadir' style={{ marginTop: "8vh", display: "flex", flexDirection: "row", gap: "25em", padding: "20px" }}>
                <Card sx={{ width: "20vw", height: "60vh", textAlign: "center", alignItems: "center", display: "flex", flexDirection: "column",
                    border:"1px solid gray",padding:"20px",boxShadow:"0px 4px 8px rgba(0, 0, 0, 0.2)"
                 }}>
                    <CardMedia
                        sx={{ width: "10vw", height: "25vh" }}
                        image={imageUrl || '/default-image.png'}
                        title="Imagen del libro"
                    />
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ margin: '10px' }} />
                    <CardContent style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1em" }}>
                        <label>Titulo</label>
                        <input name="titulo" value={bookDetails.titulo} onChange={handleInputChange} />
                        <label>Autor</label>
                        <input name="autor" value={bookDetails.autor} onChange={handleInputChange} />
                        <label>Genero</label>
                        <input name="genero" value={bookDetails.genero} onChange={handleInputChange} />
                        <label>Año</label>
                        <input name="año" value={bookDetails.año} onChange={handleInputChange} />
                        <label>Cantidad</label>
                        <input name="cantidad" type="number" value={bookDetails.cantidad} onChange={handleInputChange} />
                    </CardContent>
                    <CardActions>
                        <Button size="small" onClick={handleAddOrUpdateBook} style={{ backgroundColor: 'gray', color: 'white' }}>
                            {isUpdating ? 'Actualizar' : 'Añadir'}
                        </Button>
                        {isUpdating && (
                            <Button size="small" onClick={handleAddBookClick} style={{ backgroundColor: 'red', color: 'white' }}>
                                Cancelar
                            </Button>
                        )}
                    </CardActions>
                </Card>
                <div style={{ flex: 1, overflowX: "auto", maxWidth: "60vw",marginTop:"10vh",height:"42.5vh" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead style={{position: "sticky", top: 0, backgroundColor: "red", zIndex: 1,border:"1px solid black"}}>
                            <tr>
                                <th style={styles.headerCell}>Título</th>
                                <th style={styles.headerCell}>Autor</th>
                                <th style={styles.headerCell}>Género</th>
                                <th style={styles.headerCell}>Año</th>
                                <th style={styles.headerCell}>Cantidad</th>
                                <th style={styles.headerCell}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody style={{backgroundColor:"white"}}>
                            {books.map((book) => (
                                <tr key={book.bookId}>
                                    <td style={styles.cell}>{book.tittle}</td>
                                    <td style={styles.cell}>{book.author}</td>
                                    <td style={styles.cell}>{book.gender}</td>
                                    <td style={styles.cell}>{book.year}</td>
                                    <td style={styles.cell}>{book.cantidad}</td>
                                    
                                    <td style={styles.buttonCell}>
                                        <Button
                                            onClick={() => handleUpdateClick(book)}
                                            style={styles.button}
                                        >
                                            Editar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AñadirLibros;
