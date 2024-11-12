import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/db";
import Poll from "@/models/Poll";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { uploadImage } from "@/lib/uploadImage";

/**
 * This function fetches all polls from the database and returns them in descending order of creation
 * date.
 * @returns The `GET` function is returning a JSON response containing the polls fetched from the
 * database. If the fetching is successful, it returns the fetched polls. If there is an error during
 * the fetching process, it returns a JSON object with a message "Failed to fetch polls" and a status
 * code of 500.
 */
export async function GET() {
  try {
    await dbConnect();
    const polls = await Poll.find().sort({ createdAt: -1 });
    return NextResponse.json(polls);
  } catch (error) {
    console.error("Error fetching polls:", error);
    return NextResponse.json(
      { message: "Failed to fetch polls" },
      { status: 500 }
    );
  }
}

/**
 * The above function is an asynchronous POST request handler in JavaScript that creates a poll, checks
 * for user authentication, parses form data, and logs the received data.
 * @param request - The `request` parameter in the code snippet represents the incoming HTTP request
 * that the function is handling. It contains information such as headers, body, URL parameters, and
 * other details of the request made to the server. In this case, the function is expecting a POST
 * request to create a poll, and
 * @returns The code snippet is returning a JSON response with a message indicating that the user must
 * be logged in to create a poll, along with a status code of 401 (Unauthorized).
 */
export async function POST(request) {
  console.log("Received POST request to create poll");
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.log("No session found or user not authenticated");
      return NextResponse.json(
        { message: "You must be logged in to create a poll" },
        { status: 401 }
      );
    }

    await dbConnect();
    const formData = await request.formData();
    console.log("Received form data:", formData);

    const title = formData.get("title");
    const options = formData.getAll("options[]");
    const image = formData.get("image");

    console.log("Parsed data:", {
      title,
      options,
      image: image ? "Image file received" : "No image",
    });

   /* This block of code is handling the creation of a new poll in the POST request function. Here's a
   breakdown of what it does: */
    if (!title || options.length < 2) {
      return NextResponse.json(
        { message: "Title and at least two options are required" },
        { status: 400 }
      );
    }

    let imageUrl = null;
    if (image) {
      try {
        imageUrl = await uploadImage(image);
        console.log("Image uploaded successfully:", imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json(
          { message: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    const poll = new Poll({
      title,
      options: options.map((option) => ({ text: option, votes: 0 })),
      createdBy: session.user.id,
      imageUrl,
    });

    await poll.save();
    console.log("Poll created successfully:", poll);

    return NextResponse.json(poll, { status: 201 });
  } catch (error) {
    console.error("Error creating poll:", error);
    return NextResponse.json(
      { message: "Failed to create poll", error: error.message },
      { status: 500 }
    );
  }
}
