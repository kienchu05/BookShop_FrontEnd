// utils/fetchWithAuth.ts
import React from "react";

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  // 1. Lấy Access Token từ kho chứa
  let accessToken = localStorage.getItem("accessToken");

  // Thiết lập Headers mặc định, nhét Access Token vào
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  // 2. Gọi API lần 1
  let response = await fetch(url, { ...options, headers });

  // 3. NẾU BỊ BẮT LỖI 401 (UNAUTHORIZED) -> CHẠY LUỒNG REFRESH TOKEN
  if (response.status === 401) {
    console.warn("Access Token có thể đã hết hạn, đang tự động làm mới...");
    const refreshToken = localStorage.getItem("refreshToken");
    // console.log("DEBUG - Refresh Token lấy được là:", refreshToken);
    // Nếu không có cả Refresh Token thì về trang Login
    if (!refreshToken) {
      localStorage.clear();
      window.location.href = "/login";
      return response;
    }

    try {
      // Gọi API đổi Token của Backend.
      // LƯU Ý: Truyền refreshToken vào Header đúng như Backend yêu cầu
      const refreshResponse = await fetch(
        "http://localhost:8080/user/refresh-token",
        {
          method: "POST", // Hoặc GET tùy theo bạn cấu hình ở Controller
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (refreshResponse.ok) {
        // Trích xuất cục JSON { accessToken: "...", refreshToken: "..." } mà Backend trả về
        const data = await refreshResponse.json();
        console.log("Token mới nhận về từ API:", data);

        // Lưu 2 chìa khóa mới vào lại kho
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        // Đổi Header thành Access Token mới tinh
        headers["Authorization"] = `Bearer ${data.accessToken}`;

        // 4. GỌI LẠI ĐÚNG CÁI API BAN ĐẦU VỪA BỊ LỖI
        response = await fetch(url, { ...options, headers });
      } else {
        // Refresh Token bị Backend từ chối (có thể do hết hạn hoặc bị xóa trong DB)
        console.error("Refresh Token không hợp lệ. Vui lòng đăng nhập lại.");
        // const errorText = await refreshResponse.text();
        // console.log(
        //   "DEBUG: Lỗi khi gọi /refresh-token:",
        //   refreshResponse.status,
        //   errorText,
        // );
        localStorage.clear();
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Lỗi mạng khi làm mới token:", error);
      localStorage.clear();
      window.location.href = "/login";
    }
  }
  return response;
};