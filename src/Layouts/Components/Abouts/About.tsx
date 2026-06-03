import React from "react";

export default function About() {
  return (
    <div className="container py-5">
      {/* 1. Phần Giới thiệu & Hình ảnh (Hero Section) */}
      <div className="row align-items-center mb-5 pb-4 border-bottom">
        <div className="col-lg-6 mb-4 mb-lg-0 pe-lg-5">
          <h2 className="fw-bold mb-4 display-6">
            Hành trình của <span className="text-info">Book Store</span>
          </h2>
          <p className="text-muted fs-5 lh-base">
            Chào mừng bạn đến với không gian tri thức của chúng tôi. Bắt đầu từ
            niềm đam mê công nghệ và sách của nhà sáng lập Chu Việt Kiên, Book
            Store được xây dựng với mục tiêu mang đến trải nghiệm mua sắm tiện
            lợi, thông minh và thân thiện nhất.
          </p>
          <p className="text-muted lh-base">
            Với nền tảng hệ thống vững chắc và giao diện hiện đại, chúng tôi cam
            kết không chỉ bán sách mà còn trao gửi những giá trị tinh thần, giúp
            bạn dễ dàng tìm kiếm những tác phẩm yêu thích chỉ bằng vài cú click
            chuột.
          </p>
          <a
            href="/"
            className="btn btn-info text-white rounded-pill px-4 py-2 mt-3 fw-bold shadow-sm text-decoration-none d-inline-block"
          >
            Khám phá sách ngay <i className="fas fa-arrow-right ms-2"></i>
          </a>
        </div>
        <div className="col-lg-6">
          <img
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Thư viện sách Book Store"
            className="img-fluid rounded-4 shadow-lg"
          />
        </div>
      </div>

      {/* 2. Phần Giá trị cốt lõi (3 cột) */}
      <div className="text-center mb-5">
        <h3 className="fw-bold mb-2">Vì sao chọn chúng tôi?</h3>
        <p className="text-muted">
          Những cam kết mang lại trải nghiệm tốt nhất cho độc giả
        </p>
      </div>

      <div className="row text-center g-4 mb-5">
        {/* Cột 1: Chất lượng */}
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-4 book-card-hover">
            <div className="card-body">
              {/* Vòng tròn chứa icon */}
              <div className="bg-info bg-opacity-10 text-info d-inline-block p-4 rounded-circle mb-3">
                <i className="fas fa-book-open fs-2"></i>
              </div>
              <h5 className="fw-bold">Đa dạng thể loại</h5>
              <p className="text-muted small mb-0">
                Hàng ngàn tựa sách từ văn học, khoa học, đến kỹ năng sống được
                cập nhật liên tục mỗi ngày.
              </p>
            </div>
          </div>
        </div>

        {/* Cột 2: Giao hàng */}
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-4 book-card-hover">
            <div className="card-body">
              <div className="bg-danger bg-opacity-10 text-danger d-inline-block p-4 rounded-circle mb-3">
                <i className="fas fa-truck-fast fs-2"></i>
              </div>
              <h5 className="fw-bold">Giao hàng siêu tốc</h5>
              <p className="text-muted small mb-0">
                Hệ thống xử lý đơn hàng tự động, đóng gói cẩn thận 3 lớp và giao
                đến tận tay bạn nhanh chóng.
              </p>
            </div>
          </div>
        </div>

        {/* Cột 3: Hỗ trợ */}
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm rounded-4 p-4 book-card-hover">
            <div className="card-body">
              <div className="bg-success bg-opacity-10 text-success d-inline-block p-4 rounded-circle mb-3">
                <i className="fas fa-headset fs-2"></i>
              </div>
              <h5 className="fw-bold">Hỗ trợ 24/7</h5>
              <p className="text-muted small mb-0">
                Đội ngũ chăm sóc khách hàng luôn sẵn sàng lắng nghe và giải đáp
                mọi thắc mắc của bạn bất cứ lúc nào.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
