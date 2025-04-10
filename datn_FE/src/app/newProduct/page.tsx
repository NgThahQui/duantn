"use client";

import { useEffect, useState } from "react";
import { getNewProducts } from "../lib/api_allproducts";
import { Product } from "../models/IProduct";

export default function NewProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getNewProducts();
      setProducts(data);
    };
    fetch();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4">Sản phẩm mới</h2>
      <div className="row">
        {products.map((p) => (
          <div className="col-md-3 mb-4" key={p._id}>
            <div className="card h-100 shadow-sm">
              <img
                src={`/images/${p.image}`}
                alt={p.name}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />

              <div className="card-body text-center">
                <h6 className="card-title">{p.name}</h6>
                <p className="text-danger fw-bold">
                  {p.price.toLocaleString()} đ
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
