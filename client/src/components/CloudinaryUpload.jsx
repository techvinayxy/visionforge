import { useState } from "react";

function CloudinaryUpload() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Upload failed");
      }

      setImageUrl(data.secure_url);

      console.log("Cloudinary Image URL:", data.secure_url);
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Cloudinary Upload Test</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />

      {uploading && <p>Uploading...</p>}

      {imageUrl && (
        <div>
          <p>Upload successful ✅</p>

          <img
            src={imageUrl}
            alt="Uploaded"
            style={{ width: "300px", marginTop: "10px" }}
          />

          <p>{imageUrl}</p>
        </div>
      )}
    </div>
  );
}

export default CloudinaryUpload;