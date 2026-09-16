import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

import FormField from "../../components/FormField";
import Loading from "../../components/Loading";

interface ArtisanOrder {
  orderId: number;
  requestId: number;
  customerId: number;
  artisanId: number;
  platformFeePercent: number;
  platformFee: number;
  totalAmount: number;
  advanceAmount: number;
  remainingAmount: number;
  orderStatus: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  subjectImages?: string;
  artworkImages?: string;
  createdAt: string;
}

function ArtisanOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] =
    useState<ArtisanOrder | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [artworkImages, setArtworkImages] =
    useState("");

  const [uploadLoading, setUploadLoading] =
    useState(false);

  const [uploadMessage, setUploadMessage] =
    useState("");

  useEffect(() => {
    if (orderId) {
      loadOrderDetails(Number(orderId));
    }
  }, [orderId]);

  const loadOrderDetails = async (
    id: number
  ) => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<ArtisanOrder>(
          `/Order/artisan/${id}`
        );

      console.log(
        "ARTISAN ORDER DETAILS:",
        response.data
      );

      console.log(
        "SUBJECT IMAGES:",
        response.data.subjectImages
      );

      setOrder(response.data);

      if (response.data.artworkImages) {
        setArtworkImages(
          response.data.artworkImages
        );
      }
    } catch (err: any) {
      console.log(
        "ARTISAN ORDER DETAILS ERROR:",
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
          "Failed to load order details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStartWork = async () => {
    if (!order) return;

    try {
      setError("");

      await api.post(
        `/Artisan/orders/${order.orderId}/start`
      );

      await loadOrderDetails(
        order.orderId
      );
    } catch (err: any) {
      console.log(
        "START WORK ERROR:",
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
          "Work could not be started."
      );
    }
  };

  const handleCompleteWork = async () => {
    if (!order) return;

    try {
      setError("");

      await api.post(
        `/Artisan/orders/${order.orderId}/complete`
      );

      await loadOrderDetails(
        order.orderId
      );
    } catch (err: any) {
      console.log(
        "COMPLETE WORK ERROR:",
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
          "Work could not be completed."
      );
    }
  };

  const handleUploadArtwork = async () => {
    if (!order) return;

    if (!artworkImages.trim()) {
      setUploadMessage(
        "Please enter an artwork image URL."
      );
      return;
    }

    try {
      setUploadLoading(true);
      setUploadMessage("");
      setError("");

      await api.put(
        `/Artisan/orders/${order.orderId}/artwork`,
        {
          artworkImages:
            artworkImages.trim(),
        }
      );

      setUploadMessage(
        "Artwork uploaded successfully."
      );

      await loadOrderDetails(
        order.orderId
      );
    } catch (err: any) {
      console.log(
        "ARTWORK UPLOAD ERROR:",
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

      setUploadMessage(
        err.response?.data?.message ||
          "Artwork upload failed."
      );
    } finally {
      setUploadLoading(false);
    }
  };

  const parseImages = (
    value?: string
  ): string[] => {
    if (!value) {
      return [];
    }

    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Old single image format
    }

    return [value];
  };

  const getImageUrl = (
    imagePath: string
  ) => {
    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    return `http://localhost:5215${imagePath}`;
  };

  if (loading) {
    return (
      <Loading
        message="Loading order details..."
      />
    );
  }

  if (error && !order) {
    return (
      <div>
        <p>{error}</p>

        <button
          type="button"
          onClick={() =>
            navigate("/artisan/orders")
          }
        >
          Back to My Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <p>Order not found.</p>

        <button
          type="button"
          onClick={() =>
            navigate("/artisan/orders")
          }
        >
          Back to My Orders
        </button>
      </div>
    );
  }

  const subjectImages = parseImages(
    order.subjectImages
  );

  return (
    <div>
      <h1>Order Details</h1>

      {error && <p>{error}</p>}

      <p>
        <strong>Order Status:</strong>{" "}
        {order.orderStatus}
      </p>

      <hr />

      <h2>Reference Images</h2>

      {subjectImages.length > 0 ? (
        <div className="image-gallery">
          {subjectImages.map(
            (imagePath, index) => (
              <img
                key={`${imagePath}-${index}`}
                src={getImageUrl(imagePath)}
                alt={`Reference ${
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
      ) : (
        <p>
          No reference images uploaded.
        </p>
      )}

      <hr />

      <h2>Payment Details</h2>

      <p>
        <strong>Platform Fee:</strong>{" "}
        {order.platformFeePercent}%
      </p>

      <p>
        <strong>
          Platform Fee Amount:
        </strong>{" "}
        ₹{order.platformFee}
      </p>

      <p>
        <strong>Total Amount:</strong>{" "}
        ₹{order.totalAmount}
      </p>

      <p>
        <strong>
          Advance Amount:
        </strong>{" "}
        ₹{order.advanceAmount}
      </p>

      <p>
        <strong>
          Remaining Amount:
        </strong>{" "}
        ₹{order.remainingAmount}
      </p>

      <hr />

      {order.orderStatus === "Created" && (
        <div>
          <h2>Work</h2>

          <p>
            Advance payment must be
            completed before starting
            the work.
          </p>

          <button
            type="button"
            onClick={handleStartWork}
          >
            Start Work
          </button>

          <hr />
        </div>
      )}

      {order.orderStatus === "Started" && (
        <div>
          <h2>Work In Progress</h2>

          <p>
            Work has been started for
            this order.
          </p>

          <button
            type="button"
            onClick={handleCompleteWork}
          >
            Complete Work
          </button>

          <hr />
        </div>
      )}

      {order.orderStatus === "Completed" && (
        <div>
          <h2>Work Completed</h2>

          <p>
            The artisan has completed
            the work.
          </p>

          <hr />

          <h2>Upload Artwork</h2>

          <p>
            Add the final artwork image
            URL for this order.
          </p>

          <FormField
            label="Artwork Image"
            name="artworkImages"
            type="text"
            value={artworkImages}
            onChange={(e) =>
              setArtworkImages(
                e.target.value
              )
            }
            placeholder="Enter artwork image URL"
          />

          <br />

          <button
            type="button"
            onClick={handleUploadArtwork}
            disabled={
              uploadLoading ||
              !artworkImages.trim()
            }
          >
            {uploadLoading
              ? "Uploading..."
              : "Upload Artwork"}
          </button>

          {uploadMessage && (
            <p>
              <strong>
                {uploadMessage}
              </strong>
            </p>
          )}

          {order.artworkImages && (
            <div>
              <h3>
                Uploaded Artwork
              </h3>

              <img
                src={getImageUrl(
                  order.artworkImages
                )}
                alt="Final Artwork"
                width="300"
                height="200"
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />
            </div>
          )}

          <hr />
        </div>
      )}

      <h2>Order Timeline</h2>

      <p>
        <strong>Created:</strong>{" "}
        {order.createdAt}
      </p>

      <p>
        <strong>Accepted:</strong>{" "}
        {order.acceptedAt ||
          "Not yet"}
      </p>

      <p>
        <strong>Started:</strong>{" "}
        {order.startedAt ||
          "Not yet"}
      </p>

      <p>
        <strong>Completed:</strong>{" "}
        {order.completedAt ||
          "Not yet"}
      </p>

      <br />

      <button
        type="button"
        onClick={() =>
          navigate("/artisan/orders")
        }
      >
        Back to My Orders
      </button>
    </div>
  );
}

export default ArtisanOrderDetails;