import { fetchWithAuth } from "../../../Authentication/fetchWithAuth";
import React, { useState, useEffect } from "react";

const UserProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Thêm state để quản lý chế độ Edit
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    purchaseAddress: "",
    deliverAddress: "",
    gender: "",
  });

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const fetchMyProfile = async () => {
    try {
      const response = await fetchWithAuth(
        "http://localhost:8080/user/my-profile",
        {
          method: "GET",
        },
      );

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
         console.log("Dữ liệu hồ sơ nhận về:", data);
        // Khởi tạo dữ liệu cho form sửa
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          address: data.address || "",
          purchaseAddress: data.purchaseAddress || "",
          deliverAddress: data.deliverAddress || "",
          gender: data.gender || "",
        });
      } else {
        console.error("Không thể tải hồ sơ");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitUpdate = async () => {
    try {
      const response = await fetchWithAuth(
        `http://localhost:8080/user/updateUser`,
        {
          method: "PUT",
          body: JSON.stringify(formData), // fetchWithAuth tự thêm header Content-Type
        },
      );

      if (response.ok) {
        alert("Cập nhật thông tin thành công!");
        setIsEditing(false); // Đóng form
        fetchMyProfile(); // Tải lại dữ liệu mới từ backend
      } else {
        alert("Cập nhật thất bại, vui lòng thử lại.");
        // console.log("Lỗi khi cập nhật:", response.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("Đã xảy ra lỗi hệ thống!");
    }
  };

  if (loading) return <div className="text-center mt-5">Đang tải hồ sơ...</div>;
  if (!profile)
    return <div className="text-center mt-5">Không có dữ liệu hồ sơ.</div>;

  return (
    <div className="container mt-5 mb-5">
      {/* HEADER: Tiêu đề và nút chuyển đổi chế độ */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0 text-dark">
          {isEditing ? (
            <span className="text-success">+ CẬP NHẬT THÔNG TIN HỒ SƠ</span>
          ) : (
            "Hồ sơ của tôi"
          )}
        </h2>
        {!isEditing && (
          <button
            className="btn btn-outline-primary fw-semibold shadow-sm"
            onClick={() => setIsEditing(true)}
          >
            <i className="fas fa-edit me-2"></i>Chỉnh sửa hồ sơ
          </button>
        )}
      </div>

      <div
        className="card shadow-sm p-4 border-0"
        style={{ backgroundColor: "#fdfdfd" }}
      >
        {/* --- CHẾ ĐỘ XEM (READ-ONLY) --- */}
        {!isEditing ? (
          <div className="row">
            <div className="col-md-6 mb-4">
              <span className="text-muted d-block mb-1">Họ và tên</span>
              <strong className="fs-5">{profile.name}</strong>
            </div>
            <div className="col-md-6 mb-4">
              <span className="text-muted d-block mb-1">Username</span>
              <strong className="fs-5">{profile.username}</strong>
            </div>
            <div className="col-md-6 mb-4">
              <span className="text-muted d-block mb-1">Email</span>
              <strong className="fs-5">{profile.email}</strong>
            </div>
            <div className="col-md-6 mb-4">
              <span className="text-muted d-block mb-1">Số điện thoại</span>
              <strong className="fs-5">{profile.phone}</strong>
            </div>
            <div className="col-md-6 mb-4">
              <span className="text-muted d-block mb-1">Giới tính</span>
              <strong className="fs-5">
                {profile.gender || "Chưa cập nhật"}
              </strong>
            </div>
            <div className="col-md-6 mb-4">
              <span className="text-muted d-block mb-1">Địa chỉ</span>
              <strong className="fs-5">
                {profile.address || "Chưa cập nhật"}
              </strong>
            </div>
            <div className="col-md-6 mb-4">
              <span className="text-muted d-block mb-1">
                Địa chỉ thanh toán (mua hàng)
              </span>
              <strong className="fs-5">
                {profile.purchaseAddress || "Chưa cập nhật"}
              </strong>
            </div>
            <div className="col-md-6 mb-4">
              <span className="text-muted d-block mb-1">Địa chỉ giao hàng</span>
              <strong className="fs-5">
                {profile.deliverAddress || "Chưa cập nhật"}
              </strong>
            </div>
          </div>
        ) : (
          /* --- CHẾ ĐỘ SỬA (FORM UPDATE) --- */
          <div>
            <div className="text-center mb-4">
              <h5 className="text-muted">CẬP NHẬT HỒ SƠ: "{profile.name}"</h5>
            </div>

            <div className="row">
              {/* Họ tên (Cho phép sửa) */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Họ và tên</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên..."
                />
              </div>

              {/* Username (Khóa) */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Username</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={profile.username}
                  disabled
                />
              </div>

              {/* Email (Khóa - Không cho sửa vì liên quan đăng nhập/bảo mật) */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control bg-light"
                  value={profile.email}
                  disabled
                />
              </div>

              {/* Số điện thoại (Cho phép sửa) */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Số điện thoại</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại..."
                />
              </div>

              {/* Giới tính (Dùng thẻ Select dropdown) */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Giới tính</label>
                <select
                  className="form-select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Chọn giới tính...</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              {/* Địa chỉ chung */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  Địa chỉ thường trú
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ..."
                />
              </div>

              {/* Địa chỉ thanh toán */}
              <div className="col-md-6 mb-4">
                <label className="form-label fw-semibold">
                  Địa chỉ thanh toán (mua hàng)
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="purchaseAddress"
                  value={formData.purchaseAddress}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ thanh toán..."
                />
              </div>

              {/* Địa chỉ giao hàng */}
              <div className="col-md-6 mb-4">
                <label className="form-label fw-semibold">
                  Địa chỉ giao hàng
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="deliverAddress"
                  value={formData.deliverAddress}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ giao hàng..."
                />
              </div>
            </div>

            {/* Nút hành động */}
            <div className="d-flex justify-content-center gap-3 mt-3">
              <button
                className="btn btn-outline-secondary px-4 fw-semibold"
                onClick={() => {
                  setIsEditing(false);
                  // Trả lại form data như cũ nếu ấn hủy
                  setFormData({
                    name: profile.name || "",
                    phone: profile.phone || "",
                    address: profile.address || "",
                    purchaseAddress: profile.purchaseAddress || "",
                    deliverAddress: profile.deliverAddress || "",
                    gender: profile.gender || "",
                  });
                }}
              >
                Hủy bỏ
              </button>
              <button
                className="btn btn-success px-4 fw-semibold"
                onClick={handleSubmitUpdate}
              >
                <i className="fas fa-save me-2"></i>Cập nhật
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
