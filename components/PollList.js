"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PollList() {
  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const router = useRouter();

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

  const handleDelete = async (pollId) => {
    if (confirm("Are you sure you want to delete this poll?")) {
      try {
        const response = await fetch(`/api/polls/${pollId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setPolls(polls.filter((poll) => poll._id !== pollId));
        } else {
          throw new Error("Failed to delete poll");
        }
      } catch (error) {
        console.error("Error deleting poll:", error);
        alert("Failed to delete poll. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 bg-red-100 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {polls.map((poll) => (
        <div
          key={poll._id}
          className="overflow-hidden transition-transform duration-300 bg-white rounded-lg shadow-lg hover:scale-105"
        >
          {poll.imageUrl && (
            <div className="relative w-full h-48">
              <Image
                src={poll.imageUrl}
                alt={poll.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-110"
              />
            </div>
          )}
          <div className="p-4">
            <h2 className="mb-2 text-xl font-semibold text-gray-800 truncate">
              {poll.title}
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              {poll.options.length} option{poll.options.length !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center justify-between">
              <Link
                href={`/polls/${poll._id}`}
                className="px-4 py-2 font-bold text-white transition-colors duration-300 bg-blue-500 rounded-full hover:bg-blue-600"
              >
                Vote Now
              </Link>
              <span className="text-sm text-gray-500">
                {new Date(poll.createdAt).toLocaleDateString()}
              </span>
            </div>
            {session && session.user.id === poll.createdBy && (
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  onClick={() => router.push(`/polls/edit/${poll._id}`)}
                  className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(poll._id)}
                  className="px-3 py-1 text-sm font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
