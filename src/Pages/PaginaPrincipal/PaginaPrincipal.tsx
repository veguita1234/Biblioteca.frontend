import React , {useState} from 'react';
import { CgProfile } from "react-icons/cg";
import Modal from 'react-modal';
import Login from '../Login/Login';

import './PaginaPrincipal.css'

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
                    {/* Aquí no usamos Link, sino que ejecutamos una función que abre el modal */}
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
                        backgroundColor: 'rgba(0, 0, 0, 0.75)'
                    },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '20px',
                        width: '400px'
                    }
                }}
            >
                <button onClick={closeModal} style={{ float: 'right', border: 'none', background: 'none', cursor: 'pointer' }}>X</button>
                <Login />
            </Modal>
        </div>
    );
};

export default PaginaPrincipal;