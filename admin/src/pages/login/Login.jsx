import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.scss";
import axiosInstance from "../../config/axiosInstance";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });

    try {
      const res = await axiosInstance.post("/auth/login", credentials);

      const { accessToken, user } = res.data;

      // Điều hướng dựa trên vai trò
      if (user.role === "Admin") {
        localStorage.setItem("authToken", accessToken);
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
      dispatch({
        type: "LOGIN_FAILURE",
        payload: err.response?.data || { message: "Đăng nhập thất bại" },
      });
    }
  };

  return (
    <div className="login">
      <div className="lContainer">
        <h2>Admin Login</h2>
        <input
          type="text"
          placeholder="Email"
          id="email"
          onChange={handleChange}
          className="lInput"
          value={credentials.email}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          onChange={handleChange}
          className="lInput"
          value={credentials.password}
        />
        <button
          disabled={loading}
          onClick={handleClick}
          className="lButton"
        >
          Login
        </button>
        {error && <span className="errorMessage">{error.message}</span>}
      </div>
    </div>
  );
};

export default Login;
