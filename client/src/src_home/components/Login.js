import React, { useState,useEffect } from 'react';
import './Navbar/styleLogin.css'; // Importing CSS file
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import App from 'src/src_side/App';
import '../../src_side/index.css'
import { GoogleOAuthProvider } from "@react-oauth/google"
import Logo from 'react-login-page/logo';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (isAuthenticated === 'true') {
            setIsAuthenticated(true);
            const userProfile = JSON.parse(localStorage.getItem('userProfile'));
            setProfile(userProfile);
        }
    }, []);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    const logOut = () => {
        googleLogout();
        setIsAuthenticated(false);
        setProfile(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userProfile');
    };

    useEffect(() => {
        if (user) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    setProfile(res.data);
                    setIsAuthenticated(true);
                    localStorage.setItem('isAuthenticated', 'true');
                    console.log(")))))))))))))))))))))))")
                    console.log(JSON.stringify(res.data))
                    localStorage.setItem('userProfile', JSON.stringify(res.data));
                    navigate("/competitors");
                })
                .catch((err) => console.log(err));
        }
    }, [user]);


    


    const handleSubmit = (e) => {
        e.preventDefault();

        if (email.trim() === '') {
            setEmailError('Email can\'t be blank');
        } else {
            setEmailError('');
        }

        if (password.trim() === '') {
            setPasswordError('Password can\'t be blank');
        } else {
            setPasswordError('');
        }

        // Your other form submission logic can be implemented here
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const buttonStyle = {
        transition: 'background-color 0.3s, box-shadow 0.3s',
        padding: '12px 16px 12px 42px',
        border: 'none',
        borderRadius: '3px',
        boxShadow: '0 -1px 0 rgba(0, 0, 0, .04), 0 1px 1px rgba(0, 0, 0, .25)',
        color: '#757575',
        fontSize: '14px',
        fontWeight: '500',
        fontFamily: `-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",sans-serif`,
        backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMiAxMyAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=)',
        backgroundColor: 'white',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '12px 11px',
      };
    
      const hoverStyle = {
        boxShadow: '0 -1px 0 rgba(0, 0, 0, .04), 0 2px 4px rgba(0, 0, 0, .25)',
      };
    
    

    function loadView(){
        if(!isAuthenticated){
            // login
            return(

                <div className="wrapper">
            <header>Login Form</header>
            <form onSubmit={handleSubmit}>
                <div className={`field email ${emailError && 'error'}`}>
                    <div className="input-area">
                        <input type="text" placeholder="Email Address" value={email} onChange={handleEmailChange} />
                        <i className="icon fas fa-envelope"></i>
                        <i className="error error-icon fas fa-exclamation-circle"></i>
                    </div>
                    <div className="error error-txt">{emailError}</div>
                </div>
                <div className={`field password ${passwordError && 'error'}`}>
                    <div className="input-area">
                        <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                        <i className="icon fas fa-lock"></i>
                        <i className="error error-icon fas fa-exclamation-circle"></i>
                    </div>
                    <div className="error error-txt">{passwordError}</div>
                </div>
                <div className="pass-txt"><a href="#">Forgot password?</a></div>
                <input type="submit" value="Login" />
            </form>
            <div className="sign-txt">Not yet member? <a href="#">Signup now</a></div>

            {profile ? (
                <button onClick={logOut}>Log out</button>
            ) : (
                // <button onClick={() => login()}>Sign in with Google 🚀 </button>
                <button
                onClick={() => login()}
                type="button"
                className="login-with-google-btn"
                style={buttonStyle}
                onMouseEnter={() => console.log('Mouse entered')}
                onMouseLeave={() => console.log('Mouse left')}
              >
                Sign in with Google
              </button>
            )}

        </div>
            )
        }else{
            //home
            return(
                <App/>
            )
        }
    }

    return (
        // <GoogleOAuthProvider clientId='835958615002-sv7nh5gls60un3085qtm8374qfjrdf22.apps.googleusercontent.com'>
        loadView()
    );
}

export default Login;
