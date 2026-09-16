import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { logout } from "../redux/slices/authSlice";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector(
    (state: RootState) => state.auth.user
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="app-header">
      <h1 className="app-logo">Kalaiyan</h1>

      <nav className="app-nav">
        {user?.role === "Customer" && (
          <>
            <button onClick={() => navigate("/customer/profile")}>
              My Profile
            </button>

            <button onClick={() => navigate("/customer/artisans")}>
              Browse Artisans
            </button>

            <button onClick={() => navigate("/customer/requests")}>
              My Requests
            </button>

            <button onClick={() => navigate("/customer/orders")}>
              My Orders
            </button>
          </>
        )}

        {user?.role === "Artisan" && (
          <>
            <button onClick={() => navigate("/artisan/profile")}>
              My Profile
            </button>

            <button onClick={() => navigate("/artisan/requests")}>
              Service Requests
            </button>

            <button onClick={() => navigate("/artisan/orders")}>
              My Orders
            </button>
          </>
        )}

        <button onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Header;