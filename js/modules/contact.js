(function definePortfolioContact(global) {
  'use strict';

  const emailConfig = Object.freeze({
    publicKey: 'PU-XG9rPWqN8OwKZl',
    serviceId: 'service_vhcqrve',
    templateId: 'template_v0k8rw4'
  });

  function init() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm || contactForm.dataset.contactInitialized === 'true') return;
    contactForm.dataset.contactInitialized = 'true';

    const successMessage = document.getElementById('successMessage');
    const formError = document.getElementById('formError');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const submitLabel = submitButton?.querySelector('span');
    const fields = [
      { input: document.getElementById('name'), error: document.getElementById('name-error'), validate: (value) => value.length >= 2 ? '' : 'Nhập họ và tên với ít nhất 2 ký tự.' },
      { input: document.getElementById('email'), error: document.getElementById('email-error'), validate: (value, input) => input.validity.valid && value ? '' : 'Nhập địa chỉ email hợp lệ.' },
      { input: document.getElementById('message'), error: document.getElementById('message-error'), validate: (value) => value.length >= 10 ? '' : 'Lời nhắn cần có ít nhất 10 ký tự.' }
    ].filter(({ input, error }) => input && error);
    let isSubmitting = false;
    let emailClientInitialized = false;

    function setMessage(element, message) {
      if (!element) return;
      element.textContent = message;
      element.classList.toggle('d-none', !message);
    }

    function setMailtoFallback() {
      if (!formError) return;
      const emailLink = document.createElement('a');
      emailLink.href = 'mailto:nguyentrithuong471@gmail.com';
      emailLink.textContent = 'nguyentrithuong471@gmail.com';
      formError.replaceChildren('Không thể gửi tự động vào lúc này. Gửi trực tiếp qua ', emailLink, '.');
      formError.classList.remove('d-none');
    }

    function setFieldError(field, message) {
      field.input.setAttribute('aria-invalid', String(Boolean(message)));
      field.error.textContent = message;
      field.error.hidden = !message;
    }

    function validateField(field) {
      const message = field.validate(field.input.value.trim(), field.input);
      setFieldError(field, message);
      return !message;
    }

    function validateForm() {
      const invalidFields = fields.filter((field) => !validateField(field));
      return invalidFields[0] || null;
    }

    function setSubmitting(submitting) {
      if (!submitButton) return;
      submitButton.disabled = submitting;
      submitButton.classList.toggle('is-loading', submitting);
      if (submitLabel) submitLabel.textContent = submitting ? 'Đang gửi…' : 'Gửi lời nhắn';
    }

    function getEmailClient() {
      if (!global.emailjs || typeof global.emailjs.init !== 'function' || typeof global.emailjs.send !== 'function') {
        return null;
      }

      if (!emailConfig.publicKey || !emailConfig.serviceId || !emailConfig.templateId) return null;

      if (!emailClientInitialized) {
        global.emailjs.init(emailConfig.publicKey);
        emailClientInitialized = true;
      }

      return global.emailjs;
    }

    fields.forEach((field) => {
      field.input.addEventListener('blur', () => validateField(field));
      field.input.addEventListener('input', () => {
        if (field.input.getAttribute('aria-invalid') === 'true') validateField(field);
      });
    });

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (isSubmitting) return;

      setMessage(successMessage, '');
      setMessage(formError, '');

      const honeypot = document.getElementById('honeypot');
      if (honeypot?.value.trim()) {
        setMessage(successMessage, 'Tin nhắn đã được gửi. Cảm ơn bạn đã liên hệ.');
        contactForm.reset();
        fields.forEach((field) => setFieldError(field, ''));
        return;
      }

      const invalidField = validateForm();
      if (invalidField) {
        setMessage(formError, 'Vui lòng kiểm tra lại các trường được đánh dấu.');
        invalidField.input.focus();
        return;
      }

      isSubmitting = true;
      setSubmitting(true);

      try {
        const emailClient = getEmailClient();
        if (!emailClient) throw new Error('EMAIL_SERVICE_UNAVAILABLE');

        await emailClient.send(emailConfig.serviceId, emailConfig.templateId, {
          name: document.getElementById('name').value.trim(),
          email: document.getElementById('email').value.trim(),
          message: document.getElementById('message').value.trim()
        });

        setMessage(successMessage, 'Tin nhắn đã được gửi. Cảm ơn bạn đã liên hệ.');
        contactForm.reset();
        fields.forEach((field) => setFieldError(field, ''));
      } catch {
        setMailtoFallback();
      } finally {
        isSubmitting = false;
        setSubmitting(false);
      }
    });
  }

  global.PortfolioContact = Object.freeze({ init });
})(window);
