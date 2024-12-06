"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CreatePollForm() {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, ""]);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status !== "authenticated") {
      setError("You must be logged in to create a poll");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    options.forEach((option, index) => {
      formData.append(`options[]`, option);
    });
    if (image) {
      formData.append("image", image);
    }

    console.log("Submitting form data:", {
      title,
      options,
      imageFileName: image ? image.name : "No image",
    });

    try {
      console.log("Sending POST request to /api/polls");
      const response = await fetch("/api/polls", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      console.log("Response OK:", response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log("Poll created successfully:", data);
        router.push("/");
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        setError(errorData.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Please sign in to create a poll.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" role="form" aria-label="Create Poll Form">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Poll Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          aria-required="true"
          aria-invalid={!title}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      {options.map((option, index) => (
        <div key={index}>
          <label
            htmlFor={`option-${index}`}
            className="block text-sm font-medium text-gray-700"
          >
            Option {index + 1}
          </label>
          <input
            type="text"
            id={`option-${index}`}
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            required
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
      ))}
      {options.length < 5 && (
        <button
          type="button"
          onClick={addOption}
          className="px-4 py-2 font-bold text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
        >
          Add Option
        </button>
      )}
      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          Poll Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full mt-1"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"
      >
        Create Poll
      </button>
    </form>
  );
}
