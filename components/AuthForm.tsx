
'use client'
 
// import { useFormState } from 'react-dom'
import {useActionState} from 'react'
import { authenticate,signUp } from '@/app/action'
import { useState } from 'react'
 
export default function AuthForm() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined)
  const [state,setState] = useState('login')
 const setSignup = ()=>{setState('signup')}
 const setLogin = ()=>{setState('login')}


  return (<>
{state=='login'?<Login setStateSignup={setSignup}/>:<SignUp setStateLogin={setLogin}/>}
</>
   
  )
}
 

 function SignUp({setStateLogin}){
  const [errorMessage, dispatch] = useActionState(signUp, undefined)
  const [state,setState] = useState('login')

return <>
 <form action={dispatch}>
    <div className='flex justify-between'>
        <label htmlFor="username">Username</label>
        <div>
          <input
            id="username"
            // type="email"
            name="username"
            placeholder="Enter your username"
            required
          />
        </div>
      </div>
      <div className='flex justify-between'>
        <label htmlFor="email">Email</label>
        <div>
          <input
            id="email"
            // type="email"
            name="email"
            placeholder="Enter your email address"
            required
          />
        </div>
      </div>
      <div className='flex justify-between'>
        <label htmlFor="password">Password</label>
        <div>
          <input
            id="password"
            // type="password"
            name="password"
            placeholder="Enter password"
            required
            // minLength={6}
          />
        </div>
      </div >
       <div className='flex justify-between'>
        <label htmlFor="password">role</label>
        <div>
          <select name="role" id="role" title='role'>
<option value="user">user</option>
<option value="admin">admin</option>
<option value="owner">owner</option>
          </select>
        </div>
      </div >
      <div className='flex justify-around'>   
       <button title='b' >register</button></div>
      
      <div
        aria-live="polite"
        aria-atomic="true"
      >
        {errorMessage && (
          <p>{errorMessage}</p>
        )}
      </div>
    </form>
</>

 }

 function Login({setStateSignup}){
  const [errorMessage, dispatch] = useActionState(authenticate, undefined)
  const [state,setState] = useState('login')
 
  return (
    <form action={dispatch}>
    
      <div className='flex justify-between'>
        <label htmlFor="email">Email</label>
        <div>
          <input
            id="email"
            // type="email"
            name="email"
            placeholder="Enter your email address"
            required
          />
        </div>
      </div>
      <div className='flex justify-between'>
        <label htmlFor="password">Password</label>
        <div>
          <input
            id="password"
            // type="password"
            name="password"
            placeholder="Enter password"
            required
            // minLength={6}
          />
        </div>
      </div >
      <div className='flex justify-between'>   
        <button title='a' type='submit'>Log in</button>
       <button title='b' type='button' onClick={()=>{setStateSignup()}}>sign up</button></div>
      
      <div
        aria-live="polite"
        aria-atomic="true"
      >
        {errorMessage && (
          <p>{errorMessage}</p>
        )}
      </div>
    </form>
  )


 }
