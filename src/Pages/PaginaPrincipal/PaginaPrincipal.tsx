import React, { useState } from 'react';
import { CgProfile } from "react-icons/cg";
import Modal from 'react-modal';
import Login from '../Login/Login';

import './PaginaPrincipal.css';

const PaginaPrincipal: React.FC = () => {
    const iconSize = 40;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className='PaginaPrincipal'>
            <div className='encabezado'>
                <div className='perfil'>
                    <div style={{
                        borderRadius: "50%", width: `${iconSize}px`, height: `${iconSize}px`, display: "flex",
                        alignItems: "center", justifyContent: "center"
                    }}>
                        <CgProfile style={{ fontSize: `${iconSize}px`, color: "gray" }} />
                    </div>
                    <button onClick={openModal} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
                        Iniciar Sesión
                    </button>
                </div>
            </div>

            {/* Modal para el Login */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Login Modal"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        zIndex: 1000 // Asegura que el overlay esté encima de otros elementos
                    },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '20px',
                        width: '400px',

                        position: 'relative', // Asegura que el botón se posicione en relación con el modal
                        borderRadius: '10px', // Bordes suaves para el modal
                        overflow: 'visible', // Permite que el contenido se desborde si es necesario
                        
                    }
                }}
            >
                <button onClick={closeModal} style={{
                    position: 'absolute',
                    top: '-10px', // Ajusta la posición según el tamaño del botón
                    right: '-10px', // Ajusta la posición según el tamaño del botón
                    border: 'none',
                    background: 'white',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'black',
                    zIndex: 1100 // Asegura que el botón se superponga al contenido del modal
                }}>
                    &#x2715; {/* Representa la "X" de cierre */}
                </button>
                <Login />
            </Modal>
        </div>
    );
};

export default PaginaPrincipal;
