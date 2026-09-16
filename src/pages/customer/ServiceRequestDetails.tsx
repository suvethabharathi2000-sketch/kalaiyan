import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getServiceRequestDetails,
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

function ServiceRequestDetails() {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] =
    useState<ServiceRequest | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (requestId) {
      loadDetails(Number(requestId));
    }
  }, [requestId]);

  const loadDetails = async (id: number) => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getServiceRequestDetails(id);

      setRequest(data);
    } catch (err: any) {
      console.log(
        "REQUEST DETAILS ERROR:",
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
          "Failed to load request details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!request) return;

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
        request.requestId
      );

      await loadDetails(
        request.requestId
      );
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

  if (loading) {
    return (
      <Loading message="Loading request details..." />
    );
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>

        <button
          type="button"
          onClick={() =>
            navigate("/customer/requests")
          }
        >
          Back to My Requests
        </button>
      </div>
    );
  }

  if (!request) {
    return (
      <div>
        <p>Request not found.</p>

        <button
          type="button"
          onClick={() =>
            navigate("/customer/requests")
          }
        >
          Back to My Requests
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Service Request Details</h1>

      <h2>
        Request #{request.requestId}
      </h2>

      <p>
        <strong>Artisan ID:</strong>{" "}
        {request.artisanId}
      </p>

      <p>
        <strong>Category:</strong>{" "}
        {request.categoryName ||
          request.categoryId}
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
        <strong>Number of Faces:</strong>{" "}
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
        <strong>Instructions:</strong>{" "}
        {request.instructions ||
          "None"}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {request.requestStatus}
      </p>

      <p>
        <strong>Created At:</strong>{" "}
        {request.createdAt}
      </p>

      {request.updatedAt && (
        <p>
          <strong>Updated At:</strong>{" "}
          {request.updatedAt}
        </p>
      )}

      <h3>Subject Image</h3>

      <img
        src={
          request.subjectImages ||
          "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342"
        }
        alt="Subject"
        width="300"
        height="200"
        onError={(e) => {
          e.currentTarget.src =
            "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342";
        }}
      />

      <br />
      <br />

      {request.requestStatus ===
        "Pending" && (
        <button
          type="button"
          onClick={handleCancel}
        >
          Cancel Request
        </button>
      )}

      <br />
      <br />

      <button
        type="button"
        onClick={() =>
          navigate("/customer/requests")
        }
      >
        Back to My Requests
      </button>
    </div>
  );
}

export default ServiceRequestDetails;
