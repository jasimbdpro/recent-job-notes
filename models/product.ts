import mongoose, { Document } from "mongoose";
// Define the Product Document Interface
interface IProduct extends Document {
    productName: string;
    price: string;
}

// Define the Mongoose Schema and Model
const productSchema = new mongoose.Schema<IProduct>({
    productName: { type: String, required: true },
    price: { type: String, required: true },
}, { collection: "job_notes" });

const ProductModel: mongoose.Model<IProduct> =
    mongoose.models["job_notes"] ||
    mongoose.model<IProduct>("job_notes", productSchema);

export { ProductModel };