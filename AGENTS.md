# Portfolio redesign workflow

Các quy tắc này áp dụng lâu dài cho mọi phase tiếp theo:

- Giữ nguyên kiến trúc static HTML/CSS/JavaScript hiện tại.
- Không chuyển sang React, Next.js, Vue, Tailwind hoặc framework mới.
- Chỉ dùng một dark theme; không có light/dark toggle.
- Không bịa nội dung, metrics, demo URL hoặc trạng thái project.
- Chỉ đọc file liên quan trực tiếp đến phase hiện tại.
- Không scan `node_modules`, `.git`, ảnh nhị phân hoặc repo ngoài nếu không bắt buộc.
- Không thêm dependency chỉ để tạo hiệu ứng nhỏ.
- Mỗi phase phải được test, commit riêng và cập nhật `docs/WORK_LOG.md`.
- Phản hồi cuối mỗi phase tối đa 12 dòng.
- Không tự chuyển sang phase sau.

