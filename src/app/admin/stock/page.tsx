'use client';

import React, { useState, useEffect } from 'react';
import Nav from '../nav/nav';
import { toast } from 'react-toastify';

interface StockItem {
  id: string;
  product_name: string;
  variant: string;
  quantity: number;
  low_stock_threshold: number;
  history: StockHistory[];
}

interface StockHistory {
  id: string;
  quantity_change: number;
  reason: string;
  created_at: string;
}

export default function StockAdminPage() {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [formData, setFormData] = useState({
    id: '',
    product_name: '',
    variant: '',
    quantity: 0,
    reason: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  const resetForm = () => {
    setFormData({
      id: '',
      product_name: '',
      variant: '',
      quantity: 0,
      reason: ''
    });
    setIsEditing(false);
  };

  useEffect(() => {
    setStocks([
      {
        id: '1',
        product_name: 'Áo Thun Nam',
        variant: 'M / Trắng',
        quantity: 8,
        low_stock_threshold: 5,
        history: [
          { id: 'h1', quantity_change: +5, reason: 'Nhập thêm', created_at: '2025-05-20' },
          { id: 'h2', quantity_change: -2, reason: 'Khách mua hàng', created_at: '2025-05-21' }
        ]
      },
      {
        id: '2',
        product_name: 'Quần Jean Nữ',
        variant: 'L / Xanh',
        quantity: 0,
        low_stock_threshold: 3,
        history: []
      }
    ]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { product_name, variant, quantity } = formData;

    if (!product_name || !variant || isNaN(quantity)) {
      toast.error('Vui lòng nhập đầy đủ thông tin tồn kho.');
      return;
    }

    if (isEditing) {
      setStocks((prev) =>
        prev.map((s) =>
          s.id === formData.id
            ? {
                ...s,
                quantity: formData.quantity,
                history: [
                  ...s.history,
                  {
                    id: Date.now().toString(),
                    quantity_change: formData.quantity - s.quantity,
                    reason: formData.reason,
                    created_at: new Date().toISOString()
                  }
                ]
              }
            : s
        )
      );
      toast.success('Cập nhật tồn kho thành công!');
    } else {
      const newStock: StockItem = {
        id: Date.now().toString(),
        product_name,
        variant,
        quantity,
        low_stock_threshold: 5,
        history: []
      };
      setStocks([...stocks, newStock]);
      toast.success('Thêm tồn kho thành công!');
    }

    resetForm();
  };

  const handleEdit = (stock: StockItem) => {
    setFormData({
      id: stock.id,
      product_name: stock.product_name,
      variant: stock.variant,
      quantity: stock.quantity,
      reason: ''
    });
    setIsEditing(true);
  };

  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity === 0) return 'out';
    if (quantity <= threshold) return 'low';
    return 'ok';
  };

  return (
    <>
      <Nav />
      <div id="content" className="p-6">
        <h1>Quản lý Tồn kho</h1>

        <div className="voucher-admin-wrapper">
          <div className="voucher-admin-layout">
            {/* Form */}
            <div className="voucher-form-card">
              <h2>{isEditing ? 'Cập nhật tồn kho' : 'Thêm tồn kho mới'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Tên sản phẩm:</label>
                  <input
                    type="text"
                    value={formData.product_name}
                    onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phân loại:</label>
                  <input
                    type="text"
                    value={formData.variant}
                    onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Số lượng tồn:</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Lý do thay đổi:</label>
                  <input
                    type="text"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  />
                </div>
                <div className="button-group">
                  <button type="submit" className="btn primary-btn">
                    {isEditing ? 'Cập nhật' : 'Thêm'}
                  </button>
                  {isEditing && (
                    <button type="button" className="btn secondary-btn" onClick={resetForm}>
                      Hủy
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Danh sách tồn kho */}
            <div className="voucher-table-card">
              <h2>Danh sách tồn kho</h2>
              <table className="voucher-table category-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Sản phẩm</th>
                    <th>Phân loại</th>
                    <th>Số lượng</th>
                    <th>Trạng thái</th>
                    <th>Lịch sử</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock, idx) => (
                    <tr key={stock.id}>
                      <td>{idx + 1}</td>
                      <td>{stock.product_name}</td>
                      <td>{stock.variant}</td>
                      <td style={{ textAlign: 'center' }}>{stock.quantity}</td>
                      <td>
                        {(() => {
                          const status = getStockStatus(stock.quantity, stock.low_stock_threshold);
                          if (status === 'out') return <span className="status-badge expired">Hết hàng</span>;
                          if (status === 'low') return <span className="status-badge warning">Sắp hết</span>;
                          return <span className="status-badge active">Còn hàng</span>;
                        })()}
                      </td>
                      <td>
                        {stock.history.length > 0 ? (
                          <ul>
                            {stock.history.map((h) => (
                              <li key={h.id}>
                                {h.quantity_change > 0 ? '+' : ''}
                                {h.quantity_change} ({h.reason}) - {new Date(h.created_at).toLocaleDateString()}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          'Không có'
                        )}
                      </td>
                      <td>
                        <button className="icon-btn edit-btn" onClick={() => handleEdit(stock)} title="Cập nhật">
                          <i className="bx bx-edit-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
