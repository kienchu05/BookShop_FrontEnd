import React from "react";
import BookModel from "../Models/BookModel";
import req_api from "./RequestAPI";

interface ResultInterface {
  result: BookModel[];
  totalPages: number;
  totalElements: number;
}

export async function findByCategoriesId(
  categoryId: number,
  currentPage: number,
): Promise<ResultInterface> {
  const result: BookModel[] = [];

  const endpoint = `http://localhost:8080/book/search/findByCategories_Id?id=${categoryId}&page=${currentPage}&size=4`;

  const response = await req_api(endpoint);
  const listBooks = response._embedded.books;

  const totalPages = response.page.totalPages;
  const totalElements = response.page.totalElements;

  // Sử dụng Promise.all để lấy thể loại song song cho tất cả sách
  const booksWithCategories = await Promise.all(
    listBooks.map(async (book: any) => {
      let categoryNames = "Chưa có";

      try {
        // Lấy link thể loại từ _links của mỗi cuốn sách
        const categoryUrl = book._links?.categories?.href;
        if (categoryUrl) {
          const catResponse = await fetch(categoryUrl);
          if (catResponse.ok) {
            const catData = await catResponse.json();
            categoryNames = catData._embedded?.categories
              .map((c: any) => c.categoryName || c.name)
              .join(", ");
          }
        }
      } catch (err) {
        console.error("Lỗi khi lấy thể loại:", err);
      }

      return {
        id: book.id,
        name: book.name,
        priceInit: book.priceInit,
        priceFinal: book.priceFinal,
        description: book.description,
        quantity: book.quantity,
        author: book.author,
        avgRating: book.avgRating,
        categoryName: categoryNames, 
      };
    }),
  );

  return {
    result: booksWithCategories,
    totalPages: totalPages,
    totalElements: totalElements,
  };
}
