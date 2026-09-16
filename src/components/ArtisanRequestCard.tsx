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

interface ArtisanRequestCardProps {
  request: ArtisanRequest;
  onAccept: (requestId: number) => void;
  onReject: (requestId: number) => void;
  onViewDetails: (requestId: number) => void;
}

function ArtisanRequestCard({
  request,
  onAccept,
  onReject,
  onViewDetails,
}: ArtisanRequestCardProps) {
  const defaultImage =
    "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342";

    

const parseImages = (value?: string): string[] => {
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

const getImageUrl = (imagePath: string) => {
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

const subjectImages = parseImages(
  request.subjectImages
);

console.log("ARTISAN REQUEST:", request);
console.log("SUBJECT IMAGES:", request.subjectImages);
console.log("PARSED IMAGES:", subjectImages);
  return (
    <div className="artisan-request-card">
      

      <p>
        <strong>Category:</strong>{" "}
        {request.categoryName}
      </p>

      <p>
        <strong>Description:</strong>{" "}
        {request.description || "No description"}
      </p>

      <p>
        <strong>Size:</strong>{" "}
        {request.size}
      </p>

      <p>
        <strong>Number of Faces:</strong>{" "}
        {request.noOfFaces}
      </p>

      <p>
        <strong>Location:</strong>{" "}
        {request.location}
      </p>

      <p>
        <strong>Budget:</strong>{" "}
        ₹{request.budget}
      </p>

      <p>
        <strong>Deadline:</strong>{" "}
        {request.deadline}
      </p>

      <p>
        <strong>Instructions:</strong>{" "}
        {request.instructions || "None"}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {request.requestStatus}
      </p>

      <hr />

      <h3>Customer Reference Images</h3>

{subjectImages.length > 0 ? (
  <div className="image-gallery">
    {subjectImages.map((imagePath, index) => (
      <img
        key={`${imagePath}-${index}`}
        src={getImageUrl(imagePath)}
        alt={`Customer Reference ${index + 1}`}
        className="gallery-image"
        onError={(e) => {
          e.currentTarget.src = defaultImage;
        }}
      />
    ))}
  </div>
) : (
  <p>No reference images uploaded.</p>
)}

      <br />
      <br />

      <button
        type="button"
        onClick={() => onAccept(request.requestId)}
      >
        Accept
      </button>

      {" "}

      <button
        type="button"
        onClick={() => onReject(request.requestId)}
      >
        Reject
      </button>

      <br />
      <br />

      <button
        type="button"
        onClick={() =>
          onViewDetails(request.requestId)
        }
      >
        View Details
      </button>
    </div>
  );
}

export default ArtisanRequestCard;