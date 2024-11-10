"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PollList() {
  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch("/api/polls");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPolls(data);
      } catch (e) {
        console.error("Error fetching polls:", e);
        setError("Failed to fetch polls. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPolls();
  }, []);

  if (isLoading) {
    return <div>Loading polls...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {polls.map((poll) => (
        <div key={poll._id} className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="mb-2 text-xl font-semibold">{poll.title}</h2>
          <p className="mb-4 text-gray-600">Options: {poll.options.length}</p>
          <Link
            href={`/polls/${poll._id}`}
            className="inline-block px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            View Poll
          </Link>
        </div>
      ))}
    </div>
  );
}
