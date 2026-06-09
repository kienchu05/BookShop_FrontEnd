import React, { useState, useEffect } from "react";
import BookModel from "../Models/BookModel";
import ImageModel from "../Models/ImageModel";
import { error } from "console";

import { getAllImages } from "../API/ApiImages";
import { Link } from "react-router-dom";

// =======================================================
// 1. COMPONENT CON: Xử lý dữ liệu và hình ảnh cho TỪNG Slide
// =======================================================
interface CarouselItemProps {
  book: BookModel;
  index: number;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ book, index }) => {
  const [images, setImages] = useState<ImageModel[]>([]);
  // Không cần hiện chữ "Uploading..." làm hỏng bố cục thanh trượt

  useEffect(() => {
    getAllImages(book.id)
      .then((response) => setImages(response))
      .catch((error) => console.log("Lỗi tải ảnh carousel:", error.message));
  }, []);

  return (
    <div className={`carousel-item ${index === 0 ? "active" : ""}`}>
      <div className="row align-items-center p-4 p-md-5">
        {/* Phần Ảnh Bìa Sách */}
        <div className="col-md-5 text-center mb-4 mb-md-0">
          {images && images.length > 0 && images[0]?.dataImage ? (
            <Link to={`/book/${book.id}`}>
              <img
                src={`${images[0].dataImage}`}
                className="img-fluid rounded-3 shadow"
                alt={book.name}
                style={{ maxHeight: "400px", objectFit: "cover" }}
                onError={(e) => {
                  // Bắt lỗi nếu chuỗi Base64 trong DB bị hỏng
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://picsum.photos/400/600?grayscale";
                }}
              />
            </Link>
          ) : (
            <Link to={`/book/${book.id}`}>
              <img
                src="https://picsum.photos/400/600?grayscale"
                className="img-fluid rounded-3 shadow"
                alt="Đang tải ảnh..."
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
            </Link>
          )}
        </div>

        {/* Phần Thông Tin Sách */}
        <div className="col-md-7 px-md-5">
          <span className="badge bg-danger mb-2 px-3 py-2">Sách Nổi Bật</span>
          <h2
            className="display-5 fw-bold text-dark mb-3"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {book.name}
          </h2>
          <p
            className="lead mb-4"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {book.description}
          </p>

          {/* Hiển thị Giá tiền */}
          <div className="d-flex align-items-center mb-4">
            <h3 className="text-danger fw-bold me-3 mb-0">
              {book.priceFinal?.toLocaleString("vi-VN")}(VNĐ)
            </h3>
            <del className="text-muted fs-5">
              {book.priceInit?.toLocaleString("vi-VN")}(VNĐ)
            </del>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselItem;
