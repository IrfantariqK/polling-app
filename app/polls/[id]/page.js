import Image from "next/image";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Poll from "@/models/Poll";
import VotingForm from "@/components/VotingForm";

/**
 * This JavaScript function retrieves a poll from a database by its ID and returns it as a JSON object
 * after converting it to a string.
 * @param id - The code snippet you provided is an asynchronous function `getPoll` that retrieves a
 * poll from the database based on the provided `id`. It first connects to the database using
 * `dbConnect`, then finds the poll by its id using `Poll.findById`. If the poll is not found, it calls
 * a
 * @returns The `getPoll` function is returning the poll data with the specified `id` in JSON format
 * after fetching it from the database.
 */
async function getPoll(id) {
  await dbConnect();
  const poll = await Poll.findById(id);
  if (!poll) {
    notFound();
  }
  return JSON.parse(JSON.stringify(poll));
}

export default async function PollPage({ params }) {
  // Await the params object before accessing its properties
  const { id } = await params;
  const poll = await getPoll(id);

  /* This code snippet is defining the return value of the `PollPage` component in a Next.js
  application. It is a JSX structure that will be rendered as part of the UI when this component is
  used. */
  return (
    <div className="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-md">
      <h1 className="mb-4 text-3xl font-bold">{poll.title}</h1>
      {poll.imageUrl && (
        <div className="relative w-full h-64 mb-4">
          <Image
            src={poll.imageUrl}
            alt={poll.title}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      )}
      <VotingForm poll={poll} />
    </div>
  );
}
