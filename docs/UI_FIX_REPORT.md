# UI correction report

## Đã sửa

- Xóa mô tả nội bộ ở khu dự án; thống nhất nhãn giao diện chính sang tiếng Việt.
- Rút hero và spacing giữa các section; cải thiện hierarchy của technical snapshot và CTA.
- Chuẩn hóa taxonomy, trạng thái hướng người xem và cấu trúc renderer để category, status, title và footer không chồng lấn.
- Tách rõ card featured gọn có evidence với archive compact, hai cột trên desktop; VietASR Pro và TBD RAG Chatbot giữ vị trí nổi bật.
- Đổi Expertise thành grid bất đối xứng, hoàn thiện About hai cột và Contact hai cột; không thay đổi logic form.
- Tăng hiện diện background line-art công nghệ trong phạm vi light theme, vẫn không tương tác và giảm mật độ trên mobile.

## Files

`index.html`, `css/style.css`, `css/responsive.css`, `js/data/projects.js`, `js/modules/projects.js`, `docs/WORK_LOG.md`.

## Còn lại cho logic task

- Không thay đổi dữ liệu project, repository URL hoặc visual design; chỉ hoàn thiện logic navigation, filter, form và reveal hiện có.

## Logic fix

- Đồng bộ nav active state với hash bằng một scroll scheduler dùng `requestAnimationFrame`; scroll dùng `history.replaceState`, click nav giữ hash navigation mặc định để back/forward hoạt động.
- Back-to-top chỉ hiện sau 420px, ghi `#top` khi được chọn, và tôn trọng reduced motion.
- Menu mobile đóng khi chọn section hoặc Escape, trả focus về toggler và có guard chống đăng ký listener lặp.
- Project filter dùng event delegation trên button native, giữ focus sau render và bảo toàn `aria-pressed` cùng count từ catalog.
- Contact có lỗi inline, `aria-invalid`, chống double submit, loading state, guard EmailJS/CDN/config và fallback email hướng người dùng; không log dữ liệu form.
- Reveal chỉ kích hoạt CSS hidden state sau khi observer sẵn sàng và tự rollback nếu observer lỗi.
