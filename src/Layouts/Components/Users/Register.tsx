import React, { useState } from "react";
import { Link } from "react-router-dom";
import { fetchWithAuth } from "../../../Authentication/fetchWithAuth";

const Register: React.FC = () => {
  // 1. Khai báo State lưu trữ dữ liệu form
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Khai báo State lưu trữ lỗi riêng biệt cho từng phần
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // State hiển thị thông báo thành công
  const [success, setSuccess] = useState<boolean>(false);

  //Theo dõi api có đang dc gọi hay không
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 2. Hàm xử lý khi người dùng gõ vào ô input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Ẩn lỗi chung khi người dùng bắt đầu gõ lại
    if (formError) setFormError(null);
  };

  // 3. Hàm kiểm tra Tên đăng nhập thời gian thực (khi click ra ngoài ô input)
  const handleUsernameBlur = async () => {
    if (!formData.username.trim()) {
      setUsernameError("Vui lòng nhập tên đăng nhập !");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/user/check-username?username=${formData.username}`,
      );
      const isExist = await response.json();

      if (isExist === true) {
        setUsernameError("Tên đăng nhập này đã tồn tại!");
      } else {
        setUsernameError(null);
      }
    } catch (err) {
      console.log("Lỗi kiểm tra username:", err);
    }
  };

  // 4. Hàm kiểm tra Email thời gian thực (khi click ra ngoài ô input)
  const handleEmailBlur = async () => {
    if (!formData.email.trim()) {
      setEmailError("Vui lòng nhập email !");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailError(
        "Vui lòng nhập đúng định dạng email (Ví dụ: name@example.com)!",
      );
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/user/check-email?email=${formData.email}`,
      );
      const isExist = await response.json();

      if (isExist === true) {
        setEmailError("Email này đã được sử dụng!");
      } else {
        setEmailError(null);
      }
    } catch (err) {
      console.log("Lỗi kiểm tra email:", err);
    }
  };
  // 5. Hàm kiểm tra password (khi click ra ngoài ô input)
  const handlePasswordBlur = () => {
    if (!formData.password) {
      setPasswordError("Vui lòng nhập mật khẩu  !");
      return;
    }

    if (formData.password.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự!");
    } else {
      setPasswordError(null);
    }

    // Nếu ô xác nhận mật khẩu ĐÃ CÓ dữ liệu, tiện thể kiểm tra luôn xem có khớp không
    if (formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        setConfirmPasswordError("Mật khẩu xác nhận không khớp!");
      } else {
        setConfirmPasswordError(null);
      }
    }
  };

  // Kiểm tra nhập lại mật khẩu khi rời ô
  const handleConfirmPasswordBlur = () => {
    if (!formData.confirmPassword) {
      setConfirmPasswordError(null);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError("Mật khẩu xác nhận không khớp!");
    } else {
      setConfirmPasswordError(null);
    }
  };

  // Kiểm tra số điện thoại
  const handlePhoneNumberBlur = () => {
    if (!formData.phone.trim()) {
      setPhoneNumberError("Vui lòng nhập số điện thoại!");
      return;
    }

    // Regex kiểm tra số điện thoại Việt Nam (10 số, bắt đầu bằng 03, 05, 07, 08, 09)
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;

    if (!phoneRegex.test(formData.phone)) {
      setPhoneNumberError("Số điện thoại không hợp lệ (VD: 0912345678)!");
    } else {
      setPhoneNumberError(null);
    }
  };

  // 5. Hàm xử lý tổng khi bấm nút Đăng ký
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Kiểm tra chặn đăng ký nếu username hoặc email đang bị lỗi trùng
    if (
      usernameError ||
      emailError ||
      passwordError ||
      confirmPasswordError ||
      phoneNumberError
    ) {
      setFormError("Vui lòng sửa các lỗi thông tin ở trên trước khi tiếp tục.");
      return;
    }

    try {
      // Dữ liệu hợp lệ, gọi API POST để lưu user mới vào database
      const url = "http://localhost:8080/user-account/registerUser";
      // TODO: Viết hàm fetch(URL, { method: 'POST', body: ... }) ở đây
      const response = await fetchWithAuth(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          isActivated: 0,
          activationCode: "",
        }),
      });

      if (!response.ok) {
        // Lấy dữ liệu lỗi từ backend và in ra console để debug
        const errorData = await response.json().catch(() => null);
        console.log("Chi tiết lỗi từ Backend:", errorData);

        let errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại sau.";

        // Bóc tách câu chữ tiếng Việt từ Object JSON
        if (errorData) {
          if (typeof errorData === "string") {
            errorMessage = errorData;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.errors && errorData.errors.length > 0) {
            errorMessage = errorData.errors[0].defaultMessage;
          } else {
            errorMessage = JSON.stringify(errorData);
          }
        }

        // Ném CÂU CHỮ (String) xuống catch, KHÔNG ném Object nữa
        throw new Error(errorMessage);
      }
      setSuccess(true);
      setFormData({
        name: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      if (err.message === "Failed to fetch") {
        setFormError(
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng hoặc thử lại sau!",
        );
      } else {
        // Các lỗi khác từ backend trả về
        setFormError(err.message || "Đã xảy ra lỗi không xác định!");
      }
    } finally {
      // Dù thành công hay thất bại, cuối cùng cũng phải tắt trạng thái Loading đi
      setIsLoading(false);
    }
  };
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-5">
              <h2 className="text-center fw-bold mb-4 text-dark">
                Đăng ký tài khoản
              </h2>

              {/* Hiển thị lỗi chung (Mật khẩu không khớp, lỗi hệ thống...) */}
              {formError && (
                <div className="alert alert-danger py-2">{formError}</div>
              )}

              {/* Hiển thị thông báo thành công */}
              {/* Hiển thị thông báo thành công */}
              {success && (
                <div className="alert alert-success py-3 rounded-3 shadow-sm border-0">
                  <h5 className="alert-heading fw-bold mb-2">
                    <i className="fas fa-check-circle me-2"></i> Đăng ký thành
                    công!
                  </h5>
                  <p className="mb-0">
                    Hệ thống đã gửi một email xác thực đến địa chỉ{" "}
                    <strong>{formData.email}</strong>. Vui lòng kiểm tra hộp thư
                    đến (hoặc mục Spam/Thư rác) và làm theo hướng dẫn để kích
                    hoạt tài khoản của bạn.
                  </p>
                  <hr />
                  <p className="mb-0 small text-muted">
                    Sau khi kích hoạt xong, bạn có thể{" "}
                    <Link to="/login" className="alert-link fw-bold">
                      đăng nhập tại đây
                    </Link>
                    .
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Họ và tên</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="Nhập họ và tên"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    // Đổi màu viền đỏ nếu có lỗi username
                    className={`form-control ${usernameError ? "is-invalid" : ""}`}
                    name="username"
                    placeholder="Viết liền không dấu"
                    value={formData.username}
                    onChange={handleInputChange}
                    onBlur={handleUsernameBlur}
                    required
                  />
                  {/* Hiển thị chữ lỗi màu đỏ */}
                  {usernameError && (
                    <div className="invalid-feedback fw-semibold">
                      {usernameError}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    // Đổi màu viền đỏ nếu có lỗi email
                    className={`form-control ${emailError ? "is-invalid" : ""}`}
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleEmailBlur}
                    required
                  />
                  {/* Hiển thị chữ lỗi màu đỏ */}
                  {emailError && (
                    <div className="invalid-feedback fw-semibold">
                      {emailError}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Số điện thoại
                  </label>
                  <input
                    type="tel" // Dùng type="tel" để trên điện thoại nó hiện bàn phím số
                    className={`form-control ${phoneNumberError ? "is-invalid" : ""}`}
                    name="phone"
                    placeholder="Ví dụ: 0912345678"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handlePhoneNumberBlur} // Gắn sự kiện kiểm tra
                    required
                  />
                  {phoneNumberError && (
                    <div className="invalid-feedback fw-semibold">
                      {phoneNumberError}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Mật khẩu</label>
                  <input
                    type="password"
                    // ĐỔI MÀU VIỀN ĐỎ NẾU CÓ LỖI:
                    className={`form-control ${passwordError ? "is-invalid" : ""}`}
                    name="password"
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handlePasswordBlur}
                    required
                  />
                  {/* HIỂN THỊ CHỮ LỖI MÀU ĐỎ: */}
                  {passwordError && (
                    <div className="invalid-feedback fw-semibold">
                      {passwordError}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    // ĐỔI MÀU VIỀN ĐỎ NẾU CÓ LỖI:
                    className={`form-control ${confirmPasswordError ? "is-invalid" : ""}`}
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={handleConfirmPasswordBlur}
                    required
                  />
                  {/* HIỂN THỊ CHỮ LỖI MÀU ĐỎ: */}
                  {confirmPasswordError && (
                    <div className="invalid-feedback fw-semibold">
                      {confirmPasswordError}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-info text-white w-100 fw-bold py-2"
                  style={{ borderRadius: "10px" }}
                  // Nút bị mờ/khóa nếu đang hiển thị lỗi trùng lặp
                  disabled={
                    isLoading ||
                    usernameError !== null ||
                    emailError !== null ||
                    passwordError !== null ||
                    confirmPasswordError !== null ||
                    phoneNumberError !== null
                  }
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Đang xử lý...
                    </>
                  ) : (
                    "Đăng ký"
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <span className="text-muted">Bạn đã có tài khoản? </span>
                <Link
                  to="/login"
                  className="text-info fw-bold text-decoration-none"
                >
                  Đăng nhập ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
