import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/db";
import Poll from "@/models/Poll";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { uploadImage } from "@/lib/uploadImage"; // Implement this function to handle image uploads

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const poll = await Poll.findById(params.id);

    if (!poll) {
      return NextResponse.json({ message: "Poll not found" }, { status: 404 });
    }

    if (poll.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get("title");
    const options = formData
      .getAll("options[]")
      .map((option) => ({ text: option, votes: 0 }));
    const image = formData.get("image");

    poll.title = title;
    poll.options = options;

    if (image) {
      const imageUrl = await uploadImage(image);
      poll.imageUrl = imageUrl;
    }

    await poll.save();
    return NextResponse.json(poll);
  } catch (error) {
    console.error("Error updating poll:", error);
    return NextResponse.json(
      { message: "Failed to update poll" },
      { status: 500 }
    );
  }
}
