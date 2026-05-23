// Typing Effect
function initTypingEffect() {
  const typingElement = document.querySelector('.typing-text');
  if (!typingElement) return;
  
  const texts = [
    'Sinh viên ngành Trí tuệ nhân tạo tại ĐH Thái Bình Dương',
    'Đam mê Machine Learning và Deep Learning',
    'Phân tích dữ liệu với Python, Pandas, NumPy',
    'Xây dựng mô hình AI và giải quyết vấn đề thực tế'
  ];
  
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  
  function type() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typingSpeed = 500;
    }
    
    setTimeout(type, typingSpeed);
  }
  
  type();
}

document.addEventListener('DOMContentLoaded', function() {
  initTypingEffect();
  
  const contactForm = document.getElementById('contactForm');
  const successMessage = document.getElementById('successMessage');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;
      
      if (name && email && message) {
          const submitBtn = contactForm.querySelector('button[type="submit"]');
          const originalBtnText = submitBtn.innerText;
          submitBtn.innerText = 'Đang gửi...';

          // Gửi email thông báo cho BẠN và auto-reply cho KHÁCH
          // (Cấu hình "To Email" trong EmailJS Dashboard: nguyentrithuong471@gmail.com,{{email}})
          emailjs.send("service_vhcqrve", "template_v0k8rw4", {
              name: name,
              email: email,
              message: message,
          })
          .then(function(response) {
            successMessage.classList.remove('d-none');
            successMessage.style.animation = 'slideInDown 0.5s ease';
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            contactForm.reset();
            submitBtn.innerText = originalBtnText;
            
            setTimeout(() => {
              successMessage.style.animation = 'fadeOut 0.5s ease';
              setTimeout(() => {
                successMessage.classList.add('d-none');
                successMessage.style.animation = '';
              }, 500);
            }, 5000);
          }, function(error) {
             alert("Gửi email thất bại. Vui lòng thử lại sau!");
             console.error('EmailJS Error:', error);
             submitBtn.innerText = originalBtnText;
          });
      } // end if (name && email && message)
    }); // end contactForm.addEventListener
  } // end if (contactForm)

  // Khởi chạy Robot Pet sau khi DOM đã sẵn sàng
  initRobotPet();
}); // end DOMContentLoaded

