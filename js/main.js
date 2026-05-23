// ============================================================
// TYPING EFFECT — Hiệu ứng gõ chữ trong hero section
// ============================================================
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

// ============================================================
// HELPER: QUẢN LÝ TRẠNG THÁI CHATBOT
// Đồng bộ ba trạng thái: chatbotPanel.active, body.chatbot-open, robotPet.chatbot-open
// Helper: manage chatbot open/close state across three sync points
// ============================================================
function setChatbotOpen(isOpen) {
  const chatPanel = document.getElementById('chatbotPanel');
  const robot = document.getElementById('robotPet');
  if (!chatPanel || !robot) return;

  if (isOpen) {
    chatPanel.classList.add('active');
    document.body.classList.add('chatbot-open');
    robot.classList.add('chatbot-open');

    // Xóa inline styles do kéo thả hoặc scroll gây ra — tránh robot nhảy vị trí
    // Clear drag/scroll inline styles to prevent position jump when opening
    robot.style.left = '';
    robot.style.top = '';
    robot.style.right = '';
    robot.style.bottom = '';
    robot.style.transform = '';
  } else {
    chatPanel.classList.remove('active');
    document.body.classList.remove('chatbot-open');
    robot.classList.remove('chatbot-open');
  }
}

function toggleChatbot() {
  const chatPanel = document.getElementById('chatbotPanel');
  if (!chatPanel) return;
  const isOpen = chatPanel.classList.contains('active');
  setChatbotOpen(!isOpen);
}

