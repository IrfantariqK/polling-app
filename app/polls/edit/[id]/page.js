"use client";

import { useParams } from "next/navigation";
import EditPollForm from "@/components/EditPollForm";

export default function EditPollPage() {
  const { id } = useParams();

  return (
    <div className="container py-8 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Edit Poll</h1>
      <EditPollForm id={id} />
    </div>
  );
}