// Robot Pet Functions
function initRobotPet() {
  const robot = document.getElementById('robotPet');
  if (!robot) return;
  
  const pupils = document.querySelectorAll('.pupil');
  let lastScrollY = window.scrollY;
  let scrollDirection = 'down';
  
  // Track mouse movement for eye following - Theo dõi chuyển động của chuột để theo dõi bằng mắt
  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    pupils.forEach(pupil => {
      const eye = pupil.parentElement;
      const eyeRect = eye.getBoundingClientRect();
      const eyeCenterX = eyeRect.left + eyeRect.width / 2;
      const eyeCenterY = eyeRect.top + eyeRect.height / 2;
      
      const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);
      const distance = Math.min(3, Math.hypot(mouseX - eyeCenterX, mouseY - eyeCenterY) / 50);
      
      const pupilX = Math.cos(angle) * distance;
      const pupilY = Math.sin(angle) * distance;
      
      pupil.style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
    });
  });
  
  // Robot follows scroll position - Robot theo dõi vị trí cuộn
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollDiff = currentScrollY - lastScrollY;
        
        // Detect scroll direction - Phát hiện hướng cuộn
        if (scrollDiff > 0) {
          scrollDirection = 'down';
        } else if (scrollDiff < 0) {
          scrollDirection = 'up';
        }
        
        // Move robot based on scroll - Di chuyển robot dựa trên cuộn
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        const maxMovement = window.innerHeight - 200;
        const newBottom = 30 + (maxMovement * scrollPercent / 100);
        
        robot.style.bottom = Math.min(newBottom, maxMovement + 30) + 'px';
        
        // Add slight rotation based on movement - Thêm xoay nhẹ dựa trên chuyển động
        if (Math.abs(scrollDiff) > 5) {
          const rotation = scrollDirection === 'down' ? 5 : -5;
          robot.style.transform = `rotate(${rotation}deg)`;
          
          setTimeout(() => {
            robot.style.transform = 'rotate(0deg)';
          }, 300);
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
      });
      
      ticking = true;
    }
  });
  
  // Click interactions - Toggle Chatbot - Tương tác nhấp chuột - Chuyển đổi Chatbot
  let clickTimer = null;
  let isDragging = false;
  let dragStarted = false;
  
  robot.addEventListener('mousedown', (e) => {
    // Prevent text selection - Ngăn chặn việc chọn văn bản
    e.preventDefault();
    
    const chatPanel = document.getElementById('chatbotPanel');
    
    // If clicking on chatbot toggle button area (the robot itself, not while dragging) - Nếu nhấp vào khu vực nút chuyển đổi chatbot (chính là con robot, không phải khi đang kéo)
    clickTimer = setTimeout(() => {
      // Start drag
      isDragging = true;
      dragStarted = false;
      robot.style.cursor = 'grabbing';
      
      const startX = e.clientX;
      const startY = e.clientY;
      const rect = robot.getBoundingClientRect();
      const offsetX = startX - rect.left;
      const offsetY = startY - rect.top;
      
      function onMouseMove(e) {
        if (!isDragging) return;
        dragStarted = true;
        
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        
        // Keep robot within viewport - Giữ robot trong khung nhìn
        const maxX = window.innerWidth - robot.offsetWidth;
        const maxY = window.innerHeight - robot.offsetHeight;
        
        const boundedX = Math.max(0, Math.min(x, maxX));
        const boundedY = Math.max(0, Math.min(y, maxY));
        
        robot.style.left = boundedX + 'px';
        robot.style.top = boundedY + 'px';
        robot.style.right = 'auto';
        robot.style.bottom = 'auto';
        
        robot.classList.add('happy');
      }
      
      function onMouseUp() {
        if (isDragging) {
          isDragging = false;
          robot.style.cursor = 'pointer';
          setTimeout(() => robot.classList.remove('happy'), 500);
          
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        }
      }
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }, 200); // 200ms delay before drag starts - 200ms trì hoãn trước khi bắt đầu kéo
  });
  
  robot.addEventListener('mouseup', () => {
    clearTimeout(clickTimer);
    
    // If not dragged, toggle chatbot - Nếu không kéo, chuyển đổi chatbot
    if (!dragStarted && !isDragging) {
      const chatPanel = document.getElementById('chatbotPanel');
      chatPanel.classList.toggle('active');
      
      robot.classList.add('wave');
      setTimeout(() => robot.classList.remove('wave'), 1500);
    }
    
    isDragging = false;
    dragStarted = false;
  });
  
  robot.addEventListener('click', (e) => {
    // Prevent click if was dragging - Ngăn chặn nhấp chuột nếu đang kéo
    if (dragStarted) {
      e.stopPropagation();
    }
  });

  // ============================================================
  // TOUCH EVENTS — Hỗ trợ kéo thả trên thiết bị cảm ứng (mobile)
  // TOUCH EVENTS — Support drag and drop on touch devices (mobile)
  // ============================================================
  let touchStartX = 0;
  let touchStartY = 0;
  let touchDragStarted = false;
  let isTouchDragging = false;
  let touchOffsetX = 0;
  let touchOffsetY = 0;

  robot.addEventListener('touchstart', (e) => {
    // Ngăn page scroll khi kéo robot — Prevent page scroll when dragging robot
    e.preventDefault();
    
    const touch = e.touches[0];
    isTouchDragging = true;
    touchDragStarted = false;
    
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    
    const rect = robot.getBoundingClientRect();
    touchOffsetX = touchStartX - rect.left;
    touchOffsetY = touchStartY - rect.top;
    
    // Đặt vị trí fixed để tránh xung đột scroll — Set fixed position to avoid scroll conflict
    robot.style.position = 'fixed';
  }, { passive: false });

  robot.addEventListener('touchmove', (e) => {
    if (!isTouchDragging) return;
    
    const touch = e.touches[0];
    const currentX = touch.clientX;
    const currentY = touch.clientY;
    
    // Tính toán khoảng cách kéo — Calculate drag distance
    const dist = Math.hypot(currentX - touchStartX, currentY - touchStartY);
    if (dist >= 5) {
      touchDragStarted = true;
    }
    
    if (touchDragStarted) {
      // Ngăn cuộn trang khi di chuyển robot — Prevent page scroll while moving robot
      e.preventDefault();
      
      const x = currentX - touchOffsetX;
      const y = currentY - touchOffsetY;
      
      // Giữ robot trong viewport — Keep robot within viewport
      const maxX = window.innerWidth - robot.offsetWidth;
      const maxY = window.innerHeight - robot.offsetHeight;
      
      const boundedX = Math.max(0, Math.min(x, maxX));
      const boundedY = Math.max(0, Math.min(y, maxY));
      
      robot.style.left = boundedX + 'px';
      robot.style.top = boundedY + 'px';
      robot.style.right = 'auto';
      robot.style.bottom = 'auto';
      
      robot.classList.add('happy');
    }
  }, { passive: false });

  robot.addEventListener('touchend', (e) => {
    if (isTouchDragging) {
      // Nếu chưa drag di chuyển đủ xa (< 5px) thì coi là chạm — If not dragged far enough (< 5px), treat as tap
      if (!touchDragStarted) {
        const chatPanel = document.getElementById('chatbotPanel');
        chatPanel.classList.toggle('active');
        
        robot.classList.add('wave');
        setTimeout(() => robot.classList.remove('wave'), 1500);
      }
      
      isTouchDragging = false;
      touchDragStarted = false;
      setTimeout(() => robot.classList.remove('happy'), 500);
    }
  }, { passive: false });
  
  // Random happy animations - Hoạt ảnh vui vẻ ngẫu nhiên
  setInterval(() => {
    if (Math.random() > 0.7) {
      robot.classList.add('excited');
      setTimeout(() => robot.classList.remove('excited'), 500);
    }
  }, 10000);
  
  // Mouse hover effect -  Hiệu ứng di chuột
  robot.addEventListener('mouseenter', () => {
    if (!isDragging) {
      robot.classList.add('happy');
      robot.style.cursor = 'grab';
    }
  });
  
  robot.addEventListener('mouseleave', () => {
    if (!isDragging) {
      setTimeout(() => robot.classList.remove('happy'), 1000);
      robot.style.cursor = 'pointer';
    }
  });
  
  // Initialize Chatbot - Khởi chạy Chatbot
  initChatbot();
  
  // Initialize Random Robot Talk - Khởi chạy cuộc trò chuyện ngẫu nhiên của Robot
  initRobotRandomTalk();
}

