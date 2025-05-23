'use client';

import React, { useState } from 'react';
import Nav from '../nav/nav';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  status: 'active' | 'inactive';
}

export default function UserAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    // Nếu đã có dữ liệu, không thêm lại nữa
    setUsers((prev) => {
      if (prev.length > 0) return prev;
      return [
        {
          id: '1',
          name: 'Nguyễn Văn A',
          email: 'vana@example.com',
          phone: '0123456789',
          password: 'pass1234',
          role: 'admin',
          status: 'active',
        },
        {
          id: '2',
          name: 'Trần Thị B',
          email: 'thib@example.com',
          phone: '0987654321',
          password: 'pass5678',
          role: 'user',
          status: 'inactive',
        },
        {
          id: '3',
          name: 'Lê Văn C',
          email: 'vanc@example.com',
          phone: '0911222333',
          password: 'pass9999',
          role: 'user',
          status: 'active',
        },
      ];
    });
  }, []); 

  const [formData, setFormData] = useState<User>({
    id: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
    status: 'active'
  });
  const [isEditing, setIsEditing] = useState(false);

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'user',
      status: 'active'
    });
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.name || (!formData.email && !formData.phone)) {
      alert('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert('Email không hợp lệ.');
        return;
      }
  
      const isDuplicateEmail = users.some(
        (user) => user.email === formData.email && user.id !== formData.id
      );
      if (isDuplicateEmail) {
        alert('Email đã được sử dụng.');
        return;
      }
    }

    if (!isEditing && !formData.password) {
      alert('Vui lòng nhập mật khẩu.');
      return;
    }
  
    if (formData.phone) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.phone)) {
        alert('Số điện thoại phải đúng 10 chữ số.');
        return;
      }
  
      const isDuplicatePhone = users.some(
        (user) => user.phone === formData.phone && user.id !== formData.id
      );
      if (isDuplicatePhone) {
        alert('Số điện thoại đã được sử dụng.');
        return;
      }
    }

    // Kiểm tra độ dài mật khẩu và có ít nhất 1 số
    if (formData.password.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự và một chữ số.');
        return;
    }
    const hasNumber = /\d/.test(formData.password);
    if (!hasNumber) {
        alert('Mật khẩu phải chứa ít nhất một chữ số.');
        return;
    }
  
    if (isEditing) {
      setUsers((prev) =>
        prev.map((u) => (u.id === formData.id ? formData : u))
      );
      toast.success('Cập nhật người dùng thành công!');
    } else {
      setUsers([...users, { ...formData, id: Date.now().toString() }]);
      toast.success('Thêm người dùng mới thành công!');
    }
  
    resetForm();
  };
  
  

  const handleEdit = (user: User) => {
    setFormData(user);
    setIsEditing(true);
  };
  const filteredUsers = users.filter((user) => {
    return filterStatus === '' || user.status === filterStatus;
  });
  
  return (
    <>
      <Nav />
      <div id="content" className="p-6">
        <main>
        <div className="head-title">
            <div className="left">
                <h1>Quản lý Người dùng</h1>
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


    <div className="user-admin-wrapper">
  {/* Form thêm/sửa người dùng */}
  <div className="user-form-card">
    <h2>{isEditing ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</h2>
    <form onSubmit={handleSubmit}>
      {/* Các form-group */}
      <div className="form-group">
        <label htmlFor="userName">Họ tên:</label>
        <input
          type="text"
          id="userName"
          placeholder="VD: Nguyễn Văn A"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="userEmail">Email:</label>
        <input
          type="email"
          id="userEmail"
          placeholder="VD: abc@gmail.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="userPhone">Số điện thoại:</label>
        <input
          type="text"
          id="userPhone"
          placeholder="VD: 0123456789"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

        <div className="form-group">
        <label htmlFor="userPassword">Mật khẩu:</label>
        <input
            type="password"
            id="userPassword"
            placeholder="Nhập mật khẩu"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        </div>


      <div className="form-group">
        <label htmlFor="userRole">Vai trò:</label>
        <select
          id="userRole"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="user">Người dùng</option>
          <option value="admin">Quản trị viên</option>
        </select>
      </div>

      <div className="form-group switch-wrapper">
        <label htmlFor="status-toggle" className="switch-label">Trạng thái:</label>
        <div className="switch-control">
          <label className="switch">
            <input
              type="checkbox"
              id="status-toggle"
              checked={formData.status === 'active'}
              onChange={() =>
                setFormData({
                  ...formData,
                  status: formData.status === 'active' ? 'inactive' : 'active',
                })
              }
            />
            <span className="slider"></span>
          </label>
          <span className="status-label">
            {formData.status === 'active' ? 'Đang hoạt động' : 'Tạm ngưng'}
          </span>
        </div>
      </div>

      <div className="button-group form-buttons">
        <button type="submit" className="btn icon-btn primary-btn">
          <i className={`bx ${isEditing ? 'bx-save' : 'bx-plus'}`}></i>
          <span className="btn-text">{isEditing ? 'Lưu thay đổi' : 'Thêm người dùng'}</span>
        </button>
        {isEditing && (
          <button
            type="button"
            className="btn icon-btn secondary-btn"
            onClick={resetForm}
          >
            <i className="bx bx-x"></i>
            <span className="btn-text">Hủy</span>
          </button>
        )}
      </div>
    </form>
  </div>

  {/* Bảng danh sách người dùng */}
  <div className="user-table-card">
    <h2>Danh sách người dùng</h2>
    {filteredUsers.length === 0 ? (
      <div className="empty-state">
        <i className="bx bx-info-circle"></i>
        <p>Chưa có người dùng nào được tạo.</p>
      </div>
    ) : (
      <div className="table-responsive">
        <table className="category-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Điện thoại</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email || '-'}</td>
                <td>{user.phone || '-'}</td>    
<td>
  <span className={`role-badge ${user.role === 'admin' ? 'admin-role' : 'user-role'}`}>
    {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
  </span>
</td>
<td>
  <span className={`status-badge ${user.status === 'active' ? 'active' : 'inactive'}`}>
    {user.status === 'active' ? 'Đang hoạt động' : 'Tạm ngưng'}
  </span>
</td>

                <td className="actions-cell">
                  <button className="btn icon-btn edit-btn" title="Sửa" onClick={() => handleEdit(user)}>
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