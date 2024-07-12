import React from 'react';
import './registerpage.css';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm();


    const onLogin = async (formData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                email: formData.email,
                password: formData.password
            });
            console.log('Login successful: ', response.data);

            // Store email & username in local storage
            localStorage.setItem('email', JSON.stringify(formData.email));
            localStorage.setItem('username', JSON.stringify(response.data.username)); 
            localStorage.setItem('useraccount', JSON.stringify(true)); 

            navigate('/');

            // Refresh the page to ensure the navbar updates
            window.location.reload();

        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.error('Error:', error.response.data);
                setError('email', { type: 'manual', message: error.response.data });
            } else {
                console.error('Error logging in:', error.response ? error.response.data : error.message);
            }
        }
    };

    return (
        <div className='login-form-bg'>
            <h3>Login</h3>
            <form onSubmit={handleSubmit(onLogin)}>
                <div className='login-account-inputs'>
                    <h5>Your email</h5>
                    <input {...register("email", { required: "Email is required", pattern: /^\S+@\S+\.\S+$/ })} type='email' placeholder='xxx@mailbox.com' />
                    {errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}
                </div>
                <div className='login-account-inputs'>
                    <h5>Your password</h5>
                    <input {...register("password", { required: "Password is required" })} type='password' />
                    {errors.password && <span style={{ color: 'red' }}>{errors.password.message}</span>}
                </div>
                <div className='login-center'>
                    <button type="submit" className="btn btn-success">LOG IN</button>
                </div>
            </form>

            <p style={{display: 'flex', justifyContent: 'center'}}>Don't have an account? <Link to='/register'>Register here</Link></p>
        </div>
    )
}

export default Login; 