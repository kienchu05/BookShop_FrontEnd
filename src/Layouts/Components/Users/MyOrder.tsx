import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchWithAuth } from "../../../Authentication/fetchWithAuth";

export interface OrderDetailModel {
  bookName: string;
  quantity: number;
  price: number;
}

export interface OrderModel {
  id: number;
  creationDate: string;
  deliverAddress: string;
  totalPrice: number;
  shippingPrice: number;
  paymentMethod: string;
  deliverMethod: string;
  orderDetails: OrderDetailModel[];
  status: string; // PAID, PENDING, CANCELLED
}

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Tùy chỉnh màu sắc và giao diện cho các thông báo trạng thái
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <span className="badge bg-success px-3 py-2 rounded-pill">
            Đã thanh toán
          </span>
        );
      case "PENDING":
        return (
          <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
            Chờ thanh toán
          </span>
        );
      case "CANCELLED":
        return (
          <span className="badge bg-danger px-3 py-2 rounded-pill">Đã hủy</span>
        );
      default:
        return (
          <span className="badge bg-secondary px-3 py-2 rounded-pill">
            {status}
          </span>
        );
    }
  };

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const response = await fetchWithAuth(
          "http://localhost:8080/order/my-order",
          {
            method: "GET",
          },
        );
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error("Lỗi lấy đơn hàng");
        }
      } catch (error) {
        console.error("Lỗi hệ thống:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  // 2. Hàm xử lý Hủy đơn hàng (Giữ lại đơn, chỉ đổi trạng thái)
  const handleCancelOrder = async (orderId: number) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn hủy đơn hàng này không? Quá trình này không thể hoàn tác.",
      )
    ) {
      return;
    }

    try {
      const response = await fetchWithAuth(
        `http://localhost:8080/order/delete-order/${orderId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        alert("Đã hủy đơn hàng thành công!");
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status: "CANCELLED" } : order,
          ),
        );
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || "Lỗi khi hủy đơn hàng!");
      }
    } catch (error) {
      console.error("Lỗi hủy đơn hàng:", error);
      alert("Đã xảy ra lỗi hệ thống!");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5 py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <h5 className="mt-3 text-muted">Đang tải lịch sử đơn hàng...</h5>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <h2 className="fw-bold mb-4 text-primary">
        <i className="fas fa-box-open me-2"></i> Lịch sử đơn hàng
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4 shadow-sm border-0">
          <img
            src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
            alt="Empty Orders"
            width="120"
            className="mb-3 opacity-50"
          />
          <h5 className="text-muted mb-3">Bạn chưa có đơn hàng nào</h5>
          <Link to="/" className="btn btn-primary rounded-pill px-4">
            Bắt đầu mua sắm
          </Link>
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order.id} className="col-12 mb-4">
              <div className="card shadow-sm border-0 rounded-4">
                {/* Tiêu đề Card: Thông tin chung */}
                <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fw-bold text-dark">
                      Mã đơn: #{order.id}
                    </span>
                    <span className="text-muted ms-3 small">
                      <i className="far fa-clock me-1"></i>
                      {new Date(order.creationDate).toLocaleString("vi-VN")}
                    </span>
                  </div>

                  {/* 3. NÚT HỦY ĐƠN VÀ TRẠNG THÁI */}
                  <div>
                    <span className="me-2">{getStatusLabel(order.status)}</span>

                    {/* Chỉ hiển thị nút khi trạng thái là PENDING hoặc PAID */}
                    {(order.status === "PENDING" ||
                      order.status === "PAID") && (
                      <button
                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        <i className="fas fa-times me-1"></i> Hủy đơn
                      </button>
                    )}
                  </div>
                </div>

                {/* Nội dung Card: Danh sách sách */}
                <div className="card-body p-0">
                  <ul className="list-group list-group-flush">
                    {order.orderDetails.map((detail, idx) => (
                      <li
                        key={idx}
                        className="list-group-item d-flex justify-content-between align-items-center p-3"
                      >
                        <div className="d-flex align-items-center">
                          <div
                            className="bg-light rounded p-2 me-3 text-center"
                            style={{ width: "50px", height: "60px" }}
                          >
                            <i className="fas fa-book text-secondary fs-4 mt-1"></i>
                          </div>
                          <div>
                            <h6 className="mb-1 fw-semibold">
                              {detail.bookName}
                            </h6>
                            <small className="text-muted">
                              x{detail.quantity}
                            </small>
                          </div>
                        </div>
                        <span className="fw-semibold text-danger">
                          {(detail.price * detail.quantity).toLocaleString(
                            "vi-VN",
                          )}
                          đ
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Card: Tổng kết tiền và địa chỉ */}
                <div className="card-footer bg-light border-top-0 rounded-bottom-4 p-3">
                  <div className="row">
                    <div className="col-md-7 border-end">
                      <p className="mb-1 small">
                        <span className="text-muted">Giao đến:</span>{" "}
                        <span className="fw-semibold">
                          {order.deliverAddress}
                        </span>
                      </p>
                      <p className="mb-1 small">
                        <span className="text-muted">Vận chuyển:</span>{" "}
                        {order.deliverMethod}
                      </p>
                      <p className="mb-0 small">
                        <span className="text-muted">Thanh toán:</span>{" "}
                        {order.paymentMethod}
                      </p>
                    </div>
                    <div className="col-md-5 text-end">
                      <div className="d-flex justify-content-end mb-1 small text-muted">
                        <span className="me-3">Phí ship:</span>
                        <span>
                          {order.shippingPrice.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                      <div className="d-flex justify-content-end align-items-center">
                        <span className="me-3 fw-bold">Tổng số tiền:</span>
                        <span className="fs-5 fw-bold text-danger">
                          {order.totalPrice.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
