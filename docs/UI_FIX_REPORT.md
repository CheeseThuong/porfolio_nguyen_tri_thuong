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

## Hero responsive fix (2026-06-25)

### Nguyên nhân lỗi

- `.hero-profile__summary` dùng `position: absolute; right: 1rem; bottom: -2rem` → che avatar và tràn khung.
- `.hero-profile` dùng `position: relative; isolation: isolate` để chứa card tuyệt đối.
- `.hero-premium__layout` dùng `align-items: end` gây lệch vertical.
- `--text-display` quá lớn (`clamp(2.5rem, 6vw, 4.5rem)`) → tên ép xuống hai dòng nặng.

### CSS overlay đã loại bỏ

- Xóa `position: absolute`, `right: 1rem`, `bottom: -2rem`, `width: min(calc(100% - 2rem), 20rem)` khỏi `.hero-profile__summary`.
- Xóa `position: relative`, `isolation: isolate`, `::before` decorative glow khỏi `.hero-profile`.

### Bố cục desktop (≥ 1100px)

- Grid: `minmax(0, 1.08fr) minmax(360px, 0.92fr)`, `align-items: center`.
- `.hero-profile` dùng `display: grid; gap: 1rem` — summary nằm dưới ảnh trong normal flow.
- Avatar tối đa 460px; summary 100% width avatar wrapper.
- Title: `clamp(2.8rem, 5.2vw, 5rem)`, `line-height: 0.96`, `letter-spacing: -0.04em`.

### Bố cục mobile (< 576px)

- Layout một cột; content trước, avatar sau.
- Title mobile: `clamp(2.8rem, 13vw, 4rem)`, `line-height: 0.98`.
- Avatar: `min(88vw, 390px)`.
- Summary: `padding: 16px`, không absolute, không overlay.
- Breakpoint 389px: summary row chuyển sang một cột.

### Viewports đã kiểm tra

320×800 · 390×844 · 430×932 · 768×1024 · 1024×768 · 1280×800 · 1440×900 · 1920×1080

### Files đã thay đổi

`index.html`, `css/style.css`, `css/responsive.css`, `docs/UI_FIX_REPORT.md`, `docs/WORK_LOG.md`
