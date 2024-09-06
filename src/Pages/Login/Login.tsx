import React, { useState } from 'react';
import './Login.css';

const Login: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        name: '',
        lastName: '',
        email: '',
        dni: '',
        tipo: '' // Campo tipo editable para inicio de sesión
    });

    const [errors, setErrors] = useState({
        userName: '',
        name: '',
        lastName: '',
        email: '',
        dni: '',
    });

    const switchToRegister = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setIsLogin(false);
        // Resetea el tipo al cambiar a registro
        setFormData({
            ...formData,
            tipo: 'USUARIO'
        });
    };

    const switchToLogin = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setIsLogin(true);
        // Limpiar el tipo al cambiar a inicio de sesión
        setFormData({
            ...formData,
            tipo: ''
        });
    };

    // Manejador de cambios en los inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Limpia el error cuando el usuario empieza a corregir el campo
        setErrors({
            ...errors,
            [e.target.name]: ''
        });
    };

    // Función para iniciar sesión
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
                // Aquí puedes almacenar el token o redirigir a otra página
            } else {
                // Extrae el mensaje del backend y muestra la alerta
                const errorMsg = result.message || 'Error al iniciar sesión.';
                alert(errorMsg);
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Error en la solicitud. Por favor, intente de nuevo.');
        }
    };

    // Función para registrar un nuevo usuario
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
                // Limpiar el mensaje de error si la solicitud es exitosa
                setErrorMessage(null);
                alert(result.Message || 'Registro exitoso.');
                setFormData({
                    userName: '',
                    password: '',
                    name: '',
                    lastName: '',
                    email: '',
                    dni: '',
                    tipo: ''
                });
            } else {
                // Extrae el mensaje del backend y muestra la alerta
                const errorMsg = result.message || 'Error al registrarse.';
                alert(errorMsg);
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
                        <input
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            style={{ textTransform: "uppercase" }}
                        />
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
                    </div>
                    <button style={{ marginTop: "6vh" }} onClick={handleRegister}>Registrarse</button>
                    <span style={{ marginTop: "4vh" }}>
                        <span>¿Ya tiene una cuenta? </span>
                        <span><a href="#" onClick={switchToLogin}>Iniciar Sesión</a></span>
                    </span>
                </>
            )}
        </div>
    );
};

export default Login;
