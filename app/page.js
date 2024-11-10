import PollList from "@/components/PollList";

export default function Home() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Recent Polls</h1>
      <PollList />
    </div>
  );
}
