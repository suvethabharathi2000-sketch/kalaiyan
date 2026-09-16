import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "../../redux/store";
import { selectArtisan } from "../../redux/slices/artisanSlice";

import type { Artisan } from "../../types/artisan";

import ArtisanCard from "../../components/ArtisanCard";
import Loading from "../../components/Loading";
import api from "../../services/api";

function BrowseArtisans() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [artisans, setArtisans] = useState<Artisan[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadArtisans();
  }, []);

  const loadArtisans = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await api.get<Artisan[]>(
      "/CustomerArtisan"
    );

    const artisanList = response.data;

    const artisansWithReviews = await Promise.all(
      artisanList.map(async (artisan) => {
        try {
          const reviewResponse = await api.get<{
            ArtisanId: number;
            AverageRating: number;
            ReviewCount: number;
          }>(
            `/Review/artisan/${artisan.artisanId}/summary`
          );

          console.log(
  "REVIEW SUMMARY:",
  artisan.artisanId,
  JSON.stringify(reviewResponse.data, null, 2)
);

          return {
            ...artisan,
            averageRating:
              reviewResponse.data.AverageRating,
            reviewCount:
              reviewResponse.data.ReviewCount,
          };
        } catch (err) {
          console.log(
            `REVIEW SUMMARY ERROR FOR ARTISAN ${artisan.artisanId}:`,
            err
          );

          return {
            ...artisan,
            averageRating: 0,
            reviewCount: 0,
          };
        }
      })
    );
    console.log(
  "ARTISANS WITH REVIEWS:",
  JSON.stringify(artisansWithReviews, null, 2)
);

    setArtisans(artisansWithReviews);
  } catch (err: any) {
    console.log("BROWSE ARTISAN ERROR:", err);
    console.log("STATUS:", err.response?.status);
    console.log("DATA:", err.response?.data);

    setError(
      err.response?.data?.message ||
        "Failed to load artisans."
    );
  } finally {
    setLoading(false);
  }
};

  const handleSelectArtisan = (artisan: Artisan) => {
    dispatch(selectArtisan(artisan));
    navigate("/customer/request");
  };

  if (loading) {
  return <Loading message="Loading artisans..." />;
}

  return (
    <div>
      <h1>Browse Artisans</h1>

      <p>
        Explore artisans and their previous work.
      </p>

      {error && <p>{error}</p>}

      {!error && artisans.length === 0 && (
        <p>No artisans available.</p>
      )}

      <div className="artisan-list">
        {artisans.map((artisan) => (
          <ArtisanCard
            key={artisan.artisanId}
            artisan={artisan}
            onSelect={handleSelectArtisan}
          />
        ))}
      </div>

      <br />

      <button onClick={() => navigate("/customer")}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default BrowseArtisans;