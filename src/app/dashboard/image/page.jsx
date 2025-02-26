"use client"

import { CldUploadWidget } from "next-cloudinary";
import React, { useState } from "react";

const Image = () => {

    const [ image , setImage ] = useState("")

  return (
    <div>

        <img src={image} className="w-20 h-20" alt="" />

      <CldUploadWidget
        uploadPreset="ml_default"
        options={{ sources: ["local", "url"] }}
        onSuccess={(result) =>
          setImage(result.info.secure_url)
        }
      >
        {({ open }) => (
          <button
            className="text-white mt-2 font-semibold text-sm rounded-lg px-4 py-2 bg-blue-500"
            onClick={() => open()}
          >
            Upload Image
          </button>
        )}
      </CldUploadWidget>


    </div>
  );
};

export default Image;