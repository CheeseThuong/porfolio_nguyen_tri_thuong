# Technical audit

## Stack hiện tại

- Portfolio một trang, static, viết bằng HTML5, CSS và JavaScript thuần.
- Bootstrap 5.3.2 hỗ trợ layout/component; Font Awesome 6.0.0 cung cấp icon.
- Font Outfit được tải từ Google Fonts; EmailJS Browser 3 xử lý gửi form.
- Không có bằng chứng về build step, package manager hoặc framework ứng dụng trong các entry point đã đọc.

## Entry points và CDN

- `index.html`: document, nội dung, component markup và thứ tự tải asset.
- `css/style.css`: theme, component, animation và phần lớn styling; file đã tích lũy nhiều lớp override.
- `css/responsive.css`: breakpoint, print, high contrast, reduced motion và override mobile cho robot/chatbot.
- `js/main.js`: typing, contact form, robot pet, chatbot, weather và nội dung trả lời.
- `js/script.js`: khởi tạo/toggle theme, back-to-top, active navigation và reveal/skill animation.
- CDN: Google Fonts, Bootstrap CSS/JS 5.3.2, Font Awesome 6.0.0, EmailJS Browser 3.

## Nhóm logic chính

- Typing effect trong hero; smooth navigation, active section và back-to-top.
- IntersectionObserver cho navbar, reveal content và skill meter; có nhánh `prefers-reduced-motion`.
- Contact form dùng validation trình duyệt, trạng thái submit và `emailjs.send`.
- Robot pet theo dõi chuột, hỗ trợ pointer/keyboard, kéo-thả, animation và đồng bộ trạng thái panel.
- Chatbot rule-based với câu trả lời hard-code, typing delay và random response.
- Weather gọi Open-Meteo geocoding/forecast ở client, có timeout và mapping mã WMO.
- Random talk/animation dùng `setTimeout`, `setInterval` và `Math.random()`.

## Vấn đề đã thấy

- Theme: HTML khai báo hỗ trợ light/dark; CSS có force-light, nhiều selector `.dark-mode`, biến màu khai báo lại; JS lưu `darkMode` vào localStorage và tạo toggle. Cấu trúc này trái yêu cầu một dark theme duy nhất.
- JavaScript: `js/main.js` trên 1.000 dòng và gộp nhiều trách nhiệm không liên quan; dữ liệu chatbot/project nằm chung với interaction và network logic, làm tăng rủi ro regression.
- Robot/chatbot/weather/random talk làm tăng số listener, timer, lớp z-index, breakpoint override và trạng thái cần đồng bộ; weather phụ thuộc API/network phía client.
- Project hiện được hard-code trong `index.html`; nội dung chatbot còn hard-code tên và mô tả project cũ, nên dễ lệch catalog đã xác minh.
- Nội dung hiện tại chứa project không đủ bằng chứng như Q Nails Summerwood, Ellamy Nails và Tarot AI; không được giữ trong redesign nếu chưa xác minh.

## Rủi ro chất lượng

- Accessibility: đã có skip link, semantic section, ARIA và reduced-motion, nhưng dialog/chatbot tự dựng, focus flow, drag interaction, thông báo form và contrast cần test bàn phím/screen reader thực tế.
- Responsive: có nhiều breakpoint và override robot/chatbot lặp ở cuối file; `!important`, fixed positioning và z-index có thể gây che nội dung trên màn hình nhỏ.
- SEO: có title/description/author/favicon nhưng chưa thấy Open Graph, canonical hoặc structured data; nội dung title/meta cần kiểm tra encoding khi triển khai.
- Contact form: phụ thuộc CDN và EmailJS phía client; public identifiers nằm trong source, không có backend chống spam/rate limit, và lỗi mạng chỉ được xử lý ở trình duyệt.

## File dự kiến bị tác động ở phase sau

- `index.html`: cấu trúc nội dung, project catalog, metadata và loại bỏ theme toggle markup/config liên quan.
- `css/style.css`: hợp nhất thành dark theme, hệ thống token, layout/component và giảm override.
- `css/responsive.css`: chuẩn hóa breakpoint và hành vi mobile/focus/reduced-motion.
- `js/main.js`: tách hoặc tinh gọn logic, đồng bộ project/chatbot, đánh giá robot/weather/random talk.
- `js/script.js`: bỏ persistence/toggle theme và giữ các interaction cần thiết.

