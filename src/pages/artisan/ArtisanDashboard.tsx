import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../redux/store";

import Header from "../../components/Header";

import {
  getArtisanProfile,
} from "../../services/artisanService";

import api from "../../services/api";

function ArtisanDashboard() {
  const navigate = useNavigate();

  const user = useSelector(
    (state: RootState) => state.auth.user
  );

  const [artisanId, setArtisanId] =
    useState<number | null>(null);

  const [averageRating, setAverageRating] =
    useState(0);

  const [reviewCount, setReviewCount] =
    useState(0);

  // Load logged-in artisan profile
  useEffect(() => {
    const loadArtisanProfile = async () => {
      try {
        const profile =
          await getArtisanProfile();

        setArtisanId(profile.artisanId);
      } catch (err) {
        console.log(
          "ARTISAN PROFILE ERROR:",
          err
        );
      }
    };

    loadArtisanProfile();
  }, []);

  // Load artisan review summary
  useEffect(() => {
    if (!artisanId) {
      return;
    }

    const loadReviewSummary = async () => {
      try {
        const response = await api.get(
          `/Review/artisan/${artisanId}/summary`
        );

        console.log(
          "ARTISAN REVIEW SUMMARY:",
          JSON.stringify(
            response.data,
            null,
            2
          )
        );

        setAverageRating(
          response.data.AverageRating
        );

        setReviewCount(
          response.data.ReviewCount
        );
      } catch (err) {
        console.log(
          "REVIEW SUMMARY ERROR:",
          err
        );
      }
    };

    loadReviewSummary();
  }, [artisanId]);

  return (
    <div>
      <Header />

      <h2>
        Welcome, {user?.fullName} 👋
      </h2>

      <p>
        Manage your artisan profile, service
        requests, and orders from here.
      </p>

      <hr />

      <h2>Your Reviews</h2>

      <div>
        <h3>
          ⭐ {averageRating.toFixed(1)}
        </h3>

        <p>
          {reviewCount} Reviews
        </p>
      </div>

      <hr />

      <h2>Quick Actions</h2>

      <button
        type="button"
        onClick={() =>
          navigate("/artisan/profile")
        }
      >
        My Profile
      </button>

      {" "}

      <button
        type="button"
        onClick={() =>
          navigate("/artisan/requests")
        }
      >
        Service Requests
      </button>
        {" "}

<button
  type="button"
  onClick={() =>
    navigate("/artisan/orders")
  }
>
  Orders
</button>

    </div>
  );
}

export default ArtisanDashboard;