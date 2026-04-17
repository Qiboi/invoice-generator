import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await connectDB();

    const existingUser = await User.findOne({
      email: body.email,
    });

    if (existingUser) {
      return Response.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(body.password, 10);

    const user = await User.create({
      name: body.name,
      email: body.email,
      password: hashedPassword,
    });

    return Response.json({
      message: "User created",
      user,
    });
  } catch (error) {
    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}