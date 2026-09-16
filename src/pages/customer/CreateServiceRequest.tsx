import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type {
  AppDispatch,
  RootState,
} from "../../redux/store";

import {
  clearSelectedArtisan,
} from "../../redux/slices/artisanSlice";

import {
  createServiceRequest,
} from "../../services/ServiceRequestService";

import api from "../../services/api";

import type {
  ServiceRequestDto,
  Category,
} from "../../types/api";

import FormField from "../../components/FormField";
import Loading from "../../components/Loading";

function CreateServiceRequest() {
  const navigate = useNavigate();

  const dispatch =
    useDispatch<AppDispatch>();

  const selectedArtisan =
    useSelector(
      (state: RootState) =>
        state.artisan.selectedArtisan
    );

  const selectedArtisanId =
    selectedArtisan?.artisanId;

  const selectedArtisanName =
    selectedArtisan?.companyName;

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [form, setForm] =
    useState<ServiceRequestDto>({
      artisanId:
        selectedArtisanId || 0,
      categoryId: 0,
      description: "",
      size: "",
      noOfFaces: 1,
      location: "",
      budget: 0,
      deadline: "",
      instructions: "",
    });

  // Multiple subject images
  const [subjectImages, setSubjectImages] =
    useState<File[]>([]);

  // Image preview URLs
  const [imagePreviews, setImagePreviews] =
    useState<string[]>([]);

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      setError("");

      const response =
        await api.get<Category[]>(
          "/Category"
        );

      setCategories(
        response.data
      );
    } catch (err: any) {
      console.log(
        "CATEGORY ERROR:",
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
          "Failed to load categories."
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const {
      name,
      value,
    } = e.target;

    setForm((previous) => ({
      ...previous,

      [name]:
        name === "categoryId"
          ? Number(value)
          : name === "noOfFaces"
          ? Number(value)
          : name === "budget"
          ? Number(value)
          : value,
    }));
  };

  // SELECT MULTIPLE IMAGES
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files =
      Array.from(
        e.target.files || []
      );

    if (files.length === 0) {
      return;
    }

    setSubjectImages(
      (previous) => [
        ...previous,
        ...files,
      ]
    );

    const newPreviews =
      files.map((file) =>
        URL.createObjectURL(file)
      );

    setImagePreviews(
      (previous) => [
        ...previous,
        ...newPreviews,
      ]
    );

    // Allow selecting same file again
    e.target.value = "";
  };

  // REMOVE INDIVIDUAL IMAGE
  const handleRemoveImage = (
    index: number
  ) => {
    const preview =
      imagePreviews[index];

    if (preview) {
      URL.revokeObjectURL(
        preview
      );
    }

    setSubjectImages(
      (previous) =>
        previous.filter(
          (_, i) =>
            i !== index
        )
    );

    setImagePreviews(
      (previous) =>
        previous.filter(
          (_, i) =>
            i !== index
        )
    );
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (form.budget <= 0) {
      setError(
        "Budget must be greater than 0."
      );

      return;
    }

    if (!selectedArtisanId) {
      setError(
        "Please select an artisan first."
      );

      return;
    }

    try {
      setSaving(true);
      console.log("SELECTED ARTISAN ID:", form.artisanId);
console.log("FORM DATA:", form);

      const requestData = {
  ...form,
  artisanId: selectedArtisanId,
};

const response =
  await createServiceRequest(
    requestData,
    subjectImages
  );
      setMessage(
        response.message ||
          "Service request created successfully."
      );

      // Clear selected artisan
      dispatch(
        clearSelectedArtisan()
      );

      // Reset form
      setForm({
        artisanId: 0,
        categoryId: 0,
        description: "",
        size: "",
        noOfFaces: 1,
        location: "",
        budget: 0,
        deadline: "",
        instructions: "",
      });

      // Clear images
      imagePreviews.forEach(
        (preview) =>
          URL.revokeObjectURL(
            preview
          )
      );

      setSubjectImages([]);
      setImagePreviews([]);
    } catch (err: any) {
      console.log(
        "CREATE REQUEST ERROR:",
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

      console.log(
    "BACKEND MESSAGE:",
    err.response?.data?.message
  );


      setError(
        err.response?.data?.message ||
          "Failed to create service request."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loadingCategories) {
    return (
      <Loading
        message="Loading categories..."
      />
    );
  }

  return (
    <div>
      <h1>
        Create Service Request
      </h1>

      {selectedArtisanName && (
        <div>
          <strong>
            Selected Artisan:
          </strong>{" "}
          {selectedArtisanName}
        </div>
      )}

      {!selectedArtisanId && (
        <p>
          Please go back and select an
          artisan first.
        </p>
      )}

      <br />

      <form
        onSubmit={handleSubmit}
      >
        <FormField
          label="Category"
          name="categoryId"
          type="select"
          value={form.categoryId}
          onChange={handleChange}
          required
          options={[
            {
              value: 0,
              label:
                "Select Category",
            },
            ...categories.map(
              (category) => ({
                value:
                  category.categoryId,
                label:
                  category.categoryName,
              })
            ),
          ]}
        />

        <br />

        <FormField
          label="Description"
          name="description"
          type="textarea"
          value={
            form.description
          }
          onChange={handleChange}
          rows={4}
        />

        <br />

        <FormField
          label="Size"
          name="size"
          type="text"
          value={form.size}
          onChange={handleChange}
          required
        />

        <br />

        <FormField
          label="Number of Faces"
          name="noOfFaces"
          type="number"
          value={
            form.noOfFaces || ""
          }
          onChange={handleChange}
          min="1"
          placeholder="Enter number of faces"
          required
        />

        <br />

        {/* =========================
            Subject Images
        ========================= */}

        <div className="form-field">
          <label htmlFor="subjectImages">
            Subject Images
          </label>

          <br />

          <input
            id="subjectImages"
            type="file"
            accept="image/*"
            multiple
            onChange={
              handleImageChange
            }
          />

          {subjectImages.length > 0 && (
            <div>
              <p>
                <strong>
                  Selected Images:{" "}
                  {subjectImages.length}
                </strong>
              </p>

              {subjectImages.map(
                (image, index) => (
                  <div
                    key={`${image.name}-${index}`}
                    style={{
                      marginBottom:
                        "20px",
                    }}
                  >
                    <p>
                      <strong>
                        Image{" "}
                        {index + 1}:
                      </strong>{" "}
                      {image.name}
                    </p>

                    <img
                      src={
                        imagePreviews[
                          index
                        ]
                      }
                      alt={`Subject ${
                        index + 1
                      }`}
                      width="300"
                      height="200"
                      style={{
                        objectFit:
                          "contain",
                        border:
                          "1px solid #ddd",
                        borderRadius:
                          "8px",
                        background:
                          "#fff",
                      }}
                    />

                    <br />
                    <br />

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveImage(
                          index
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <br />

        <FormField
          label="Location"
          name="location"
          type="textarea"
          value={
            form.location
          }
          onChange={handleChange}
          rows={3}
          required
        />

        <br />

        <FormField
          label="Budget"
          name="budget"
          type="number"
          value={
            form.budget || ""
          }
          onChange={handleChange}
          min="1"
          step="0.01"
          placeholder="Enter budget"
          required
        />

        <br />

        <FormField
          label="Deadline"
          name="deadline"
          type="date"
          value={
            form.deadline
          }
          onChange={handleChange}
          required
        />

        <br />

        <FormField
          label="Instructions"
          name="instructions"
          type="textarea"
          value={
            form.instructions
          }
          onChange={handleChange}
          rows={4}
        />

        <br />

        {error && (
          <p>{error}</p>
        )}

        {message && (
          <p>{message}</p>
        )}

        <button
          type="submit"
          disabled={
            saving ||
            !selectedArtisanId
          }
        >
          {saving
            ? "Creating..."
            : "Create Request"}
        </button>
      </form>

      <br />

      <button
        type="button"
        onClick={() =>
          navigate(
            "/customer/artisans"
          )
        }
      >
        Back to Browse Artisans
      </button>

      <br />
      <br />

      <button
        type="button"
        onClick={() =>
          navigate(
            "/customer"
          )
        }
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default CreateServiceRequest;