import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Poll from "@/models/Poll";

export async function GET(request, { params }) {
  const { id } = params;
  await dbConnect();
  const poll = await Poll.findById(id);
  if (!poll) {
    return NextResponse.json({ message: "Poll not found" }, { status: 404 });
  }
  return NextResponse.json(poll);
}

export async function POST(request, { params }) {
  const { id } = params;
  const { optionIndex } = await request.json();

  await dbConnect();
  const poll = await Poll.findById(id);

  if (!poll) {
    return NextResponse.json({ message: "Poll not found" }, { status: 404 });
  }

  if (optionIndex < 0 || optionIndex >= poll.options.length) {
    return NextResponse.json({ message: "Invalid option" }, { status: 400 });
  }

  poll.options[optionIndex].votes += 1;
  await poll.save();

  return NextResponse.json(poll);
}
