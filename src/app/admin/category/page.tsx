'use client';

import Nav from "../nav/nav";
import React, { useState, useEffect } from "react";
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
  isActive: boolean;
}

export default function CategoryAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [isActiveForm, setIsActiveForm] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/category');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const resetForm = () => {
    setCategoryName('');
    setIsActiveForm(true);
    setIsEditing(false);
    setCurrentCategory(null);
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      alert('Tên danh mục không được để trống!');
      return;
    }

    const newCategory = {
      name: categoryName.trim(),
      isActive: isActiveForm,
    };

    try {
      const res = await fetch('http://localhost:3000/api/category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });

      if (!res.ok) throw new Error('Thêm danh mục thất bại');

      alert('Thêm danh mục thành công!');
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error(error);
      alert('Không thể thêm danh mục.');
    }
  };

  const handleUpdateCategory = async () => {
  if (!currentCategory) return;

  console.log(currentCategory);
  const updatedCategory = {
    name: categoryName.trim(),
    isActive: isActiveForm,
  };

  console.log(updatedCategory);

  try {
    const res = await fetch(`http://localhost:3000/api/category/${currentCategory._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCategory),
    });

    if (!res.ok) throw new Error('Cập nhật thất bại');

    alert('Cập nhật danh mục thành công!');
    resetForm();
    fetchCategories();
  } catch (error) {
    console.error(error);
    alert('Không thể cập nhật danh mục.');
  }
};


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    isEditing ? handleUpdateCategory() : handleAddCategory();
  };

 const handleEdit = (category: Category) => {
  console.log("Chỉnh sửa danh mục:", category); // kiểm tra xem có id không
  setIsEditing(true);
  setCurrentCategory(category);
  setCategoryName(category.name);
  setIsActiveForm(category.isActive);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};


  const filteredCategories = categories.filter(category => {
    if (filterStatus === 'active') return category.isActive;
    if (filterStatus === 'inactive') return !category.isActive;
    return true;
  });

  return (
    <>
      <Nav />
      <div id="content">
        <main>
          <div className="head-title">
            <div className="left">
              <h1>Quản lý Danh mục</h1>
              <ul className="breadcrumb">
                <li><Link href="/admin">Admin</Link></li>
                <li><i className='bx bx-chevron-right'></i></li>
                <li><Link className="active" href="/admin/category">Danh mục</Link></li>
              </ul>
            </div>
            <div className="right">
              <div className="filter-icon-wrapper">
                <i className='bx bx-filter'></i>
                <select
                  className="filter-select-icon"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Tạm Ngưng</option>
                </select>
              </div>
            </div>
          </div>

          <div className="category-container">
            <div className="category-form-card">
              <h2>{isEditing ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục mới'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="categoryName">Tên danh mục:</label>
                  <input
                    type="text"
                    id="categoryName"
                    placeholder="VD: Áo sơ mi"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group switch-wrapper">
                  <label htmlFor="status-toggle" className="switch-label">Trạng thái:</label>
                  <div className="switch-control">
                    <label className="switch">
                      <input
                        type="checkbox"
                        id="status-toggle"
                        checked={isActiveForm}
                        onChange={() => setIsActiveForm(!isActiveForm)}
                      />
                      <span className="slider"></span>
                    </label>
                    <span className="status-label">{isActiveForm ? 'Đang hoạt động' : 'Tạm Ngưng'}</span>
                  </div>
                </div>

                <div className="button-group form-buttons">
                  <button type="submit" className="btn icon-btn primary-btn">
                    <i className={`bx ${isEditing ? 'bx-save' : 'bx-plus'}`}></i>
                    <span className="btn-text">{isEditing ? 'Lưu thay đổi' : 'Thêm danh mục'}</span>
                  </button>
                  {isEditing && (
                    <button type="button" className="btn icon-btn secondary-btn" onClick={resetForm}>
                      <i className='bx bx-x'></i>
                      <span className="btn-text">Hủy</span>
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="category-table-card">
              <h2>Danh sách Danh mục</h2>
              {filteredCategories.length === 0 ? (
                <div className="empty-state">
                  <i className='bx bx-info-circle'></i>
                  <p>Không tìm thấy danh mục nào phù hợp hoặc chưa có danh mục nào được tạo.</p>
                  {filterStatus && <button onClick={() => setFilterStatus('')} className="btn secondary-btn">Xóa bộ lọc</button>}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="category-table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Tên danh mục</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCategories.map((category, index) => (
                        <tr key={category.id}>
                          <td>{index + 1}</td>
                          <td>{category.name}</td>
                          <td>
                            <span className={`status-badge ${category.isActive ? 'active' : 'inactive'}`}>
                              {category.isActive ? 'Đang hoạt động' : 'Tạm Ngưng'}
                            </span>
                          </td>
                          <td className="actions-cell">
                            <button
                              className="btn icon-btn edit-btn"
                              title="Sửa"
                              onClick={() => handleEdit(category)}
                            >
                              <i className="bx bx-edit-alt"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
