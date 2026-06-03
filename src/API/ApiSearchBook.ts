import React from "react";
import BookModel from "../Models/BookModel";
import req_api from "./RequestAPI";

interface ResultInterface {
  result: BookModel[];
  totalPages: number;
  totalElements: number;
}

export async function findBooks(
  search: string,
  searchType: string,
): Promise<ResultInterface> {
  const result: BookModel[] = [];

  let endpoint: string;

  if (search === "") {
    endpoint = "http://localhost:8080/book?sort=id,desc&size=4&page=0";
  } else {
    // KIỂM TRA LOẠI TÌM KIẾM ĐỂ GỌI ĐÚNG API
    if (searchType === "author") {
      endpoint = `http://localhost:8080/book/search/findByAuthorContainingIgnoreCase?author=${search}&page=0&size=4`;
    } else {
      endpoint = `http://localhost:8080/book/search/findByNameContainingIgnoreCase?name=${search}&page=0&size=4`;
    }
  }

  const response = await req_api(endpoint);
  const listBooks = response._embedded.books;

  const totalPages = response.page.totalPages;
  const totalElements = response.page.totalElements;

  // ĐÃ ĐỔI "in" THÀNH "of" ĐỂ CODE CHẠY CHUẨN XÁC VÀ RÚT GỌN HƠN
  for (const book of listBooks) {
    result.push({
      id: book.id,
      name: book.name,
      priceInit: book.priceInit,
      priceFinal: book.priceFinal,
      description: book.description,
      quantity: book.quantity,
      author: book.author,
      avgRating: book.avgRating,
    });
  }

  return {
    result: result,
    totalPages: totalPages,
    totalElements: totalElements,
  };
}
