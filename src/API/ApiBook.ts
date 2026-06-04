import React from "react";
import BookModel from "../Models/BookModel";
import req_api from "./RequestAPI";

interface ResultInterface {
  result: BookModel[];
  totalPages: number;
  totalElements: number;
}

export async function getAllBooks(
  currentPage: number,
): Promise<ResultInterface> {
  const result: BookModel[] = [];

  const endpoint: string = `http://localhost:8080/book?sort=id,desc&size=4&page=${currentPage}`;

  const response = await req_api(endpoint);
  const listBooks = response._embedded.books;

  const totalPages = response.page.totalPages;
  const totalElements = response.page.totalElements;

  for (const book of listBooks) {
    const categoryUrl = book._links.categories.href;

    // 2. Gọi thêm 1 request để lấy danh sách thể loại của cuốn sách này
    const catResponse = await fetch(categoryUrl);
    const catData = await catResponse.json();

    // 3. Trích xuất tên thể loại (giả sử JSON trả về có mảng categories)
    const categoryNames =
      catData._embedded?.categories.map((c: any) => c.name).join(", ") ||
      "Chưa có";
    result.push({
      id: book.id,
      name: book.name,
      priceInit: book.priceInit,
      priceFinal: book.priceFinal,
      description: book.description,
      quantity: book.quantity,
      author: book.author,
      avgRating: book.avgRating,
      categories: categoryNames,
    });
  }
  return {
    result: result,
    totalPages: totalPages,
    totalElements: totalElements,
  };
}
