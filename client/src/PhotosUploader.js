import React, { useState } from "react";
import Image from "./Image";

const PhotosUploader = ({ addedPhotos, onChange }) => {
  const [photoLink, setPhotoLink] = useState("");

  async function addPhotoByLink(event) {
    event.preventDefault();
    const response = await fetch("http://localhost:4000/upload-by-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ link: photoLink }),
    });

    const { data: filename } = await response.json();

    onChange((prev) => {
      return [...prev, filename];
    });

    setPhotoLink("");
  }

  async function uploadPhoto(event) {
    const files = event.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }

    const response = await fetch("http://localhost:4000/upload", {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const uploadData = await response.json();
    const { data: filenames } = uploadData.data;

    onChange((prev) => {
      return [...prev, ...filenames];
    });
  }

  return <div></div>;
};

export default PhotosUploader;
