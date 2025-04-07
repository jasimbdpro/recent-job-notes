import { connectToDb } from "@/lib/database";
import { ProductModel } from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

// Define the Next.js API Handlers
// API Route Handler
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectToDb();
    const { id } = await context.params;

    const product = await ProductModel.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Error fetching product" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    await connectToDb();
    const { id } = await context.params;
    const body = await req.json();
    const { productName, price } = body;

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      { productName, price },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return new Response("Product not found", { status: 404 });
    }
    return new Response(JSON.stringify(updatedProduct), { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return new Response(
      JSON.stringify({ message: "Error updating product", error }),
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    await connectToDb();
    const { id } = await context.params;

    const deletedProduct = await ProductModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      return new Response("Product not found", { status: 404 });
    }
    return new Response("Successfully Deleted", { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return new Response(
      JSON.stringify({ message: "Error deleting product", error }),
      { status: 500 }
    );
  }
}
