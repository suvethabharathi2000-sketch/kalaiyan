import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getArtisanOrders } from "../../services/artisanService";

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
  createdAt: string;
}

function ArtisanOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] =
    useState<ArtisanOrder[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getArtisanOrders();

      setOrders(data);
    } catch (err: any) {
      console.log(
        "ARTISAN ORDERS ERROR:",
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
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Loading message="Loading orders..." />
    );
  }

  return (
    <div>
      

      {error && <p>{error}</p>}

      {!error &&
        orders.length === 0 && (
          <p>No orders available.</p>
        )}

      {orders.map((order) => (
        <div key={order.orderId}>
          <h2>My Order</h2>

          <p>
            <strong>Total Amount:</strong>{" "}
            ₹{order.totalAmount}
          </p>

          <p>
            <strong>Advance Amount:</strong>{" "}
            ₹{order.advanceAmount}
          </p>

          <p>
            <strong>Remaining Amount:</strong>{" "}
            ₹{order.remainingAmount}
          </p>

          <p>
            <strong>Order Status:</strong>{" "}
            {order.orderStatus}
          </p>

          {order.acceptedAt && (
            <p>
              <strong>Accepted At:</strong>{" "}
              {order.acceptedAt}
            </p>
          )}

          {order.startedAt && (
            <p>
              <strong>Started At:</strong>{" "}
              {order.startedAt}
            </p>
          )}

          {order.completedAt && (
            <p>
              <strong>Completed At:</strong>{" "}
              {order.completedAt}
            </p>
          )}

          <button
            type="button"
            onClick={() =>
              navigate(
                `/artisan/orders/${order.orderId}`
              )
            }
          >
            View Details
          </button>

          <hr />
        </div>
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

export default ArtisanOrders;