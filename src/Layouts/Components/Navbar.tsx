import React, { ChangeEvent, useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
  search: string;
  setSearch: (searchKey: string) => void;
  searchType: string;
  setSearchType: (searchKey: string) => void;
}

export default function Navbar({
  search,
  setSearch,
  searchType,
  setSearchType,
}: NavbarProps) {
  // 1. Tạo state cục bộ để giữ chữ người dùng đang gõ (chưa gửi đi tìm ngay)
  const [tempKey, setTempKey] = useState("");

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTempKey(e.target.value);
  };

  // 2. Hàm này CHỈ CHẠY khi người dùng bấm nút "Tìm" hoặc bấm phím Enter
  const handleSearch = (e: FormEvent) => {
    e.preventDefault(); // Ngăn trình duyệt tự động load lại trang (hành vi mặc định của form)
    setSearch(tempKey); // Lúc này mới chính thức báo cho App.tsx biết để đi tìm sách
  };

  const navigate = useNavigate();

  // Đọc thông tin từ LocalStorage
  const token = localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("userRole");

  // Kiểm tra trạng thái
  const isLoggedIn = !!token; // Nếu có token là true, không có là false
  const isAdmin = isLoggedIn && userRole?.includes("ADMIN");
  const isUser = isLoggedIn && !isAdmin;
  // console.log(isAdmin); // Kiểm tra xem chuỗi role có chứa chữ ADMIN không

  // Hàm Xử lý Đăng xuất
  const handleLogout = () => {
    // Xóa sạch dữ liệu trong LocalStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");

    // Đẩy về trang đăng nhập
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm py-3">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          <i className="fa-solid fa-book-open text-info me-2"></i>
          Book Store
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 fs-6">
            <li className="nav-item">
              <Link className="nav-link active" to="/">
                Trang chủ
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                id="navbarDropdown1"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Thể loại sách
              </a>
              <ul className="dropdown-menu shadow">
                <li>
                  <Link className="dropdown-item" to="/category/1">
                    Tiểu thuyết - Văn học
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/category/2">
                    Kỹ năng sống - Tâm lý
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/category/3">
                    Khoa học - Lịch sử
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/category/4">
                    Trinh thám - Giả tưởng
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/category/5">
                    Sách thiếu nhi
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                id="navbarDropdown2"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Chính sách bán hàng
              </a>
              <ul className="dropdown-menu shadow">
                <li>
                  <a className="dropdown-item" href="#">
                    Chính sách đổi trả
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Chính sách vận chuyển
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                Liên hệ
              </a>
            </li>
          </ul>

          {/* Form tìm kiếm */}
          <form className="d-flex me-4" role="search" onSubmit={handleSearch}>
            <select
              className="form-select me-2 rounded-pill"
              style={{ width: "150px" }}
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="name">Tên sách</option>
              <option value="author">Tác giả</option>
            </select>

            <input
              className="form-control me-2 rounded-pill px-3"
              type="search"
              placeholder={
                searchType === "name"
                  ? "Tìm kiếm sách ..."
                  : "Tìm kiếm tác giả ..."
              }
              aria-label="Search"
              onChange={onSearchChange}
              value={tempKey}
            />
            <button
              className="btn btn-outline-info rounded-pill px-4"
              type="submit"
            >
              Tìm
            </button>
          </form>

          {/* Các biểu tượng giỏ hàng và người dùng */}
          <div className="d-flex align-items-center mt-3 mt-lg-0">
            <a
              href="#"
              className="nav-link text-white me-4 fs-5 position-relative"
            >
              <i className="fas fa-shopping-cart"></i>
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                <span className="visually-hidden">Giỏ hàng có sản phẩm</span>
              </span>
            </a>

            <div className="dropdown">
              <button
                className="btn btn-link text-white p-0 border-0"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i
                  className="fas fa-user-circle fs-3 hover-text-info"
                  style={{ transition: "color 0.2s" }}
                ></i>
              </button>

              <ul
                className="dropdown-menu dropdown-menu-end shadow-sm mt-3"
                aria-labelledby="userDropdown"
              >
                {/* NẾU CHƯA ĐĂNG NHẬP */}
                {!isLoggedIn && (
                  <>
                    <li>
                      <Link
                        className="dropdown-item fw-semibold py-2"
                        to="/login"
                      >
                        <i className="fas fa-sign-in-alt me-2 text-secondary"></i>
                        Đăng nhập
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link
                        className="dropdown-item fw-semibold py-2"
                        to="/register"
                      >
                        <i className="fas fa-user-plus me-2 text-info"></i>
                        Đăng ký
                      </Link>
                    </li>
                  </>
                )}

                {/* 2. ĐÃ ĐĂNG NHẬP (CẢ USER VÀ ADMIN ĐỀU ĐƯỢC XEM HỒ SƠ) */}
                {isLoggedIn && (
                  <li>
                    <Link
                      className="dropdown-item fw-semibold py-2"
                      to="/profile"
                    >
                      <i className="fas fa-id-card me-2 text-primary"></i>
                      Hồ sơ của tôi
                    </Link>
                  </li>
                )}

                {/* 3. CHỈ HIỂN THỊ ĐƠN HÀNG NẾU LÀ USER THƯỜNG */}
                {isUser && (
                  <li>
                    <Link
                      className="dropdown-item fw-semibold py-2"
                      to="/orders"
                    >
                      <i className="fas fa-box-open me-2 text-success"></i>
                      Đơn hàng của tôi
                    </Link>
                  </li>
                )}

                {/* 4. CHỈ HIỂN THỊ QUẢN LÝ NẾU LÀ ADMIN */}
                {isAdmin && (
                  <>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <h6 className="dropdown-header text-warning fw-bold">
                        QUẢN TRỊ VIÊN
                      </h6>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item fw-semibold py-2"
                        to="/admin/books"
                      >
                        <i className="fas fa-book me-2 text-warning"></i>
                        Quản lý sách
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item fw-semibold py-2"
                        to="/admin/users"
                      >
                        <i className="fas fa-users-cog me-2 text-warning"></i>
                        Quản lý người dùng
                      </Link>
                    </li>
                  </>
                )}
                {/* NÚT ĐĂNG XUẤT CHO TẤT CẢ TÀI KHOẢN ĐÃ ĐĂNG NHẬP */}
                {isLoggedIn && (
                  <>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item fw-semibold py-2 text-danger"
                        onClick={handleLogout}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Đăng xuất
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
