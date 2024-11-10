import CreatePollForm from "@/components/CreatePollForm";

export default function CreatePoll() {
  return (
    <div className="max-w-md mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Create a New Poll</h1>
      <CreatePollForm />
    </div>
  );
}
