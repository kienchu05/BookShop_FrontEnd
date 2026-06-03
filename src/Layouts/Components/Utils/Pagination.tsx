import React from "react";
import BookModel from "../../../Models/BookModel";

interface PaginationInterface {
  currentPage: number;
  pageTotal: number;
  pageFunction: any;
}

const Pagination: React.FC<PaginationInterface> = (props) => {
  const pageLists: number[] = [];

  const startPage = Math.max(1, props.currentPage - 2);
  const endPage = Math.min(props.pageTotal, props.currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pageLists.push(i);
  }
  return (
    <nav aria-label="...">
      <ul className="pagination justify-content-center mt-5 mb-4">
        <li className="page-item" onClick={() => props.pageFunction(1)}>
          <button className="page-link">First</button>
        </li>
        {pageLists.map((page) => (
          <li
            className={`page-item ${props.currentPage === page ? "active" : ""}`}
            key={page}
            onClick={() => props.pageFunction(page)}
          >
            <button className="page-link">{page}</button>
          </li>
        ))}
        <li
          className="page-item"
          onClick={() => props.pageFunction(props.pageTotal)}
        >
          <button className="page-link">Last</button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
