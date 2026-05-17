import React from 'react'
import { RouterProvider } from "react-router-dom"
import { router } from "./app.routes"
import { AuthProvider } from './features/auth/auth.context'
import { InterviewProvider } from './features/interview/interview.context'
import Header from './components/Header'

const App = () => {
  return (
    <AuthProvider>
      <InterviewProvider>
        <Header/>
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App