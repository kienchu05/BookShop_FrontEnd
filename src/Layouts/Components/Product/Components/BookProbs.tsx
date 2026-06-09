import React, { useState, useEffect } from "react";
import "./BookProbs.css";
import BookModel from "../../../../Models/BookModel";
import ImageModel from "../../../../Models/ImageModel";
import { getAllImages } from "../../../../API/ApiImages";
import { Link } from "react-router-dom";

interface BookProps {
  book: BookModel;
}

const BookCard: React.FC<BookProps> = (props) => {
  const book_id: number = props.book.id;

  const [images, setImages] = useState<ImageModel[]>([]);
  const [uploading, setUploading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllImages(book_id)
      .then((response) => {
        // Sắp xếp: ảnh nào có isAvatar === true thì cho lên đầu
        const sortedImages = [...response].sort(
          (a, b) => (b.isAvatar ? 1 : 0) - (a.isAvatar ? 1 : 0),
        );
        setImages(sortedImages);
        setUploading(false);
      })
      .catch((error) => {
        setError(error.message);
        setImages([]);
        setUploading(false);
      });
  }, [book_id]);

  if (uploading) {
    return (
      <div className="d-flex">
        <h1>Uploading ...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Errors : {error}</h1>
      </div>
    );
  }

  return (
    <div className="col-md-3 mt-3">
      <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden book-card-hover">
        {images && images.length > 0 && images[0]?.dataImage ? (
          <Link to={`/book/${props.book.id}`}>
            <img
              src={`${images[0].dataImage}`}
              alt={props.book.name}
              loading="lazy"
              className="card-img-top"
              style={{ height: "250px", objectFit: "cover" }}
            />
          </Link>
        ) : (
          <Link to={`/book/${props.book.id}`}>
            <img
              src="https://picsum.photos/400/600?grayscale"
              alt="Đang cập nhật ảnh"
              className="card-img-top"
              loading="lazy"
              style={{ height: "250px", objectFit: "cover" }}
            />
          </Link>
        )}

        <div className="card-body d-flex flex-column">
          {/* Ép tên sách hiển thị tối đa 2 dòng */}
          <h5
            className="card-title fw-bold text-dark mb-1"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {props.book.name}
          </h5>
          <p className="card-text text-info small mb-2 fw-semibold">
            <i className="fas fa-user-pen me-1"></i> {props.book.author}
          </p>

          {/* Mô tả sách */}
          <p
            className="card-text text-muted small mb-3"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {props.book.description}
          </p>

          <div className="mt-auto">
            <div className="d-flex align-items-center mb-3">
              <span className="text-danger fw-bold fs-5 me-2">
                {props.book.priceFinal?.toLocaleString("vi-VN")}(VNĐ)
              </span>
              <span className="text-muted text-decoration-line-through small">
                {props.book.priceInit?.toLocaleString("vi-VN")}(VNĐ)
              </span>
            </div>

            <div className="row g-2" role="group">
              <div className="col-4">
                <a
                  href="#"
                  className="btn btn-outline-danger w-100"
                  title="Yêu thích"
                >
                  <i className="fas fa-heart"></i>
                </a>
              </div>
              <div className="col-8">
                <Link
                  to={`/book/${props.book.id}`}
                  className="btn btn-info text-white w-100 fw-bold"
                  title="Thêm vào giỏ"
                >
                  <i className="fas fa-shopping-cart me-2"></i> Mua
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
