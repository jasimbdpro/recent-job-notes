"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";

// Define Interfaces
interface IProduct {
  _id: string;
  productName: string;
  price: string;
}

interface IFormData {
  productName: string;
  price: string;
}

export default function Page() {
  const [formData, setFormData] = useState<IFormData>({
    productName: "",
    price: "",
  });
  const [gotData, setGotData] = useState<IProduct[]>([]);
  const [editProduct, setEditProduct] = useState<IProduct | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [editedPrice, setEditedPrice] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);

  // Base URL for API
  const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

  // Fetch GET Data
  const fetchData = async (): Promise<void> => {
    try {
      const response = await fetch(`${NEXT_PUBLIC_BASE_URL}/api`, {
        cache: "no-store",
      });
      if (response.ok) {
        const data: IProduct[] = await response.json();
        setGotData(data);
      } else {
        throw new Error(`HTTP Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Post Data
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response = await fetch(`${NEXT_PUBLIC_BASE_URL}/api`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setVisible(true);
        setTimeout(() => setVisible(false), 1000);
        await fetchData();
      } else {
        throw new Error(`HTTP Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  // Handle Edit
  const handleEditClick = (product: IProduct): void => {
    setEditProduct(product);
    setEditedName(product.productName);
    setEditedPrice(product.price);
  };

  const handleUpdate = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: editedName, price: editedPrice }),
      });

      if (response.ok) {
        alert("Product updated successfully!");
        setEditProduct(null);
        await fetchData();
      } else {
        alert("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string): Promise<void> => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`${NEXT_PUBLIC_BASE_URL}/api/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Product deleted successfully!");
          await fetchData();
        } else {
          alert("Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <div>
      <h2>Current Job Notes</h2>
      <h4>Enter New Tips and Notes:</h4>
      <form onSubmit={handleSubmit}>
        <label>
          Note Title:
          <br />
          <input
            type="text"
            placeholder="Any Text"
            value={formData.productName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, productName: e.target.value })
            }
          />
        </label>
        <br />
        <label>
  Description:
  <br />
  <textarea
    rows={2}
    placeholder="Text Only"
    value={formData.price}
    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
      setFormData({ ...formData, price: e.target.value })
    }
  />
</label>

        <br />
        <button type="submit">Submit</button>
      </form>
      <br />
      {visible && <div style={{ color: "green" }}>Data saved to MongoDB!</div>}
      <br />
      <div style={{ overflowX: "auto" }}>
        <table
          border={1}
          cellPadding="5"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Note Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {gotData &&
              gotData.map((product) => (
                <tr key={product?._id}>
                  <td
                    style={{
                      paddingLeft: "3px",
                      paddingRight: "3px",
                      wordWrap: "break-word",
                    }}
                  >
                    {product?.productName}
                  </td>
                  <td
                    style={{
                      paddingLeft: "3px",
                      paddingRight: "3px",
                      wordWrap: "break-word",
                    }}
                  >
                    <pre
                       style={{ 
                         fontFamily: 'sans-serif',
                         wordWrap: 'break-word',
                         whiteSpace: 'pre-wrap' }}
                      >{product?.price}</pre>
                  </td>
                  <td>
                    <button onClick={() => handleEditClick(product)}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {editProduct && (
        <div 
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "gray",
            padding: "20px",
            border: "1px solid black",
          }}
        >
          <h3>Edit Note</h3>
          <label>
            Note Title: <br />
            <input
              type="text"
              value={editedName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEditedName(e.target.value)
              }
            />
          </label>
          <br />
          <label>
            Description: <br />
            <textarea
              rows={2}
              value={editedPrice}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setEditedPrice(e.target.value)
              }
            />
          </label>
          <br />
          <button onClick={() => handleUpdate(editProduct._id)}>Update</button>
          <button onClick={() => setEditProduct(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
