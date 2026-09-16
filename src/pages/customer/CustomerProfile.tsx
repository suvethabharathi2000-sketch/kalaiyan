import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCustomerProfile,
  createCustomerProfile,
  updateCustomerProfile,
} from "../../services/customerService";

import FormField from "../../components/FormField";
import Loading from "../../components/Loading";

function CustomerProfile() {
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const profile = await getCustomerProfile();

      setAddress(profile.address || "");
      setCity(profile.city || "");
      setProfileExists(true);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setProfileExists(false);
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load profile."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const data = {
        address,
        city,
      };

      if (profileExists) {
        await updateCustomerProfile(data);
        setMessage(
          "Profile updated successfully."
        );
      } else {
        await createCustomerProfile(data);
        setProfileExists(true);
        setMessage(
          "Profile created successfully."
        );
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to save profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Loading message="Loading profile..." />
    );
  }

  return (
    <div>
      <h1>Customer Profile</h1>

      <form onSubmit={handleSubmit}>
        <FormField
          label="Address"
          name="address"
          type="textarea"
          value={address}
          onChange={(e) =>
            setAddress(e.target.value)
          }
          rows={4}
          required
        />

        <br />

        <FormField
          label="City"
          name="city"
          type="text"
          value={city}
          onChange={(e) =>
            setCity(e.target.value)
          }
          required
        />

        <br />

        {error && <p>{error}</p>}

        {message && <p>{message}</p>}

        <button
          type="submit"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : profileExists
            ? "Update Profile"
            : "Create Profile"}
        </button>
      </form>

      <br />

      <button
        type="button"
        onClick={() =>
          navigate("/customer")
        }
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default CustomerProfile;