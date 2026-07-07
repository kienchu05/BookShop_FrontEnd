import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../Authentication/fetchWithAuth";

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
          existingImages = data.images
            .map((img: any) => img.linkToImage)
            .filter(Boolean);
        }

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
      const base64Promises = Array.from(files).map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
      });

      const newBase64Images = await Promise.all(base64Promises);

      setBook((prevBook: any) => ({
        ...prevBook,
        images: [...(prevBook?.images || []), ...newBase64Images],
      }));
    } catch (error) {
      console.error("Lỗi khi đọc file ảnh:", error);
      alert("Không thể tải ảnh lên. Vui lòng thử lại!");
    }
    e.target.value = "";
  };

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
    try {
      const response = await fetchWithAuth(
        `http://localhost:8080/book/update-book/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(book), // Vẫn dùng JSON vì Backend đã có logic bóc tách chuỗi base64
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
            {/* Cột trái: Thông tin form (Giữ nguyên của bạn) */}
            <div className="col-md-8">
              {/* ... Code các thẻ input chữ của bạn giữ nguyên hoàn toàn ... */}

              {/* Trích xuất 1 đoạn để code không quá dài, bạn cứ giữ nguyên code của bạn ở khu vực này */}
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

              {/* ... (các input Thể loại, ISBN, Giá... giữ nguyên) ... */}
            </div>

            {/* Cột phải: KHU VỰC THÊM ẢNH BÌA */}
            <div className="col-md-4">
              <label className="fw-semibold mb-2">Ảnh sách</label>

              <div
                className="border p-2 mb-3 bg-light rounded d-flex flex-wrap gap-2"
                style={{ minHeight: "150px" }}
              >
                {book.images && book.images.length > 0 ? (
                  book.images.map((imgString: string, index: number) => (
                    <div
                      key={index}
                      className="position-relative"
                      style={{ width: "80px", height: "100px" }}
                    >
                      {/* SỬA Ở ĐÂY 2: Cập nhật logic hiển thị ảnh thông minh */}
                      <img
                        src={
                          imgString.startsWith("http")
                            ? imgString // Nếu là link Cloudinary (hoặc http bất kỳ)
                            : imgString.startsWith("data:")
                              ? imgString // Nếu là ảnh Base64 mới chọn chưa lưu
                              : `http://localhost:8080/images/${imgString}` // Fallback ảnh local cũ (nếu còn)
                        }
                        alt={`Preview ${index}`}
                        className="img-thumbnail w-100 h-100"
                        style={{ objectFit: "cover" }}
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
                    Chưa có ảnh
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
