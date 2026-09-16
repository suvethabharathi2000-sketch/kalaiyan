import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

import Header from "../../components/Header";

function CustomerDashboard() {
  const user = useSelector(
    (state: RootState) => state.auth.user
  );

  return (
    <div>
      <Header />

      <main className="dashboard-container">
        <section className="dashboard-welcome">
          <h2>
            Welcome back, {user?.fullName}
          </h2>

          <p>
            Manage your service requests,
            explore artisans, and track your
            orders from here.
          </p>
        </section>

        <section className="profile-summary-card">
          

          
        </section>

        <section className="dashboard-info">
          <h3>Your Dashboard</h3>

          <p>
            Use the navigation above to manage
            your profile, browse artisans, view
            service requests, and track your
            orders.
          </p>
        </section>
      </main>
    </div>
  );
}

export default CustomerDashboard;