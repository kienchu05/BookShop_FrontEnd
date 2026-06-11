import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../../Authentication/fetchWithAuth"; // Nhớ kiểm tra lại đường dẫn này cho đúng

// --- CÁC INTERFACE ĐỊNH NGHĨA KIỂU DỮ LIỆU ---
export interface CartItemModel {
  cartItemId: number;
  bookId: number;
  bookName: string;
  priceFinal: number;
  quantity: number;
}

export interface DeliverModel {
  deliverId: number;
  nameDeliver: string;
  deliverPrice: number;
  description: string;
}

export interface PaymentModel {
  paymentId: number;
  namePayment: string;
  description: string;
}

const Cart: React.FC = () => {
  const navigate = useNavigate();

  // --- STATE QUẢN LÝ GIỎ HÀNG ---
  const [cartItems, setCartItems] = useState<CartItemModel[]>([]);
  const [loading, setLoading] = useState(true);

  // --- STATE QUẢN LÝ MODAL THANH TOÁN ---
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveries, setDeliveries] = useState<DeliverModel[]>([]);
  const [payments, setPayments] = useState<PaymentModel[]>([]);
  const [shippingFee, setShippingFee] = useState(0);

  const [checkoutData, setCheckoutData] = useState({
    purchaseAddress: "",
    deliverAddress: "",
    paymentId: 1,
    deliverId: 1,
  });

  // --- 1. GỌI API LẤY DỮ LIỆU KHI VÀO TRANG ---
  useEffect(() => {
    // Lấy danh sách giỏ hàng
    const fetchCart = async () => {
      try {
        const response = await fetchWithAuth(
          "http://localhost:8080/cart/my-cart",
          {
            method: "GET",
          },
        );
        if (response.ok) {
          const data = await response.json();
          setCartItems(data);
        }
      } catch (error) {
        console.error("Lỗi lấy giỏ hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    // Lấy danh sách Vận chuyển & Thanh toán cho Modal
    const fetchCheckoutInfo = async () => {
      try {
        const [resDeliver, resPayment] = await Promise.all([
          fetchWithAuth("http://localhost:8080/checkout/deliveries", {
            method: "GET",
          }),
          fetchWithAuth("http://localhost:8080/checkout/payments", {
            method: "GET",
          }),
        ]);

        if (resDeliver.ok && resPayment.ok) {
          const dataDeliver = await resDeliver.json();
          const dataPayment = await resPayment.json();

          setDeliveries(dataDeliver);
          setPayments(dataPayment);
          console.log("Dữ liệu Vận chuyển:", dataDeliver);
          console.log("Dữ liệu Thanh toán:", dataPayment);
          if (dataDeliver.length > 0 && dataPayment.length > 0) {
            const defaultDeliverId = dataDeliver[0].deliverId;
            const defaultPaymentId = dataPayment[0].paymentId;

            setCheckoutData((prev) => ({
              ...prev,
              deliverId: defaultDeliverId,
              paymentId: defaultPaymentId,
            }));
            setShippingFee(dataDeliver[0].deliverPrice);
          }
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin thanh toán:", error);
      }
    };

    fetchCart();
    fetchCheckoutInfo();
  }, []);

  // --- 2. CÁC HÀM XỬ LÝ LOGIC GIỎ HÀNG ---
  const handleUpdateQuantity = async (
    cartItemId: number,
    currentQuantity: number,
    change: number,
  ) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }

    try {
      const response = await fetchWithAuth(
        `http://localhost:8080/cart/update/${cartItemId}?quantity=${newQuantity}`,
        { method: "PUT" },
      );
      if (response.ok) {
        setCartItems(
          cartItems.map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, quantity: newQuantity }
              : item,
          ),
        );
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || "Không thể cập nhật số lượng!");
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?"))
      return;

    try {
      const response = await fetchWithAuth(
        `http://localhost:8080/cart/remove/${cartItemId}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        setCartItems(
          cartItems.filter((item) => item.cartItemId !== cartItemId),
        );
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa TOÀN BỘ giỏ hàng không?"))
      return;

    try {
      const response = await fetchWithAuth(
        "http://localhost:8080/cart/clear-cart",
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        setCartItems([]);
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      console.error("Lỗi khi xóa toàn bộ giỏ hàng:", error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.priceFinal * item.quantity,
      0,
    );
  };

  // --- 3. CÁC HÀM XỬ LÝ THANH TOÁN (MODAL) ---
  const handleCheckoutChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setCheckoutData({ ...checkoutData, [name]: value });

    // Khi người dùng đổi đơn vị vận chuyển, tính lại phí ship
    if (name === "deliverId") {
      const selectedDeliver = deliveries.find(
        (d) => d.deliverId === Number(value),
      );
      if (selectedDeliver) {
        setShippingFee(selectedDeliver.deliverPrice);
      }
    }
  };

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetchWithAuth(
        "http://localhost:8080/order/checkout",
        {
          method: "POST",
          body: JSON.stringify({
            purchaseAddress: checkoutData.purchaseAddress,
            deliverAddress: checkoutData.deliverAddress,
            paymentId: Number(checkoutData.paymentId),
            deliverId: Number(checkoutData.deliverId),
          }),
        },
      );

      if (response.ok) {
        const result = await response.json();

        // PHÂN NHÁNH 1: NẾU CHỌN VNPAY -> CHUYỂN HƯỚNG SANG CỔNG THANH TOÁN
        if (result.status === "PAYMENT_REDIRECT") {
          setShowModal(false);
          setCartItems([]);
          window.dispatchEvent(new Event("cartUpdated"));
          // LỆNH QUAN TRỌNG NHẤT: Ép trình duyệt rời khỏi React để sang VNPay
          window.location.href = result.url;
          return;
        }

        // PHÂN NHÁNH 2: NẾU LÀ COD -> THÔNG BÁO VÀ CHUYỂN VỀ TRANG CHỦ
        alert("🎉 Đặt hàng thành công! Cảm ơn bạn đã mua sắm.");
        setShowModal(false);
        setCartItems([]);
        window.dispatchEvent(new Event("cartUpdated"));
        navigate("/");
      } else {
        const err = await response.text();
        alert("Lỗi đặt hàng: " + err);
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi hệ thống!");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- GIAO DIỆN CHÍNH ---
  if (loading) {
    return (
      <div className="text-center mt-5 py-5">
        <div className="spinner-border text-info" role="status"></div>
        <h5 className="mt-3 text-muted">Đang tải giỏ hàng...</h5>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <h2 className="fw-bold mb-4 text-primary">
        <i className="fas fa-shopping-cart me-2"></i> Giỏ hàng của bạn
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4 shadow-sm border-0">
          <img
            src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
            alt="Empty Cart"
            width="120"
            className="mb-3 opacity-50"
          />
          <h4 className="text-muted mb-3">Giỏ hàng của bạn đang trống</h4>
          <Link
            to="/"
            className="btn btn-info text-white fw-bold px-4 rounded-pill"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="row">
          {/* ================= CỘT TRÁI: BẢNG GIỎ HÀNG ================= */}
          <div className="col-lg-8 mb-4">
            <div className="d-flex justify-content-end mb-2">
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={handleClearCart}
              >
                <i className="fas fa-trash-alt me-1"></i> Xóa tất cả
              </button>
            </div>
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-0">
                <table className="table table-hover align-middle mb-0 text-center">
                  <thead className="table-light">
                    <tr>
                      <th className="text-start ps-4">Sản phẩm</th>
                      <th>Đơn giá</th>
                      <th>Số lượng</th>
                      <th>Thành tiền</th>
                      <th>Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, index) => (
                      <tr key={index}>
                        <td className="text-start ps-4 fw-semibold text-dark">
                          <Link
                            to={`/book/${item.bookId}`}
                            className="text-decoration-none text-dark"
                          >
                            {item.bookName}
                          </Link>
                        </td>
                        <td className="text-danger fw-semibold">
                          {item.priceFinal.toLocaleString("vi-VN")}đ
                        </td>
                        <td>
                          <div
                            className="input-group input-group-sm mx-auto"
                            style={{ width: "100px" }}
                          >
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.cartItemId,
                                  item.quantity,
                                  -1,
                                )
                              }
                            >
                              -
                            </button>
                            <input
                              type="text"
                              className="form-control text-center bg-white"
                              value={item.quantity}
                              readOnly
                            />
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.cartItemId,
                                  item.quantity,
                                  1,
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="text-danger fw-bold">
                          {(item.priceFinal * item.quantity).toLocaleString(
                            "vi-VN",
                          )}
                          đ
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-danger border-0"
                            onClick={() => handleRemoveItem(item.cartItemId)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ================= CỘT PHẢI: TỔNG KẾT ĐƠN HÀNG ================= */}
          <div className="col-lg-4">
            <div
              className="card shadow-sm border-0 rounded-4 sticky-top mt-lg-0 mt-4"
              style={{ top: "100px", zIndex: 900 }}
            >
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3 border-bottom pb-2">
                  Tổng hóa đơn
                </h5>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Tạm tính:</span>
                  <span className="fw-semibold">
                    {calculateTotal().toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Phí giao hàng:</span>
                  <span className="fw-semibold text-success">
                    Tính khi thanh toán
                  </span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4 align-items-center">
                  <span className="fw-bold fs-5">Tạm tính:</span>
                  <span className="fw-bold fs-4 text-danger">
                    {calculateTotal().toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <button
                  className="btn btn-success w-100 fw-bold py-2 fs-5 rounded-pill shadow-sm"
                  onClick={() => setShowModal(true)}
                >
                  Tiến hành thanh toán{" "}
                  <i className="fas fa-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL THANH TOÁN OVERLAY ================= */}
      {showModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header bg-light border-bottom-0 rounded-top-4">
                <h5 className="modal-title fw-bold text-primary">
                  <i className="fas fa-clipboard-check me-2"></i>Xác nhận đơn
                  hàng
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <form onSubmit={submitOrder}>
                <div className="modal-body p-4">
                  <div className="row">
                    {/* Cột trái: Form thông tin */}
                    <div className="col-md-7 border-end pe-4">
                      <h6 className="fw-bold mb-3">Thông tin giao hàng</h6>
                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">
                          Địa chỉ người mua (Hóa đơn)
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="purchaseAddress"
                          value={checkoutData.purchaseAddress}
                          onChange={handleCheckoutChange}
                          required
                          placeholder="Nhập địa chỉ của bạn..."
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">
                          Địa chỉ nhận hàng (Giao tới)
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="deliverAddress"
                          value={checkoutData.deliverAddress}
                          onChange={handleCheckoutChange}
                          required
                          placeholder="Nhập địa chỉ nhận hàng..."
                        />
                      </div>

                      <div className="row mt-4">
                        <div className="col-12 col-xl-6 mb-3">
                          <label className="form-label fw-semibold small">
                            Đơn vị vận chuyển
                          </label>
                          <select
                            className="form-select form-select-sm"
                            name="deliverId"
                            value={checkoutData.deliverId}
                            onChange={handleCheckoutChange}
                          >
                            {deliveries.map((d) => (
                              <option key={d.deliverId} value={d.deliverId}>
                                {d.nameDeliver} (
                                {d.deliverPrice.toLocaleString("vi-VN")}đ)
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-12 col-xl-6 mb-3">
                          <label className="form-label fw-semibold small">
                            Thanh toán
                          </label>
                          <select
                            className="form-select form-select-sm"
                            name="paymentId"
                            value={checkoutData.paymentId}
                            onChange={handleCheckoutChange}
                          >
                            {payments.map((p) => (
                              <option key={p.paymentId} value={p.paymentId}>
                                {p.namePayment}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Cột phải: Tóm tắt sách */}
                    <div className="col-md-5 ps-4">
                      <h6 className="fw-bold mb-3">
                        Sản phẩm ({cartItems.length})
                      </h6>
                      <div
                        className="overflow-auto mb-3"
                        style={{ maxHeight: "150px" }}
                      >
                        <ul className="list-group list-group-flush">
                          {cartItems.map((item, idx) => (
                            <li
                              key={idx}
                              className="list-group-item px-0 py-1 d-flex justify-content-between align-items-center border-0"
                            >
                              <span
                                className="text-truncate"
                                style={{
                                  maxWidth: "150px",
                                  fontSize: "0.85rem",
                                }}
                              >
                                {item.bookName}
                              </span>
                              <span
                                className="fw-semibold text-danger"
                                style={{ fontSize: "0.85rem" }}
                              >
                                x{item.quantity}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <hr className="my-2" />
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted small">Tạm tính:</span>
                        <span className="fw-semibold small">
                          {calculateTotal().toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-2 border-bottom pb-2">
                        <span className="text-muted small">
                          Phí vận chuyển:
                        </span>
                        <span className="fw-semibold small text-success">
                          + {shippingFee.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold">Tổng thanh toán:</span>
                        <span className="fw-bold fs-5 text-danger">
                          {(calculateTotal() + shippingFee).toLocaleString(
                            "vi-VN",
                          )}
                          đ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light border-top-0 rounded-bottom-4">
                  <button
                    type="button"
                    className="btn btn-secondary px-4 rounded-pill"
                    onClick={() => setShowModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success px-4 rounded-pill fw-bold"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Đang xử lý...
                      </>
                    ) : (
                      "Chốt đơn ngay"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
