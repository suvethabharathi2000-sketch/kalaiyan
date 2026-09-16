import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";
import { createPayment } from "../../services/PaymentService";
import { createReview } from "../../services/reviewService";
import Loading from "../../components/Loading";

interface CustomerOrder {
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
  isFinalPaymentCompleted: boolean;
  createdAt: string;
}

function CustomerOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] =
    useState<CustomerOrder | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("UPI");

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  const [paymentMessage, setPaymentMessage] =
    useState("");

    const [reviewRating, setReviewRating] =
  useState(0);

const [reviewComment, setReviewComment] =
  useState("");

const [reviewLoading, setReviewLoading] =
  useState(false);

const [reviewMessage, setReviewMessage] =
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
        await api.get<CustomerOrder>(
          `/Order/customer/${id}`
        );

        console.log(
  "SUBJECT IMAGES:",
  response.data.subjectImages
);

console.log(
  "ALL ORDER DATA:",
  JSON.stringify(response.data, null, 2)
);

console.log(
  "ORDER STATUS:",
  response.data.orderStatus
);

console.log(
  "FINAL PAYMENT COMPLETED:",
  response.data.isFinalPaymentCompleted
);

console.log(
  "FINAL PAYMENT TYPE:",
  typeof response.data.isFinalPaymentCompleted
);

      setOrder(response.data);
    } catch (err: any) {
      console.log(
        "CUSTOMER ORDER DETAILS ERROR:",
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

  const parseImages = (
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
      // Supports old single-image format
    }

    return [value];
  };

  const defaultImage =
  "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342";

const getImageUrl = (imagePath: string) => {
  if (!imagePath) {
    return defaultImage;
  }

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://")
  ) {
    return imagePath;
  }

  if (imagePath.startsWith("/uploads/")) {
    return `http://localhost:5215${imagePath}`;
  }

  return `http://localhost:5215/uploads/requests/${imagePath}`;
};

  const handleAdvancePayment = async () => {
    if (!order) {
      return;
    }

    try {
      setPaymentLoading(true);
      setPaymentMessage("");
      setError("");

      const result =
        await createPayment({
          orderId: order.orderId,
          paymentType: "Advance",
          paymentMethod: paymentMethod,
        });

      setPaymentMessage(
        `Payment successful! Payment ID: ${result.paymentId}`
      );

      await loadOrderDetails(
        order.orderId
      );
    } catch (err: any) {
      console.log(
        "PAYMENT ERROR:",
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

      setPaymentMessage(
        err.response?.data?.message ||
          "Payment failed."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleFinalPayment = async () => {
    if (!order) {
      return;
    }

    try {
      setPaymentLoading(true);
      setPaymentMessage("");
      setError("");

      const result =
        await createPayment({
          orderId: order.orderId,
          paymentType: "Final",
          paymentMethod: paymentMethod,
        });

      setPaymentMessage(
        `Final payment successful! Payment ID: ${result.paymentId}`
      );

      await loadOrderDetails(
        order.orderId
      );
    } catch (err: any) {
      console.log(
        "FINAL PAYMENT ERROR:",
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

      setPaymentMessage(
        err.response?.data?.message ||
          "Final payment failed."
      );
    } finally {
      setPaymentLoading(false);
    }
  };
  const handleReviewSubmit = async () => {
  if (!order) {
    return;
  }

  if (reviewRating < 1 || reviewRating > 5) {
    setReviewMessage(
      "Please select a rating between 1 and 5."
    );
    return;
  }

  try {
    setReviewLoading(true);
    setReviewMessage("");
    setError("");

    const result = await createReview({
      orderId: order.orderId,
      rating: reviewRating,
      comment: reviewComment.trim() || undefined,
    });

    setReviewMessage(
      result.message ||
        "Review submitted successfully!"
    );

    setReviewRating(0);
    setReviewComment("");
  } catch (err: any) {
    console.log(
      "REVIEW ERROR:",
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

    setReviewMessage(
      err.response?.data?.message ||
        "Failed to submit review."
    );
  } finally {
    setReviewLoading(false);
  }
};
  if (loading) {
    return (
      <Loading message="Loading order details..." />
    );
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/customer/orders"
            )
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
            navigate(
              "/customer/orders"
            )
          }
        >
          Back to My Orders
        </button>
      </div>
    );
  }

  const subjectImages =
    parseImages(
      order.subjectImages
    );

  const artworkImages =
    parseImages(
      order.artworkImages
    );

  return (
    <div>
      <h1>Order Details</h1>

      <h2>Service Order</h2>

      <p>
        <strong>Status:</strong>{" "}
        {order.orderStatus}
      </p>

      <hr />

      <h2>Reference Images</h2>

      {subjectImages.length > 0 ? (
        <div className="image-gallery">
          {subjectImages.map(
            (
              imagePath,
              index
            ) => (
              <img
  key={`${imagePath}-${index}`}
  src={getImageUrl(imagePath)}
  alt={`Reference ${index + 1}`}
  className="gallery-image"
  onError={(e) => {
    e.currentTarget.src = defaultImage;
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
        <strong>
          Total Amount:
        </strong>{" "}
        ₹{order.totalAmount}
      </p>

      <p>
        <strong>
          Advance Amount (30%):
        </strong>{" "}
        ₹{order.advanceAmount}
      </p>

      <p>
        <strong>
          Remaining Amount (70%):
        </strong>{" "}
        ₹{order.remainingAmount}
      </p>

      <hr />

      {order.orderStatus ===
        "Created" && (
        <div>
          <h2>Pay Advance</h2>

          <p>
            Please pay the 30% advance
            amount before the artisan
            starts the work.
          </p>

          <p>
            <strong>
              Amount to Pay:
            </strong>{" "}
            ₹{order.advanceAmount}
          </p>

          <label>
            <strong>
              Payment Method:
            </strong>
          </label>

          <br />

          <select
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(
                e.target.value
              )
            }
          >
            <option value="UPI">
              UPI
            </option>

            <option value="Card">
              Card
            </option>

            <option value="Cash">
              Cash
            </option>

            <option value="NetBanking">
              Net Banking
            </option>
          </select>

          <br />
          <br />

          <button
            type="button"
            onClick={
              handleAdvancePayment
            }
            disabled={
              paymentLoading
            }
          >
            {paymentLoading
              ? "Processing..."
              : `Pay ₹${order.advanceAmount}`}
          </button>

          {paymentMessage && (
            <p>
              <strong>
                {paymentMessage}
              </strong>
            </p>
          )}
        </div>
      )}

      {paymentMessage &&
        order.orderStatus !==
          "Created" && (
          <p>
            <strong>
              {paymentMessage}
            </strong>
          </p>
        )}

      {order.orderStatus ===
        "Completed" && (
        <div>
          <h2>Final Payment</h2>

          {order.isFinalPaymentCompleted ? (
            <p>
              <strong>
                Final payment completed
                ✅
              </strong>
            </p>
          ) : (
            <div>
              <p>
                The work has been
                completed. Please pay
                the remaining 70%
                amount.
              </p>

              <p>
                <strong>
                  Amount to Pay:
                </strong>{" "}
                ₹
                {
                  order.remainingAmount
                }
              </p>

              <label>
                <strong>
                  Payment Method:
                </strong>
              </label>

              <br />

              <select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              >
                <option value="UPI">
                  UPI
                </option>

                <option value="Card">
                  Card
                </option>

                <option value="Cash">
                  Cash
                </option>

                <option value="NetBanking">
                  Net Banking
                </option>
              </select>

              <br />
              <br />

              <button
                type="button"
                onClick={
                  handleFinalPayment
                }
                disabled={
                  paymentLoading
                }
              >
                {paymentLoading
                  ? "Processing..."
                  : `Pay ₹${order.remainingAmount}`}
              </button>

              {paymentMessage && (
                <p>
                  <strong>
                    {paymentMessage}
                  </strong>
                </p>
              )}
            </div>
          )}

          <hr />
        </div>
      )}

      <h2>Final Artwork</h2>

      {artworkImages.length > 0 ? (
        <div>
          <p>
            <strong>
              Artwork uploaded by artisan:
            </strong>
          </p>

          <div className="image-gallery">
            {artworkImages.map(
              (
                imagePath,
                index
              ) => (
                <img
                  key={`${imagePath}-${index}`}
                  src={getImageUrl(
                    imagePath
                  )}
                  alt={`Final Artwork ${
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
        </div>
      ) : (
        <p>
          Final artwork has not been
          uploaded yet.
        </p>
      )}

      <hr />{order.orderStatus === "Completed" &&
  order.isFinalPaymentCompleted && (
    <>
      <hr />

      <h2>Rate & Review Artisan</h2>

      <p>
        Please share your experience with
        the artisan.
      </p>

      <div>
        <strong>Rating:</strong>

        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "10px",
            marginBottom: "15px",
          }}
        >
          {[1, 2, 3, 4, 5].map(
            (star) => (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setReviewRating(star)
                }
                style={{
  fontSize: "32px",
  border: "none",
  background: "none",
  cursor: "pointer",
  padding: "0",
  color:
    star <= reviewRating
      ? "#f59e0b"
      : "#d1d5db",
}}
              >
                {star <= reviewRating
                  ? "★"
                  : "☆"}
              </button>
            )
          )}
        </div>
      </div>

      <div>
        <label>
          <strong>Comment:</strong>
        </label>

        <br />

        <textarea
          value={reviewComment}
          onChange={(e) =>
            setReviewComment(
              e.target.value
            )
          }
          placeholder="Write your experience..."
          rows={5}
          style={{
            width: "100%",
            maxWidth: "600px",
            marginTop: "8px",
            padding: "10px",
          }}
        />
      </div>

      <br />

      <button
        type="button"
        onClick={handleReviewSubmit}
        disabled={reviewLoading}
      >
        {reviewLoading
          ? "Submitting..."
          : "Submit Review"}
      </button>

      {reviewMessage && (
        <p>
          <strong>
            {reviewMessage}
          </strong>
        </p>
      )}

      <hr />
    </>
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
          navigate(
            "/customer/orders"
          )
        }
      >
        Back to My Orders
      </button>
    </div>
  );
}

export default CustomerOrderDetails;