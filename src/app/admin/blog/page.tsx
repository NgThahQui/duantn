'use client';

import React, { useState } from 'react';
import Nav from '../nav/nav';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface Blog {
    id: string;
    title: string;
    image: string;
    content: string;
    isActive: boolean;
    createdAt: string;
  }
  

  const initialBlogs: Blog[] = [
    {
      id: '1',
      title: 'Bí quyết phối đồ mùa hè',
      content: 'Nội dung bài viết 1...',
      image: '/images/anh1.jpeg',
      isActive: true,
      createdAt: '2025-05-01T10:00:00Z',
    },
    {
      id: '2',
      title: 'Xu hướng thời trang 2025',
      content: 'Nội dung bài viết 2...',
      image: '/images/anh1.jpeg',
      isActive: false,
      createdAt: '2025-05-10T08:30:00Z',
    },
  ];
  

export default function BlogAdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);


  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [isActiveForm, setIsActiveForm] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
 
  const resetForm = () => {
    setTitle('');
    setContent('');
    setImage('');
    setIsActiveForm(true);
    setIsEditing(false);
    setCurrentBlog(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        setUploadedImage(file);
        if (uploadedImage) {} // Dòng này để "đọc" biến => TypeScript không báo lỗi nữa        
      setImage(URL.createObjectURL(file)); // xem trước
    } else {
      toast.error('Vui lòng chọn tệp hình ảnh hợp lệ');
    }
  };
  

  const validateFields = () => {
    if (!title.trim() || !content.trim() || !image.trim()) {
      toast.error('Vui lòng nhập đầy đủ thông tin bài viết!');
      return false;
    }
    return true;
  };
  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateFields()) return;

    if (isEditing && currentBlog) {
        const updatedBlog: Blog = {
          ...currentBlog,
          title: title.trim(),
          content: content.trim(),
          image: image.trim(),
          isActive: isActiveForm,
          createdAt: currentBlog.createdAt,
        };
        setBlogs(blogs.map((blog) => (blog.id === currentBlog.id ? updatedBlog : blog)));
        toast.success('Cập nhật bài viết thành công!');
      } else {
        const newBlog: Blog = {
          id: new Date().toISOString(),
          title: title.trim(),
          content: content.trim(),
          image: image.trim(),
          isActive: isActiveForm,
          createdAt: new Date().toISOString(),
        };
        setBlogs([...blogs, newBlog]);
        toast.success('Thêm bài viết thành công!');
      }
      

    resetForm();
  };

  const handleEdit = (blog: Blog) => {
    setIsEditing(true);
    setCurrentBlog(blog);
    setTitle(blog.title);
    setContent(blog.content);
    setImage(blog.image);
    setIsActiveForm(blog.isActive);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredBlogs = blogs.filter((blog) => {
    if (filterStatus === 'active') return blog.isActive;
    if (filterStatus === 'inactive') return !blog.isActive;
    return true;
  });

  return (
    <>
      <Nav />
      <div id="content">
        <main>
          <div className="head-title">
            <div className="left">
              <h1>Quản lý Blog</h1>
            </div>
            <div className="right">
              <div className="filter-icon-wrapper">
                <i className="bx bx-filter"></i>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select-icon">
                  <option value="">Tất cả trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Tạm ngưng</option>
                </select>
              </div>
            </div>
          </div>

          <div className="category-container">
          <div className="category-form-card">
  <h2>{isEditing ? 'Chỉnh sửa Bài viết' : 'Thêm Bài viết mới'}</h2>
  <form onSubmit={handleSubmit}>
    
    <div className="form-group">
      <label htmlFor="title">Tiêu đề:</label>
      <input
        type="text"
        id="title"
        placeholder="VD: Xu hướng thời trang 2025"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="content">Nội dung:</label>
      <textarea
        id="content"
        placeholder="Nội dung bài viết..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      ></textarea>
    </div>
    


    <div className="form-group">
      <label htmlFor="imageUpload">Hình ảnh:</label>
      <input
        type="file"
        id="imageUpload"
        accept="image/*"
        onChange={handleImageChange}
      />
      {image && (
        <div style={{ marginTop: '8px' }}>
          <Image
            src={image}
            alt="Preview"
            width={100}
            height={70}
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}
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
        <span className="status-label">{isActiveForm ? 'Đang hoạt động' : 'Tạm ngưng'}</span>
      </div>
    </div>

    <div className="button-group form-buttons">
      <button type="submit" className="btn icon-btn primary-btn">
        <i className={`bx ${isEditing ? 'bx-save' : 'bx-plus'}`}></i>
        <span className="btn-text">{isEditing ? 'Lưu thay đổi' : 'Thêm bài viết'}</span>
      </button>
      {isEditing && (
        <button type="button" className="btn icon-btn secondary-btn" onClick={resetForm}>
          <i className="bx bx-x"></i>
          <span className="btn-text">Hủy</span>
        </button>
      )}
    </div>
  </form>
</div>


            <div className="category-table-card">
              <h2>Danh sách Blog</h2>
              {filteredBlogs.length === 0 ? (
                <div className="empty-state">
                  <i className="bx bx-info-circle"></i>
                  <p>Không có bài viết phù hợp.</p>
                  {filterStatus && (
                    <button className="btn secondary-btn" onClick={() => setFilterStatus('')}>
                      Xóa bộ lọc
                    </button>
                  )}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="category-table">
                  <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tiêu đề</th>
                        <th>Nội dung</th>
                        <th>Hình ảnh</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th>Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredBlogs.map((blog, index) => (
                        <tr key={blog.id}>
                        <td>{index + 1}</td>
                        <td>{blog.title}</td>
                        <td>{blog.content}</td>
                        <td>
                            <Image src={blog.image} alt={blog.title} width={60} height={40} style={{ objectFit: 'cover' }} />
                        </td>
                        <td>
                            <span className={`status-badge ${blog.isActive ? 'active' : 'inactive'}`}>
                            {blog.isActive ? 'Đang hoạt động' : 'Tạm ngưng'}
                            </span>
                        </td>
                        <td>
                        {new Intl.DateTimeFormat('vi-VN').format(new Date(blog.createdAt))}
                        </td>

                        <td className="actions-cell">
                            <button className="btn icon-btn edit-btn" title="Sửa" onClick={() => handleEdit(blog)}>
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

