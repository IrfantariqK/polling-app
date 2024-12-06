import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import dbConnect from "@/lib/db"
import Poll from "@/models/Poll"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request, { params }) {
  try {
    await dbConnect()
    const poll = await Poll.findById(params.id)

    if (!poll) {
      return NextResponse.json({ message: "Poll not found" }, { status: 404 })
    }

    return NextResponse.json(poll)
  } catch (error) {
    console.error("Error fetching poll:", error)
    return NextResponse.json(
      { message: "Failed to fetch poll" },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect()
    const { id } = params
    const formData = await request.formData()
    
    // Extract data from formData
    const title = formData.get("title")
    const options = formData.getAll("options[]").map(option => ({
      text: option,
      votes: 0
    }))

    // Validate data
    if (!title || options.length === 0) {
      return NextResponse.json(
        { message: "Title and at least one option are required" },
        { status: 400 }
      )
    }

    // Find and update the poll
    const updatedPoll = await Poll.findByIdAndUpdate(
      id,
      {
        title,
        options,
        // Only update imageUrl if a new image was uploaded
        ...(formData.get("image") && { imageUrl: formData.get("imageUrl") }),
      },
      { new: true, runValidators: true }
    )

    if (!updatedPoll) {
      return NextResponse.json(
        { message: "Poll not found" },
        { status: 404 }
      )
    }

    // Log the updated poll for debugging
    console.log("Updated poll:", updatedPoll)

    return NextResponse.json(updatedPoll)
  } catch (error) {
    console.error("Error updating poll:", error)
    return NextResponse.json(
      { message: "Error updating poll" },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    const poll = await Poll.findById(params.id)

    if (!poll) {
      return NextResponse.json({ message: "Poll not found" }, { status: 404 })
    }

    if (poll.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await Poll.findByIdAndDelete(params.id)
    return NextResponse.json({ message: "Poll deleted successfully" })
  } catch (error) {
    console.error("Error deleting poll:", error)
    return NextResponse.json(
      { message: "Failed to delete poll", error: error.message },
      { status: 500 }
    )
  }
}