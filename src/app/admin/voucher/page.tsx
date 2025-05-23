'use client';

import React, { useState } from 'react';
import Nav from '../nav/nav';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect } from 'react';
import { toast } from 'react-toastify';

interface Voucher {
    id: string;
    id_user: string;
    description: string;
    code: string;
    quantity: number;
    start_day: string;
    end_day: string;
    status: boolean;
    discount_percent: number; 
  }
  const getVoucherStatus = (start: string, end: string): 'expired' | 'upcoming' | 'active' => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
  
    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'expired';
    return 'active';
  };
  

export default function VoucherAdminPage() {
  const [filterStatus, setFilterStatus] = useState('');
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [formData, setFormData] = useState<Voucher>({
    id: '',
    id_user: '',
    description: '',
    code: '',
    quantity: 0,
    start_day: '',
    end_day: '',
    status: true,
    discount_percent: 0,
  });
  

  const [isEditing, setIsEditing] = useState(false);

  const resetForm = () => {
    setFormData({
      id: '',
      id_user: '',
      description: '',
      code: '',
      quantity: 0,
      start_day: '',
      end_day: '',
      status: true,
      discount_percent: 0,
    });
    setIsEditing(false);
  };


  useEffect(() => {
    setVouchers((prev) => {
      if (prev.length > 0) return prev;
      return [
        {
          id: '1',
          id_user: '1',
          description: 'Giảm 20% cho đơn hàng đầu tiên',
          code: 'SALE20',
          quantity: 100,
          start_day: '2025-05-01',
          end_day: '2025-06-01',
          status: true,
          discount_percent: 20,
        },
        {
          id: '2',
          id_user: '2',
          description: 'Giảm 50% cho đơn hàng trên 1 triệu',
          code: 'BIGSALE50',
          quantity: 50,
          start_day: '2025-05-10',
          end_day: '2025-06-30',
          status: true,
          discount_percent: 50,
        },
        {
          id: '3',
          id_user: '3',
          description: 'Ưu đãi sinh nhật: giảm 30%',
          code: 'BDAY30',
          quantity: 30,
          start_day: '2025-04-01',
          end_day: '2025-04-30',
          status: false,
          discount_percent: 30,
        },
      ];
    });
  }, []);
  
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    const { code, description, start_day, end_day, quantity } = formData;
  
    if (!code.trim() || !description.trim() || !start_day.trim() || !end_day.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin mã giảm giá.");
      return;
    }
  
    if (isNaN(quantity) || quantity <= 0) {
      toast.error("Số lượng phải là số hợp lệ và lớn hơn 0.");
      return;
    }
  
    if (new Date(start_day) > new Date(end_day)) {
      toast.error("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
      return;
    }
  
    const newVoucher: Voucher = {
      ...formData,
      id: isEditing ? formData.id : Date.now().toString(),
      id_user: '',
    };
  
    if (isEditing) {
      setVouchers((prev) => prev.map((v) => (v.id === formData.id ? newVoucher : v)));
      toast.success("Cập nhật mã giảm giá thành công!");
    } else {
      setVouchers([...vouchers, newVoucher]);
      toast.success("Thêm mã giảm giá thành công!");
    }
  
    resetForm();
  };  

  const handleEdit = (voucher: Voucher) => {
    setFormData(voucher);
    setIsEditing(true);
  };

  const filteredVouchers = vouchers.filter((v) => {
    const status = getVoucherStatus(v.start_day, v.end_day);
  
    if (filterStatus === 'active') return v.status && status === 'active';
    if (filterStatus === 'inactive') return !v.status && status === 'active';
    if (filterStatus === 'expired') return status === 'expired';
    return true; // Trường hợp 'Tất cả trạng thái'
  });
  
  

  return (
    <>
      <Nav />
      <div id="content" className="p-6">
        <main>
        <div className="head-title">
            <div className="left">
                <h1>Quản lý Mã giảm giá</h1>
            </div>
            <div className="right">
                <div className="filter-icon-wrapper">
                <i className="bx bx-filter"></i>
                <select
                    className="filter-select-icon"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Tạm ngưng</option>
                    <option value="expired">Hết hạn</option>
                </select>
                </div>
            </div>
            </div>

        <div className="voucher-admin-wrapper">
        <div className="voucher-admin-layout">
            {/* Form thêm/sửa */}
            <div className="voucher-form-card">
              <h2>{isEditing ? 'Chỉnh sửa mã giảm giá' : 'Thêm mã giảm giá'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="voucherCode">Mã Code:</label>
                  <input
                    type="text"
                    id="voucherCode"
                    placeholder="VD: SALE20"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="voucherDesc">Mô tả:</label>
                  <input
                    type="text"
                    id="voucherDesc"
                    placeholder="VD: Giảm 20% cho đơn hàng đầu tiên"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="voucherQty">Số lượng:</label>
                  <input
                    type="number"
                    id="voucherQty"
                    min="1"
                    placeholder="VD: 100"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="discountPercent">Phần trăm giảm giá:</label>
                  <input
                    type="number"
                    id="discountPercent"
                    min="0"
                    max="100"
                    placeholder="VD: 20"
                    value={formData.discount_percent}
                    onChange={(e) => setFormData({ ...formData, discount_percent: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="startDate">Ngày bắt đầu:</label>
                  <DatePicker
                    id="startDate"
                    selected={formData.start_day ? new Date(formData.start_day) : null}
                    onChange={(date: Date | null) =>
                        setFormData({
                          ...formData,
                          start_day: date ? date.toLocaleDateString('en-CA') : ''
                        })
                      }
                      
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="date-picker"
                    minDate={new Date()} // không cho chọn ngày trong quá khứ
                    />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">Ngày kết thúc:</label>
                  <DatePicker
                    id="endDate"
                    selected={formData.end_day ? new Date(formData.end_day) : null}
                    onChange={(date: Date | null) =>
                        setFormData({
                          ...formData,
                          end_day: date ? date.toLocaleDateString('en-CA') : ''
                        })
                      }
                      
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="date-picker"
                    minDate={new Date()} // không cho chọn ngày trong quá khứ
                    />
                </div>

                {/* <div className="form-group switch-wrapper">
                <label htmlFor="status-toggle" className="switch-label">Trạng thái:</label>
                <div className="switch-control">
                    <label className="switch">
                    <input
                        type="checkbox"
                        id="status-toggle"
                        checked={formData.status}
                        onChange={() => setFormData({ ...formData, status: !formData.status })}
                    />
                    <span className="slider"></span>
                    </label>
                    <span className="status-label">
                    {formData.status ? 'Đang hoạt động' : 'Tạm ngưng'}
                    </span>
                </div>
                </div> */}
                <div className="button-group form-buttons">
                  <button type="submit" className="btn icon-btn primary-btn">
                    <i className={`bx ${isEditing ? 'bx-save' : 'bx-plus'}`}></i>
                    <span className="btn-text">{isEditing ? 'Lưu thay đổi' : 'Thêm mã'}</span>
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

           {/* Danh sách mã giảm giá */}
<div className="voucher-table-card">
  <h2>Danh sách mã giảm giá</h2>
  {filteredVouchers.length === 0 ? (
    <div className="empty-state">
      <i className="bx bx-info-circle"></i>
      <p>Chưa có mã giảm giá nào.</p>
    </div>
  ) : (
    <div className="table-responsive">
      <table className="voucher-table category-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã Code</th>
            <th>Mô tả</th>
            <th>Số lượng</th>
            <th>Giảm (%)</th>
            <th>Ngày bắt đầu</th>
            <th>Ngày kết thúc</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredVouchers.map((v, idx) => (
            <tr key={v.id}>
             <td>{idx + 1}</td>

            <td>
            {v.code}
            </td>

<td style={{ minWidth: '100px', maxWidth: '330px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
  {v.description || '-'}
</td>

<td style={{ textAlign: 'center' }}>
  {v.quantity}
</td>

<td style={{textAlign: 'center' }}>
  {v.discount_percent}%
</td>

<td style={{textAlign: 'center' }}>
  {v.start_day}
</td>

<td style={{textAlign: 'center' }}>
  {v.end_day}
</td>

<td style={{textAlign: 'center' }}>
  {(() => {
    const timeStatus = getVoucherStatus(v.start_day, v.end_day);
    if (timeStatus === 'expired') {
      return <span className="status-badge expired">Hết hạn</span>;
    }
    if (timeStatus === 'upcoming') {
      return <span className="status-badge upcoming">Chưa hoạt động</span>;
    }
    if (!v.status) {
      return <span className="status-badge inactive">Tạm ngưng</span>;
    }
    return <span className="status-badge active">Hoạt động</span>;
  })()}
</td>

<td className="actions-cell" style={{ width: '100px', textAlign: 'center' }}>
  <button className="icon-btn edit-btn" onClick={() => handleEdit(v)} title="Sửa">
    <i className="bx bx-edit-alt"></i>
  </button>
  {getVoucherStatus(v.start_day, v.end_day) === 'active' && (
    <button
      className="icon-btn toggle-btn"
      onClick={() =>
        setVouchers((prev) =>
          prev.map((item) =>
            item.id === v.id ? { ...item, status: !item.status } : item
          )
        )
      }
      title={v.status ? 'Ẩn' : 'Hiện'}
    >
      <i className={`bx ${v.status ? 'bx-hide' : 'bx-show'}`}></i>
    </button>
  )}
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
</div>

          </div>
        </main>
      </div>
    </>
  );
}
