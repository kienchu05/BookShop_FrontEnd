import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]); // Danh sách thể loại từ DB

  useEffect(() => {
    fetch(`http://localhost:8080/book/${id}`)
      .then((res) => res.json())
      .then((data) => setBook(data))
      .catch((err) => console.error("Lỗi lấy thông tin:", err));
    fetch("http://localhost:8080/category")
      .then((res) => res.json())
      .then((data) => {
        const catList = data._embedded ? data._embedded.categories : data;
        setCategories(catList);
      });
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    const response = await fetch(
      `http://localhost:8080/book/update-book/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(book),
      },
    );

    if (response.ok) {
      alert("Cập nhật thành công!");
      navigate("/admin/books");
    } else {
      alert("Có lỗi xảy ra!");
    }
  };

  if (!book) return <div className="text-center mt-5">Đang tải dữ liệu...</div>;

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: "900px" }}>
      <div className="card shadow-lg border-0 rounded-4 p-4">
        <h3 className="text-center fw-bold text-success mb-4">
          + CẬP NHẬT THÔNG TIN SÁCH
        </h3>
        <h5 className="text-muted text-center mb-4">
          CẬP NHẬT SÁCH: "{book.name}"
        </h5>

        <form onSubmit={handleUpdate}>
          <div className="row">
            {/* Cột trái: Thông tin form */}
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Tên sách</label>
                  <input
                    className="form-control"
                    value={book.name}
                    onChange={(e) => setBook({ ...book, name: e.target.value })}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Tác giả</label>
                  <input
                    className="form-control"
                    value={book.author}
                    onChange={(e) =>
                      setBook({ ...book, author: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="fw-semibold">Thể loại</label>
                <select
                  className="form-select"
                  value={
                    book.categories && book.categories.length > 0
                      ? book.categories[0]
                      : ""
                  }
                  onChange={(e) =>
                    setBook({ ...book, categories: [e.target.value] })
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

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="fw-semibold">Mã ISBN</label>
                  <input
                    className="form-control"
                    value={book.isbn}
                    onChange={(e) => setBook({ ...book, isbn: e.target.value })}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="fw-semibold">Giá gốc</label>
                  <input
                    className="form-control"
                    value={book.priceInit}
                    onChange={(e) =>
                      setBook({ ...book, priceInit: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="fw-semibold">Giá bán</label>
                  <input
                    className="form-control"
                    value={book.priceFinal}
                    onChange={(e) =>
                      setBook({ ...book, priceFinal: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="fw-semibold">Số lượng nhập kho</label>
                <input
                  className="form-control"
                  value={book.quantity}
                  onChange={(e) =>
                    setBook({ ...book, quantity: e.target.value })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="fw-semibold">Mô tả nội dung</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={book.description}
                  onChange={(e) =>
                    setBook({ ...book, description: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Cột phải: Ảnh bìa */}
            <div className="col-md-4 text-center">
              <label className="fw-semibold mb-2">Ảnh bìa sách</label>
              <div
                className="border p-3 mb-3 bg-light"
                style={{ height: "200px" }}
              >
                {/* Giả sử bạn có URL ảnh ở đây */}
                <img
                  src={book.imageUrl || "placeholder.jpg"}
                  alt="Bìa sách"
                  style={{ height: "100%", width: "auto" }}
                />
              </div>
              <button type="button" className="btn btn-outline-secondary w-100">
                Thay đổi ảnh bìa
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3 mt-4">
            <button
              type="button"
              className="btn btn-light border px-5"
              onClick={() => navigate(-1)}
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleUpdate}
              type="submit"
              className="btn btn-success px-5 fw-bold"
            >
              <i className="fas fa-save me-2"></i>Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBook;
