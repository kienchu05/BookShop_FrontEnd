import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";

const ActivateAccount = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Đang kích hoạt tài khoản...");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  // Dùng useRef để đánh dấu là "đã gọi API rồi", tránh bị Strict Mode gọi đúp
  const hasFetched = useRef(false);

  // Lấy mã code từ URL
  const activationCode = searchParams.get("activationCode");

  useEffect(() => {
    if (!activationCode) {
      setMessage("Mã kích hoạt không tồn tại!");
      setStatus("error");
      return;
    }

    // Nếu đã fetch rồi thì DỪNG LẠI, không gọi lần 2
    if (hasFetched.current) return;
    hasFetched.current = true;

    // Gọi API tới Backend
    fetch(
      `http://localhost:8080/user/activate-account?activationCode=${activationCode}`,
    )
      .then(async (res) => {
        const textData = await res.text(); // Lấy dữ liệu dạng text thô trước
        let displayMessage = textData;

        try {
          const jsonData = JSON.parse(textData);
          if (jsonData.message) {
            displayMessage = jsonData.message;
          }
        } catch (error) {
        }

        if (res.ok) {
          setMessage(displayMessage);
          setStatus("success");
        } else {
          setMessage(displayMessage);
          setStatus("error");
        }
      })
      .catch(() => {
        setMessage("Có lỗi xảy ra khi kết nối tới server.");
        setStatus("error");
      });
  }, [activationCode]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Thông báo</h1>
      <p
        style={{
          color: status === "error" ? "red" : "green",
          fontSize: "20px",
        }}
      >
        {message}
      </p>
      {status === "success" && <a href="/login">Nhấn vào đây để đăng nhập</a>}
    </div>
  );
};

export default ActivateAccount;
