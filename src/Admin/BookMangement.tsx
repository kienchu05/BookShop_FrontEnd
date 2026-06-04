import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Định nghĩa cấu trúc Thể loại (Điều chỉnh tên biến cho khớp Backend)
interface Category {
  id: number;
  name: string;
}

// Mở rộng kiểu dữ liệu cho cuốn sách
interface Book {
  id: number;
  name: string;
  author: string;
  priceFinal: number;
  quantity?: number; // Số lượng tồn kho
  categories?: Category[]; // Danh sách thể loại của sách
}
const BookManagement = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. THÊM STATE CHO PHÂN TRANG
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchBooks(currentPage); // Gọi fetch với trang hiện tại
  }, [currentPage]); // Chạy lại mỗi khi đổi trang

  const fetchBooks = async (page: number) => {
    setIsLoading(true);
    try {
      // 2. TRUYỀN PAGE VÀO ENDPOINT
      const response = await fetch(
        `http://localhost:8080/book?sort=id,desc&page=${page}&size=5`,
        {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        },
      );

      if (!response.ok) throw new Error("Không thể tải dữ liệu.");

      const data = await response.json();
      const bookList: Book[] = data._embedded ? data._embedded.books : [];

      // 3. CẬP NHẬT TỔNG SỐ TRANG TỪ BACKEND
      setTotalPages(data.page.totalPages);

      const booksWithCategories = await Promise.all(
        bookList.map(async (book: any) => {
          const categoriesUrl = book._links?.categories?.href;
          if (categoriesUrl) {
            const catResponse = await fetch(categoriesUrl);
            if (catResponse.ok) {
              const catData = await catResponse.json();
              return {
                ...book,
                categories: catData._embedded?.categories || [],
              };
            }
          }
          return { ...book, categories: [] };
        }),
      );

      setBooks(booksWithCategories);
    } catch (err) {
      setError("Lỗi tải danh sách sách.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. HÀM XỬ LÝ XÓA SÁCH
  const handleDelete = async (id: number) => {
    const isConfirm = window.confirm(
      "Bạn có chắc chắn muốn xóa cuốn sách này không?",
    );
    if (!isConfirm) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Lỗi: Bạn chưa đăng nhập hoặc hết phiên làm việc.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/book/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Xóa sách thành công!");
        setBooks(books.filter((book) => book.id !== id));
      } else if (response.status === 403) {
        alert("Lỗi: Bạn không có quyền quản trị viên (ADMIN) để xóa sách!");
      } else {
        alert(
          "Có lỗi xảy ra khi xóa sách. Sách có thể đang nằm trong hóa đơn.",
        );
        console.log("Lỗi chi tiết khi xóa:", response.text());
      }
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      alert("Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <div className="container-fluid px-4 mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">
          <i className="fas fa-book-open me-2"></i>Quản lý Kho Sách
        </h2>
        <Link
          to="/admin/add-book"
          className="btn btn-success fw-bold shadow-sm px-4 py-2"
        >
          <i className="fas fa-plus-circle me-2"></i>Thêm sách mới
        </Link>
      </div>

      {error && <div className="alert alert-danger shadow-sm">{error}</div>}

      <div className="card shadow border-0 rounded-3">
        <div className="card-body p-0">
          {isLoading ? (
            <div className="text-center p-5">
              <div
                className="spinner-border text-primary"
                style={{ width: "3rem", height: "3rem" }}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted fw-semibold">
                Đang tải dữ liệu từ máy chủ...
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered mb-0 text-center align-middle">
                <thead className="table-dark">
                  <tr>
                    <th
                      scope="col"
                      className="text-start"
                      style={{ width: "25%" }}
                    >
                      Tên sách
                    </th>
                    <th scope="col" style={{ width: "15%" }}>
                      Tác giả
                    </th>
                    <th scope="col" style={{ width: "15%" }}>
                      Thể loại
                    </th>
                    <th scope="col" style={{ width: "10%" }}>
                      Giá bán
                    </th>
                    <th scope="col" style={{ width: "10%" }}>
                      Số lượng
                    </th>
                    <th scope="col" style={{ width: "20%" }}>
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {books.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-5 text-muted fw-semibold fs-5"
                      >
                        <i className="fas fa-folder-open mb-3 fs-1 d-block text-secondary"></i>
                        Chưa có cuốn sách nào trong hệ thống.
                      </td>
                    </tr>
                  ) : (
                    books.map((book, index) => (
                      <tr key={book.id || index}>
                        <td className="text-start fw-bold text-primary">
                          {book.name}
                        </td>

                        <td className="fw-semibold">{book.author}</td>

                        {/* Xử lý hiển thị Thể loại (Categories) */}
                        <td>
                          {book.categories && book.categories.length > 0 ? (
                            book.categories.map((cat) => (
                              <span
                                key={cat.id}
                                className="badge bg-info text-dark me-1 mb-1"
                              >
                                {cat.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted fst-italic">
                              Chưa có
                            </span>
                          )}
                        </td>

                        <td className="text-danger fw-bold">
                          {book.priceFinal
                            ? book.priceFinal.toLocaleString("vi-VN")
                            : "0"}{" "}
                          K(VNĐ)
                        </td>

                        <td>
                          <span
                            className={`badge ${book.quantity && book.quantity > 0 ? "bg-success" : "bg-danger"} rounded-pill fs-6`}
                          >
                            {book.quantity || 0} cuốn sách
                          </span>
                        </td>

                        <td>
                          <Link
                            to={`/admin/update-book/${book.id}`}
                            className="btn btn-sm btn-outline-warning me-2 fw-bold"
                          >
                            <i className="fas fa-edit me-1"></i> Sửa
                          </Link>

                          <button
                            className="btn btn-sm btn-outline-danger fw-bold"
                            onClick={() => handleDelete(book.id)}
                          >
                            <i className="fas fa-trash-alt me-1"></i> Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          {!isLoading && totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
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
                  className={`page-item ${currentPage + 1 >= totalPages ? "disabled" : ""}`}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default BookManagement;
