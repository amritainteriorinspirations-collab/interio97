// app/api/applications/route.js
import Application from "@/models/application";
import DbConnect from "@/lib/Db/DbConnect";
import slugify from "slugify";

export async function GET() {
  await DbConnect();

  try {
    const applications = await Application.find().sort({ createdAt: -1 });

    return Response.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await DbConnect();

  try {
    const body = await req.json();
    let { name, image, desc } = body;

    if (!name)
      return Response.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );

    const slug = slugify(name, { lower: true });

    const exists = await Application.findOne({ slug });
    if (exists)
      return Response.json(
        { success: false, message: "Application already exists" },
        { status: 409 }
      );

    const application = await Application.create({
      name,
      slug,
      image: image || null,
      desc: desc || "",
    });

    return Response.json(
      { success: true, message: "Application created", data: application },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to create application" },
      { status: 500 }
    );
  }
}
