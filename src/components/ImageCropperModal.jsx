import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { FaTimes } from "react-icons/fa";
import "./ImageCropperModal.css";

const ImageCropperModal = ({
  image,
  onCropComplete: onCropSave,
  onClose,
  aspect = 1,
  shape = "rect",
  title = "Crop Image",
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = useCallback((crop) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom) => {
    setZoom(zoom);
  }, []);

  const onCropCompleteInternal = useCallback(
    (_croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleSave = async () => {
    try {
      const canvas = document.createElement("canvas");
      const img = new Image();

      img.src = image;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("Failed to create blob");
            return;
          }

          onCropSave(blob);
        },
        "image/jpeg",
        0.9,
      );
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  };

  return (
    <div className="cropper-modal-overlay">
      <div className="cropper-modal-content">
        <div className="cropper-header">
          <h3>{title}</h3>
          <button type="button" onClick={onClose} className="btn-close-cropper">
            <FaTimes />
          </button>
        </div>
        <div className="cropper-container-wrapper">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
            cropShape={shape}
            showGrid={false}
          />
        </div>
        <div className="cropper-controls">
          <div className="zoom-control">
            <span>Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(e.target.value)}
              className="zoom-range"
            />
          </div>
          <button type="button" onClick={handleSave} className="btn-save-crop">
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
