import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

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
  createdAt: string;
}

function CustomerOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] =
    useState<CustomerOrder[]>([]);

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

      const response =
        await api.get<CustomerOrder[]>(
          "/Order/customer"
        );

      setOrders(response.data);
    } catch (err: any) {
      console.log(
        "CUSTOMER ORDERS ERROR:",
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
      <Loading message="Loading your orders..." />
    );
  }

  return (
    <div>
      <h1>My Orders</h1>

      <p>
        View and manage your service orders.
      </p>

      {error && <p>{error}</p>}

      {!error &&
        orders.length === 0 && (
          <p>
            You don't have any orders yet.
          </p>
        )}

      {orders.map((order) => (
        <div
          key={order.orderId}
          className="order-card"
        >
          <h2>Service Order</h2>

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
            <strong>Status:</strong>{" "}
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
                `/customer/orders/${order.orderId}`
              )
            }
          >
            View Order
          </button>
        </div>
      ))}

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

export default CustomerOrders;