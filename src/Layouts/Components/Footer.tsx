import React from "react";

export default function Footer() {
  return (
    <footer className="py-5 container mt-5">
      <div className="row">
        {/* Cột 1 */}
        <div className="col-6 col-md-2 mb-3">
          <h5>Về chúng tôi</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <a href="#" className="nav-link p-0 text-body-secondary">
                Trang chủ
              </a>
            </li>
            <li className="nav-item mb-2">
              <a href="#" className="nav-link p-0 text-body-secondary">
                Hệ thống cửa hàng
              </a>
            </li>
            <li className="nav-item mb-2">
              <a href="#" className="nav-link p-0 text-body-secondary">
                Tuyển dụng
              </a>
            </li>
          </ul>
        </div>

        {/* Cột 2 */}
        <div className="col-6 col-md-2 mb-3">
          <h5>Hỗ trợ</h5>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <a href="#" className="nav-link p-0 text-body-secondary">
                Hướng dẫn mua hàng
              </a>
            </li>
            <li className="nav-item mb-2">
              <a href="#" className="nav-link p-0 text-body-secondary">
                Phương thức thanh toán
              </a>
            </li>
            <li className="nav-item mb-2">
              <a href="#" className="nav-link p-0 text-body-secondary">
                Câu hỏi thường gặp (FAQs)
              </a>
            </li>
          </ul>
        </div>

        {/* Cột Form Đăng ký */}
        <div className="col-md-5 offset-md-3 mb-3">
          <form>
            <h5>Đăng ký nhận bản tin</h5>
            <p>
              Nhận thông báo về sách mới và các chương trình khuyến mãi hàng
              tháng.
            </p>
            <div className="d-flex flex-column flex-sm-row w-100 gap-2">
              <label htmlFor="newsletter1" className="visually-hidden">
                Địa chỉ Email
              </label>
              <input
                id="newsletter1"
                type="email"
                className="form-control"
                placeholder="Nhập email của bạn..."
              />
              <button
                className="btn btn-info text-white text-nowrap flex-shrink-0"
                type="button"
              >
                Đăng ký
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Phần Bản quyền và Mạng xã hội */}
      <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
        <p>&copy; 2026 Book Store, Inc. Bản quyền thuộc về bạn.</p>
        <ul className="list-unstyled d-flex">
          <li className="ms-3">
            <a
              className="link-body-emphasis fs-4"
              href="#"
              aria-label="Twitter"
            >
              <i className="fa-brands fa-twitter"></i>
            </a>
          </li>
          <li className="ms-3">
            <a
              className="link-body-emphasis fs-4"
              href="#"
              aria-label="Instagram"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
          </li>
          <li className="ms-3">
            <a
              className="link-body-emphasis fs-4"
              href="#"
              aria-label="Facebook"
            >
              <i className="fa-brands fa-facebook"></i>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
