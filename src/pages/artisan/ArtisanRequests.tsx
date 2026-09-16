import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getArtisanRequests,
  acceptArtisanRequest,
  rejectArtisanRequest,
} from "../../services/artisanService";

import ArtisanRequestCard from "../../components/ArtisanRequestCard";
import Loading from "../../components/Loading";

interface ArtisanRequest {
  requestId: number;
  artisanId: number;
  customerId: number;
  categoryId: number;
  categoryName: string;
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

function ArtisanRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] =
    useState<ArtisanRequest[]>([]);

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
        await getArtisanRequests();

      setRequests(data);
    } catch (err: any) {
      console.log(
        "ARTISAN REQUEST ERROR:",
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

  const handleAccept = async (
    requestId: number
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to accept this request?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await acceptArtisanRequest(
        requestId
      );

      await loadRequests();
    } catch (err: any) {
      console.log(
        "ACCEPT ERROR:",
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
          "Failed to accept request."
      );
    }
  };

  const handleReject = async (
    requestId: number
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to reject this request?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await rejectArtisanRequest(
        requestId
      );

      await loadRequests();
    } catch (err: any) {
      console.log(
        "REJECT ERROR:",
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
          "Failed to reject request."
      );
    }
  };

  const handleViewDetails = (
    requestId: number
  ) => {
    navigate(
      `/artisan/requests/${requestId}`
    );
  };

  if (loading) {
    return (
      <Loading message="Loading service requests..." />
    );
  }

  return (
    <div>
      <h1>Service Requests</h1>

      {error && <p>{error}</p>}

      {!error &&
        requests.length === 0 && (
          <p>
            No pending service requests available.
          </p>
        )}

      {requests.map((request) => (
        <ArtisanRequestCard
          key={request.requestId}
          request={request}
          onAccept={handleAccept}
          onReject={handleReject}
          onViewDetails={
            handleViewDetails
          }
        />
      ))}

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

export default ArtisanRequests;