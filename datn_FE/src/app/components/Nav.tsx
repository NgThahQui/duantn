"use client";
import { useEffect, useState } from "react";
import style from "../css/layout.module.css";
import { getAllCategories } from "../lib/api_categories"; // import API
import type { Category } from "../lib/api_categories"; // import interface
import Link from "next/link";

export default function Nav() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <nav className={style.nav}>
      <ul>
        <li>
          <Link href="/">Trang Chủ</Link>
        </li>
        <li>
          <Link href="/hotProduct">Sản phẩm nổi bật</Link>
        </li>
        <li>
          <Link href="/newProduct">Sản phẩm mới</Link>
        </li>
        <li>
          <Link href="/saleProduct">Sản phẩm giảm giá</Link>
        </li>
        <li>
          <Link href="#">Danh mục</Link>
          <ul>
            {categories.map((cat) => (
              <li key={cat._id}>
                <Link href={`/category/${cat._id}`}>{cat.name}</Link>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </nav>
  );
}
