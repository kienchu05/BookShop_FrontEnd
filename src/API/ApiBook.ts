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

  for (const book in listBooks) {
    result.push({
      id: listBooks[book].id,
      name: listBooks[book].name,
      priceInit: listBooks[book].priceInit,
      priceFinal: listBooks[book].priceFinal,
      description: listBooks[book].description,
      quantity: listBooks[book].quantity,
      author: listBooks[book].author,
      avgRating: listBooks[book].avgRating,
    });
  }
  return {
    result: result,
    totalPages: totalPages,
    totalElements: totalElements,
  };
}
