import type { Artisan } from "../types/artisan";
import { useState } from "react";

interface ArtisanCardProps {
  artisan: Artisan;
  onSelect: (artisan: Artisan) => void;
}

function ArtisanCard({
  artisan,
  onSelect,
}: ArtisanCardProps) {
  const [currentImageIndex, setCurrentImageIndex] =
  useState(0);

  const images =
  artisan.previousWorkImages
    ?.split(",")
    .map((image) => image.trim())
    .filter((image) => image.length > 0) || [];
  const defaultImage =
    "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342";

  return (
    <div className="artisan-card">
     <div className="artisan-image-slider">

  {images.length > 1 && (
    <button
      type="button"
      onClick={() =>
        setCurrentImageIndex(
          currentImageIndex === 0
            ? images.length - 1
            : currentImageIndex - 1
        )
      }
    >
      ◀
    </button>
  )}

  <img
    className="artisan-card-image"
    src={
      images.length > 0
        ? images[currentImageIndex]
        : defaultImage
    }
    alt={artisan.companyName || "Artisan"}
    width="250"
    height="180"
    onError={(e) => {
      e.currentTarget.src = defaultImage;
    }}
  />

  {images.length > 1 && (
  <span className="artisan-image-counter">
    {currentImageIndex + 1} / {images.length}
  </span>
)}

  {images.length > 1 && (
    <button
      type="button"
      onClick={() =>
        setCurrentImageIndex(
          currentImageIndex === images.length - 1
            ? 0
            : currentImageIndex + 1
        )
      }
    >
      ▶
    </button>
  )}

</div> 

      <div className="artisan-card-content">
        <h2 className="artisan-card-title">
          {artisan.companyName || "Unnamed Artisan"}
        </h2>

        <div className="artisan-card-rating">
  <span>
    ⭐ {artisan.averageRating?.toFixed(1) || "0.0"}
  </span>

  <span>
    ({artisan.reviewCount || 0} Reviews)
  </span>
</div>

        <p>
          <strong>Experience:</strong>{" "}
          {artisan.experienceYears ?? 0} years
        </p>

        <p>
          <strong>Service Area:</strong>{" "}
          {artisan.serviceArea || "Not specified"}
        </p>

        <p>
          {artisan.description ||
            "No description available."}
        </p>

        <button
          className="artisan-card-button"
          onClick={() => onSelect(artisan)}
        >
          Select Artisan
        </button>
      </div>
    </div>
  );
}

export default ArtisanCard;