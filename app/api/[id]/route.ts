import mongoose, { Schema, Document, Model } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// MongoDB Connection Utility
const connectToDatabase = async (): Promise<void> => {
  if (mongoose.connections[0].readyState) return; // Already connected
  const URI = process.env.MONGO_URI_RECENT_JOB || "URI not loaded";
  try {
    await mongoose.connect(URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Database connection failed");
  }
};

// Define the Product Document Interface
interface IProduct extends Document {
  productName: string;
  price: string;
}

// Define the Mongoose Schema and Model
const productSchema = new Schema<IProduct>({
  productName: { type: String, required: true },
  price: { type: String, required: true },
});

const ProductModel: Model<IProduct> =
  mongoose.models["secretcrudpost22"] ||
  mongoose.model<IProduct>("secretcrudpost22", productSchema);

// Define the Next.js API Handlers
// API Route Handler
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await connectToDatabase();
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
    await connectToDatabase();
    const { id } = await context.params;
    const body = await req.json();
    const { productName, price } = body as Partial<IProduct>;

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
    await connectToDatabase();
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
