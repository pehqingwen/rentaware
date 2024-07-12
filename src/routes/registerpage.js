import React from 'react';
import './registerpage.css';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors
    } = useForm();

    const onSubmit = async (formData) => {
        const { username, email, password, passwordRepeat, terms } = formData;

        // Basic client-side validation for password matching and terms acceptance
        if (password !== passwordRepeat) {
            setError('passwordRepeat', { type: 'manual', message: 'Passwords do not match' });
            return;
        }
        if (!terms) {
            setError('terms', { type: 'manual', message: 'You must agree to the terms' });
            return;
        }
        clearErrors(['passwordRepeat', 'terms']);

        try {
            const response = await axios.post('http://localhost:5000/api/register', {
                username,
                email,
                password
            });
            console.log('Data submitted:', response.data);
            navigate('/');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.error('Error:', error.response.data);
                setError('email', { type: 'manual', message: error.response.data });
            } else {
                console.error('Error posting data:', error.response ? error.response.data : error.message);
            }
        }

    };

    return (
        <div className='register-form-bg'>
            <h3>Register your account</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='register-account-inputs'>
                    <h5>Your username</h5>
                    <input {...register("username", { required: "Username is required" })} type='text' placeholder='Doe' />
                    {errors.username && <span style={{ color: 'red' }}>{errors.username.message}</span>}
                </div>
                <div className='register-account-inputs'>
                    <h5>Your email</h5>
                    <input {...register("email", { required: "Email is required", pattern: /^\S+@\S+\.\S+$/ })} type='email' placeholder='xxx@mailbox.com' />
                    {errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}
                </div>
                <div className='register-account-inputs'>
                    <h5>Your password</h5>
                    <input {...register("password", { required: "Password is required" })} type='password' />
                    {errors.password && <span style={{ color: 'red' }}>{errors.password.message}</span>}
                </div>
                <div className='register-account-inputs'>
                    <h5>Repeat password</h5>
                    <input {...register("passwordRepeat", { required: "Repeat password is required" })} type='password' />
                    {errors.passwordRepeat && <span style={{ color: 'red' }}>{errors.passwordRepeat.message}</span>}
                </div>
                <div className='register-center'>
                    <input {...register("terms", { required: "You must agree to the terms" })} className="form-check-input" type="checkbox" />
                    <label className="form-check-label">I agree with the Terms & Conditions</label>
                    {errors.terms && <span style={{ color: 'red' }}>{errors.terms.message}</span>}
                </div>
                <div className='register-center'>
                    <button type="submit" className="btn btn-primary">Register Account</button>
                </div>
            </form>

            <p style={{display: 'flex', justifyContent: 'center'}}>Already have an account? <Link to='/login'>Log in here</Link></p>
        </div>
    );
}

export default Register;
