import React from "react";

function Banner() {
  return (
    <div className="container my-5">
      <div className="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-4 border shadow-lg bg-white">
        {/* Cột chứa nội dung chữ */}
        <div className="col-lg-7 p-3 p-lg-5 pt-lg-3">
          <h1 className="display-4 fw-bold lh-1 text-dark mb-4">
            Khám phá thế giới qua{" "}
            <span className="text-info">từng trang sách</span>
          </h1>
          <p className="lead text-muted mb-4">
            Hàng ngàn tựa sách hấp dẫn đang chờ bạn khám phá. Từ tiểu thuyết
            lãng mạn, sách lập trình công nghệ đến kỹ năng sống.
          </p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3">
            <button
              type="button"
              className="btn btn-info text-white btn-lg px-4 me-md-2 fw-bold rounded-pill shadow-sm"
            >
              <a
                href="#"
                className="btn btn-info text-white rounded-pill px-4 py-2 fw-bold"
              >
                <i className="fa-solid fa-house me-2"></i>
                Đến với trang chủ ngay
              </a>
            </button>
          </div>
        </div>

        {/* Cột chứa hình ảnh minh họa */}
        <div className="col-lg-4 offset-lg-1 p-0 overflow-hidden shadow-lg rounded-4 mb-4 mb-lg-0 d-none d-lg-block">
          {/* Bạn có thể thay link src bên dưới bằng ảnh thực tế của dự án */}
          <img
            className="img-fluid rounded-4"
            src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Banner Book Store"
          />
        </div>
      </div>
    </div>
  );
}

export default Banner;
