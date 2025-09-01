'use client'
import { useSession, signIn, signOut } from 'next-auth/react'


export default function Dashboard(){
   const { data: session, status } = useSession()

return <>{session?<h1>youre signed in as {session.user?.email}</h1> :<>'not signed in'</>}</>
}