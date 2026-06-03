import React, { useState, useEffect } from "react";
import RatingModel from "../../../Models/RatingModel";
import { getRatingById } from "../../../API/ApiRating";

const ReviewItem: React.FC<{ review: RatingModel }> = ({ review }) => {
  const [userName, setUserName] = useState(`Khách hàng #${review.user_id}`);

  useEffect(() => {
    if (review.id) {
      fetch(`http://localhost:8080/rating/${review.id}/userAccount`)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Không tìm thấy user");
        })
        .then((userData) => {
          const fullName = userData.name;
          if (fullName) setUserName(fullName);
        })
        .catch((err) => console.log("Lỗi lấy user:", err));
    }
  }, [review.id]);

  return (
    <div className="d-flex mb-4 border-bottom pb-3">
      {/* Avatar tự động lấy chữ cái đầu của Tên */}
      <div className="me-3">
        <div
          className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold text-uppercase"
          style={{ width: "50px", height: "50px" }}
        >
          {userName.charAt(0)}
        </div>
      </div>

      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-1">
          {/* TÊN ĐÃ ĐƯỢC CẬP NHẬT TỪ API */}
          <h6 className="fw-bold mb-0">{userName}</h6>
          <span className="text-muted small">Mới đây</span>
        </div>

        {/* HIỂN THỊ SAO ĐÃ SỬA */}
        <div className="mb-2 small">
          {[1, 2, 3, 4, 5].map((star) => (
            <i
              key={star}
              className={`fas fa-star ${star <= review.rate ? "text-warning" : "text-muted opacity-25"}`}
            ></i>
          ))}
        </div>

        <p className="text-secondary mb-0">{review.comment}</p>
      </div>
    </div>
  );
};

export default ReviewItem;
