"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Loader2, Pencil, Trash } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
        setError("Failed to delete poll. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="w-4 h-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {polls.map((poll, index) => (
        <Card key={poll._id} className="overflow-hidden">
          {poll.imageUrl && (
            <div className="relative w-full h-48">
              <Image
                src={poll.imageUrl}
                alt={poll.title}
                layout="fill"
                objectFit="cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="transition-transform duration-300 hover:scale-110"
                priority={index === 0}
              />
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 truncate">
              {poll.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {poll.options.length} option{poll.options.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/polls/${poll._id}`} passHref>
              <Button variant="outline">Vote Now</Button>
            </Link>
            <span className="text-sm text-gray-500">
              {new Date(poll.createdAt).toLocaleDateString()}
            </span>
          </CardFooter>
          {session && session.user.id === poll.createdBy && (
            <CardFooter className="flex justify-end space-x-2 bg-gray-50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/polls/edit/${poll._id}`)}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(poll._id)}
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
