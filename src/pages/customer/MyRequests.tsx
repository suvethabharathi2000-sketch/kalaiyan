import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCustomerRequests,
  cancelServiceRequest,
} from "../../services/ServiceRequestService";

import Loading from "../../components/Loading";

interface ServiceRequest {
  requestId: number;
  artisanId: number;
  customerId: number;
  categoryId: number;
  categoryName?: string;
  description?: string;
  size: string;
  noOfFaces: number;
  subjectImages?: string;
  location: string;
  budget: number;
  deadline: string;
  instructions?: string;
  requestStatus: string;
  createdAt: string;
  updatedAt?: string;
}

function MyRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] =
    useState<ServiceRequest[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getCustomerRequests();

      setRequests(data);
    } catch (err: any) {
      console.log(
        "MY REQUESTS ERROR:",
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
          "Failed to load service requests."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (
    requestId: number
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this request?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await cancelServiceRequest(
        requestId
      );

      await loadRequests();
    } catch (err: any) {
      console.log(
        "CANCEL REQUEST ERROR:",
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
          "Failed to cancel request."
      );
    }
  };

  const parseSubjectImages = (
    value?: string
  ): string[] => {
    if (!value) {
      return [];
    }

    try {
      const parsed =
        JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Old single-image format
    }

    return [value];
  };

  const getImageUrl = (
    imagePath: string
  ) => {
    if (
      imagePath.startsWith("http")
    ) {
      return imagePath;
    }

    return `http://localhost:5215${imagePath}`;
  };

  if (loading) {
    return (
      <Loading message="Loading your requests..." />
    );
  }

  return (
    <div>
      <h1>My Requests</h1>

      {error && <p>{error}</p>}

      {!error &&
        requests.length === 0 && (
          <p>
            No service requests found.
          </p>
        )}

      {requests.map((request) => {
        const subjectImages =
          parseSubjectImages(
            request.subjectImages
          );

        return (
          <div
            key={request.requestId}
            className="request-card"
          >
            <h2>
              Service Request
            </h2>

            <p>
  <strong>Category:</strong>{" "}
  {request.categoryName ||
    "Category not available"}
</p>

            <p>
              <strong>Description:</strong>{" "}
              {request.description ||
                "No description"}
            </p>

            <p>
              <strong>Size:</strong>{" "}
              {request.size}
            </p>

            <p>
              <strong>
                Number of Faces:
              </strong>{" "}
              {request.noOfFaces}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {request.location}
            </p>

            <p>
              <strong>Budget:</strong>{" "}
              ₹{request.budget}
            </p>

            <p>
              <strong>Deadline:</strong>{" "}
              {request.deadline}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {request.requestStatus}
            </p>

            {subjectImages.length > 0 && (
              <>
                <h3>
                  Subject Images
                </h3>

                <div className="image-gallery">
                  {subjectImages.map(
                    (imagePath, index) => (
                      <img
                        key={`${imagePath}-${index}`}
                        src={getImageUrl(
                          imagePath
                        )}
                        alt={`Subject ${
                          index + 1
                        }`}
                        className="gallery-image"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />
                    )
                  )}
                </div>
              </>
            )}

            <br />

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/customer/requests/${request.requestId}`
                )
              }
            >
              View Details
            </button>

            {" "}

            {request.requestStatus ===
              "Pending" && (
              <button
                type="button"
                onClick={() =>
                  handleCancel(
                    request.requestId
                  )
                }
              >
                Cancel Request
              </button>
            )}

            <hr />
          </div>
        );
      })}

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

export default MyRequests;