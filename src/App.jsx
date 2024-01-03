import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Membersbar from './components/Membersbar'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home/home'
import Profile from './pages/Profile/Profile'
import Projects from './pages/Projects/projects'
import { ThemeProvider } from './Providers/theme-provider'
import Login from './pages/Login/login'
import Signup from './pages/Signup/signup'
import {useAuthContext} from './hooks/useAuthContext.js';
import Loading from './components/Loading'

// Uso com any


function App() {
  const {user, authIsReady} = useAuthContext()

  if (!authIsReady) {
    return(<Loading/>)
  }

  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <div className='flex'>
        <BrowserRouter>
          { user ? (
            <>
            <Sidebar/>
              <div className='flex-grow'>
                <Routes>
                  <Route exact path='/' element={<Home/>}/>
                  <Route path='/Profile' element={<Profile/>}/>
                  <Route path='/Projects' element={<Projects/>}/>
                  <Route path='/Home' element={<Home/>}/>
                </Routes>
              </div>
            <Membersbar/>
            </>
          ) : (
            <Routes>
              <Route path='/login' element={<Login/>}/>
              <Route path='/signup' element={<Signup/>}/>
              <Route path='/*' element={<Signup/>}/>
            </Routes>

          )

          }
        </BrowserRouter>
      </div>
    </ThemeProvider>
  )
}

export default App
