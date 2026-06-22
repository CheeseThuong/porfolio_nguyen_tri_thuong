(function definePortfolioContact(global) {
  'use strict';

  function init() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const formError = document.getElementById('formError');

    if (!contactForm) return;

    // Initialize EmailJS if available (since inline initialization was removed for performance)
    if (global.emailjs) {
      global.emailjs.init("PU-XG9rPWqN8OwKZl");
    }

    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Reset feedback messages
      if (successMessage) successMessage.classList.add('d-none');
      if (formError) formError.classList.add('d-none');

      // 1. Honeypot Spam Protection
      const honeypot = document.getElementById('honeypot');
      if (honeypot && honeypot.value.trim() !== '') {
        // Silently ignore submission to deceive spam bots, show fake success
        if (successMessage) {
          successMessage.classList.remove('d-none');
          successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        contactForm.reset();
        contactForm.classList.remove('was-validated');
        return;
      }

      // 2. Field Validation
      if (!contactForm.checkValidity()) {
        contactForm.classList.add('was-validated');
        if (formError) {
          formError.textContent = 'Vui lòng kiểm tra lại các trường bắt buộc.';
          formError.classList.remove('d-none');
        }
        contactForm.querySelector(':invalid')?.focus();
        return;
      }

      // 3. Double Submit Guard & Loading State
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const submitLabel = submitBtn ? submitBtn.querySelector('span') : null;
      const originalLabel = submitLabel ? submitLabel.textContent : 'Gửi lời nhắn';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('is-loading');
      }
      if (submitLabel) {
        submitLabel.textContent = 'Đang gửi...';
      }

      const nameVal = document.getElementById('name').value.trim();
      const emailVal = document.getElementById('email').value.trim();
      const messageVal = document.getElementById('message').value.trim();

      try {
        // 4. EmailJS Submission
        if (!global.emailjs) {
          throw new Error('EmailJS library is not available');
        }

        await global.emailjs.send("service_vhcqrve", "template_v0k8rw4", {
          name: nameVal,
          email: emailVal,
          message: messageVal,
        });

        // Success State
        if (successMessage) {
          successMessage.classList.remove('d-none');
          successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        contactForm.reset();
        contactForm.classList.remove('was-validated');

      } catch (error) {
        // 5. Fallback to mailto redirection if EmailJS fails/blocked
        console.error('Mail delivery service error occurred.'); // Do not log sensitive user inputs

        const subject = encodeURIComponent(`Liên hệ từ Portfolio - ${nameVal}`);
        const body = encodeURIComponent(`${messageVal}\n\n---\nEmail liên hệ: ${emailVal}`);
        const mailtoLink = `mailto:nguyentrithuong471@gmail.com?subject=${subject}&body=${body}`;

        // Redirect user to their default mail client
        global.location.href = mailtoLink;

        if (formError) {
          formError.textContent = 'Hệ thống gửi thư tự động gặp sự cố. Trình gửi mail của bạn đã được mở để gửi trực tiếp.';
          formError.classList.remove('d-none');
        }
      } finally {
        // Reset button loading state
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('is-loading');
        }
        if (submitLabel) {
          submitLabel.textContent = originalLabel;
        }
      }
    });
  }

  global.PortfolioContact = Object.freeze({ init });
})(window);
