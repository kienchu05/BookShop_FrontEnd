import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchWithAuth } from "../../../Authentication/fetchWithAuth";
import { toast } from "react-toastify";

const VNPayReturn: React.FC = () => {
  const [statusMessage, setStatusMessage] = useState(
    "Đang xác thực giao dịch từ VNPay...",
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (isSuccess) {
        toast.success(
          "Thanh toán thành công! Đơn hàng của bạn đã được cập nhật.",
          {
            position: "top-right",
            autoClose: 5000,
          },
        );
      } else {
        toast.error("Thanh toán thất bại! Vui lòng kiểm tra lại đơn hàng.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
  }, [loading, isSuccess]);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const rawUrl = window.location.href;
        const questionMarkIndex = rawUrl.indexOf("?");

        if (questionMarkIndex === -1) {
          setIsSuccess(false);
          setStatusMessage(
            "Không tìm thấy dữ liệu giao dịch từ VNPay trả về trên thanh địa chỉ!",
          );
          setLoading(false);
          return;
        }

        const queryParams = rawUrl.substring(questionMarkIndex);

        const response = await fetchWithAuth(
          `http://localhost:8080/checkout/vn-pay${queryParams}`,
          { method: "GET" },
        );

        const data = await response.json();
        if (response.ok) {
          setIsSuccess(true);
          setStatusMessage(
            "🎉 Thanh toán đơn hàng qua ví điện tử VNPay thành công! Cảm ơn bạn đã lựa chọn dịch vụ của chúng tôi.",
          );
        } else {
          setIsSuccess(false);
          setStatusMessage(
            data.message ||
              "Giao dịch thất bại hoặc đã xảy ra lỗi trong quá trình xử lý.",
          );
        }
      } catch (error) {
        console.error(error);
        setStatusMessage("Lỗi kết nối đến hệ thống xác thực đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5 py-5">
        <div className="spinner-border text-success" role="status"></div>
        <h5 className="mt-3 text-muted">Đang xử lý kết quả thanh toán...</h5>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0 rounded-4 p-5">
            {isSuccess ? (
              <div className="text-success mb-4">
                <i className="fas fa-check-circle fa-5x"></i>
              </div>
            ) : (
              <div className="text-danger mb-4">
                <i className="fas fa-times-circle fa-5x"></i>
              </div>
            )}

            <h3 className="fw-bold mb-3">
              {isSuccess ? "Thành Công" : "Thất Bại"}
            </h3>
            <p className="text-muted mb-4 fs-6" style={{ lineHeight: 1.6 }}>
              {statusMessage}
            </p>

            {/* PHẦN ĐÃ CHỈNH SỬA: Nút điều hướng chuyên nghiệp */}
            {isSuccess ? (
              <div className="d-grid gap-3 d-md-flex justify-content-md-center">
                <Link
                  to="/orders"
                  className="btn btn-outline-success rounded-pill px-4 py-2 fw-bold"
                >
                  <i className="fas fa-receipt me-2"></i> Xem đơn hàng
                </Link>
                <Link
                  to="/"
                  className="btn btn-success rounded-pill px-4 py-2 fw-bold"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            ) : (
              <div className="d-grid gap-2">
                <Link
                  to="/cart"
                  className="btn btn-danger rounded-pill py-2 fw-bold"
                >
                  <i className="fas fa-undo me-2"></i> Thử thanh toán lại
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VNPayReturn;
