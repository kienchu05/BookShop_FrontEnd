import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const OAuth2RedirectHandler: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Lấy chuỗi token từ thanh URL xuống
    const token = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (token && refreshToken) {
      //Lưu vào LocalStorage
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);

      // Chuyển hướng user về trang chủ
      navigate("/");
      window.location.reload();
    } else {
      alert("Đăng nhập Google thất bại, vui lòng thử lại!");
      navigate("/login");
    }
  }, [navigate, searchParams]);

  return (
    <div className="text-center mt-5 py-5">
      <div className="spinner-border text-primary" role="status"></div>
      <h4 className="mt-3">Đang xử lý đăng nhập hệ thống...</h4>
    </div>
  );
};

export default OAuth2RedirectHandler;