// ============================================================
// ROBOT PET — Logic chính của robot: mắt, scroll, kéo thả, chat
// Robot Pet main logic: eyes, scroll, drag-and-drop, chatbot
// ============================================================
function initRobotPet() {
  const robot = document.getElementById('robotPet');
  if (!robot) return;
  
  // Cache DOM elements — tránh gọi querySelector nhiều lần trong scroll/mousemove
  // Cache DOM elements — avoid repeated DOM lookup in scroll/mousemove handlers
  const pupils = document.querySelectorAll('.pupil');
  let lastScrollY = window.scrollY;
  let scrollDirection = 'down';
  let isChatbotOpen = false;

  // Theo dõi trạng thái chatbot để scroll handler không ghi đè vị trí robot
  // Track chatbot state so scroll handler doesn't override robot position
  const chatPanel = document.getElementById('chatbotPanel');
  if (chatPanel) {
    // Quan sát class changes trên chatPanel để đồng bộ cờ trạng thái
    // Observe class changes on chatPanel to sync state flag
    const observer = new MutationObserver(() => {
      isChatbotOpen = chatPanel.classList.contains('active');
    });
    observer.observe(chatPanel, { attributes: true, attributeFilter: ['class'] });
  }

  // Theo dõi chuyển động chuột để mắt robot nhìn theo — Mouse tracking for eye follow
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
  
  // Robot di chuyển theo scroll — chỉ khi chatbot ĐÓNG
  // Robot follows scroll position — only when chatbot is CLOSED
  let ticking = false;
  window.addEventListener('scroll', () => {
    // Không cập nhật vị trí robot khi chatbot đang mở — tránh robot nhảy
    // Do not update robot position when chatbot is open
    if (isChatbotOpen) return;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollDiff = currentScrollY - lastScrollY;
        
        if (scrollDiff > 0) {
          scrollDirection = 'down';
        } else if (scrollDiff < 0) {
          scrollDirection = 'up';
        }
        
        // Di chuyển robot dựa trên scroll — Move robot based on scroll
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        const maxMovement = window.innerHeight - 200;
        const newBottom = 30 + (maxMovement * scrollPercent / 100);
        
        // Chỉ cập nhật nếu chatbot vẫn đóng (kiểm tra lại trong rAF)
        // Re-check inside rAF before updating
        if (!isChatbotOpen) {
          robot.style.bottom = Math.min(newBottom, maxMovement + 30) + 'px';
        }
        
        // Xoay nhẹ theo hướng scroll — Slight rotation based on scroll direction
        if (Math.abs(scrollDiff) > 5 && !isChatbotOpen) {
          const rotation = scrollDirection === 'down' ? 5 : -5;
          robot.style.transform = `rotate(${rotation}deg)`;
          
          setTimeout(() => {
            if (!isChatbotOpen) robot.style.transform = 'rotate(0deg)';
          }, 300);
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
      });
      
      ticking = true;
    }
  });
  
  // ============================================================
  // MOUSE EVENTS — Kéo thả và click để toggle chatbot (Desktop)
  // Mouse drag-and-drop and click to toggle chatbot (Desktop)
  // ============================================================
  let clickTimer = null;
  let isDragging = false;
  let dragStarted = false;
  
  robot.addEventListener('mousedown', (e) => {
    // Không kéo khi chatbot đang mở — Disable drag when chatbot is open
    if (isChatbotOpen) return;
    // Không xử lý nếu click vào bên trong chatbot panel
    if (e.target.closest('#chatbotPanel')) return;

    e.preventDefault();
    
    clickTimer = setTimeout(() => {
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
    }, 200); // 200ms trễ trước khi bắt đầu kéo — 200ms delay before drag starts
  });
  
  robot.addEventListener('mouseup', () => {
    clearTimeout(clickTimer);
    
    // Nếu không kéo thả thì toggle chatbot — Toggle chatbot if not dragging
    if (!dragStarted && !isDragging) {
      toggleChatbot();
      
      robot.classList.add('wave');
      setTimeout(() => robot.classList.remove('wave'), 1500);
    }
    
    isDragging = false;
    dragStarted = false;
  });
  
  robot.addEventListener('click', (e) => {
    // Ngăn click nếu đang kéo — Prevent click if was dragging
    if (dragStarted) {
      e.stopPropagation();
    }
  });

  // ============================================================
  // TOUCH EVENTS — Hỗ trợ kéo thả trên thiết bị cảm ứng (mobile)
  // Touch drag-and-drop support for mobile devices
  // ============================================================
  let touchStartX = 0;
  let touchStartY = 0;
  let touchDragStarted = false;
  let isTouchDragging = false;
  let touchOffsetX = 0;
  let touchOffsetY = 0;

  robot.addEventListener('touchstart', (e) => {
    // Bỏ qua nếu chạm vào bên trong chatbot panel — Skip if touching inside chatbot panel
    if (e.target.closest('#chatbotPanel')) return;
    // Khi chatbot đang mở, chỉ cho phép tap để đóng, không kéo thả
    // When chatbot is open, only allow tap to close, no dragging
    if (isChatbotOpen) {
      isTouchDragging = true;
      touchDragStarted = false;
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      return; // Không preventDefault khi chatbot mở — avoid blocking panel interaction
    }

    // Chặn scroll trang khi kéo robot — Prevent page scroll when dragging robot
    e.preventDefault();
    
    const touch = e.touches[0];
    isTouchDragging = true;
    touchDragStarted = false;
    
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    
    const rect = robot.getBoundingClientRect();
    touchOffsetX = touchStartX - rect.left;
    touchOffsetY = touchStartY - rect.top;
    
    robot.style.position = 'fixed';
  }, { passive: false });

  robot.addEventListener('touchmove', (e) => {
    if (!isTouchDragging) return;
    // Không kéo khi chatbot đang mở — No drag when chatbot is open
    if (isChatbotOpen) return;
    
    const touch = e.touches[0];
    const currentX = touch.clientX;
    const currentY = touch.clientY;
    
    const dist = Math.hypot(currentX - touchStartX, currentY - touchStartY);
    if (dist >= 8) {
      touchDragStarted = true;
    }
    
    if (touchDragStarted) {
      // Chặn cuộn trang khi di chuyển robot — Prevent page scroll while moving robot
      e.preventDefault();
      
      const x = currentX - touchOffsetX;
      const y = currentY - touchOffsetY;
      
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
      // Nếu chưa kéo đủ xa (<8px) thì coi là tap — If not dragged far, treat as tap
      if (!touchDragStarted) {
        toggleChatbot();
        
        robot.classList.add('wave');
        setTimeout(() => robot.classList.remove('wave'), 1500);
      }
      
      isTouchDragging = false;
      touchDragStarted = false;
      setTimeout(() => robot.classList.remove('happy'), 500);
    }
  }, { passive: false });
  
  // Ngăn sự kiện từ chatbot panel bubble lên robot — Prevent chatbot panel events from bubbling to robot
  const panel = document.getElementById('chatbotPanel');
  if (panel) {
    panel.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
    panel.addEventListener('mousedown', (e) => e.stopPropagation());
  }
  
  // Hoạt ảnh ngẫu nhiên — Random happy animations (không đổi vị trí)
  setInterval(() => {
    if (Math.random() > 0.7) {
      robot.classList.add('excited');
      setTimeout(() => robot.classList.remove('excited'), 500);
    }
  }, 10000);
  
  // Hiệu ứng hover chuột — Mouse hover effect
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
  
  // Khởi chạy Chatbot
  initChatbot();
  // Khởi chạy cuộc trò chuyện ngẫu nhiên của Robot
  initRobotRandomTalk();
}

