import { connectToDb } from "@/lib/database";
import { ProductModel } from "@/models/product";

// API Handlers
export async function GET(): Promise<Response> {
  try {
    await connectToDb();
    const productData = await ProductModel.find({});
    return new Response(JSON.stringify(productData), { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response("Error fetching data", { status: 500 });
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    await connectToDb();
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
