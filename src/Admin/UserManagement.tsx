import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchWithAuth } from "../Authentication/fetchWithAuth";

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6; // Số lượng người dùng trên 1 trang

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const response = await fetchWithAuth(
        `http://localhost:8080/user-account?sort=id,desc&size=${pageSize}&page=${currentPage}`,
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Dữ liệu người dùng nhận về:", data);

        const userList = data._embedded
          ? data._embedded.userAccounts
          : data.content || data;
        setUsers(userList);

        if (data.page) {
          setTotalPages(data.page.totalPages);
        } else if (data.totalPages) {
          setTotalPages(data.totalPages);
        }
      } else {
        console.error("Không thể tải danh sách người dùng");
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác!",
      )
    ) {
      return;
    }

    const token = localStorage.getItem("accessToken");
    try {
      // Thay đổi URL API xóa user sao cho khớp với Backend của bạn
      const response = await fetchWithAuth(
        `http://localhost:8080/user-account/delete/${id}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        alert("Xóa người dùng thành công!");
        fetchUsers(); // Refresh lại bảng sau khi xóa
      } else {
        alert("Có lỗi xảy ra khi xóa người dùng.");
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">
          <i className="fas fa-users-cog me-2"></i>Quản lý Người dùng
        </h2>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <table className="table table-hover table-bordered text-center align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th scope="col" style={{ width: "20%" }}>
                  Họ và tên
                </th>
                <th scope="col" style={{ width: "20%" }}>
                  Email / Username
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Quyền (Role)
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Trạng thái
                </th>
                <th scope="col" style={{ width: "25%" }}>
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={index}>
                    <td className="fw-semibold text-start px-3">{user.name}</td>
                    <td>{user.username}</td>

                    {/* HIỂN THỊ QUYỀN (ROLE) TỪ MẢNG AUTHORITIES */}
                    <td>
                      {user.authorities && user.authorities.length > 0 ? (
                        user.authorities.map((auth: any, idx: number) => (
                          <span
                            key={idx}
                            className="badge bg-info text-dark me-1"
                          >
                            {auth.authority.replace("ROLE_", "")}
                          </span>
                        ))
                      ) : (
                        <span className="badge bg-secondary">GUEST</span>
                      )}
                    </td>

                    {/* HIỂN THỊ TRẠNG THÁI (DỰA VÀO enabled) */}
                    <td>
                      {user.enabled ? (
                        <span className="badge bg-success rounded-pill px-3">
                          Đang hoạt động
                        </span>
                      ) : (
                        <span className="badge bg-secondary rounded-pill px-3">
                          Đang khóa
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button className="btn btn-sm btn-outline-warning fw-bold">
                          <i className="fas fa-lock"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger fw-bold"
                          onClick={() => handleDelete(user.userId)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang (Pagination) */}
        {totalPages > 1 && (
          <div className="card-footer bg-white d-flex justify-content-center py-3 border-0">
            <nav>
              <ul className="pagination mb-0">
                <li
                  className={`page-item ${currentPage === 0 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Trước
                  </button>
                </li>

                <li className="page-item active">
                  <span className="page-link">
                    {currentPage + 1} / {totalPages}
                  </span>
                </li>

                <li
                  className={`page-item ${currentPage >= totalPages - 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Sau
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
