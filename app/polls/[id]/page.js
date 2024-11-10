import Image from "next/image";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/db";
import Poll from "@/models/Poll";
import VotingForm from "@/components/VotingForm";

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
