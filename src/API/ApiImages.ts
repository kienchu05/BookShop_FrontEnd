import React from "react";
import req_api from "./RequestAPI";
import ImageModel from "../Models/ImageModel";

export async function getAllImages(id: number): Promise<ImageModel[]> {
  const result: ImageModel[] = [];

  const endpoint: string = `http://localhost:8080/book/${id}/images?sort=id,desc`;

  const response = await req_api(endpoint);
  const listImages = response._embedded.images;

  for (const image in listImages) {
    result.push({
      id: listImages[image].id,
      name: listImages[image].name,
      isAvatar: listImages[image].isAvatar,
      linkToImage: listImages[image].linkToImage,
      dataImage: listImages[image].dataImage,
    });
  }

  console.log("Dữ liệu nhận được là : ", listImages);

  return result;
}
