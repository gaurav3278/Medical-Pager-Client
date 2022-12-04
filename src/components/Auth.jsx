import React, { useState } from 'react'
import Cookies from 'universal-cookie'
import axios from 'axios'
import { StreamChat } from 'stream-chat';

import singinImage from '../assets/signup.jpg';

const cookies = new Cookies();

const apiKey = 'eub6qdwvynnx'

const Auth = () => {

    const [form, setForm] = useState({
        fullName: '',
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        avatarURL: '',
        checkEmail: '',
        checkOtp: '',
        NewPassword: '',
        SentOtp: ''
    });

    const [isSignup, setIsSignup] = useState(true)
    const [isSignIn, setIsSignIn] = useState(false)
    const [isForgot, setIsForgot] = useState(false)
    const [isSent, setIsSent] = useState(false)
    const [isChangePassword, setIsChangePassword] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const Changepassword = async (e) => {
        e.preventDefault()
        setIsChangePassword(true)
        const { NewPassword, checkEmail } = form
        console.log(NewPassword)
        if (NewPassword.length > 4) {
            if (NewPassword === form.confirmPassword) {
                try{
                    await axios.post('https://pager2022.herokuapp.com/auth/UpdatePassword', { NewPassword, checkEmail })
                      .then(res=>{
                          console.log(res.data)
                            if(res.data.message === 'Password updated') {
                                const client = StreamChat.getInstance(apiKey); //instance of stream chat
                                cookies.set('hashedPassword', res.data.hashedPassword)
                                client.connectUser({
                                    id: res.data.userId,
                                    name: res.data.username,
                                    image: res.data.avatarURL,
                                    hashedPassword: cookies.get('hashedPassword')
                                }, res.data.token);
                                alert('Password Changed')
                                window.location.reload();
                            }
                            else {
                                alert('Password not changed')
                            }
                    })
                }catch(err){
                    console.log(err)
                }
            }
            else {
                alert('Password does not match')
            }
        }
        else {
            alert('Please enter password of length more than 4')
        }
    }


    const SendOtp = async (e) => {
        e.preventDefault();
        const { checkEmail, username } = form;
        console.log(checkEmail, username);
        const URL = 'https://pager2022.herokuapp.com/auth/forgot';
        try {
            const { SentOtp } = await axios.post(URL, { checkEmail, username }, { timeout: 120 * 1000 })
                .then(res => {
                    console.log(res);
                    setForm({ ...form, SentOtp: res.data.SentOtp })
                    return res.data.SentOtp
                })
            console.log(SentOtp)
            setIsSent(true)
            setIsForgot(false)
            setIsSignIn(false)
            setIsSignup(false)
        }
        catch (err) {
            console.log(err);
        }
    }


    const ForgotPassword = () => {
        setIsForgot((prevIsForgot) => !prevIsForgot)
        setIsSignup(false)
        setIsSignIn(false)
    }

    const verify = async (e) => {
        e.preventDefault();
        const { checkOtp, SentOtp } = form;
        const URL = 'https://pager2022.herokuapp.com/auth/verify';
        const { data } = await axios.post(URL, { checkOtp, SentOtp }, { timeout: 120 * 1000 })
        if (data.message === 'OTP verified') {
            alert(data.message)
            setIsForgot(false)
            setIsSent(false)
            setIsSignup(false)
            setIsSignIn(false)
            setIsChangePassword(true)
        }
        else {
            alert(data.message)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { username, password, email, avatarURL } = form;

        const URL = 'https://pager2022.herokuapp.com/auth';
        const { data: { token, userId, hashedPassword, fullName } } = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, {
            username, password, fullName: form.fullName, email, avatarURL,
        })

        cookies.set('token', token, { maxAge: 120 });
        cookies.set('username', username, { maxAge: 120 });
        cookies.set('fullName', fullName, { maxAge: 120 });
        cookies.set('userId', userId, { maxAge: 120 });

        if (isSignup) {
            cookies.set('email', email);
            cookies.set('avatarURL', avatarURL);
            cookies.set('hashedPassword', hashedPassword);
        }
        if (isForgot) {
            cookies.set('checkEmail', email, { maxAge: 120 });
        }
        window.location.reload();
    }

    const alerts = (res) => {
        // console.log(cookies.status)
    }

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup)
        setIsSignIn((prevIsSignIn) => !prevIsSignIn)
    }

    return (
        <div className='auth__form-container'>
            <div className='auth__form-container_fields'>
                <div className='auth__form-container_fields-content'>
                    <p>
                        {isChangePassword ? 'Change Password' : (isSent ? 'OTP Verification' : (isForgot ? 'Password Reset' : (isSignup ? 'Sign Up' : 'Sign In')))}
                    </p>
                    <form onSubmit={handleSubmit}>
                        {isSignup && (
                            <div className='auth__form-container_fields-content_input'>
                                <label htmlFor='fullName'>Full Name</label>
                                <input name='fullName' type="text"
                                    placeholder="Full Name"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        {(isSignIn || isSignup || isForgot) && (<div className='auth__form-container_fields-content_input'>
                            <label htmlFor='username'>username</label>
                            <input name='username' type="text"
                                placeholder="username"
                                onChange={handleChange}
                                required
                            />
                        </div>)}
                        {isSent && (
                            <div className='auth__form-container_fields-content_input'>
                                <label htmlFor='checkOtp'>One Time Password</label>
                                <input name='checkOtp' type='text'
                                    placeholder="OTP"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        {(isForgot && !isSignup) && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor='checkEmail'>Check Email</label>
                                <input name='checkEmail' type="email"
                                    placeholder="Email"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        {isSignup && (
                            <div className='auth__form-container_fields-content_input'>
                                <label htmlFor='email'>Email</label>
                                <input name='email' type="email"
                                    placeholder="Email"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        {isSignup && (
                            <div className='auth__form-container_fields-content_input'>
                                <label htmlFor='avatarURL'>Avatar URL</label>
                                <input name='avatarURL' type="text"
                                    placeholder="Avatar URL"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        {(isSignIn || isSignup) && (<div className='auth__form-container_fields-content_input'>
                            <label htmlFor='password'>Password</label>
                            <input name='password' type="password"
                                placeholder="Password"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        )}
                        {isChangePassword && (
                            <div className='auth__form-container_fields-content_input'>
                                <label htmlFor='NewPassword'>New Password</label>
                                <input name='NewPassword' type="password"
                                    placeholder="Password"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        {(isSignup || isChangePassword) && (
                            <div className='auth__form-container_fields-content_input'>
                                <label htmlFor='confirmPassword'>Confirm Password</label>
                                <input name='confirmPassword' type="password"
                                    placeholder="Confirm Password"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        <div className="auth__form-container_fields-content_button" onClick={alerts}>
                            {(isForgot || isSent || isChangePassword) ? "" :
                                <button className='auth__form-container_fields-content_button-link'>{!isSignup ? 'Sign In' : 'Sign Up'}
                                </button>
                            }
                            {isChangePassword ? <button onClick={Changepassword}>Change</button> : (isSent ? <button onClick={verify}>Verify</button> : (isForgot ? <button onClick={SendOtp}>Send OTP</button> : ((!isSignup && isSignIn) ?
                                <button className='auth__form-container_fields-content_button-link' onClick={ForgotPassword}>Forgot Password?</button>
                                : "")))}
                        </div>
                    </form>
                    <div className='auth__form-container_fields-account'>
                        <p>
                            {isChangePassword ? '' : (isForgot ? '' : (isSignup ? "Already have an account?" : "Don't have an account?"))}
                            <span onClick={switchMode}>
                                {isChangePassword ? '' : (isForgot ? '' : (isSignup ? ' Sign In' : ' Sign Up'))}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div className='auth__form-container_image'>
                <img src={singinImage} alt='sign in' />
            </div>
        </div>
    )
}

export default Auth
