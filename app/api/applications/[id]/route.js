// app/api/applications/[id]/route.js
import Application from "@/models/application";
import DbConnect from "@/lib/Db/DbConnect";
import slugify from "slugify";

export async function GET(_, { params }) {
  await DbConnect();

  try {
    const app = await Application.findById(params.id);
    if (!app)
      return Response.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );

    return Response.json({ success: true, data: app });
  } catch (error) {
    return Response.json(
      { success: false, message: "Error fetching application" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  await DbConnect();

  try {
    const body = await req.json();
    let { name, image, desc } = body;

    const payload = {};

    if (name) {
      payload.name = name;
      payload.slug = slugify(name, { lower: true });
    }
    if (image !== undefined) payload.image = image;
    if (desc !== undefined) payload.desc = desc;

    const updated = await Application.findByIdAndUpdate(params.id, payload, {
      new: true,
    });

    if (!updated)
      return Response.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );

    return Response.json({
      success: true,
      message: "Application updated",
      data: updated,
    });
  } catch (error) {
    return Response.json(
      { success: false, message: "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(_, { params }) {
  await DbConnect();

  try {
    const deleted = await Application.findByIdAndDelete(params.id);

    if (!deleted)
      return Response.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );

    return Response.json({
      success: true,
      message: "Application deleted",
    });
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to delete application" },
      { status: 500 }
    );
  }
}
