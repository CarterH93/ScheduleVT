import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

//styles
import "./App.css";

//pages and components
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Navbar from "./components/Navbar";
import Favorites from "./pages/favorites/Favorites";

function App() {
  const { user, authIsReady } = useAuthContext();

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/login" />}
            />

            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <Login />}
            />

            <Route
              path="/signup"
              element={user ? <Navigate to="/" /> : <Signup />}
            />
            <Route
              path="/favorites"
              element={user ? <Favorites /> : <Navigate to="/login" />}
            />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
