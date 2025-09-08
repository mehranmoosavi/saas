'use client'
import { useSession, signIn, signOut } from 'next-auth/react'


export default function Providers(){
return <>
     <div className='gitgooglelogin w-full text-center'>
<div title="sign in" onClick={()=>{signIn('google')}}>continue with google</div>
<div title="sign in" onClick={()=>{signIn('github')}}>continue with github</div>

      </div></>

}