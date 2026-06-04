import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn trình duyệt reload lại trang
    setError("");

    // Validate cơ bản
    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }

    setIsLoading(true);

    try {
      // LƯU Ý: Chỉnh sửa URL này cho khớp với endpoint đăng nhập trong Controller của bạn
      const response = await fetch("http://localhost:8080/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      // console.log("Dữ liệu Backend trả về:", data);
      if (response.ok) {
        // 1. SỬA LẠI TÊN BIẾN CHO KHỚP VỚI BACKEND (CÓ DẤU GẠCH DƯỚI)
        localStorage.setItem("accessToken", data.access_token);

        if (data.refresh_token) {
          localStorage.setItem("refreshToken", data.refresh_token);
        }

        // 2. LƯU ROLE (CHẮC CHẮN RẰNG BACKEND TRẢ VỀ data.role LÀ "ADMIN")
        localStorage.setItem("userRole", data.role);

        window.location.href = "/";
      } else {
        // Bắt lỗi từ Backend (Ví dụ: Sai mật khẩu, Tài khoản chưa kích hoạt)
        // Spring Boot của bạn có thể trả về thông báo lỗi trong thuộc tính 'message' hoặc 'error'
        setError(data.message || "Tài khoản hoặc mật khẩu không đúng.");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "50px",
        marginBottom: "50px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontWeight: "bold",
          }}
        >
          Đăng nhập
        </h2>

        {/* Vùng hiển thị lỗi */}
        {error && (
          <div
            style={{
              color: "red",
              backgroundColor: "#ffe6e6",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "20px",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* Tên đăng nhập */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              Tên đăng nhập
            </label>
            <input
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 15px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "14px",
                boxSizing: "border-box", // Đảm bảo input không bị tràn viền
              }}
            />
          </div>

          {/* Mật khẩu */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 15px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Nút Đăng nhập */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: isLoading ? "#80e2e5" : "#00c4cc", // Màu cyan giống ảnh của bạn
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: isLoading ? "not-allowed" : "pointer",
              marginTop: "10px",
              transition: "background-color 0.3s",
            }}
          >
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <div
          style={{ textAlign: "center", marginTop: "20px", fontSize: "14px" }}
        >
          Bạn chưa có tài khoản?{" "}
          <Link
            to="/register"
            style={{
              color: "#00c4cc",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
