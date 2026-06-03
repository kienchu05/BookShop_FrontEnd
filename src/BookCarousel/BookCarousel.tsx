import React, { useState, useEffect } from "react";
import BookModel from "../Models/BookModel";
import ImageModel from "../Models/ImageModel";
import { getAllImages } from "../API/ApiImages";
import CarouselItem from "./Carousel";

// =======================================================
// 2. COMPONENT CHA: Quản lý cái khung bao ngoài của thanh trượt
// =======================================================
interface CarouselProps {
  books: BookModel[];
}

const BookCarousel: React.FC<CarouselProps> = ({ books }) => {
  // Nếu chưa có dữ liệu thì không render (hoặc báo lỗi)
  if (!books || books.length === 0) {
    return null;
  }

  // Lấy 3 cuốn đầu tiên để đưa lên thanh trượt
  const carouselBooks = books.slice(0, 4);

  return (
    <div className="container my-5">
      <div
        id="heroBookCarousel"
        className="carousel carousel-dark slide shadow-lg rounded-4 overflow-hidden bg-white border"
        data-bs-ride="carousel"
      >
        {/* Nút điều hướng nhỏ ở dưới (Indicators) */}
        <div className="carousel-indicators mb-1">
          {carouselBooks.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#heroBookCarousel"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-current={index === 0 ? "true" : "false"}
            ></button>
          ))}
        </div>

        {/* Nội dung các Slide (Gọi Component con vào đây) */}
        <div className="carousel-inner">
          {carouselBooks.map((book, index) => (
            <CarouselItem key={book.id} book={book} index={index} />
          ))}
        </div>

        {/* Nút bấm Trái / Phải */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#heroBookCarousel"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#heroBookCarousel"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default BookCarousel;
