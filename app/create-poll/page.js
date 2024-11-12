import CreatePollForm from "@/components/CreatePollForm";
/**
 * The function CreatePoll returns a JSX element for creating a new poll with a title and a form.
 * @returns The `CreatePoll` function is returning a JSX element that contains a `div` with the class
 * name "max-w-md mx-auto", a heading element `h1` with the text "Create a New Poll", and a
 * `CreatePollForm` component.
 */

export default function CreatePoll() {
  return (
    <div className="max-w-md mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Create a New Poll</h1>
      <CreatePollForm />
    </div>
  );
}
