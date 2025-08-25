'use client'
import Image from "next/image";
import { useSession, signIn, signOut } from 'next-auth/react'


export default function Home() {
   const { data: session, status } = useSession()
     if (status === 'loading') {
    return <p>Loading...</p>
    // یا یک کامپوننت اسکلتی (Skeleton Component)
  }
  return (<>
  {session?<>  <h1>youre signed in as {session.user?.name}</h1> 
  <button onClick={() => signOut()}>Sign Out</button></>
:<><div title="sign in" onClick={()=>{signIn('google')}}>sign in google</div>
<div title="sign in" onClick={()=>{signIn('github')}}>sign in github</div>
</>}
  </>)
}
