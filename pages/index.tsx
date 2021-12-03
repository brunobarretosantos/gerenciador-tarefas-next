import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Login } from "../containers/Login"
import { Home } from "../containers/Home"

const Index: NextPage = () => {

  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined'){
      const token = localStorage.getItem('accessToken');

      if (token){
        setAccessToken(token);
      }
    }
  })

  return (
     accessToken ? <Home  setToken={setAccessToken}/> : <Login setToken={setAccessToken}/>
  )
}

export default Index