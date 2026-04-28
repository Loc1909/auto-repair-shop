# 🚗 Auto Repair Shop Management System

Hệ thống quản lý Garage Sửa chữa Ô tô chuyên nghiệp, cung cấp giải pháp toàn diện để kết nối Khách hàng, Nhân viên kỹ thuật và Quản trị viên. 

Hệ thống hỗ trợ đặt lịch trực tuyến, theo dõi tiến độ sửa chữa theo thời gian thực (Real-time), quản lý linh kiện, báo giá và tự động gửi thông báo qua Email & Push Notification.

---

## ✨ Tính năng nổi bật

### 👤 Dành cho Khách hàng (Customer)
* **Đặt lịch hẹn trực tuyến:** Chọn ngày, giờ và loại dịch vụ mong muốn.
* **Quản lý danh sách xe:** Lưu trữ thông tin xe (Hãng xe, Dòng xe, Biển số) để dễ dàng chọn khi đặt lịch.
* **Theo dõi tiến độ Real-time:** Xem tiến độ sửa chữa xe thay đổi theo thời gian thực (qua Socket.IO) mà không cần tải lại trang.
* **Duyệt báo giá trực tuyến:** Nhận và xác nhận/từ chối báo giá phụ tùng, dịch vụ ngay trên nền tảng.
* **Đánh giá dịch vụ:** Viết đánh giá sau khi hoàn tất sửa chữa.

### 👷 Dành cho Nhân viên (Employee)
* **Quản lý lịch làm việc:** Xem các lịch hẹn được giao trong ngày.
* **Tiếp nhận xe:** Chuyển đổi trạng thái từ Lịch hẹn sang Phiếu sửa chữa (Repair Order).
* **Cập nhật tiến độ:** Thay đổi trạng thái sửa chữa (Chờ xử lý -> Đang chẩn đoán -> Đang báo giá -> Đang sửa chữa -> Hoàn thành). Tiến độ lập tức hiển thị cho Khách hàng.
* **Tạo Báo giá & Yêu cầu vật tư:** Lập danh sách dịch vụ và phụ tùng cần thiết gửi cho khách hàng và kho.

### 👑 Dành cho Quản trị viên (Admin)
* **Bảng điều khiển (Dashboard):** Xem tổng quan doanh thu, số lượng đơn hàng, lịch hẹn.
* **Quản lý danh mục:** Dịch vụ, Phụ tùng, Danh mục dịch vụ.
* **Quản lý nhân sự & Khách hàng:** Quản lý tài khoản, phân quyền.
* **Quản lý Yêu cầu vật tư:** Phê duyệt hoặc từ chối các yêu cầu xuất kho phụ tùng từ nhân viên.
* **Cấu hình Thông báo (Notification Config):** Chỉnh sửa các mẫu Email/Push Notification HTML trực tiếp với các biến động (Placeholder) như `{name}`, `{date}`, `{vehicleInfo}`, `{licensePlate}`.

---

## 🛠 Công nghệ sử dụng

### 🖥 Frontend (Client)
- **Framework:** React.js (Vite)
- **UI Component:** Material UI (MUI) v5
- **Routing:** React Router DOM v6 (Phân chia Route theo Module: AdminRoutes, EmployeeRoutes, CustomerRoutes)
- **Real-time:** Socket.IO Client
- **Push Notification:** Firebase Cloud Messaging (FCM)
- **State & Data Fetching:** Custom Hooks, Axios

### ⚙️ Backend (Server)
- **Framework:** Spring Boot 3 (Java)
- **Security:** Spring Security + JWT (JSON Web Token)
- **ORM:** Spring Data JPA / Hibernate
- **Real-time:** Netty Socket.IO Server
- **Email Service:** Spring Boot Starter Mail (Hỗ trợ MimeMessage, HTML Template)
- **Database:** MySQL / PostgreSQL (Tuỳ cấu hình)

---

## 📂 Cấu trúc dự án tiêu biểu

### Backend (`/backend`)
```text
src/main/java/com/ou/autorepairshop/
├── config/         # Spring Security, CORS, SocketIO, Firebase Config
├── controller/     # Các REST API Endpoint
├── dto/            # Request/Response Data Transfer Objects
├── entity/         # Database Entities
├── exception/      # Global Exception Handler
├── mapper/         # Chuyển đổi giữa Entity và DTO
├── repository/     # Spring Data JPA Repositories
└── service/        # Chứa Business Logic (Core của ứng dụng)
```

### Frontend (`/frontend`)
```text
src/
├── api/            # Tầng giao tiếp với Backend (Axios instances)
├── components/     # UI Components dùng chung (Layout, Dialog, Card)
├── hooks/          # Custom Hooks (Tách biệt Data Logic khỏi UI)
├── pages/          # Các trang (Views) chia theo Role (Admin, Employee, Customer)
└── routes/         # Tách biệt Route config (AdminRoutes, EmployeeRoutes)
```

---

## 🚀 Hướng dẫn cài đặt & Chạy dự án

### Yêu cầu hệ thống
- JDK 17+
- Node.js 18+ & npm/yarn
- Cơ sở dữ liệu MySQL

### Bước 1: Khởi động Backend
1. Mở file cấu hình `backend/src/main/resources/application.yml`
2. Cập nhật thông tin kết nối Database và thông tin SMTP (Email).
3. Chạy lệnh:
```bash
cd backend
./mvnw spring-boot:run
```
*(Backend sẽ chạy ở cổng `8080` và Socket.IO chạy ở cổng `9092`)*

### Bước 2: Khởi động Frontend
1. Cài đặt các gói phụ thuộc:
```bash
cd frontend
npm install
```
2. Cấu hình biến môi trường: Tạo file `.env` (hoặc sửa `.env.local`) trỏ API về Backend.
3. Chạy ứng dụng:
```bash
npm run dev
```

---

## 💎 Điểm nổi bật về Kiến trúc phần mềm (Clean Architecture)
Dự án được thiết kế theo tiêu chuẩn khắt khe, tuân thủ nguyên tắc **SOLID**:
- **API Layer (Frontend):** Toàn bộ hàm gọi `Axios` được gom vào thư mục `/api`, loại bỏ hoàn toàn việc gọi API trực tiếp trong file UI Component.
- **Custom Hooks (Frontend):** Tách biệt State Management và Logic lấy dữ liệu ra khỏi UI, giúp các file `.jsx` cực kỳ ngắn gọn và dễ bảo trì.
- **Route Modularization:** Hệ thống Routes phân chia rành mạch cho từng đối tượng người dùng.
- **Event-Driven & Real-time (Backend):** Ứng dụng Socket.IO trong việc cập nhật Notification và Tracking, giúp tối ưu băng thông (tránh Long Polling).
- **Dynamic Template Engine:** Cấu hình thông báo hỗ trợ nạp biến động trực tiếp vào HTML Template từ Database.