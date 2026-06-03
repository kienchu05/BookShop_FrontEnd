import React from "react";
import req_api from "./RequestAPI";
import RatingModel from "../Models/RatingModel";

export async function getRatingById(id: number): Promise<RatingModel[]> {
  const result: RatingModel[] = [];

  const endpoint: string = `http://localhost:8080/book/${id}/ratingBooks?sort=id,desc`;

  const response = await req_api(endpoint);
  const listRatings = response._embedded.ratingBooks;

  // Trong file ApiRating.ts
  for (const rating of listRatings) {
    result.push({
      id: rating.id,
      comment: rating.comment,
      rate: rating.rating,
      book_id: id,
      user_id: rating.userId || rating.user_id || 0,
    });
  }

  return result;
}