// ============================================================
// RANDOM ROBOT TALK — Hàm trò chuyện ngẫu nhiên của Robot
// Random speech bubbles from the robot pet
// ============================================================
function initRobotRandomTalk() {
  const robot = document.getElementById('robotPet');
  if (!robot) return;
  const thinkingBubble = robot.querySelector('.thinking-bubble');
  if (!thinkingBubble) return;
  const chatPanel = document.getElementById('chatbotPanel');
  
  const funnyQuotes = [
    "Hôm nay bạn có vui không?",
    "Một lần bạn click, robot vui mỗi lần!",
    "Tui là robot thông minh nhất thế giới luôn!",
    "Bạn biết không? Code không bao giờ nói dối đâu!",
    "Tui đói pin rồi, cho tui sạc nha!",
    "Ai đẹp trai/xinh gái thế kia? À, là bạn đó!",
    "Tui có thể code cả ngày không mệt đó!",
    "Lỗi 404: Không tìm thấy là do đề buồn!",
    "Bạn có biết? AI cũng có trái tim đây!",
    "Click vào tui đi, tui cô đơn lắm!",
    "Hôm nay trời đẹp, code cũng đẹp nữa!",
    "Tui yêu JavaScript hơn Python đó!",
    "Bug? Không có trong từ điển của tui!",
    "Bạn muốn nghe ca dao không? Tức ra không biết!",
    "Tui nghĩ... nên đi ngủ thôi!",
    "Hello World! Tui là robot cute nhất!",
    "Bạn đang xem CV của Trí Thượng đó nhe!",
    "Mình có thể giúp bạn tìm hiểu về chủ nhân!",
    "Hỏi mình về thời tiết hay giờ giấc đi!",
    "AI không ngủ, AI chỉ... tắt nguồn thôi!",
  ];

  const greetings = [
    "Xin chào! Mình là Robot AI!",
    "Chào bạn! Bạn có muốn hỏi về Trí Thượng không?",
    "Hey! Mình đang online nè!",
  ];

  const allQuotes = [...greetings, ...funnyQuotes];

  let talkInterval = null;
  let bubbleTimeout = null;
  let lastTalkTime = 0;

  function showRandomTalk() {
    if (!thinkingBubble) return;
    // Không hiện bong bóng khi chatbot đang mở — hide bubble while chatbot panel is open
    if (chatPanel && chatPanel.classList.contains('active')) return;

    const now = Date.now();
    if (now - lastTalkTime < 8000) return;

    const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
    const dotsSpan = thinkingBubble.querySelector('.thinking-dots');

    thinkingBubble.childNodes[0].textContent = randomQuote + ' ';

    robot.classList.add('thinking');
    robot.classList.add('happy');

    lastTalkTime = Date.now();

    clearTimeout(bubbleTimeout);
    bubbleTimeout = setTimeout(() => {
      robot.classList.remove('thinking');
      robot.classList.remove('happy');
      thinkingBubble.childNodes[0].textContent = 'Đang suy nghĩ ';
    }, 6000);
  }

  function startRandomTalk() {
    clearInterval(talkInterval);

    setTimeout(() => {
      showRandomTalk();

      talkInterval = setInterval(() => {
        showRandomTalk();
      }, 10000);
    }, 5000); // Bắt đầu sau 5 giây — Start after 5 seconds
  }

  // Bắt đầu random talk ngay lập tức
  startRandomTalk();
}

/* ============================================================
   MODULE THỜI GIAN THỰC — Lấy ngày giờ hiện tại chi tiết
   Real-time date/time module with Vietnamese formatting
   ============================================================ */
function getRealTimeInfo() {
  const now = new Date();
  
  // Ngày trong tuần tiếng Việt — Vietnamese day names
  const daysVi = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  
  // Tên tháng tiếng Việt — Vietnamese month names
  const monthsVi = [
    'tháng 1', 'tháng 2', 'tháng 3', 'tháng 4',
    'tháng 5', 'tháng 6', 'tháng 7', 'tháng 8',
    'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'
  ];

  const dayName   = daysVi[now.getDay()];
  const day       = now.getDate();
  const month     = monthsVi[now.getMonth()];
  const year      = now.getFullYear();
  const hours     = now.getHours();
  const minutes   = String(now.getMinutes()).padStart(2, '0');
  const seconds   = String(now.getSeconds()).padStart(2, '0');

  // Xác định buổi trong ngày — Determine time of day greeting
  let buoi, emoji;
  if (hours >= 5 && hours < 12) {
    buoi = 'buổi sáng'; emoji = '🌅';
  } else if (hours >= 12 && hours < 14) {
    buoi = 'buổi trưa'; emoji = '☀️';
  } else if (hours >= 14 && hours < 18) {
    buoi = 'buổi chiều'; emoji = '🌤️';
  } else if (hours >= 18 && hours < 22) {
    buoi = 'buổi tối'; emoji = '🌙';
  } else {
    buoi = 'đêm khuya'; emoji = '🌛';
  }

  return {
    dayName, day, month, year,
    hours, minutes, seconds, buoi, emoji,
    fullDate: `${dayName}, ngày ${day} ${month} năm ${year}`,
    fullTime: `${hours}:${minutes}:${seconds}`,
    greeting: `${buoi} ${emoji}`
  };
}

