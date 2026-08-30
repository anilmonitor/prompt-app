import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

// Helper for CORS headers
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

// GET /api/prompts - Fetch all prompts (optional query params: ?category=...&q=...)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q");

    const db = await getDatabase();
    const collection = db.collection("prompts");

    // Build filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { promptText: { $regex: query, $options: "i" } },
      ];
    }

    const prompts = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    // Map _id to id string for frontend compatibility
    const formatted = prompts.map((doc) => ({
      id: doc._id.toString(),
      imageUrl: doc.imageUrl || "",
      title: doc.title || "",
      category: doc.category || "",
      promptText: doc.promptText || "",
      createdAt: doc.createdAt,
    }));

    return NextResponse.json(formatted, {
      status: 200,
      headers: corsHeaders(),
    });
  } catch (error) {
    console.error("Error fetching prompts from MongoDB:", error);
    return NextResponse.json(
      { error: "Failed to fetch prompts" },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// POST /api/prompts - Create a new prompt
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, title, category, promptText } = body;

    if (!imageUrl || !title || !promptText) {
      return NextResponse.json(
        { error: "Missing required fields (imageUrl, title, promptText)" },
        { status: 400, headers: corsHeaders() }
      );
    }

    const db = await getDatabase();
    const collection = db.collection("prompts");

    const newDoc = {
      imageUrl: imageUrl.trim(),
      title: title.trim(),
      category: (category || "Uncategorized").trim(),
      promptText: promptText.trim(),
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newDoc);

    return NextResponse.json(
      {
        id: result.insertedId.toString(),
        ...newDoc,
      },
      {
        status: 201,
        headers: corsHeaders(),
      }
    );
  } catch (error) {
    console.error("Error creating prompt in MongoDB:", error);
    return NextResponse.json(
      { error: "Failed to create prompt" },
      { status: 500, headers: corsHeaders() }
    );
  }
}
