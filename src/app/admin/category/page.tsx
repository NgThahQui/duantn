'use client';

import Nav from "../nav/nav"; // Giả định Nav component tồn tại
import React, { useState, useEffect } from "react";
import Link from 'next/link';

// Interface cho đối tượng danh mục
interface Category {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

// Dữ liệu mẫu ban đầu
const initialCategories: Category[] = [
  { id: '1', code: 'CAT001', name: 'Áo sơ mi', isActive: true },
  { id: '2', code: 'CAT002', name: 'Quần Jean', isActive: true },
  { id: '3', code: 'CAT003', name: 'Phụ kiện', isActive: false },
];

export default function CategoryAdminPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  // State cho form inputs
  const [categoryCode, setCategoryCode] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [isActiveForm, setIsActiveForm] = useState(true);

  // State cho filter
  const [filterStatus, setFilterStatus] = useState<string>(''); // '', 'active', 'inactive'

  useEffect(() => {
    // Trong thực tế, bạn sẽ fetch categories từ API ở đây
    // setCategories(fetchedCategories);
  }, []);

  const resetForm = () => {
    setCategoryCode('');
    setCategoryName('');
    setIsActiveForm(true);
    setIsEditing(false);
    setCurrentCategory(null);
  };

  const handleAddCategory = () => {
    if (!categoryName.trim() || !categoryCode.trim()) {
      alert('Mã danh mục và Tên danh mục không được để trống!');
      return;
    }
    // Kiểm tra trùng mã (ví dụ đơn giản)
    if (categories.some(cat => cat.code === categoryCode.trim())) {
        alert('Mã danh mục đã tồn tại!');
        return;
    }

    const newCategory: Category = {
      id: new Date().toISOString(), // ID tạm thời, nên được tạo bởi backend
      code: categoryCode.trim(),
      name: categoryName.trim(),
      isActive: isActiveForm,
    };
    setCategories([...categories, newCategory]);
    alert('Thêm danh mục thành công!'); // Thay bằng toast notification
    resetForm();
  };

  const handleUpdateCategory = () => {
    if (!currentCategory || !categoryName.trim() || !categoryCode.trim()) {
      alert('Mã danh mục và Tên danh mục không được để trống!');
      return;
    }
    // Kiểm tra trùng mã (trừ category hiện tại)
    if (categories.some(cat => cat.code === categoryCode.trim() && cat.id !== currentCategory.id)) {
        alert('Mã danh mục đã tồn tại ở một danh mục khác!');
        return;
    }

    setCategories(
      categories.map((cat) =>
        cat.id === currentCategory.id
          ? { ...cat, code: categoryCode.trim(), name: categoryName.trim(), isActive: isActiveForm }
          : cat
      )
    );
    alert('Cập nhật danh mục thành công!'); // Thay bằng toast notification
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEditing) {
      handleUpdateCategory();
    } else {
      handleAddCategory();
    }
  };

  const handleEdit = (category: Category) => {
    setIsEditing(true);
    setCurrentCategory(category);
    setCategoryCode(category.code);
    setCategoryName(category.name);
    setIsActiveForm(category.isActive);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên đầu trang để thấy form
  };

  const filteredCategories = categories.filter(category => {
    if (filterStatus === 'active') return category.isActive;
    if (filterStatus === 'inactive') return !category.isActive;
    return true; // 'Tất cả'
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
                  <label htmlFor="categoryCode">Mã danh mục:</label>
                  <input
                    type="text"
                    id="categoryCode"
                    placeholder="VD: CAT001"
                    value={categoryCode}
                    onChange={(e) => setCategoryCode(e.target.value)}
                    disabled={isEditing} // Không cho sửa mã khi editing, hoặc tuỳ theo logic của bạn
                    required
                  />
                </div>
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
                        <th>Mã danh mục</th>
                        <th>Tên danh mục</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCategories.map((category, index) => (
                        <tr key={category.id}>
                          <td>{index + 1}</td>
                          <td>{category.code}</td>
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
              {/* TODO: Pagination component here if needed */}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}