/* ============================================================
   MODULE THỜI TIẾT REALTIME — Gọi Open-Meteo API (miễn phí, không cần API key)
   Real-time weather via Open-Meteo free API (no key required)
   Geocoding via Open-Meteo Geocoding API
   ============================================================ */
async function getWeatherInfo(cityName) {
  try {
    // Bước 1: Geocoding — chuyển tên thành phố thành tọa độ
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=vi&format=json`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      return null; // Không tìm thấy địa điểm — Location not found
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Bước 2: Lấy dữ liệu thời tiết hiện tại — Fetch current weather
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&wind_speed_unit=kmh&timezone=auto`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    if (!weatherData.current) return null;

    const current = weatherData.current;

    // Bảng mô tả mã thời tiết WMO — WMO weather code descriptions in Vietnamese
    const weatherDescriptions = {
      0: { vi: 'Trời quang đãng ☀️', icon: '☀️' },
      1: { vi: 'Hầu hết quang đãng 🌤️', icon: '🌤️' },
      2: { vi: 'Có mây một phần ⛅', icon: '⛅' },
      3: { vi: 'Nhiều mây ☁️', icon: '☁️' },
      45: { vi: 'Có sương mù 🌫️', icon: '🌫️' },
      48: { vi: 'Sương mù đóng băng 🌫️', icon: '🌫️' },
      51: { vi: 'Mưa phùn nhẹ 🌦️', icon: '🌦️' },
      53: { vi: 'Mưa phùn vừa 🌦️', icon: '🌦️' },
      55: { vi: 'Mưa phùn dày 🌧️', icon: '🌧️' },
      61: { vi: 'Mưa nhẹ 🌧️', icon: '🌧️' },
      63: { vi: 'Mưa vừa 🌧️', icon: '🌧️' },
      65: { vi: 'Mưa to 🌧️', icon: '🌧️' },
      71: { vi: 'Tuyết rơi nhẹ ❄️', icon: '❄️' },
      73: { vi: 'Tuyết rơi vừa ❄️', icon: '❄️' },
      75: { vi: 'Tuyết rơi dày ❄️', icon: '❄️' },
      80: { vi: 'Mưa rào nhẹ 🌦️', icon: '🌦️' },
      81: { vi: 'Mưa rào vừa 🌦️', icon: '🌦️' },
      82: { vi: 'Mưa rào nặng hạt ⛈️', icon: '⛈️' },
      95: { vi: 'Giông bão ⛈️', icon: '⛈️' },
      96: { vi: 'Giông có mưa đá ⛈️', icon: '⛈️' },
      99: { vi: 'Giông mưa đá lớn ⛈️', icon: '⛈️' },
    };

    const wmoCode = current.weather_code;
    const desc = weatherDescriptions[wmoCode] || { vi: 'Không xác định 🌡️', icon: '🌡️' };

    return {
      city: name,
      country,
      temp: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      wind: Math.round(current.wind_speed_10m),
      description: desc.vi,
      icon: desc.icon
    };

  } catch (err) {
    // Lỗi mạng hoặc API — Network/API error
    console.error('[Weather] Lỗi lấy thời tiết:', err);
    return null;
  }
}

// ============================================================
// CHATBOT — Khởi tạo và xử lý logic chatbot
// Chatbot initialization and message handling
// ============================================================
function initChatbot() {
  // Guard: kiểm tra tất cả element cần thiết trước khi bind events
  // Guard: verify all required elements exist before binding events
  const chatPanel = document.getElementById('chatbotPanel');
  const closeBtn = document.getElementById('closeChatbot');
  const sendBtn = document.getElementById('sendMessage');
  const chatInput = document.getElementById('chatInput');
  const messagesContainer = document.getElementById('chatMessages');
  const typingIndicator = document.getElementById('typingIndicator');
  const robot = document.getElementById('robotPet');

  // Nếu thiếu element nào thì warn và return, tránh crash
  // Warn and return if any required element is missing
  const missing = [
    ['chatbotPanel', chatPanel], ['closeChatbot', closeBtn],
    ['sendMessage', sendBtn], ['chatInput', chatInput],
    ['chatMessages', messagesContainer], ['typingIndicator', typingIndicator],
    ['robotPet', robot],
  ].filter(([, el]) => !el).map(([id]) => id);

  if (missing.length > 0) {
    console.warn('[initChatbot] Thiếu element:', missing.join(', '));
    return;
  }

  const thinkingBubble = robot.querySelector('.thinking-bubble');

  // Đóng chatbot khi bấm nút X — Close chatbot on close button click
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    setChatbotOpen(false);
    if (thinkingBubble) thinkingBubble.childNodes[0].textContent = 'Đang suy nghĩ ';
  });

  // Ngăn click trong panel bubble lên robot — Prevent clicks inside panel from bubbling to robot
  chatPanel.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  /* ============================================================
     BIND EVENTS — Gắn sự kiện cho nút gửi và input
     Xử lý cả click, Enter, và touch để đảm bảo hoạt động
     trên mọi trình duyệt và thiết bị mobile
     ============================================================ */

  // Nút gửi — Send button click
  sendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    sendMessage();
  });

  // Phím Enter trong input — Enter key in input field
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Touch: đảm bảo input focus đúng trên iOS — Ensure input focus on iOS
  chatInput.addEventListener('touchstart', (e) => {
    e.stopPropagation();
  }, { passive: true });

  sendBtn.addEventListener('touchstart', (e) => {
    e.stopPropagation();
  }, { passive: true });

  /* ============================================================
     SEND MESSAGE — Xử lý gửi tin nhắn với guard checks
     Handle message sending with null checks and state guards
     ============================================================ */
  async function sendMessage() {
    if (!chatInput || !messagesContainer) return;

    const message = chatInput.value.trim();

    if (!message) {
      chatInput.focus();
      return;
    }

    // Tránh gửi trùng khi đang xử lý — Prevent double send while processing
    if (sendBtn.disabled) return;
    sendBtn.disabled = true;

    // Hiển thị tin nhắn user — Display user message
    addMessage(message, 'user');
    chatInput.value = '';

    // Hiện typing indicator — Show typing indicator
    typingIndicator.style.display = 'flex';
    if (robot) robot.classList.add('thinking');
    if (thinkingBubble) thinkingBubble.childNodes[0].textContent = 'Đang suy nghĩ ';
    scrollToBottom();

    const q = message.toLowerCase();

    // Kiểm tra câu hỏi thời tiết — Check if weather query
    const isWeatherQuery = q.match(/thời tiết|nhiệt độ|nóng|lạnh|mưa|nắng|trời|weather|temp/);

    // Kiểm tra câu hỏi thời gian — Check if time/date query
    const isTimeQuery = q.match(/mấy giờ|bây giờ|hôm nay|ngày mấy|thứ mấy|năm nay|ngày tháng|giờ|time|date/);

    let botReply;

    if (isWeatherQuery) {
      // Xử lý câu hỏi thời tiết — Handle weather query
      const cityPatterns = [
        /(?:ở|tại|của|tại\s+thành\s+phố)\s+([a-zA-ZÀ-ỹ\s]+?)(?:\s+(?:hôm nay|bây giờ|như thế nào|thế nào|không|nhé|đi)|[?!.,]|$)/i,
        /thời tiết\s+([a-zA-ZÀ-ỹ\s]+?)(?:\s+(?:hôm nay|bây giờ|như thế nào|thế nào|không|nhé|đi)|[?!.,]|$)/i,
        /([a-zA-ZÀ-ỹ\s]+?)\s+(?:nóng|lạnh|mưa|nắng|trời)\s+không/i,
      ];

      let cityName = null;
      for (const pattern of cityPatterns) {
        const match = message.match(pattern);
        if (match && match[1] && match[1].trim().length > 1) {
          cityName = match[1].trim();
          break;
        }
      }

      // Mặc định Nha Trang nếu không tìm được tên thành phố
      if (!cityName) cityName = 'Nha Trang';

      // Thêm độ trễ tự nhiên — Natural thinking delay
      await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

      const weather = await getWeatherInfo(cityName);

      if (weather) {
        const t = getRealTimeInfo();
        botReply = `Thời tiết tại ${weather.city} (${weather.country}) lúc ${t.fullTime} ${t.greeting}:\n\n` +
          `${weather.icon} ${weather.description}\n` +
          `🌡️ Nhiệt độ: ${weather.temp}°C (cảm giác như ${weather.feelsLike}°C)\n` +
          `💧 Độ ẩm: ${weather.humidity}%\n` +
          `💨 Gió: ${weather.wind} km/h\n\n` +
          `Dữ liệu cập nhật theo thời gian thực từ Open-Meteo! 📡`;
      } else {
        botReply = `Mình không tìm được thông tin thời tiết cho "${cityName}" 😕\n` +
          `Bạn thử hỏi lại với tên thành phố rõ hơn nhé! Ví dụ: "Thời tiết Hà Nội", "Thời tiết TP.HCM" 🌤️`;
      }

    } else if (isTimeQuery) {
      // Xử lý câu hỏi thời gian — Handle time/date query
      await new Promise(resolve => setTimeout(resolve, 600));
      const t = getRealTimeInfo();

      botReply = `Bây giờ là ${t.greeting}!\n\n` +
        `⏰ Thời gian: ${t.fullTime}\n` +
        `📅 Ngày: ${t.fullDate}\n\n` +
        `Chúc bạn một ${t.buoi} thật vui! 😊`;

    } else {
      // Câu hỏi thông thường — Regular query with smart response
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      botReply = getSmartResponse(message);
    }

    // Ẩn typing indicator — Hide typing indicator
    typingIndicator.style.display = 'none';
    if (robot) robot.classList.remove('thinking');

    addMessage(botReply, 'bot');
    scrollToBottom();

    // Mở lại nút gửi sau khi xử lý xong — Re-enable send button after processing
    sendBtn.disabled = false;
    chatInput.focus();
  }

  /* ============================================================
     SMART RESPONSE ENGINE v2.0
     Xử lý ngôn ngữ tự nhiên với 16 nhóm câu hỏi
     NLP-style response handling with 16 question categories
     ============================================================ */
  function getSmartResponse(question) {
    const q = question.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Bỏ dấu để match dễ hơn
      .trim();

    /* ----------------------------------------------------------
       1. CHÀO HỎI — Greeting
       ---------------------------------------------------------- */
    if (q.match(/^(xin chao|chao|hi|hello|hey|alo|yo|sup|chao ban|good morning|good afternoon|good evening|chào|xin chào)/)) {
      const t = getRealTimeInfo();
      const greetings = [
        `Xin chào! ${t.greeting} nhé! 😊\nMình là Robot AI của Trí Thượng!\nBạn muốn biết gì về chủ nhân mình?`,
        `Chào bạn! Rất vui được gặp! 🤖\nMình có thể giúp bạn tìm hiểu về Trí Thượng đó!`,
        `Hello! Mình đang sẵn sàng phục vụ! 🤖\nHôm nay bạn muốn biết gì?`,
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    /* ----------------------------------------------------------
       2. HỎI TÊN — Name query
       ---------------------------------------------------------- */
    if (q.match(/ten ban|ban ten gi|may ten gi|ban la ai|may la ai|name|who are you|ten la gi/)) {
      return '🤖 Mình là Robot AI Pet của Nguyễn Trí Thượng!\n\nMình được tạo ra để giới thiệu về chủ nhân và trò chuyện với bạn.\nBạn muốn biết gì về Trí Thượng không?';
    }

    /* ----------------------------------------------------------
       3. HỌC VẤN — Education
       ---------------------------------------------------------- */
    if (q.match(/hoc van|truong|dai hoc|hoc o dau|sinh vien|education|university|school|khoa|nganh|major|study|hoc gi/)) {
      return '🎓 Học vấn của Trí Thượng:\n\n' +
        '🏫 ĐH Thái Bình Dương, Nha Trang\n' +
        '📚 Ngành: Trí tuệ Nhân tạo\n' +
        '📅 Dự kiến tốt nghiệp: 2025\n' +
        '🎯 Đồ án: VietASR Pro (nhận dạng giọng nói TV)\n\n' +
        'Đam mê nghiên cứu AI và giải quyết vấn đề thực tế!';
    }

    /* ----------------------------------------------------------
       4. THÔNG TIN CÁ NHÂN — Personal info
       ---------------------------------------------------------- */
    if (q.match(/tri thuong|chu nhan|nguyen tri thuong|ban gioi thieu|gioi thieu ban than|ban la nguoi nhu the nao|ban sinh nam nao|tuoi/)) {
      return '👤 Nguyễn Trí Thượng\n\n' +
        '🌊 ĐH Thái Bình Dương, Nha Trang\n' +
        '🤖 Đam mê AI, ML và phát triển web\n' +
        '💻 Đang làm đồ án về nhận dạng giọng nói tiếng Việt\n\n' +
        'Bạn đang xem trang CV cá nhân của bạn ấy đó! 🎯';
    }

    /* ----------------------------------------------------------
       5. KỸ NĂNG — Skills
       ---------------------------------------------------------- */
    if (q.match(/ky nang|skill|biet gi|hoc gi|gioi|cong nghe|tool|framework|python|javascript|ai|ml/)) {
      return '💻 Kỹ năng của Trí Thượng:\n\n' +
        '🐍 Python (75%) — AI, data processing\n' +
        '🤖 Machine Learning (65%) — Scikit-learn\n' +
        '🧠 Deep Learning (60%) — TensorFlow, PyTorch\n' +
        '📊 Data Analysis (70%) — Pandas, NumPy\n' +
        '🌐 Web Dev — HTML, CSS, JS, Bootstrap\n' +
        '🔧 Tools: Jupyter, Kaggle, Git, VS Code';
    }

    /* ----------------------------------------------------------
       6. DỰ ÁN — Projects
       ---------------------------------------------------------- */
    if (q.match(/du an|project|lam gi|portfolio|da lam|xay dung|app|website/)) {
      return '🎯 Các dự án nổi bật:\n\n' +
        '🎤 VietASR Pro — Nhận dạng giọng nói TV (Wav2Vec2)\n' +
        '🏦 TBD Bank Chatbot — Tư vấn ngân hàng AI\n' +
        '🎓 Botchat Sinh Viên — Hỗ trợ học vụ tự động\n' +
        '💅 Q Nails Summerwood — Website đặt lịch nail\n' +
        '💅 Ellamy Nails — Website thương hiệu nail\n' +
        '🔮 Tarot AI — Xem tarot miễn phí bằng AI\n\n' +
        'Xem chi tiết ở section "Dự Án" trên trang! 👆';
    }

    /* ----------------------------------------------------------
       7. ĐỒ ÁN TỐT NGHIỆP — Thesis
       ---------------------------------------------------------- */
    if (q.match(/luan van|do an|tot nghiep|thesis|asr|giong noi|speech|wav2vec|vivos|vlsp/)) {
      return '🎤 Đồ án tốt nghiệp: VietASR Pro\n\n' +
        '📌 Mô hình: Wav2Vec 2.0 (Facebook AI)\n' +
        '📌 Dataset: VIVOS + VLSP 2020\n' +
        '📌 Backend: FastAPI | Demo: Flask\n' +
        '📌 Tính năng: Speaker diarization\n' +
        '📌 Post-processing: KenLM language model\n' +
        '📌 Training: Kaggle GPU T4\n\n' +
        'Nghiên cứu thực tiễn về NLP tiếng Việt! 🔬';
    }

    /* ----------------------------------------------------------
       8. LIÊN HỆ — Contact
       ---------------------------------------------------------- */
    if (q.match(/lien he|contact|email|so dien thoai|phone|gap|hop tac|thue/)) {
      return '📬 Liên hệ với Trí Thượng:\n\n' +
        '📧 nguyentrithuong471@gmail.com\n' +
        '📱 +84 935 253 359\n' +
        '🐙 github.com/CheeseThuong\n' +
        '💼 linkedin.com/in/tri-thuong-nguyen\n' +
        '📘 facebook.com/tri.thuong.379163\n\n' +
        'Hoặc dùng form Liên hệ ở cuối trang! 📝';
    }

    /* ----------------------------------------------------------
       9. SỞ THÍCH — Hobbies
       ---------------------------------------------------------- */
    if (q.match(/so thich|hobby|thich gi|yeu thich|ngoai gio|game|xe|nhac|phat|giai tri/)) {
      return '🎮 Sở thích của Trí Thượng:\n\n' +
        '🤖 Code AI & nghiên cứu Machine Learning\n' +
        '🏍️ Đi phượt xe máy (Honda AB 2026)\n' +
        '🎮 Gaming — TFT/DTCL, Battlefield 2042\n' +
        '🎵 Viết nhạc & sáng tác tiếng Việt\n' +
        '📷 Chụp ảnh & chỉnh ảnh với AI\n' +
        '🔮 Nghiên cứu Tử Vi, Bát Tự, I Ching\n' +
        '🏔️ Du lịch — đã phượt Đà Lạt bằng xe máy!';
    }

    /* ----------------------------------------------------------
       10. MỤC TIÊU — Goals
       ---------------------------------------------------------- */
    if (q.match(/muc tieu|goal|tuong lai|dinh huong|muon|uoc mo|ke hoach/)) {
      return '🚀 Mục tiêu của Trí Thượng:\n\n' +
        '📌 Ngắn hạn: Hoàn thành đồ án tốt nghiệp xuất sắc\n' +
        '🎯 Trung hạn: Trở thành AI/ML Engineer chuyên nghiệp\n' +
        '🌟 Dài hạn: Xây dựng sản phẩm AI phục vụ người Việt\n\n' +
        'Mỗi ngày đều học thêm và tiến gần mục tiêu hơn! 💪';
    }

    /* ----------------------------------------------------------
       11. VỊ TRÍ — Location
       ---------------------------------------------------------- */
    if (q.match(/o dau|noi|dia chi|location|nha trang|khanh hoa|binh duong/)) {
      return '📍 Trí Thượng đang ở:\n' +
        'Nha Trang, Khánh Hòa 🌊\n\n' +
        '🏫 Học tại ĐH Thái Bình Dương\n' +
        '🌟 Thành phố biển đẹp nhất miền Trung!\n\n' +
        'Nha Trang có biển xanh, hải sản tươi ngon — rất đáng ghé! 🐟';
    }

    /* ----------------------------------------------------------
       12. VỀ ROBOT NÀY — About this chatbot
       ---------------------------------------------------------- */
    if (q.match(/robot|ban la gi|chatbot|bot|duoc tao|hoat dong|tinh nang/)) {
      return '🤖 Mình là Robot Pet AI!\n\n' +
        '📌 Tạo bởi: Nguyễn Trí Thượng\n' +
        '📌 Nhiệm vụ: Giới thiệu CV & trò chuyện\n' +
        '📌 Tính năng đặc biệt:\n' +
        '  ⏰ Thời gian thực chính xác\n' +
        '  🌤️ Thời tiết realtime mọi thành phố\n' +
        '  🏃 Kéo thả tự do trên màn hình\n\n' +
        'Thử hỏi "thời tiết Hà Nội" xem! 😊';
    }

    /* ----------------------------------------------------------
       13. CẢM ƠN — Thank you
       ---------------------------------------------------------- */
    if (q.match(/cam on|thanks|thank/)) {
      const replies = [
        'Không có gì! Rất vui được giúp bạn! 🤖',
        'Hehe, mình vui khi giúp được! Hỏi thêm bất cứ lúc nào nhé 😊',
        'Aww cảm ơn bạn đã hỏi! Robot mình cũng vui lắm đó! 🤖❤️',
      ];
      return replies[Math.floor(Math.random() * replies.length)];
    }

    /* ----------------------------------------------------------
       14. TẠM BIỆT — Goodbye
       ---------------------------------------------------------- */
    if (q.match(/tam biet|bye|goodbye|see you|di roi|thoi nghe/)) {
      const now = new Date();
      const h = now.getHours();
      const buoi = h < 12 ? 'sáng' : h < 18 ? 'chiều' : 'tối';
      return `Tạm biệt! Chúc bạn buổi ${buoi} vui vẻ! 👋\n` +
        'Nhớ ghé lại trang của Trí Thượng nha!\n' +
        'Liên hệ: nguyentrithuong471@gmail.com 📧';
    }

    /* ----------------------------------------------------------
       15. HƯỚNG DẪN — Help
       ---------------------------------------------------------- */
    if (q.match(/giup|help|hoi gi|co the|lam duoc gi|tinh nang|chuc nang/)) {
      return '💡 Mình có thể giúp bạn:\n\n' +
        '⏰ "bây giờ mấy giờ" — giờ thực chính xác\n' +
        '🌤️ "thời tiết Hà Nội" — thời tiết realtime\n' +
        '👤 "Trí Thượng là ai" — thông tin chủ nhân\n' +
        '💻 "kỹ năng gì" — skills & công nghệ\n' +
        '🎯 "dự án gì" — portfolio projects\n' +
        '📬 "liên hệ" — thông tin liên lạc\n\n' +
        'Hỏi mình bất cứ điều gì nhé! 😊';
    }

    /* ----------------------------------------------------------
       16. DEFAULT — Phản hồi mặc định thông minh
       ---------------------------------------------------------- */
    const defaults = [
      'Hmm, câu này hơi khó với mình 😅\nThử hỏi: "thời tiết Nha Trang", "mấy giờ rồi", hay "Trí Thượng có dự án gì"?',
      'Mình chưa hiểu câu hỏi này lắm 😅\nGõ "giúp" để xem mình làm được gì nhé!',
      'Câu này nằm ngoài tầm hiểu biết của mình rồi 🤖\nNhưng mình biết rất nhiều về chủ nhân Trí Thượng và thời tiết đó!',
      '🤔 Interesting! Thử hỏi "dự án của Trí Thượng" hay "thời tiết TP.HCM" xem sao nhé! 🌤️',
    ];
    return defaults[Math.floor(Math.random() * defaults.length)];
  }

  /* ============================================================
     ADD MESSAGE — Hiển thị tin nhắn vào khung chat
     Hỗ trợ xuống dòng \n và render emoji đúng
     Display message in chat panel with newline and emoji support
     ============================================================ */
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    // Avatar emoji — Bot dùng robot, user dùng người
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'bot' ? '🤖' : '👤';

    const content = document.createElement('div');
    content.className = 'message-content';

    const p = document.createElement('p');

    // Dùng innerHTML với escape an toàn thay vì textContent để hỗ trợ xuống dòng
    // Use innerHTML with safe escaping to support line breaks
    const safeText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/\n/g, '<br>');

    p.innerHTML = safeText;

    content.appendChild(p);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);

    messagesContainer.appendChild(messageDiv);

    // Animation nhẹ cho tin nhắn mới — Subtle animation for new message
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(8px)';
    requestAnimationFrame(() => {
      messageDiv.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      messageDiv.style.opacity = '1';
      messageDiv.style.transform = 'translateY(0)';
    });

    scrollToBottom();
  }

  function scrollToBottom() {
    setTimeout(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
  }
}
