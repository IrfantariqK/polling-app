/**
 * The Home component renders a list of recent polls using the PollList component.
 * @returns The `Home` component is being returned, which consists of a `div` element containing a
 * heading "Recent Polls" and the `PollList` component.
 */
import PollList from "@/components/PollList";

export default function Home() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Recent Polls</h1>
      <PollList />
    </div>
  );
}
