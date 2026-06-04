import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const AddBook = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{ name: string }[]>([]);

  // Khởi tạo state với đầy đủ các trường thông tin Backend yêu cầu
  const [book, setBook] = useState({
    name: "",
    author: "",
    isbn: "", // Đã thêm để tránh lỗi trùng hoặc null ở DB
    priceInit: 0,
    priceFinal: 0,
    description: "",
    quantity: 0,
    avgRating: 0,
    categories: [] as { name: string }[], // Đảm bảo đây là mảng để Backend có thể nhận dạng đúng
  });

  // Load danh sách thể loại từ Backend để hiển thị vào Dropdown
  useEffect(() => {
    fetch("http://localhost:8080/category") // Đảm bảo API này trả về danh sách Category
      .then((res) => res.json())
      .then((data) => {
        console.log("Dữ liệu nhận về từ API:", data); // Log cả object data để debug

        // Kiểm tra kỹ cấu trúc:
        // Nếu API trả về { "_embedded": { "categories": [...] } }
        const catList = data._embedded
          ? data._embedded.categories
          : Array.isArray(data)
            ? data
            : [];
        setCategories(catList);
        console.log("Danh sách thể loại đã tải:", catList);
      })
      .catch((err) => console.error("Lỗi lấy danh sách thể loại:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Lấy token Admin để vượt qua hàng rào Spring Security
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Lỗi: Bạn không có quyền truy cập hoặc phiên làm việc đã hết hạn!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/book/add-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(book),
      });

      if (response.ok) {
        alert("Thêm sách mới thành công! 🎉");

        // DÒNG QUAN TRỌNG: Tự động nhảy về trang danh sách sách ngay lập tức
        navigate("/admin/books");
      } else {
        // Đọc câu thông báo lỗi kiểm tra trùng lặp (ISBN/Tên sách) từ Backend gửi về
        const errorData = await response.json();
        alert(errorData.message || "Có lỗi xảy ra khi thêm sách!");
      }
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
      alert("Không thể kết nối tới máy chủ.");
    }
  };

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: "600px" }}>
      <div className="card shadow-sm border-0 rounded-3 p-4">
        <h2 className="fw-bold text-success mb-4 text-center">
          <i className="fas fa-plus-circle me-2"></i>Thêm Sách Mới
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Tên sách</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="Nhập tên cuốn sách..."
              onChange={(e) => setBook({ ...book, name: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Tác giả</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="Nhập tên tác giả..."
              onChange={(e) => setBook({ ...book, author: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Thể Loại</label>
            <select
              className="form-select"
              required
              onChange={(e) =>
                setBook({ ...book, categories: [{ name: e.target.value }] })
              }
            >
              <option value="">Chọn thể loại...</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Mã xuất bản (ISBN)</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="Ví dụ: ISBN-978604..."
              onChange={(e) => setBook({ ...book, isbn: e.target.value })}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Giá gốc (đ)</label>
              <input
                type="number"
                className="form-control"
                required
                min="0"
                onChange={(e) =>
                  setBook({ ...book, priceInit: Number(e.target.value) })
                }
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Giá bán (đ)</label>
              <input
                type="number"
                className="form-control"
                required
                min="0"
                onChange={(e) =>
                  setBook({ ...book, priceFinal: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Số lượng nhập kho</label>
            <input
              type="number"
              className="form-control"
              required
              min="1"
              placeholder="10"
              onChange={(e) =>
                setBook({ ...book, quantity: Number(e.target.value) })
              }
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Mô tả nội dung</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Tóm tắt ngắn gọn nội dung cuốn sách..."
              onChange={(e) =>
                setBook({ ...book, description: e.target.value })
              }
            />
          </div>

          <div className="d-flex gap-2">
            <Link
              to="/admin/books"
              className="btn btn-outline-secondary w-50 fw-bold"
            >
              Hủy bỏ
            </Link>
            <button
              onClick={handleSubmit}
              type="submit"
              className="btn btn-success w-50 fw-bold"
            >
              <i className="fas fa-save me-2"></i>Lưu sách
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
