import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";

/**
 * The above function is an asynchronous POST request handler in JavaScript that creates a new user in
 * a database after checking for existing users.
 * @param req - The `req` parameter in the code snippet represents the request object that contains
 * information about the HTTP request being made to the server. This object typically includes details
 * such as headers, parameters, body content, and more. In this case, it seems like the `req` object is
 * expected to contain JSON
 * @returns The POST function is returning a JSON response with a success message "User created
 * successfully" and a status code of 201 if the user creation process is successful. If there is an
 * existing user with the same email, it returns a JSON response with a message "User already exists"
 * and a status code of 400. In case of any other error occurring during the process, it returns a JSON
 * response
 */
export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
