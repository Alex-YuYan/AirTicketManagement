import { createContext, useState, useEffect } from 'react'
import axios from '../axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState('')
  const [userId, setUserId] = useState('')
  const [userFirstName, setUserFirstName] = useState('')
  const [userLastName, setUserLastName] = useState('')

  useEffect(() => {
    const checkLoginStatus = async () => {
      // if (process.env.REACT_APP_DEV === '1') {
      //   setLoggedIn(true)
      //   setLoading(false)
      //   setUserFirstName('Developer')
      //   setUserLastName('Customer')
      //   setUserRole('customer')
      //   setUserId('example@email.com')
      // } else if (process.env.REACT_APP_DEV === '2') {
      //   setLoggedIn(true)
      //   setLoading(false)
      //   setUserFirstName('Developer')
      //   setUserLastName('Staff')
      //   setUserRole('staff')
      //   setUserId('exampleUsername')
      // } else {
        try {
          const res = await axios.get("/verifyLogin")
          if (res.data && res.data.success === true) {
            setLoggedIn(true)
            setUserRole(res.data.userRole)
            if (res.data.userRole === 'customer') {
              setUserId(res.data.email)
            } else {
              setUserId(res.data.username)
            }
            setUserFirstName(res.data.first_name)
            setUserLastName(res.data.last_name)
          }
          setLoading(false)
        } catch (error) {
          console.error(error)
        }
    }
    if (loggedIn === false) {
      console.log('Checking login status...')
      checkLoginStatus()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, loading, userRole, userFirstName, userLastName, userId }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext