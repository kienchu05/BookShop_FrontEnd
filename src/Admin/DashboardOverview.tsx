import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "..//Authentication/fetchWithAuth";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  month: number;
  revenue: number;
}

interface DashboardStats {
  totalRevenue: number;
  successOrders: number;
  monthlyRevenueResponses: ChartData[];
}

const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    successOrders: 0,
    monthlyRevenueResponses: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetchWithAuth(
          "http://localhost:8080/order/dashboard",
          {
            method: "GET",
          },
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Dữ liệu thống kê:", data.monthlyRevenueResponses);
          setStats(data);
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
        console.log("Kiểm tra token và quyền truy cập của bạn.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formattedChartData = stats.monthlyRevenueResponses.map((item) => ({
    month: `Tháng ${item.month}`,
    revenue: item.revenue,
  }));

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  // Hàm format tiền tệ cho trục Y của biểu đồ
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)} Tr`;
    if (value >= 1000) return `${value / 1000} K`;
    return value.toString();
  };

  return (
    <div className="container-fluid py-4">
      {/* Tiêu đề trang */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark mb-0">
          <i className="fas fa-chart-pie me-2 text-primary"></i> Tổng quan hệ
          thống
        </h3>
        <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">
          Cập nhật: {new Date().toLocaleTimeString("vi-VN")}
        </span>
      </div>

      <div className="row g-4 mb-4">
        {/* CARD 1: DOANH THU */}
        <div className="col-md-6 col-xl-4">
          <div
            className="card border-0 text-white shadow-lg h-100"
            style={{
              background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
              borderRadius: "20px",
            }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p
                    className="text-uppercase fw-bold mb-2 text-white-50"
                    style={{ fontSize: "0.85rem", letterSpacing: "1px" }}
                  >
                    Tổng doanh thu thực tế
                  </p>
                  <h2 className="fw-bolder mb-0 display-6">
                    {stats.totalRevenue.toLocaleString("vi-VN")}đ
                  </h2>
                </div>
                <div
                  className="bg-white bg-opacity-25 rounded-circle d-flex justify-content-center align-items-center shadow-sm"
                  style={{ width: "65px", height: "65px" }}
                >
                  <i className="fas fa-wallet fa-2x text-white"></i>
                </div>
              </div>
              <hr className="bg-white opacity-50 my-3" />
              <div className="small text-white opacity-75 fw-semibold">
                <i className="fas fa-arrow-up me-1"></i> Tính từ các đơn hàng đã
                thanh toán (PAID)
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: ĐƠN HÀNG */}
        <div className="col-md-6 col-xl-4">
          <div
            className="card border-0 text-white shadow-lg h-100"
            style={{
              background: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
              borderRadius: "20px",
            }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p
                    className="text-uppercase fw-bold mb-2 text-white-50"
                    style={{ fontSize: "0.85rem", letterSpacing: "1px" }}
                  >
                    Đơn hàng thành công
                  </p>
                  <h2 className="fw-bolder mb-0 display-6">
                    {stats.successOrders} đơn
                  </h2>
                </div>
                <div
                  className="bg-white bg-opacity-25 rounded-circle d-flex justify-content-center align-items-center shadow-sm"
                  style={{ width: "65px", height: "65px" }}
                >
                  <i className="fas fa-shopping-bag fa-2x text-white"></i>
                </div>
              </div>
              <hr className="bg-white opacity-50 my-3" />
              <div className="small text-white opacity-75 fw-semibold">
                <i className="fas fa-check-circle me-1"></i> Trạng thái giao
                dịch hoàn tất trong hệ thống
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: TÌNH TRẠNG HỆ THỐNG */}
        <div className="col-md-12 col-xl-4">
          <div
            className="card border-0 text-white shadow-lg h-100"
            style={{
              background: "linear-gradient(135deg, #f2994a 0%, #f2c94c 100%)",
              borderRadius: "20px",
            }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p
                    className="text-uppercase fw-bold mb-2 text-white-50"
                    style={{ fontSize: "0.85rem", letterSpacing: "1px" }}
                  >
                    Tình trạng hệ thống
                  </p>
                  <h2 className="fw-bolder mb-0 display-6">Ổn định</h2>
                </div>
                <div
                  className="bg-white bg-opacity-25 rounded-circle d-flex justify-content-center align-items-center shadow-sm"
                  style={{ width: "65px", height: "65px" }}
                >
                  <i className="fas fa-server fa-2x text-white"></i>
                </div>
              </div>
              <hr className="bg-white opacity-50 my-3" />
              <div className="small text-white opacity-75 fw-semibold">
                <i className="fas fa-clock me-1"></i> Hoạt động bình thường
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= PHẦN BIỂU ĐỒ ================= */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
              <h5 className="fw-bold text-dark mb-0">
                Biểu đồ doanh thu theo tháng
              </h5>
            </div>
            <div className="card-body p-4">
              {/* ResponsiveContainer giúp biểu đồ tự động co giãn theo kích thước màn hình */}
              <div style={{ width: "100%", height: 350 }}>
                <ResponsiveContainer>
                  <LineChart
                    data={formattedChartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#6c757d" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={formatCurrency}
                      tick={{ fill: "#6c757d" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value: any) => [
                        `${value.toLocaleString("vi-VN")}đ`,
                        "Doanh thu",
                      ]}
                      contentStyle={{
                        borderRadius: "10px",
                        border: "none",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend iconType="circle" />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Doanh thu"
                      stroke="#0072ff"
                      strokeWidth={3}
                      dot={{
                        r: 6,
                        fill: "#0072ff",
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
