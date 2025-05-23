'use client';

import Nav from "../nav/nav";
import React, { useState } from "react";

// Interface cho phản hồi
interface Feedback {
  id: string;
  user: string;
  content: string;
  product: string;
  createdAt: string;
  visible: boolean;
}

// Dữ liệu mẫu
const initialFeedbacks: Feedback[] = [
  {
    id: "1",
    user: "Nguyễn Văn A",
    content: "Áo chất lượng tốt!",
    product: "Áo thun nam",
    createdAt: "2025-05-15",
    visible: true,
  },
  {
    id: "2",
    user: "Trần Thị B",
    content: "Giao hàng hơi chậm",
    product: "Quần jeans nữ",
    createdAt: "2025-05-14",
    visible: false,
  },
];

export default function FeedbackAdminPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks);

  // State để lưu trạng thái lọc: '' | 'active' | 'inactive'
  const [filterStatus, setFilterStatus] = useState<string>("");

  // Lọc bình luận dựa trên trạng thái
  const filteredFeedbacks = filterStatus
    ? feedbacks.filter((fb) =>
        filterStatus === "active" ? fb.visible : !fb.visible
      )
    : feedbacks;

  // Đổi trạng thái hiển thị bình luận
  const toggleVisibility = (id: string) => {
    const updated = feedbacks.map((fb) =>
      fb.id === id ? { ...fb, visible: !fb.visible } : fb
    );
    setFeedbacks(updated);
  };

  return (
    <>
      <Nav />
      <div id="content" className="p-6">
        <main>
        <div className="head-title">
  <div className="left">
    <h1>Quản lý bình luận</h1>
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
        <option value="active">Hiển thị</option>
        <option value="inactive">Đã ẩn</option>
      </select>
    </div>
  </div>
</div>



          <div className="category-table-card">
            <h2>Danh sách bình luận</h2>
            {filteredFeedbacks.length === 0 ? (
              <div className="empty-state">
                <i className="bx bx-info-circle"></i>
                <p>
                  Không tìm thấy bình luận nào phù hợp hoặc chưa có bình luận nào
                  được tạo.
                </p>
                {filterStatus && (
                  <button
                    onClick={() => setFilterStatus("")}
                    className="btn secondary-btn"
                  >
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
                      <th>Người dùng</th>
                      <th>Nội dung</th>
                      <th>Sản phẩm</th>
                      <th>Ngày</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
  {filteredFeedbacks.map((fb, index) => (
    <tr key={fb.id}>
      <td>{index + 1}</td>
      <td>{fb.user}</td>
      <td>{fb.content}</td>
      <td>{fb.product}</td>
      <td>{fb.createdAt}</td>
      <td>
        {fb.visible ? (
          <span className="status-badge active">Hiển thị</span>
        ) : (
          <span className="status-badge inactive">Đã ẩn</span>
        )}
      </td>
      <td className="actions-cell" style={{ width: '100px', textAlign: 'center' }}>
        <button
          className="icon-btn toggle-btn"
          onClick={() => toggleVisibility(fb.id)}
          title={fb.visible ? 'Ẩn' : 'Hiện'}
        >
          <i className={`bx ${fb.visible ? 'bx-hide' : 'bx-show'}`}></i>
        </button>
      </td>
    </tr>
  ))}
</tbody>

                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
