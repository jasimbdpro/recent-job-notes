import mongoose, { Schema, Document, Model } from "mongoose";

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

// Define Product Interface
interface IProduct extends Document {
  productName: string;
  price: string;
}

// Define Mongoose Schema and Model
const productSchema = new Schema<IProduct>({
  productName: { type: String, required: true },
  price: { type: String, required: true },
});

const ProductModel: Model<IProduct> =
  mongoose.models["secretcrudpost22"] ||
  mongoose.model<IProduct>("secretcrudpost22", productSchema);

// API Handlers
export async function GET(): Promise<Response> {
  try {
    await connectToDatabase();
    const productData = await ProductModel.find({});
    return new Response(JSON.stringify(productData), { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response("Error fetching data", { status: 500 });
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    await connectToDatabase();
    const body = (await req.json()) as Partial<IProduct>;
    const { productName, price } = body;

    if (!productName || !price) {
      return new Response(
        JSON.stringify({ message: "Invalid input data" }),
        { status: 400 }
      );
    }

    const newProduct = new ProductModel({ productName, price });
    await newProduct.save();

    return new Response(
      JSON.stringify({ message: "Product created successfully", newProduct }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return new Response(
      JSON.stringify({ message: "Error creating product", error }),
      { status: 400 }
    );
  }
}
