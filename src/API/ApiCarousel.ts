import React from "react";
import req_api from "./RequestAPI";
import BookModel from "../Models/BookModel";

interface BookModelInterface {
  result: BookModel[];
}

export async function getBooksForCarousel(): Promise<BookModel[]> {
  const result: BookModel[] = [];

  const endpoint: string = "http://localhost:8080/book?sort=id,desc&size=3";

  const response = await req_api(endpoint);
  const listBooks = response._embedded.books;

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
  return result;
}
