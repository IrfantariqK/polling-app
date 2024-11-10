"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VotingForm({ poll }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleVote = async (e) => {
    e.preventDefault();
    if (selectedOption === null) {
      setError("Please select an option");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/polls/${poll._id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ optionIndex: selectedOption }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleVote} className="space-y-4">
      {poll.options.map((option, index) => (
        <div key={index} className="flex items-center">
          <input
            type="radio"
            id={`option-${index}`}
            name="poll-option"
            value={index}
            checked={selectedOption === index}
            onChange={() => {
              setSelectedOption(index);
              setError("");
            }}
            className="mr-2"
          />
          <label htmlFor={`option-${index}`} className="text-lg cursor-pointer">
            {option.text} ({option.votes} votes)
          </label>
        </div>
      ))}
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Voting..." : "Vote"}
      </button>
    </form>
  );
}
