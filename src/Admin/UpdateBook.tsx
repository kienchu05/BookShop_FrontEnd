import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    // 1. Lấy thông tin sách
    fetch(`http://localhost:8080/book/${id}`)
      .then((res) => res.json())
      .then((data) => {
        let existingImages: string[] = [];
        if (data.images && Array.isArray(data.images)) {
          // Lấy đúng trường dataImage (chuỗi base64) để đưa vào mảng
          existingImages = data.images
            .map((img: any) => img.dataImage)
            .filter(Boolean);
        }

        // Gán mảng String đã lọc vào book
        setBook({ ...data, images: existingImages });
      })
      .catch((err) => console.error("Lỗi lấy thông tin:", err));

    // 2. Lấy danh sách thể loại
    fetch("http://localhost:8080/category")
      .then((res) => res.json())
      .then((data) => {
        const catList = data._embedded ? data._embedded.categories : data;
        setCategories(catList);
      });
  }, [id]);

  // Hàm xử lý đọc file
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      // Sử dụng Promise để đảm bảo đọc xong tất cả các file mới cập nhật giao diện
      const base64Promises = Array.from(files).map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          // Phải gán onload trước khi gọi readAsDataURL
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
      });

      // Chờ tất cả file chuyển thành Base64
      const newBase64Images = await Promise.all(base64Promises);

      // Cập nhật state (Cộng dồn ảnh cũ và ảnh mới)
      setBook((prevBook: any) => ({
        ...prevBook,
        images: [...(prevBook?.images || []), ...newBase64Images],
      }));
    } catch (error) {
      console.error("Lỗi khi đọc file ảnh:", error);
      alert("Không thể tải ảnh lên. Vui lòng thử lại!");
    }

    // Xóa giá trị input để bạn có thể chọn lại chính bức ảnh đó nếu lỡ tay ấn xóa
    e.target.value = "";
  };

  // Hàm gỡ ảnh mới chọn
  const handleRemoveImage = (indexToRemove: number) => {
    setBook((prevBook: any) => ({
      ...prevBook,
      images: prevBook.images.filter(
        (_: any, index: number) => index !== indexToRemove,
      ),
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    // Chặn update nếu không có token
    if (!token) {
      alert("Bạn chưa đăng nhập hoặc hết phiên!");
      return;
    }

    try {
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
        const errData = await response.json();
        alert(errData.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      alert("Lỗi kết nối tới server!");
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
              {/* Các thẻ input giữ nguyên (Tên sách, Tác giả, ISBN, Giá...) */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="fw-semibold">Tên sách</label>
                  <input
                    className="form-control"
                    value={book.name}
                    onChange={(e) => setBook({ ...book, name: e.target.value })}
                    required
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
                    required
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
                  required
                >
                  <option value="">Chọn thể loại...</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ... Các input khác (ISBN, Giá gốc, Giá bán, Số lượng, Mô tả) ... */}
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="fw-semibold">Mã ISBN</label>
                  <input
                    className="form-control"
                    value={book.isbn}
                    onChange={(e) => setBook({ ...book, isbn: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="fw-semibold">Giá gốc</label>
                  <input
                    type="number"
                    className="form-control"
                    value={book.priceInit}
                    onChange={(e) =>
                      setBook({ ...book, priceInit: Number(e.target.value) })
                    }
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="fw-semibold">Giá bán</label>
                  <input
                    type="number"
                    className="form-control"
                    value={book.priceFinal}
                    onChange={(e) =>
                      setBook({ ...book, priceFinal: Number(e.target.value) })
                    }
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="fw-semibold">Số lượng nhập kho</label>
                <input
                  type="number"
                  className="form-control"
                  value={book.quantity}
                  onChange={(e) =>
                    setBook({ ...book, quantity: Number(e.target.value) })
                  }
                  required
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
                  required
                />
              </div>
            </div>

            {/* Cột phải: KHU VỰC THÊM ẢNH BÌA */}
            <div className="col-md-4">
              <label className="fw-semibold mb-2">Ảnh thêm mới</label>

              <div
                className="border p-2 mb-3 bg-light rounded d-flex flex-wrap gap-2"
                style={{ minHeight: "150px" }}
              >
                {book.images && book.images.length > 0 ? (
                  book.images.map((imgBase64: string, index: number) => (
                    <div
                      key={index}
                      className="position-relative"
                      style={{ width: "80px", height: "100px" }}
                    >
                      {/* Xử lý hiển thị cả ảnh lấy từ DB (linkToImage) HOẶC ảnh base64 mới tải lên */}
                      <img
                        src={
                          imgBase64.startsWith("data:")
                            ? imgBase64
                            : `http://localhost:8080/images/${imgBase64}`
                        } // Cần cấu hình đường dẫn ảnh nếu là url
                        alt="Preview"
                        className="img-thumbnail w-100 h-100"
                        style={{ objectFit: "cover" }}
                        // Fallback nếu ảnh không tải được
                        onError={(e: any) => {
                          e.target.src =
                            "https://via.placeholder.com/80x100?text=Error";
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle p-1"
                        style={{
                          transform: "translate(30%, -30%)",
                          width: "24px",
                          height: "24px",
                          lineHeight: "10px",
                        }}
                        onClick={() => handleRemoveImage(index)}
                        title="Xóa ảnh này"
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <span className="text-muted w-100 text-center mt-4">
                    Chưa chọn ảnh mới
                  </span>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                multiple
                id="upload-image"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />

              <label
                htmlFor="upload-image"
                className="btn btn-outline-primary w-100 fw-bold"
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-plus-circle me-2"></i>Chọn ảnh tải lên
              </label>
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
            <button type="submit" className="btn btn-success px-5 fw-bold">
              <i className="fas fa-save me-2"></i>Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBook;
