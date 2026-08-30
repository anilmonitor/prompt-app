import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

// GET single prompt by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    const collection = db.collection("prompts");

    let query: Record<string, any>;
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { id };
    }

    const doc = await collection.findOne(query);
    if (!doc) {
      return NextResponse.json(
        { error: "Prompt not found" },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      {
        id: doc._id.toString(),
        imageUrl: doc.imageUrl || "",
        title: doc.title || "",
        category: doc.category || "",
        promptText: doc.promptText || "",
        createdAt: doc.createdAt,
      },
      { status: 200, headers: corsHeaders() }
    );
  } catch (error) {
    console.error("Error fetching single prompt:", error);
    return NextResponse.json(
      { error: "Failed to fetch prompt" },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// PUT /api/prompts/[id] - Update prompt
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { imageUrl, title, category, promptText } = body;

    const db = await getDatabase();
    const collection = db.collection("prompts");

    let query: Record<string, any>;
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { id };
    }

    const updateFields: Record<string, any> = {};
    if (imageUrl !== undefined) updateFields.imageUrl = imageUrl.trim();
    if (title !== undefined) updateFields.title = title.trim();
    if (category !== undefined) updateFields.category = category.trim();
    if (promptText !== undefined) updateFields.promptText = promptText.trim();
    updateFields.updatedAt = new Date();

    const result = await collection.updateOne(query, {
      $set: updateFields,
    });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Prompt not found" },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      { success: true, message: "Prompt updated successfully" },
      { status: 200, headers: corsHeaders() }
    );
  } catch (error) {
    console.error("Error updating prompt:", error);
    return NextResponse.json(
      { error: "Failed to update prompt" },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// DELETE /api/prompts/[id] - Delete prompt
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    const collection = db.collection("prompts");

    let query: Record<string, any>;
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { id };
    }

    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Prompt not found" },
        { status: 404, headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      { success: true, message: "Prompt deleted successfully" },
      { status: 200, headers: corsHeaders() }
    );
  } catch (error) {
    console.error("Error deleting prompt:", error);
    return NextResponse.json(
      { error: "Failed to delete prompt" },
      { status: 500, headers: corsHeaders() }
    );
  }
}
