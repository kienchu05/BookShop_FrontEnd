import React, { useEffect, useState, useRef } from "react";
import BookCard from "./Components/BookProbs";
import BookModel from "../../../Models/BookModel";
import { getAllBooks } from "../../../API/ApiBook";
import Pagination from "../Utils/Pagination";
import { findBooks } from "../../../API/ApiSearchBook";
import { findByCategoriesId } from "../../../API/ApiCategory";
import { useParams } from "react-router-dom";

interface ListProducts {
  search: string;
  searchType: string;
}

function List({ search, searchType }: ListProducts) {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [uploading, setUploading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const { id } = useParams(); // Tên biến 'id' phải KHỚP với 'path="/category/:id"' ở App.tsx
  const categoryId = id ? parseInt(id) : 0;

  const listRef = useRef<HTMLDivElement>(null);
  // Khi người dùng gõ tìm kiếm chữ mới, BẮT BUỘC phải đưa họ về trang 1
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryId]);

  useEffect(() => {
    setUploading(true);
    if (search !== "") {
      // Trường hợp 1: Người dùng đang gõ tìm kiếm (Ưu tiên cao nhất)
      window.scrollTo({ top: 0, behavior: "smooth" });
      findBooks(search, searchType)
        .then((response) => {
          setBooks(response.result);
          setTotalPages(response.totalPages);
          setUploading(false);
        })
        .catch((error) => {
          setError(error.message);
          setUploading(false);
        });
    } else if (categoryId > 0) {
      // Trường hợp 2: Người dùng vừa bấm vào menu Thể loại
      window.scrollTo({ top: 0, behavior: "smooth" });
      findByCategoriesId(categoryId, currentPage - 1)
        .then((response) => {
          setBooks(response.result);
          setTotalPages(response.totalPages);
          setUploading(false);
        })
        .catch((error) => {
          setError(error.message);
          setUploading(false);
        });
    } else {
      // Trường hợp 3: Ở trang chủ, không tìm kiếm, không chọn thể loại -> Lấy tất cả
      window.scrollTo({ top: 0, behavior: "smooth" });
      getAllBooks(currentPage - 1)
        .then((response) => {
          setBooks(response.result);
          setTotalPages(response.totalPages);
          setUploading(false);
        })
        .catch((error) => {
          setError(error.message);
          setUploading(false);
        });
    }
  }, [currentPage, search, categoryId]);

  if (uploading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <h3 className="text-danger">Lỗi kết nối: {error}</h3>
      </div>
    );
  }

  // Trường hợp tìm kiếm không ra kết quả nào
  if (books.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h3>Không tìm thấy cuốn sách nào phù hợp với "{search}"</h3>
        <button
          className="btn btn-outline-info mt-3"
          onClick={() => window.location.reload()}
        >
          Tải lại trang
        </button>
      </div>
    );
  }

  return (
    <div className="container" ref={listRef}>
      <div className="row mt-4">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Chỉ hiện phân trang khi có nhiều hơn 1 trang */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          pageTotal={totalPages}
          pageFunction={setCurrentPage}
        />
      )}
    </div>
  );
}

export default List;
