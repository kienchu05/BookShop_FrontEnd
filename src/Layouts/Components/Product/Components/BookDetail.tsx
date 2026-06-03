import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookModel from "../../../../Models/BookModel";
import ImageModel from "../../../../Models/ImageModel";
import { getBookById } from "../../../../API/ApiBookDetail";
import { getAllImages } from "../../../../API/ApiImages";
import RatingBook from "./RatingBook";
import "./BookDetail.css";

const BookDetail: React.FC = () => {
  // 1. Lấy mã sách từ URL
  const { id } = useParams();
  let bookId = 0;
  try {
    bookId = parseInt(id + "");
    if (Number.isNaN(bookId)) bookId = 0;
  } catch (error) {
    bookId = 0;
  }

  // 2. Khai báo State
  const [book, setBook] = useState<BookModel | null>(null);
  const [images, setImages] = useState<ImageModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const [anhChinh, setAnhChinh] = useState(0);

  // 3. Gọi API lấy dữ liệu sách & ảnh
  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi vào
    if (bookId > 0) {
      // Lấy thông tin sách
      getBookById(bookId).then((data) => {
        setBook(data);
        setLoading(false);
      });
      // Lấy thông tin ảnh
      getAllImages(bookId).then((imgs) => {
        // Sắp xếp: ảnh nào có isAvatar === true thì cho lên đầu
        const sortedImages = [...imgs].sort(
          (a, b) => (b.isAvatar ? 1 : 0) - (a.isAvatar ? 1 : 0),
        );
        setImages(sortedImages);
      });
    }
  }, [bookId]);

  // 4. Giao diện lúc đang tải hoặc không tìm thấy
  if (loading)
    return (
      <div className="container py-5 text-center">
        <h1>Đang tải...</h1>
      </div>
    );
  if (!book)
    return (
      <div className="container py-5 text-center">
        <h1>Sách không tồn tại!</h1>
      </div>
    );

  // 5. Giao diện chính chuẩn E-commerce
  return (
    <div className="container py-5">
      <div className="row">
        {/* Cột trái: Ảnh sản phẩm */}
        <div className="col-md-5 mb-4">
          {/* Khung ảnh chính */}
          <div className="image-container-detail card border-0 shadow-sm rounded-4 mb-3">
            {images.length > 0 && (
              <img src={images[anhChinh].dataImage} className="img-fluid" />
            )}
          </div>

          {/* Dải ảnh phụ bên dưới */}
          <div className="row g-2">
            {images.map((img, index) => (
              <div className="col-3" key={index}>
                <img
                  src={img.dataImage}
                  className={`img-thumbnail ${index === anhChinh ? "border-info" : ""}`}
                  onClick={() => setAnhChinh(index)}
                  style={{
                    cursor: "pointer",
                    height: "80px",
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Cột phải: Chi tiết sách */}
        <div className="col-md-7 ps-md-5">
          <h2 className="fw-bold mb-3">{book.name}</h2>
          <div className="mb-3">
            <span className="text-info fw-semibold me-3">
              <i className="fas fa-user-pen me-1"></i> {book.author}
            </span>
            <span className="text-warning">
              <i className="fas fa-star"></i> {book.avgRating} / 5
            </span>
          </div>  

          <div className="d-flex align-items-center mb-4">
            <h3 className="text-danger fw-bold me-3 mb-0">
              {book.priceFinal}K(VNĐ)
            </h3>
            <h5 className="text-muted text-decoration-line-through mb-0">
              {book.priceInit}K(VNĐ)
            </h5>
          </div>

          <div className="mb-4">
            <h5 className="fw-bold">Mô tả sản phẩm:</h5>
            <p className="text-muted lh-base">{book.description}</p>
          </div>

          <hr />

          <div className="d-flex justify-content-between align-items-center mt-4 mb-3 p-3 bg-light rounded border border-light shadow-sm">
            <span className="fs-5 fw-bold text-dark">Tạm tính:</span>
            <span className="fs-4 fw-bold text-danger">
              {/* Nhân giá với số lượng, dùng toLocaleString để có dấu phẩy nếu số to */}
              {book.priceFinal
                ? (book.priceFinal * quantity).toLocaleString("vi-VN")
                : 0}
              K(VNĐ)
            </span>
          </div>

          {/* Cụm chọn số lượng & Nút Mua */}
          <div className="row mt-4 align-items-center">
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="input-group">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  className="form-control text-center"
                  value={quantity}
                  // 1. XÓA thuộc tính readOnly đi

                  // 2. THÊM sự kiện onChange để bắt giá trị người dùng gõ vào
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    const maxQuantity = book.quantity ?? 1; // Số lượng tồn kho tối đa

                    if (!isNaN(value)) {
                      // Nếu người dùng nhập số lớn hơn tồn kho, ép về mức tồn kho tối đa
                      if (value > maxQuantity) {
                        setQuantity(maxQuantity);
                      } else {
                        setQuantity(value);
                      }
                    } else {
                      // Nếu người dùng xóa trắng ô input, tạm thời cho nó về 1
                      setQuantity(1);
                    }
                  }}
                  // 3. THÊM sự kiện onBlur (khi người dùng click chuột ra ngoài ô input)
                  // Đảm bảo số lượng không bao giờ bị âm hoặc bằng 0
                  onBlur={(e) => {
                    if (quantity < 1) {
                      setQuantity(1);
                    }
                  }}
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setQuantity(Math.min(book.quantity ?? 1, quantity + 1))
                  }
                >
                  +
                </button>
              </div>
            </div>
            <div className="col-md-8">
              <button className="btn btn-info text-white fw-bold px-4 py-2 w-100 shadow-sm">
                <i className="fas fa-shopping-cart me-2"></i> Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
      <RatingBook bookId={book.id} />
    </div>
  );
};

export default BookDetail;
