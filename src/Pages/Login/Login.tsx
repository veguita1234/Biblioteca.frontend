import React, { useState } from 'react';
import './Login.css';

interface LoginProps {
    closeModal: () => void;
    onLoginSuccess: (name: string) => void;
}

const Login: React.FC<LoginProps> = ({ closeModal, onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        name: '',
        lastName: '',
        email: '',
        dni: '',
        tipo: ''
    });

    const [errors, setErrors] = useState({
        userName: '',
        password: '',
        name: '',
        lastName: '',
        email: '',
        dni: '',
    });

    const switchToRegister = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setIsLogin(false);
        setFormData({
            ...formData,
            tipo: 'USUARIO'
        });
    };

    const switchToLogin = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setIsLogin(true);
        setFormData({
            ...formData,
            tipo: ''
        });
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrors({
            ...errors,
            [e.target.name]: ''
        });
    };

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5243/api/User/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    UserName: formData.userName,
                    Password: formData.password,
                    Tipo: formData.tipo
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.Message || 'Inicio de sesión exitoso.');


                localStorage.setItem('user', JSON.stringify({
                    userName: formData.userName,
                    tipo: formData.tipo
                }));

                onLoginSuccess(formData.userName); 
                closeModal();
            } else {
                alert(result.message || 'Error al iniciar sesión.');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Error en la solicitud. Por favor, intente de nuevo.');
        }
    };

    const handleRegister = async () => {
        try {
            const response = await fetch('http://localhost:5243/api/User/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    UserName: formData.userName,
                    Password: formData.password,
                    Tipo: formData.tipo,
                    Name: formData.name,
                    LastName: formData.lastName,
                    Email: formData.email,
                    DNI: formData.dni
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.Message || 'Registro exitoso.');


                localStorage.setItem('user', JSON.stringify({
                    userName: formData.userName,
                    tipo: formData.tipo
                }));

                onLoginSuccess(formData.userName); 
                closeModal();
            } else {
                alert(result.message || 'Error al registrarse.');
            }
        } catch (error) {
            console.error('Error al registrarse:', error);
            alert('Error en la solicitud. Por favor, intente de nuevo.');
        }
    };

    return (
        <div style={{ height: isLogin ? '50vh' : '60vh' }} className="modal">
            {isLogin ? (
                <>
                    <div style={{ fontSize: "25px" }}>Iniciar Sesión</div>

                    <div className='forumularioinicio'>
                        <label style={{ width: "8vw" }}>Tipo</label>
                        <select
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                        
                            style={{ textTransform: "uppercase" }}
                        >
                            <option value="" disabled>Selecciona</option>
                            <option value="USUARIO">USUARIO</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>
                    <div className='forumularioinicio'>
                        <label>Nombre de Usuario</label>
                        <input
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='forumularioinicio'>
                        <label style={{ width: "8vw" }}>Contraseña</label>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button style={{ marginTop: "6vh" }} onClick={handleLogin}>Iniciar Sesión</button>
                    <span style={{ marginTop: "4vh" }}>
                        <span>¿No tiene una cuenta? </span>
                        <span><a href='/' onClick={switchToRegister}>Regístrese</a></span>
                    </span>
                </>
            ) : (
                <>
                    <div style={{ fontSize: "25px" }}>Registro</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1em", marginTop: "4vh" }}>
                        <label>Tipo</label>
                        <input
                            name="tipo"
                            value={formData.tipo}
                            readOnly
                            style={{ width: "15vw" }}
                        />
                        <label>Nombres</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={{ width: "15vw" }}
                        />
                        {errors.name && <div style={{ color: 'red', gridColumn: 'span 2' }}>{errors.name}</div>}
                        <label>Apellidos</label>
                        <input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            style={{ width: "15vw" }}
                        />
                        {errors.lastName && <div style={{ color: 'red', gridColumn: 'span 2' }}>{errors.lastName}</div>}
                        <label>Email</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={{ width: "15vw" }}
                        />
                        {errors.email && <div style={{ color: 'red', gridColumn: 'span 2' }}>{errors.email}</div>}
                        <label>DNI</label>
                        <input
                            name="dni"
                            value={formData.dni}
                            onChange={handleChange}
                            style={{ width: "15vw" }}
                        />
                        {errors.dni && <div style={{ color: 'red', gridColumn: 'span 2' }}>{errors.dni}</div>}
                        <label>Nombre de Usuario</label>
                        <input
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            style={{ width: "15vw" }}
                        />
                        {errors.userName && <div style={{ color: 'red', gridColumn: 'span 2' }}>{errors.userName}</div>}
                        <label>Contraseña</label>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={{ width: "15vw" }}
                        />
                        {errors.password && <div style={{ color: 'red', gridColumn: 'span 2' }}>{errors.password}</div>}
                    </div>
                    <button style={{ marginTop: "3vh" }} onClick={handleRegister}>Registrarse</button>
                    <span style={{ marginTop: "2vh" }}>
                        <span>¿Ya tiene una cuenta? </span>
                        <span><a href='/' onClick={switchToLogin}>Inicie sesión</a></span>
                    </span>
                </>
            )}
        </div>
    );
};

export default Login;
