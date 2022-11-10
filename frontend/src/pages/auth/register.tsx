import { useState, useEffect } from 'react'
import {
  Link,
  Redirect
} from "react-router-dom"

const typePage = 'register'

function Register(props: any) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    
    useEffect(() => {
        props.ws.onmessage = (evt: any) => {
        // listen to data sent from the websocket server
          const message = JSON.parse(evt.data)
          if(message.type === typePage){
            setError(!message.sucess)
            setMessage(message.message)
            if(message?.sucess){
              if(message?.redirect){
                window.location.pathname = message?.redirectUrl
              }
            }
          }
        }
  
        props.ws.onclose = () => {
          //Close ws
        }
  
        props.ws.onerror = (err: any) => {
          // console.error(
          //     "Socket encountered error: ",
          //     "Closing socket"
          // );
  
          props.ws.close();
      };
    }, []);
  
    const stringy = (json: object) => {
      return JSON.stringify(json)
    }
  
    return (
      <div className="App">
        <div className="login-container">
          <div className={`login-box ${(error ? 'error': '')}`}>
            <form
            onSubmit={(e: any) => {
              e.preventDefault();
              const data = {type: 'userRegister', data: {email, password, username}};
              props.ws.send(stringy(data))
            }}
            >
              <div className="login-box-content">
                <h1 className="title">Create a account</h1>
                <label htmlFor="email">E-mail</label>
                <input 
                onKeyUp={(e) => setEmail((e.target as any).value)}
                type="text" id="email" autoComplete="off"/>
                <label htmlFor="email">Username</label>
                <input 
                onKeyUp={(e) => setUsername((e.target as any).value)}
                type="text" id="email" autoComplete="off"/>
                <label htmlFor="password">Password</label>
                <input 
                onKeyUp={(e) => setPassword((e.target as any).value)}
                type="password" id="password"/>
                <span className='error'>{ error && message }</span>
                <p><a className="register" href="#">Forgot your password?</a></p>
                <button>Register</button>
                <p>Have a account? <Link 
                  to={'/login'}
                  className="register">Login</Link>
                </p>
              </div>
            </form>
          </div>
      </div>
      </div>
    )
}

export default Register