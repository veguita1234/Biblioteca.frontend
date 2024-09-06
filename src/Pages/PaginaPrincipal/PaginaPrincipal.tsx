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
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '20px',
                        width: '400px',
                        position: 'relative',
                        borderRadius: '10px',
                        overflow: 'visible',
                    }
                }}
            >
                <button onClick={closeModal} style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
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
                    zIndex: 1100
                }}>
                    &#x2715;
                </button>
                <Login />
            </Modal>
        </div>
    );
};

export default PaginaPrincipal;
