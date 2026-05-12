/*
=============================
Các tính năng bổ sung và tiện ích
=============================
*/

// Đảm bảo light mode khi trang load (trước khi DOM load)
(function() {
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode !== 'true') {
    // Xóa class dark-mode nếu không phải dark mode
    document.documentElement.classList.remove('dark-mode');
    document.documentElement.style.colorScheme = 'light';
    document.documentElement.style.backgroundColor = '#faf8f4';
    document.documentElement.style.color = '#5d4e37';
    if (document.body) {
      document.body.classList.remove('dark-mode');
      document.body.style.backgroundColor = '#faf8f4';
      document.body.style.color = '#5d4e37';
    }
  } else {
    // Thêm class dark-mode ngay lập tức để tránh flash
    document.documentElement.classList.add('dark-mode');
    document.documentElement.style.colorScheme = 'dark';
    if (document.body) {
      document.body.classList.add('dark-mode');
    }
  }
})();

// Đảm bảo DOM đã load hoàn toàn
document.addEventListener('DOMContentLoaded', function() {
  
  /*
  =============================
  TYPING ANIMATION CHO HERO TEXT
  =============================
  */
  function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }
  
  // Áp dụng typing effect cho tiêu đề hero
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    setTimeout(() => {
      typeWriter(heroTitle, originalText, 80);
    }, 1000);
  }
  
  /*
  =============================
  PROGRESS BARS CHO SKILLS
  =============================
  */
  function createProgressBars() {
    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
      const skills = [
        { name: 'HTML', level: 70, icon: 'fab fa-html5', color: '#e34c26' },
        { name: 'CSS', level: 65, icon: 'fab fa-css3-alt', color: '#1572b6' },
        { name: 'JavaScript', level: 45, icon: 'fab fa-js-square', color: '#f7df1e' },
        { name: 'Python', level: 40, icon: 'fab fa-python', color: '#3776ab' }
      ];
      
      // Tạo progress bars thay thế cho table
      const progressContainer = document.createElement('div');
      progressContainer.className = 'skills-progress-container w-75 mx-auto';
      
      skills.forEach(skill => {
        const skillDiv = document.createElement('div');
        skillDiv.className = 'skill-item mb-3';
        skillDiv.innerHTML = `
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span><i class="${skill.icon}" style="color: ${skill.color}"></i> ${skill.name}</span>
            <span class="skill-percentage">${skill.level}%</span>
          </div>
          <div class="progress" style="height: 8px;">
            <div class="progress-bar" role="progressbar" 
                 style="width: 0%; background: linear-gradient(90deg, var(--primary-color), var(--accent-color));"
                 data-width="${skill.level}%"></div>
          </div>
        `;
        progressContainer.appendChild(skillDiv);
      });
      
      // Thay thế table bằng progress bars (optional)
      const table = skillsSection.querySelector('table');
      if (table && window.innerWidth <= 768) {
        table.style.display = 'none';
        table.parentNode.insertBefore(progressContainer, table.nextSibling);
      }
    }
  }
  
  /*
  =============================
  ANIMATE PROGRESS BARS KHI SCROLL
  =============================
  */
  function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar[data-width]');
    
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBar = entry.target;
          const targetWidth = progressBar.getAttribute('data-width');
          
          setTimeout(() => {
            progressBar.style.width = targetWidth;
            progressBar.style.transition = 'width 1.5s ease-in-out';
          }, 300);
          
          observer.unobserve(progressBar);
        }
      });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => observer.observe(bar));
  }
  
  /*
  =============================
  COUNTER ANIMATION CHO STATISTICS
  =============================
  */
  function animateCounters() {
    const counters = document.querySelectorAll('.text-primary, .text-success');
    
    counters.forEach(counter => {
      const text = counter.textContent;
      const number = parseInt(text.match(/\d+/));
      
      if (number) {
        const observer = new IntersectionObserver(function(entries) {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              animateCounter(counter, 0, number, 2000);
              observer.unobserve(counter);
            }
          });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
      }
    });
  }
  
  function animateCounter(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    const originalText = element.textContent;
    const suffix = originalText.replace(/\d+/, '');
    
    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (range * progress));
      
      element.textContent = current + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }
    
    requestAnimationFrame(updateCounter);
  }
  
  /*
  =============================
  LOADING SCREEN
  =============================
  */
  function createLoadingScreen() {
    const loading = document.createElement('div');
    loading.id = 'loading-screen';
    loading.innerHTML = `
      <div class="loading-content">
        <div class="spinner"></div>
        <p>Đang tải CV...</p>
      </div>
      <style>
        #loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          color: white;
        }
        .loading-content {
          text-align: center;
        }
        .spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    
    document.body.appendChild(loading);
    
    // Ẩn loading screen sau 2 giây
    setTimeout(() => {
      loading.style.opacity = '0';
      loading.style.transition = 'opacity 0.5s ease';
      setTimeout(() => loading.remove(), 500);
    }, 2000);
  }
  
  /*
  =============================
  BACK TO TOP BUTTON
  =============================
  */
  function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      font-size: 20px;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1000;
      box-shadow: 0 4px 15px var(--shadow-color);
    `;
    
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTop.style.opacity = '1';
        backToTop.style.visibility = 'visible';
      } else {
        backToTop.style.opacity = '0';
        backToTop.style.visibility = 'hidden';
      }
    });
    
    document.body.appendChild(backToTop);
  }
  
  /*
  =============================
  DARK MODE TOGGLE
  =============================
  */
  function createDarkModeToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'dark-mode-toggle';
    toggle.setAttribute('aria-label', 'Toggle dark mode');
    toggle.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: none;
      background: var(--dark-color);
      color: white;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 1000;
      box-shadow: 0 4px 15px var(--shadow-color);
    `;
    
    // Kiểm tra và làm sạch localStorage nếu cần
    const savedMode = localStorage.getItem('darkMode');
    const isDarkMode = savedMode === 'true';
    
    // Chỉ thêm class dark-mode nếu savedMode thực sự là 'true'
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      // Đảm bảo xóa class nếu không phải dark mode
      document.body.classList.remove('dark-mode');
    }
    
    // Tạo biểu tượng dựa trên trạng thái hiện tại
    const icon = document.createElement('i');
    icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    toggle.appendChild(icon);
    
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      
      // Update color-scheme
      if (isDark) {
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.style.colorScheme = 'light';
      }
      
      // Update icon
      icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
      
      // Save preference as string 'true' or 'false'
      localStorage.setItem('darkMode', isDark.toString());
    });
    
    document.body.appendChild(toggle);
  }
  
  // Khởi chạy các tính năng
  createLoadingScreen();
  createProgressBars();
  setTimeout(animateProgressBars, 3000);
  setTimeout(animateCounters, 3000);
  createBackToTopButton();
  createDarkModeToggle();
});