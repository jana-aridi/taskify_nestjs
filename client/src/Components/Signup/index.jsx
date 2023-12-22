import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import authService from '../../Services/authService';
import Swal from 'sweetalert2';
import styles from './style.module.css'; 

const Signup = () => {
    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        isAdmin: false,
    });

    const [error, setError] = useState('')

    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        if (input.type === 'checkbox') { 
            setData({ ...data, [input.name]: input.checked });
        } else { 
            setData({ ...data, [input.name]: input.value });
        }
    };

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log('pass confirm ' + JSON.stringify(data.password) + " "+JSON.stringify(data.confirmPassword));
        if (data.confirmPassword !== data.password) { 
            
            Toast.fire({
                icon: 'error',
                title: 'The password and confirm password do not match!'
            });

        }

        else {

            try {

                const res = await authService.signupService(data);
                
                if (res.status === 201) {

                    Toast.fire({
                        icon: 'success',
                        title: 'Account created successfully!'
                    });

                    setTimeout(() => {
                        navigate("/login");
                    }, 3000);
                    
                }

                else {
                    
                    Toast.fire({
                        icon: 'error',
                        title: res.data.message
                    });

                }

            }
            catch(error) {

                if(error.response && error.response.status >= 400 && error.response.status <= 500){ 
                    Toast.fire({
                        icon: 'error',
                        title: error.response.data.message
                    });
                }

            }
        }
    }


    return(
        <div className={styles.signup_container}>
            <div className={styles.signup_form_container}>
                <div className={styles.left}>
                    <img src='/logo.png' alt="Logo" className={styles.logo} />
                    <h1>Welcome Back</h1>
                    <Link to="/login">
                        <button type='button' className={styles.white_btn}>
                            Sign in
                        </button>
                    </Link>
                </div>
                <div className={styles.right}>
                    <form className={styles.form_container} onSubmit={handleSubmit}>

                        <h1>Create Account</h1>

                        <input type="text" placeholder='First Name'
                        name='firstName' value={data.firstName} autoComplete='off'
                        onChange={handleChange} required className={styles.input}/>

                        <input type="text" placeholder='Last Name'autoComplete='off'
                        name='lastName' value={data.lastName}
                        onChange={handleChange} required className={styles.input}/>

                        <input type="email" placeholder='Email' autoComplete='off'
                        name='email' value={data.email}
                        onChange={handleChange} required className={styles.input}/>

                        <input type="password" placeholder='Password' 
                        name='password' value={data.password}
                        onChange={handleChange} required className={styles.input}/>

                        <input type="password" placeholder='Confirm Password'
                        name='confirmPassword' value={data.confirmPassword}
                        onChange={handleChange} required className={styles.input}/>

                        <div className={styles.isAdmin}>
                            <input type="checkbox" name='isAdmin' checked={data.isAdmin}
                            onChange={handleChange} className={styles.cb}/>
                            <label className={styles.lbl}>Are you a work-space creator?</label>
                        </div>
                        
                        {error && <div className={styles.error_msg}>{error}</div>}
                        
                        <button type='submit' className={styles.green_btn}>Sign Up</button>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup;