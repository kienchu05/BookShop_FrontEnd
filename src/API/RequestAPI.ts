import React from "react";

export default async function req_api(endpoint: string) {
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Cant access ${endpoint}`);
  }
  return response.json();
}