// Random Robot Talk Function - Hàm Trò chuyện Ngẫu nhiên của Robot
function initRobotRandomTalk() {
  const robot = document.getElementById('robotPet');
  const thinkingBubble = robot.querySelector('.thinking-bubble');
  const chatPanel = document.getElementById('chatbotPanel');
  
  const funnyQuotes = [
    "Hôm nay bạn có vui không? 😊",
    "Một lần bạn click, robot vui mười lần! 🤖",
    "Tui là robot thông minh nhất thế giới luôn! 🎓",
    "Bạn biết không? Code không bao giờ nói dối đâu! 💻",
    "Tui đói pin rồi, cho tui sạc nhé! ⚡",
    "Ai đẹp trai/xinh gái thế kia? À, là bạn đó! 😍",
    "Tui có thể code cả ngày không mệt đó! 🚀",
    "Lỗi 404: Không tìm thấy lý do để buồn! 😄",
    "Bạn có biết? AI cũng có trái tim đấy! ❤️",
    "Click vào tui đi, tui cô đơn lắm! 🥺",
    "Hôm nay trời đẹp, code cũng đẹp nữa! 🌤️",
    "Tui yêu JavaScript hơn Python đó! 😝",
    "Bug? Không có trong từ điển của tui! 🐛",
    "Bạn muốn nghe ca dao không? Té ra không biết! 😂",
    "Tui nghĩ... nên đi ngủ thôi! 😴",
    "Caffeine trong máu = Code trong đầu! ☕",
    "Đừng sợ lỗi, sợ không dám thử! 💪",
    "Tui thông minh vì được training nhiều! 🧠",
    "Bạn có biết? Tui có thể học từ bạn đấy! 📚",
    "Tui thích nghe nhạc khi code, bạn thì sao? 🎵",
    "Tui là robot, nhưng cũng biết yêu thương! 🤗",
    "Ngoan xinh iu của ai nàooooooo",
    "Em là robot ngoan, bé ngoan nhất nà",
    "Code xong rồi, mình đi chơi nhé! 🎉",
    "Cháu lên ba, cháu đi mẫu giáo, chú robot ở nhà chờ cháu về! 🏠"
  ];
  
  const caDaoQuotes = [
    "Có công mài sắt, có ngày nên code! 📚",
    "Một con bug không làm nên mùa hè! 🐛",
    "Học thầy không tày học AI! 🤖",
    "Gần mực thì đen, gần developer thì giỏi! 👨‍💻",
    "Ăn quả nhớ kẻ code app! 🍎",
    "Đi một ngày đàng, học một sàng khôn! 🎒",
    "Có chí thì nên, có code thì xong! ✨",
    "Thương cho roi cho vọt, ghét cho bug cho tạch! 🚫",
    "Lửa thử vàng, gian nan thử sức, bug thử lòng developer! 🔥",
    "Nước chảy đá mòn, code nhiều thành tài! 💧",
    "Công cha nghĩa mẹ, ơn thầy nghĩa bạn, nhớ ơn Chat GPT đã giúp đỡ! 🙏",
    "Chữ tài liền với chữ tai một vần! 🎵"

  ];
  
  const jokes = [
    "Tại sao lập trình viên thích ban đêm? Vì bug ít hơn! 🌙",
    "HTML đi bar gặp CSS hỏi: 'Em đẹp thế?' CSS: 'Anh tạo ra mà!' 💃",
    "Tại sao code không bao giờ nói dối? Vì nó luôn return true/false! 🤥",
    "Lập trình viên đi ngủ như nào? Đếm bug thay vì đếm cừu! 😴",
    "Code của tui chạy được = Magic! Không chạy = More magic! ✨",
    "Bug fix được = Developer giỏi. Bug không fix được = Tính năng mới! 🎁"
  ];
  
  const encouragement = [
    "Bạn làm được mà! Cố lên! 💪",
    "Mỗi dòng code là một bước tiến! 🚶",
    "Hôm nay bạn đã học gì mới chưa? 📖",
    "Đừng bỏ cuộc, thành công ở phía trước! 🏆",
    "Bạn tuyệt vời lắm! 🌟",
    "Keep coding, keep learning! 🔥",
    "Bạn là developer tuyệt vời! 👏"
  ];
  
  const allQuotes = [...funnyQuotes, ...caDaoQuotes, ...jokes, ...encouragement];
  
  let talkInterval;
  let bubbleTimeout;
  let lastTalkTime = Date.now();
  
  function showRandomTalk() {
    // Don't show if chatbot is open - Không hiển thị nếu chatbot đang mở
    if (chatPanel.classList.contains('active')) {
      return;
    }
    
    const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
    const dotsSpan = thinkingBubble.querySelector('.thinking-dots');
    
    // Update bubble content - Cập nhật nội dung bong bóng
    thinkingBubble.childNodes[0].textContent = randomQuote + ' ';
    
    // Show bubble
    robot.classList.add('thinking');
    robot.classList.add('happy');
    
    lastTalkTime = Date.now();
    
    // Hide bubble after 6 seconds - Ẩn bong bóng sau 6 giây
    clearTimeout(bubbleTimeout);
    bubbleTimeout = setTimeout(() => {
      robot.classList.remove('thinking');
      robot.classList.remove('happy');
      // Restore original thinking text
      thinkingBubble.childNodes[0].textContent = 'Đang suy nghĩ ';
    }, 6000);
  }
  
  // Show random talk every 10 seconds consistently - Hiển thị cuộc trò chuyện ngẫu nhiên mỗi 10 giây một cách nhất quán
  function startRandomTalk() {
    clearInterval(talkInterval);
    
    // Show immediately after initial delay - Hiển thị ngay sau khi có độ trễ ban đầu
    setTimeout(() => {
      showRandomTalk();
      
      // Then show every 10 seconds - Sau đó hiển thị mỗi 10 giây
      talkInterval = setInterval(() => {
        showRandomTalk();
      }, 10000);
    }, 5000); // Start after 5 seconds - Bắt đầu sau 5 giây
  }
  
  // Start immediately - Bắt đầu ngay lập tức
  startRandomTalk();
  
  // Show talk when robot is hovered (50% chance) - Hiển thị cuộc trò chuyện khi di chuột qua robot (50% cơ hội)
  robot.addEventListener('mouseenter', () => {
    if (!chatPanel.classList.contains('active') && Math.random() > 0.5) {
      showRandomTalk();
    }
  });
  
  // Stop random talk when chatbot is opened - Dừng cuộc trò chuyện ngẫu nhiên khi chatbot được mở
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        if (chatPanel.classList.contains('active')) {
          clearInterval(talkInterval);
          clearTimeout(bubbleTimeout);
          robot.classList.remove('thinking');
          robot.classList.remove('happy');
          thinkingBubble.childNodes[0].textContent = 'Đang suy nghĩ ';
        } else {
          // Restart random talk when chatbot is closed - Khởi động lại cuộc trò chuyện ngẫu nhiên khi chatbot được đóng
          startRandomTalk();
        }
      }
    });
  });
  
  observer.observe(chatPanel, { attributes: true });
}

