import { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Mail, Building2, Eye, EyeOff } from 'lucide-react'
import api from '../../../utils/axios'
import { Navigate, useNavigate } from 'react-router-dom'
import GlobalState from '../../../GlobalState'

export default function Login() {
  const navigate = useNavigate();
  const state = useContext(GlobalState);
  const [token, setToken] = state.token;
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('Team Member')
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)

  const toggleForm = () => setIsLogin(!isLogin)

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('http://localhost:5000/employee/login', { ...user });
      console.log(user);
      console.log("Admin Logged In");
      //console.log(res.data.accessToken);
      localStorage.setItem('accessToken', res.data.accessToken);
      setIsAdminLoggedIn(true);
      setUser({ userID: '', password: '' });
    }
    catch (err) {
      alert(err.response.data.msg);
    }
  }

  const [user, setUser] = useState({
    userID: '',
    password: ''
  })
  const onChangeInput = e => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value })
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('http://localhost:5000/employee/login', { ...user })
      console.log(user);
      console.log("User Logged In");
      localStorage.setItem('firstLogin', true)
      setToken(res.data.accessToken);
      console.log("reached here");
      navigate('/dashboard')
      //window.location.href = '/'
    }
    catch (err) {
      console.log("Error: ", err.response ? err.response.data.msg : err.message);
      alert(err.response.data.msg);
    }
    console.log("Login");
  }

  const handleEmployeeCreation = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/employee/create-employee', { ...user, role }, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } });
      console.log(user);
      console.log("Employee Created");

    }
    catch (err) {
      alert(err.response.data.msg);
      console.log(err.response.data.msg);
    }
  }


  return (
    <div className="flex h-screen bg-gray-100 w-full">
      <div className="m-auto bg-white rounded-lg shadow-lg overflow-hidden flex w-full h-full">
        <div className="w-1/2 p-8">
          {/* <h1 className="text-4xl font-bold text-indigo-700">Emp
          <h1 className="text-4xl font-bold mb-40 text-black">Flow</h1>
          </h1> */}
          <motion.div
            initial={false}
            animate={{ x: isLogin ? 0 : '110%' }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-4xl font-bold mb-40">
              <span className="text-indigo-700">Em</span>
              <span className="text-black">Flow</span>
            </h1>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ x: isLogin ? 0 : '100%' }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center">
              <div className="w-3/4 mx-auto">
                <h2 className="text-3xl font-semibold mb-6">{isLogin ? 'Log in' : 'Sign Up'}</h2>
                <p className="text-gray-600 mb-8">
                  {isLogin
                    ? 'Please login to continue to your account.'
                    : isAdminLoggedIn
                      ? 'Please fill all the Employee Details given below to create an Employee Account.'
                      : 'Please Login as Admin to create an Employee Account.'}
                </p>
                <form className="space-y-6 mb-3" onSubmit={isAdminLoggedIn ? undefined : handleAdminLogin}>
                  {!isLogin && !isAdminLoggedIn && (
                    <>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          placeholder="Admin Username"
                          name="userID"
                          value={user.userID}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                          onChange={onChangeInput}
                        />
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Admin Password"
                          name="password"
                          value={user.password}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                          onChange={onChangeInput}
                        />
                        <div
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-700 transition duration-200"
                        onClick={handleAdminLogin}
                      >
                        Admin Login
                      </button>
                    </>
                  )}
                  {!isLogin && isAdminLoggedIn && (
                    <>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="email"
                          placeholder="Employee Email - Don't enter"
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          placeholder="Company ID"
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          placeholder="Employee Username"
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                          name="userID"
                          value={user.userID}
                          onChange={onChangeInput}
                        />
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Employee Password"
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                          name='password'
                          value={user.password}
                          onChange={onChangeInput}
                        />
                        <div
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">Select a Role</p>
                        <div className="flex space-x-4">
                          <button
                            type="button"
                            onClick={() => setRole('Team Member')}
                            className={`flex-1 py-2 px-4 rounded-lg border ${role === 'Team Member' ? 'bg-indigo-400 text-white' : 'bg-white text-gray-700'
                              }`}
                          >
                            Team Member
                          </button>
                          <button
                            type="button"
                            onClick={() => setRole('Team Manager')}
                            className={`flex-1 py-2 px-4 rounded-lg border ${role === 'Team Lead' ? 'bg-indigo-400 text-white' : 'bg-white text-gray-700'
                              }`}
                          >
                            Team Manager
                          </button>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
                        onClick={handleEmployeeCreation}
                      >
                        Create Account
                      </button>
                      {/* <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                      >
                        Create Account
                      </button> */}
                    </>
                  )}
                  {isLogin && (
                    <>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          placeholder="Username"
                          name="userID"
                          value={user.userID}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                          onChange={onChangeInput}
                        />
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          name="password"
                          value={user.password}
                          className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                          onChange={onChangeInput}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
                        onClick={handleLoginSubmit}
                      >
                        Log In
                      </button>
                    </>
                  )}

                  {/* {isLogin && (
                    <div className="flex items-center">
                      <input type="checkbox" id="remember" className="mr-2" />
                      <label htmlFor="remember" className="text-sm text-gray-600">
                        Keep me logged in
                      </label>
                    </div>
                  )} */}
                  {/* {!isLogin && isAdminLoggedIn && (
                    
                  )} */}
                  {/* <button
                    type="submit"
                    className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                  >
                    {isLogin ? 'LOGIN' : 'Create Account'}
                  </button> */}
                </form>
                {isLogin && (
                  <>
                    <div className="relative flex justify-between">
                      {/* <div className="border-t border-gray-300 w-full"></div>
                  <div className="absolute bg-white px-4 text-sm text-gray-500">or</div> */}
                      <div className="text-center">
                        <p className="text-sm text-gray-600">
                          {isLogin ? "Don't have an account? " : 'Already have an account? '}
                          <button onClick={toggleForm} className="text-indigo-700 hover:underline">
                            {isLogin ? 'Create one' : 'Log in'}
                          </button>
                        </p>
                      </div>
                      <div className="text-center">
                        <a href="#" className="text-sm text-indigo-700 hover:underline">
                          Forgot password?
                        </a>
                      </div>

                    </div>
                    {/* <a href="http://localhost:5000/employee/auth/google">
                      <button>Login with Google</button>
                    </a> */}
                    <div className="mt-3 relative flex items-center justify-center">
                      <div className="border-t border-gray-300 w-full"></div>
                      <div className="absolute bg-white px-4 text-sm text-gray-500">or</div>
                    </div>
                    <a href="http://localhost:5000/employee/auth/google">
                      <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition duration-200 flex items-center justify-center mt-5">
                        <img src="./google-icon.png" alt="Google" className="w-5 h-5 mr-2" />
                        Sign in with Google
                      </button>
                    </a>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
        <motion.div
          className="w-1/2 bg-gradient-to-r from-indigo-600 to-indigo-400 text-white p-8 flex items-center justify-center"
          initial={false}
          animate={{ x: isLogin ? 0 : '-100%' }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">{isLogin ? 'Welcome Back!' : 'Join Us!'}</h2>
            <p className="mb-8">
              {isLogin
                ? 'Log in to access your account and manage your tasks efficiently.'
                : 'Sign up to start managing your tasks and collaborating with your team.'}
            </p>
            <button
              onClick={toggleForm}
              className="bg-white text-indigo-700 py-2 px-6 rounded-full hover:bg-blue-100 transition duration-200"
            >
              {isLogin ? 'Create Account' : 'Log In'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}