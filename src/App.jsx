import { useState } from "react"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import AdminDashboard from "./components/AdminDashboard"
import UserDashboard from "./components/UserDashboard"

function App() {
  const [role, setRole] = useState(localStorage.getItem("role"))
  const [showSignup, setShowSignup] = useState(false)

  // 🔐 After successful login
  const handleLogin = (userRole) => {
    setRole(userRole)
  }

  // 🚪 Logout (no reload)
  const handleLogout = () => {
    localStorage.clear()
    setRole(null)
    setShowSignup(false)
  }

  // 🔑 Auth screens
  if (!role) {
    return showSignup ? (
      <Signup switchToLogin={() => setShowSignup(false)} />
    ) : (
      <Login
        switchToSignup={() => setShowSignup(true)}
        onLogin={handleLogin}
      />
    )
  }

  // 🧭 Dashboards
  return role === "admin" ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <UserDashboard onLogout={handleLogout} />
  )
}

export default App
