import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../services/authService";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { login } from "../../redux/slices/authSlice";

import FormField from "../../components/FormField";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await loginUser({
        email,
        password,
      });

      dispatch(
        login({
          token: response.token,
          user: response.user,
        })
      );

      if (
        response.user.role ===
        "Customer"
      ) {
        navigate("/customer");
      } else if (
        response.user.role ===
        "Artisan"
      ) {
        navigate("/artisan");
      } else {
        setError(
          "Invalid user role."
        );
      }
    } catch (err: any) {
      console.log(
        "LOGIN ERROR:",
        err
      );

      console.log(
        "STATUS:",
        err.response?.status
      );

      console.log(
        "DATA:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Kalaiyan Login</h1>

      <form onSubmit={handleLogin}>
        <FormField
          label="Email"
          name="email"
          type="text"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
          placeholder="Enter your email"
        />

        <br />

        <FormField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
          placeholder="Enter your password"
        />

        <br />

        {error && <p>{error}</p>}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>
      </form>

      <p>
        Don't have an account?{" "}

        <button
          type="button"
          onClick={() =>
            navigate("/register")
          }
        >
          Register
        </button>
      </p>
    </div>
  );
}

export default Login;