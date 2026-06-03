import req_api from "./RequestAPI";
import BookModel from "../Models/BookModel";

export async function getBookById(id: number): Promise<BookModel | null> {
  const endpoint: string = `http://localhost:8080/book/${id}`;

  try {
    // Gọi API
    const response = await req_api(endpoint);

    // Kiểm tra xem response có dữ liệu không
    if (!response) {
      throw new Error("Không tìm thấy sách");
    }

    return {
      id: id,
      name: response.name,
      author: response.author,
      priceInit: response.priceInit,
      priceFinal: response.priceFinal,
      description: response.description,
      quantity: response.quantity,
      avgRating: response.avgRating,
    };
  } catch (error) {
    console.error("Lỗi khi gọi API sách:", error);
    return null;
  }
}
