import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../../services/authService";

import FormField from "../../components/FormField";

function Register() {
  const navigate = useNavigate();

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "Customer",
  });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (
      form.password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      await registerUser(form);

      navigate("/login");
    } catch (err: any) {
      console.log(
        "REGISTER ERROR:",
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
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Kalaiyan Register</h1>

      <form onSubmit={handleRegister}>
        <FormField
          label="Full Name"
          name="fullName"
          type="text"
          value={form.fullName}
          onChange={handleChange}
          required
          placeholder="Enter your full name"
        />

        <br />

        <FormField
          label="Email"
          name="email"
          type="text"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Enter your email"
        />

        <br />

        <FormField
          label="Phone Number"
          name="phoneNumber"
          type="text"
          value={form.phoneNumber}
          onChange={handleChange}
          required
          placeholder="Enter your phone number"
        />

        <br />

        <FormField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          placeholder="Enter your password"
        />

        <br />

        <FormField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
          required
          placeholder="Confirm your password"
        />

        <br />

        <FormField
          label="Role"
          name="role"
          type="select"
          value={form.role}
          onChange={handleChange}
          required
          options={[
            {
              value: "Customer",
              label: "Customer",
            },
            {
              value: "Artisan",
              label: "Artisan",
            },
          ]}
        />

        <br />

        {error && <p>{error}</p>}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Registering..."
            : "Register"}
        </button>
      </form>

      <p>
        Already have an account?{" "}

        <button
          type="button"
          onClick={() =>
            navigate("/login")
          }
        >
          Login
        </button>
      </p>
    </div>
  );
}

export default Register;