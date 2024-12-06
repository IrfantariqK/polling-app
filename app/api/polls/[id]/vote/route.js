import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Poll from "@/models/Poll";

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { optionIndex } = await request.json();

    await dbConnect();
    const poll = await Poll.findById(id);

    if (!poll) {
      return NextResponse.json(
        { message: "Poll not found" },
        { status: 404 }
      );
    }

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return NextResponse.json(
        { message: "Invalid option" },
        { status: 400 }
      );
    }

    // Increment vote count without rate limiting
    poll.options[optionIndex].votes += 1;
    await poll.save();

    return NextResponse.json(poll);
  } catch (error) {
    console.error("Error voting on poll:", error);
    return NextResponse.json(
      { message: "Error processing vote" },
      { status: 500 }
    );
  }
}
