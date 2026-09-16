import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getArtisanProfile,
  createArtisanProfile,
  updateArtisanProfile,
  type ArtisanProfileDto,
} from "../../services/artisanService";

import FormField from "../../components/FormField";
import Loading from "../../components/Loading";

function ArtisanProfile() {
  const navigate = useNavigate();
  

  const [form, setForm] =
    useState<ArtisanProfileDto>({
      companyName: "",
      experienceYears: undefined,
      serviceArea: "",
      description: "",
      previousWorkImages: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [profileExists, setProfileExists] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const profile =
        await getArtisanProfile();

      setForm({
        companyName:
          profile.companyName || "",
        experienceYears:
          profile.experienceYears,
        serviceArea:
          profile.serviceArea || "",
        description:
          profile.description || "",
        previousWorkImages:
          profile.previousWorkImages || "",
      });

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "experienceYears"
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      form.experienceYears !== undefined &&
      form.experienceYears < 0
    ) {
      setError(
        "Experience years cannot be negative."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (profileExists) {
        await updateArtisanProfile(form);

        setMessage(
          "Artisan profile updated successfully."
        );
      } else {
        await createArtisanProfile(form);

        setProfileExists(true);

        setMessage(
          "Artisan profile created successfully."
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
      <h1>Artisan Profile</h1>

      <form onSubmit={handleSubmit}>
        <FormField
          label="Company Name"
          name="companyName"
          type="text"
          value={form.companyName}
          onChange={handleChange}
        />

        <br />

        <FormField
          label="Experience Years"
          name="experienceYears"
          type="number"
          value={form.experienceYears}
          onChange={handleChange}
          min="0"
        />

        <br />

        <FormField
          label="Service Area"
          name="serviceArea"
          type="text"
          value={form.serviceArea}
          onChange={handleChange}
        />

        <br />

        <FormField
          label="Description"
          name="description"
          type="textarea"
          value={form.description}
          onChange={handleChange}
          rows={5}
        />

        <br />

        <FormField
          label="Previous Work Images"
          name="previousWorkImages"
          type="textarea"
          value={form.previousWorkImages}
          onChange={handleChange}
          rows={4}
          placeholder="Image URL(s)"
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
          navigate("/artisan")
        }
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default ArtisanProfile;