import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../../Authentication/fetchWithAuth";

export interface CartItemModel {
  cartItemId: number;
  bookId: number;
  bookName: string;
  priceFinal: number;
  quantity: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Tải dữ liệu giỏ hàng khi vào trang
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

  useEffect(() => {
    fetchCart();
  }, []);

  // 2. Cập nhật số lượng (+ / -)
  const handleUpdateQuantity = async (
    cartItemId: number,
    currentQuantity: number,
    change: number,
  ) => {
    const newQuantity = currentQuantity + change;

    // Nếu giảm xuống 0, gọi hàm xóa
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }

    try {
      const response = await fetchWithAuth(
        `http://localhost:8080/cart/update/${cartItemId}?quantity=${newQuantity}`,
        {
          method: "PUT",
        },
      );
      if (response.ok) {
        // Cập nhật lại UI ngay lập tức mà không cần gọi lại API GET
        setCartItems(
          cartItems.map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, quantity: newQuantity }
              : item,
          ),
        );
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || "Không thể cập nhật số lượng!");
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
    }
  };

  // 3. Xóa một món khỏi giỏ
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
        // Lọc bỏ item đã xóa khỏi state
        setCartItems(
          cartItems.filter((item) => item.cartItemId !== cartItemId),
        );
      }
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
    }
  };

  // 4. Tính tổng tiền toàn bộ giỏ hàng
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.priceFinal * item.quantity,
      0,
    );
  };

  if (loading)
    return (
      <div className="text-center mt-5 py-5">
        <h4>Đang tải giỏ hàng...</h4>
      </div>
    );

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
          {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
          <div className="col-lg-8 mb-4">
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

          {/* CỘT PHẢI: TỔNG KẾT ĐƠN HÀNG */}
          <div className="col-lg-4">
            <div
              className="card shadow-sm border-0 rounded-4"
              style={{ top: "50px" }}
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
                  <span className="fw-semibold text-success">Miễn phí</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4 align-items-center">
                  <span className="fw-bold fs-5">Tổng cộng:</span>
                  <span className="fw-bold fs-4 text-danger">
                    {calculateTotal().toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <button
                  className="btn btn-success w-100 fw-bold py-2 fs-5 rounded-pill shadow-sm"
                  onClick={() => navigate("/checkout")}
                >
                  Tiến hành thanh toán{" "}
                  <i className="fas fa-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
