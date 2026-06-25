import React, { useMemo, useState } from "react";
import { Card, Col, DatePicker, Row } from "antd";
import { 
  LoginOutlined, 
  LogoutOutlined, 
  HomeOutlined, 
  CalendarOutlined, 
  DollarOutlined, 
  PieChartOutlined, 
  CreditCardOutlined, 
  WalletOutlined,
  KeyOutlined,
  ArrowRightOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import ApexLineChartComponent from "../components/charts/ApexLineChartComponent";
import ApexMixChartComponent from "../components/charts/ApexMixChartComponent";
import { ApexChartComponent } from "../components/charts/ApexChartComponent";
import DashboardCard from "../components/dashboard/DashboardCard";
import DashboardSection from "../components/dashboard/DashboardSection";
import ComingSoonImage from "../assets/images/comingSoon.svg";
import "../styles/dashboard/dashboardStyles.scss";

const { RangePicker } = DatePicker;

const isProductionEnv =
  (import.meta.env.VITE_ENV_TYPE as string | undefined)?.trim() === "PRODUCTION";

const DashboardPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<any>(null);
  const navigate = useNavigate();

  const operationalCards = [
    { label: "Today Check-in Count", value: "12", trend: "4 pending today", icon: <LoginOutlined />, iconBgColor: "#E8F5E9", iconColor: "#2E7D32" },
    { label: "Check-in within 48 hours", value: "24", trend: "Next 2 days", icon: <CalendarOutlined />, iconBgColor: "#E3F2FD", iconColor: "#1565C0" },
    { label: "Today Check-out Count", value: "8", trend: "2 pending today", icon: <LogoutOutlined />, iconBgColor: "#FFEBEE", iconColor: "#C62828" },
    { label: "Check-out within 48 hours", value: "15", trend: "Next 2 days", icon: <CalendarOutlined />, iconBgColor: "#FFF3E0", iconColor: "#EF6C00" },
  ];

  const summaryCards = [
    { label: "Total Earnings", value: "$12,450", trend: "+8.4% from last month", icon: <DollarOutlined />, iconBgColor: "#E8F5E9", iconColor: "#2E7D32" },
    { label: "Upcoming Earnings", value: "$3,280", trend: "4 payouts pending", icon: <WalletOutlined />, iconBgColor: "#E3F2FD", iconColor: "#1565C0" },
    { label: "Total Reservations", value: "32", trend: "+6 new this week", icon: <CalendarOutlined />, iconBgColor: "#F3E5F5", iconColor: "#6A1B9A" },
    { label: "Occupancy Rate", value: "68%", trend: "+3% versus previous period", icon: <PieChartOutlined />, iconBgColor: "#FFF3E0", iconColor: "#EF6C00" },
    { label: "Active Listings", value: "7", trend: "1 listing paused", icon: <HomeOutlined />, iconBgColor: "#E0F7FA", iconColor: "#006064" },
    { label: "Avg Booking Value", value: "$389", trend: "+5.1% from last month", icon: <CreditCardOutlined />, iconBgColor: "#FBE9E7", iconColor: "#D84315" },
  ];

  const earningsLineOptions: any = useMemo(
    () => ({
      chart: { toolbar: { show: false } },
      colors: ["#EF5A60", "#082942"],
      stroke: { width: 3, curve: "smooth" },
      dataLabels: { enabled: false },
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yaxis: {
        labels: {
          formatter: (value: number) => `$${value}`,
        },
      },
      legend: { position: "top" },
      tooltip: {
        y: {
          formatter: (value: number) => `$${value}`,
        },
      },
      grid: { borderColor: "#efefef" },
    }),
    []
  );

  const earningsLineSeries: any = useMemo(
    () => [
      { name: "Earned", data: [1200, 1420, 1180, 1660, 1900, 1720, 2100] },
      { name: "Upcoming", data: [540, 620, 700, 680, 760, 810, 900] },
    ],
    []
  );

  const reservationStatusOptions: any = useMemo(
    () => ({
      chart: { type: "donut" },
      labels: ["Hosting", "Upcoming", "Completed", "Cancelled"],
      colors: ["#EF5A60", "#F59E0B", "#22C55E", "#EF4444"],
      dataLabels: { enabled: true },
      legend: { position: "bottom" },
    }),
    []
  );

  const revenueBreakdownOptions: any = useMemo(
    () => ({
      chart: { type: "pie" },
      labels: ["Earned", "Upcoming", "Cancelled"],
      colors: ["#EF5A60", "#082942", "#EF4444"],
      legend: { position: "bottom" },
    }),
    []
  );

  const commissionVsNetOptions: any = useMemo(
    () => ({
      chart: { toolbar: { show: false } },
      colors: ["#082942", "#EF5A60", "#22C55E"],
      plotOptions: { bar: { borderRadius: 4, columnWidth: "45%" } },
      dataLabels: { enabled: false },
      xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
      yaxis: {
        labels: {
          formatter: (value: number) => `$${value}`,
        },
      },
      legend: { position: "top" },
    }),
    []
  );

  const commissionVsNetSeries: any = useMemo(
    () => [
      { name: "Gross", type: "column", data: [4200, 4700, 5100, 5650, 6000, 6400] },
      { name: "Commission", type: "column", data: [420, 470, 510, 565, 600, 640] },
      { name: "Net", type: "line", data: [3780, 4230, 4590, 5085, 5400, 5760] },
    ],
    []
  );

  const topPropertyOptions: any = useMemo(
    () => ({
      chart: { toolbar: { show: false } },
      plotOptions: { bar: { horizontal: true, borderRadius: 6 } },
      dataLabels: { enabled: false },
      colors: ["#082942"],
      xaxis: {
        categories: ["Sea View Villa", "City Apartment", "Hotel Deluxe Room"],
        labels: { formatter: (value: number) => `$${value}` },
      },
    }),
    []
  );

  const bookingsByDayOptions: any = useMemo(
    () => ({
      chart: { toolbar: { show: false } },
      plotOptions: { bar: { borderRadius: 4, columnWidth: "45%" } },
      colors: ["#EF5A60"],
      xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
      dataLabels: { enabled: false },
    }),
    []
  );

  const inventoryStatusOptions: any = useMemo(
    () => ({
      chart: { stacked: true, toolbar: { show: false } },
      plotOptions: { bar: { horizontal: false, borderRadius: 4 } },
      colors: ["#22C55E", "#EF5A60", "#F59E0B"],
      xaxis: { categories: ["Sea View Villa", "City Apartment", "Hotel Deluxe Room"] },
      legend: { position: "top" },
      dataLabels: { enabled: false },
    }),
    []
  );

  return (
    <MainLayout pageName="whitePage">
      <div className="dashboard-page-wrapper">
        <div className="dashboard-page-inner">
          {isProductionEnv ? (
            <div className="dashboard-coming-soon">
              <img
                src={ComingSoonImage}
                alt="Dashboard coming soon"
                className="dashboard-coming-soon__image"
              />
              <h1 className="font-size-1 font-weight-medium primary-color mb-2">
                Dashboard Coming Soon
              </h1>
              <p className="font-size-4 text-gray mb-0">
                We&apos;re building your host dashboard. Check back soon for insights on your
                properties, bookings, and earnings.
              </p>
            </div>
          ) : (
            <>
          <Row gutter={[16, 16]} align="middle">
            <Col span={24}>
              <h1 className="font-size-2 font-weight-semi-bold secondary-color mb-1">Dashboard</h1>
              <p className="font-size-4 text-gray mb-0">
                Overview of your properties, bookings and earnings
              </p>
            </Col>
          </Row>

          <div 
            className="mt-3 mb-4 cursor-pointer"            
            style={{
              background: "linear-gradient(135deg, #082942 0%, #1565C0 100%)",
              borderRadius: "12px",
              padding: "24px 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 8px 16px rgba(8, 41, 66, 0.15)",
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 24px rgba(8, 41, 66, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(8, 41, 66, 0.15)";
            }}
          >
            <div className="d-flex align-items-center">
              <div style={{ 
                backgroundColor: "rgba(255,255,255,0.15)", 
                padding: "16px", 
                borderRadius: "50%", 
                marginRight: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <KeyOutlined style={{ fontSize: "28px", color: "#fff" }} />
              </div>
              <div>
                <h3 style={{ color: "#fff", margin: 0, fontSize: "24px", fontWeight: 600 }}>5 Available Properties</h3>
                <p style={{ color: "rgba(255,255,255,0.8)", margin: 0, fontSize: "16px", marginTop: "4px" }}>Ready for new guests today. Click to manage availability.</p>
              </div>
            </div>
            <div style={{ 
              backgroundColor: "#fff", 
              color: "#082942", 
              padding: "10px 24px", 
              borderRadius: "24px", 
              fontWeight: 600, 
              display: "flex", 
              alignItems: "center", 
              gap: "8px",
              fontSize: "14px",
              cursor: "pointer"
            }}
             onClick={() => navigate("/properties/available")}>
              View Details <ArrowRightOutlined />
            </div>
          </div>

          <h2 className="font-size-3 font-weight-semi-bold secondary-color mt-3  mb-2">Operations</h2>
          <Row gutter={[16, 16]}>
            {operationalCards.map((card: any) => (
              <Col xs={24} sm={12} md={6} lg={6} xl={6} key={card.label}>
                <DashboardCard 
                  label={card.label} 
                  value={card.value} 
                  trend={card.trend} 
                  icon={card.icon}
                  iconBgColor={card.iconBgColor}
                  iconColor={card.iconColor}
                  onClick={card.onClick}
                />
              </Col>
            ))}
          </Row>

          <Row gutter={[16, 16]} align="middle" justify="space-between" className="mt-4 mb-2">
            <Col>
              <h2 className="font-size-3 font-weight-semi-bold secondary-color mb-0">Financials & Overview</h2>
            </Col>
            <Col>
              <RangePicker
                size="large"
                value={dateRange}
                onChange={(value: any) => setDateRange(value)}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            {summaryCards.map((card: any) => (
              <Col xs={24} sm={12} md={12} lg={8} xl={8} key={card.label}>
                <DashboardCard 
                  label={card.label} 
                  value={card.value} 
                  trend={card.trend} 
                  icon={card.icon}
                  iconBgColor={card.iconBgColor}
                  iconColor={card.iconColor}
                />
              </Col>
            ))}
          </Row>

          <Row gutter={[16, 16]} className="mt-1">
            <Col xs={24} sm={24} md={24} lg={16}>
              <DashboardSection title="Earnings Overview">
                <div className="dashboard-chart-container">
                  <ApexLineChartComponent
                    type="line"
                    height={320}
                    options={earningsLineOptions}
                    series={earningsLineSeries}
                  />
                </div>
              </DashboardSection>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8}>
              <DashboardSection title="Reservation Status">
                <div className="dashboard-chart-container">
                  <ApexChartComponent
                    type="donut"
                    height={320}
                    options={reservationStatusOptions}
                    series={[8, 12, 20, 5]}
                  />
                </div>
              </DashboardSection>
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="mt-1">
            <Col xs={24} sm={24} md={12} lg={12}>
              <DashboardSection title="Revenue Breakdown">
                <div className="dashboard-chart-container">
                  <ApexChartComponent
                    type="pie"
                    height={320}
                    options={revenueBreakdownOptions}
                    series={[12450, 3280, 840]}
                  />
                </div>
              </DashboardSection>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <DashboardSection title="Commission vs Net">
                <div className="dashboard-chart-container">
                  <ApexMixChartComponent
                    height={320}
                    options={commissionVsNetOptions}
                    series={commissionVsNetSeries}
                  />
                </div>
              </DashboardSection>
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="mt-1">
            <Col xs={24}>
              <DashboardSection title="Top Performing Properties">
                <div className="dashboard-chart-container">
                  <ApexLineChartComponent
                    type="bar"
                    height={320}
                    options={topPropertyOptions}
                    series={[{ name: "Revenue", data: [6400, 4700, 3900] }]}
                  />
                </div>
              </DashboardSection>
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="mt-1">
            <Col xs={24} sm={24} md={12} lg={12}>
              <DashboardSection title="Booking Activity">
                <div className="dashboard-chart-container">
                  <ApexLineChartComponent
                    type="bar"
                    height={320}
                    options={bookingsByDayOptions}
                    series={[{ name: "Bookings", data: [4, 7, 5, 6, 8, 9, 7] }]}
                  />
                </div>
              </DashboardSection>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <DashboardSection title="Availability vs Booked vs Blocked">
                <div className="dashboard-chart-container">
                  <ApexLineChartComponent
                    type="bar"
                    height={320}
                    options={inventoryStatusOptions}
                    series={[
                      { name: "Available", data: [12, 9, 18] },
                      { name: "Booked", data: [7, 11, 10] },
                      { name: "Blocked", data: [2, 1, 3] },
                    ]}
                  />
                </div>
              </DashboardSection>
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="mt-1">
            <Col xs={24} sm={24} md={8} lg={8}>
              <Card className="dashboard-insight-card dashboard-insight-danger h-100" bordered={false}>
                <h3 className="font-size-4 font-weight-semi-bold mb-1">Cancellation Loss</h3>
                <p className="font-size-5 text-gray-secondary mb-0">
                  Estimated loss from cancellations this month: $840.
                </p>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8}>
              <Card className="dashboard-insight-card dashboard-insight-success h-100" bordered={false}>
                <h3 className="font-size-4 font-weight-semi-bold mb-1">Growth Signal</h3>
                <p className="font-size-5 text-gray-secondary mb-0">
                  Reservation volume increased 18% compared to last month.
                </p>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8}>
              <Card className="dashboard-insight-card dashboard-insight-primary h-100" bordered={false}>
                <h3 className="font-size-4 font-weight-semi-bold mb-1">Plan Insight</h3>
                <p className="font-size-5 text-gray-secondary mb-0">
                  Starter plan listings are generating the highest occupancy this period.
                </p>
              </Card>
            </Col>
          </Row>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;