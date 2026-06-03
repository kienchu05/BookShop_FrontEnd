import React, { useState, useEffect } from "react";
import RatingModel from "../../../../Models/RatingModel";
import { getRatingById } from "../../../../API/ApiRating";
import ReviewItem from "../ReviewItem";

interface RatingBookProps {
  bookId: number;
}

const RatingBook: React.FC<RatingBookProps> = ({ bookId }) => {
  // 1. Khai báo các State
  const [ratingInput, setRatingInput] = useState(5); // Dùng cho phần form nhập
  const [reviewText, setReviewText] = useState(""); // Dùng cho phần form nhập
  const [reviews, setReviews] = useState<RatingModel[]>([]); // Dùng RatingModel chuẩn

  // 2. Viết phần useEffect gọi dữ liệu
  useEffect(() => {
    if (bookId > 0) {
      getRatingById(bookId)
        .then((data) => {
          setReviews(data);
        })
        .catch((error) => console.log("Lỗi tải đánh giá:", error));
    }
  }, [bookId]);

  // 3. Xử lý khi người dùng gửi form
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Gửi đánh giá cho sách ID ${bookId}: ${ratingInput} sao - Nội dung: "${reviewText}"`,
    );

    // Logic POST JSON sẽ ở đây (gửi ratingInput và reviewText)

    setReviewText("");
    setRatingInput(5);
  };

  return (
    <div className="row mt-5">
      <div className="col-12">
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <span className="nav-link active fw-bold text-dark fs-5">
              Đánh giá sản phẩm
            </span>
          </li>
        </ul>

        <div className="row">
          {/* Cột trái: Form viết đánh giá */}
          <div className="col-md-5 mb-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-light">
              <h5 className="fw-bold mb-3">Viết đánh giá của bạn</h5>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-3 d-flex align-items-center">
                  <span className="me-3 fw-semibold">Chất lượng:</span>
                  <div className="fs-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`fas fa-star me-1 ${star <= ratingInput ? "text-warning" : "text-secondary"}`}
                        style={{ cursor: "pointer", transition: "color 0.2s" }}
                        onClick={() => setRatingInput(star)}
                      ></i>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Chia sẻ cảm nhận của bạn về cuốn sách này..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-info text-white fw-bold w-100"
                >
                  Gửi đánh giá
                </button>
              </form>
            </div>
          </div>

          {/* Cột phải: Danh sách đánh giá (Bình luận) */}
          <div className="col-md-7 ps-md-4">
            <h5 className="fw-bold mb-4">
              Khách hàng nhận xét ({reviews.length})
            </h5>

            {reviews.length === 0 ? (
              <p className="text-muted fst-italic">
                Chưa có đánh giá nào. Hãy là người đầu tiên nhận xét!
              </p>
            ) : (
              <div className="review-list">
                {/* ĐÂY LÀ CHỖ ĐƯỢC THAY ĐỔI */}
                {reviews.map((review) => (
                  <ReviewItem key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingBook;