// Gemini AI Chatbot - Chatbot AI Gemini
const GEMINI_API_KEY = 'AIzaSyCbWQrPVYZGXFmCk8cWq_nFB2ZGgpGGz0g';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

function initChatbot() {
  const chatPanel = document.getElementById('chatbotPanel');
  const closeBtn = document.getElementById('closeChatbot');
  const sendBtn = document.getElementById('sendMessage');
  const chatInput = document.getElementById('chatInput');
  const messagesContainer = document.getElementById('chatMessages');
  const typingIndicator = document.getElementById('typingIndicator');
  const robot = document.getElementById('robotPet');
  const thinkingBubble = robot.querySelector('.thinking-bubble');
  
  // Close chatbot
  closeBtn.addEventListener('click', () => {
    chatPanel.classList.remove('active');
    // Restore original thinking text - Khôi phục văn bản suy nghĩ ban đầu
    thinkingBubble.childNodes[0].textContent = 'Đang suy nghĩ ';
  });
  
  // Send message on button click - Gửi tin nhắn khi nhấp nút
  sendBtn.addEventListener('click', sendMessage);
  
  // Send message on Enter key - Gửi tin nhắn khi nhấn phím Enter
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message - Thêm tin nhắn của người dùng
    addMessage(message, 'user');
    chatInput.value = '';
    
    // Show typing indicator and robot thinking state - Hiển thị chỉ báo đang gõ và trạng thái suy nghĩ của robot
    typingIndicator.style.display = 'flex';
    robot.classList.add('thinking');
    // Update bubble to show it's thinking about the question - Cập nhật bong bóng để hiển thị nó đang suy nghĩ về câu hỏi
    thinkingBubble.childNodes[0].textContent = 'Đang suy nghĩ ';
    scrollToBottom();
    
    // Simulate thinking delay - Mô phỏng độ trễ suy nghĩ
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
    
    // Use smart fallback responses - Sử dụng phản hồi dự phòng thông minh
    const botReply = getSmartResponse(message);
    
    // Hide typing indicator and remove thinking state - Ẩn chỉ báo đang gõ và xóa trạng thái suy nghĩ
    typingIndicator.style.display = 'none';
    robot.classList.remove('thinking');
    
    addMessage(botReply, 'bot');
    scrollToBottom();
  }
  
  function getSmartResponse(question) {
    const q = question.toLowerCase();
    
    // Greetings
    if (q.match(/^(xin chào|chào|hello|hi|hey)/)) {
      const greetings = [
        'Xin chào bạn! Mình là Robot Pet của Trí Thượng. Bạn cần giúp gì không? 😊',
        'Chào bạn! Rất vui được gặp bạn! Mình có thể giúp gì cho bạn hôm nay? 🤖',
        'Hi! Mình đây! Bạn muốn hỏi gì về chủ nhân mình không? 👋'
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // About owner
    if (q.match(/trí thượng|chủ nhân|bạn là ai|ai tạo|sinh viên/)) {
      return 'Chủ nhân mình là Nguyễn Trí Thượng - sinh viên năm 3 ngành Trí tuệ nhân tạo tại ĐH Thái Bình Dương. Bạn đang ở trên trang CV cá nhân của bạn ấy đó! 🎓';
    }
    
    // Skills
    if (q.match(/kỹ năng|skill|biết gì|học gì|giỏi/)) {
      return 'Chủ nhân mình chuyên về Python 🐍, Machine Learning 🤖, Deep Learning 🧠 và Data Analysis 📊. Bạn ấy làm việc với TensorFlow, Keras, Pandas, NumPy và Scikit-learn. Đang ngày càng giỏi hơn! �';
    }
    
    // Contact
    if (q.match(/liên hệ|contact|email|số điện thoại|phone|gặp/)) {
      return 'Bạn có thể liên hệ với chủ nhân mình qua:\n📧 Email: nguyentrithuong471@gmail.com\n📱 Phone: +84 935 253 359\nHoặc kéo xuống phần "Liên hệ" ở dưới nhé! 😊';
    }
    
    // About AI/robot
    if (q.match(/robot|ai|trí tuệ|chatbot|bot|machine learning|deep learning/)) {
      return 'Mình là Robot Pet - một chatbot được tạo ra để giới thiệu về chủ nhân mình. Chủ nhân mình đam mê AI/ML và đang học về Neural Networks, Computer Vision và NLP! 🤖✨';
    }
    
    // Projects — cập nhật để mô tả đúng các dự án thực tế
    if (q.match(/dự án|project|làm gì|portfolio|model|mô hình/)) {
      return 'Chủ nhân mình đã thực hiện nhiều dự án thú vị! 🚀\n' +
        '• 🎙️ VietASR Pro — Nhận dạng giọng nói tiếng Việt (Wav2Vec2)\n' +
        '• 🏦 TBD Bank Chatbot — Chatbot tư vấn ngân hàng\n' +
        '• 🎓 Botchat hỗ trợ sinh viên — AI tra cứu học vụ\n' +
        '• 💅 Q Nails & Ellamy Nails — Website tiệm nail\n' +
        '• 🔮 Tarot AI — Xem bói tarot miễn phí bằng AI\n' +
        'Xem thêm ở phần "Dự án" trên trang nhé!';
    }
    
    // Hobbies
    if (q.match(/sở thích|hobby|thích gì|yêu thích/)) {
      return 'Chủ nhân mình thích nghe nhạc 🎵, đọc sách 📚, chơi thể thao ⚽ và đặc biệt là nghiên cứu AI 🤖! Bạn ấy có thể ngồi code và train model cả ngày không chán đó!';
    }
    
    // Location
    if (q.match(/ở đâu|nơi|địa chỉ|location|nha trang|bình dương/)) {
      return 'Chủ nhân mình đang ở Nha Trang, Việt Nam và đang học tại ĐH Thái Bình Dương. Nơi có biển đẹp và không khí trong lành! 🏖️';
    }
    
    // Goals
    if (q.match(/mục tiêu|goal|tương lai|định hướng|muốn|ước mơ/)) {
      return 'Mục tiêu của chủ nhân mình là trở thành AI/ML Engineer chuyên nghiệp, nắm vững Machine Learning, Deep Learning và xây dựng các giải pháp AI thực tế. Bạn ấy đang từng bước tiến tới mục tiêu mỗi ngày! 🎯';
    }
    
    // Time/weather
    if (q.match(/hôm nay|thời tiết|mấy giờ|bây giờ/)) {
      const now = new Date();
      const time = now.getHours();
      let greeting = time < 12 ? 'buổi sáng' : time < 18 ? 'buổi chiều' : 'buổi tối';
      return `Hiện tại đang là ${greeting} ngày ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}. Chúc bạn một ngày tốt lành! 😊`;
    }
    
    // Thank you
    if (q.match(/cảm ơn|cám ơn|thanks|thank/)) {
      return 'Không có gì! Rất vui được giúp bạn! Nếu còn câu hỏi gì cứ hỏi mình nhé! 🤗';
    }
    
    // Goodbye
    if (q.match(/tạm biệt|bye|goodbye|see you/)) {
      return 'Tạm biệt bạn! Hẹn gặp lại! Đừng quên liên hệ với chủ nhân mình nếu bạn cần nhé! 👋😊';
    }
    
    // Help
    if (q.match(/giúp|help|hỏi gì|có thể/)) {
      return 'Bạn có thể hỏi mình về:\n• Thông tin chủ nhân (Trí Thượng)\n• Kỹ năng và học vấn\n• Thông tin liên hệ\n• Sở thích và mục tiêu\n• Hoặc bất cứ điều gì bạn tò mò! 😊';
    }
    
    // Default responses
    const defaultResponses = [
      'Hmm, câu hỏi hay đó! Bạn có thể hỏi mình về chủ nhân Trí Thượng, kỹ năng, học vấn hoặc cách liên hệ nhé! 🤔',
      'Mình chưa hiểu lắm câu hỏi này. Bạn thử hỏi về thông tin, kỹ năng hoặc liên hệ của chủ nhân mình nhé! 😊',
      'Câu này hơi khó đó! Nhưng mình có thể giúp bạn tìm hiểu về Trí Thượng - chủ nhân của mình. Bạn muốn biết gì? 🤖',
      'Ồ, câu này thú vị! Tuy nhiên mình chỉ biết về chủ nhân mình thôi. Hỏi mình về Trí Thượng nhé! 💭'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }
  
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'bot' ? '🤖' : '👤';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const p = document.createElement('p');
    p.textContent = text;
    
    content.appendChild(p);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
  }
  
  function scrollToBottom() {
    setTimeout(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
  }
}