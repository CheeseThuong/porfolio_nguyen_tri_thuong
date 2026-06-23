(function defineProjectCatalog(global) {
  'use strict';

  const projects = [
    {
      id: 'vietasr-pro',
      title: 'VietASR Pro',
      repository: 'https://github.com/CheeseThuong/Vietnamese-asr',
      category: 'speech-nlp',
      featured: true,
      status: 'research',
      summary: 'Hệ thống nhận dạng tiếng nói tiếng Việt dùng Wav2Vec 2.0, PyTorch và Hugging Face, kèm Flask demo và FastAPI API.',
      problem: 'Chuyển lời nói tiếng Việt thành văn bản và cung cấp kết quả qua giao diện web lẫn API.',
      evidence: 'Repository ghi nhận pipeline Vietnamese ASR cùng hai lớp phục vụ Flask và FastAPI.',
      stack: ['Python', 'PyTorch', 'Wav2Vec 2.0', 'Hugging Face', 'Flask', 'FastAPI'],
      metric: {
        label: 'Best WER',
        value: '13.31%',
        context: 'Metric được công bố trong README của repository.'
      }
    },
    {
      id: 'tbd-rag-chatbot',
      title: 'TBD RAG Chatbot',
      repository: 'https://github.com/CheeseThuong/TBD-RAG-Chatbot',
      category: 'rag-ai-app',
      featured: true,
      status: 'prototype',
      summary: 'Hybrid RAG local-first cho tra cứu tuyển sinh, kết hợp frontend React với FastAPI, ChromaDB và Gemini.',
      problem: 'Truy xuất và trả lời câu hỏi tuyển sinh với nguồn tham chiếu và cơ chế fallback an toàn.',
      evidence: 'Repository mô tả citations, ingest, query rewriting và safe fallback.',
      stack: ['React', 'TypeScript', 'Vite', 'FastAPI', 'ChromaDB', 'Gemini']
    },
    {
      id: 'sentiment-rnn-lstm-bert',
      title: 'Sentiment Analysis RNN/LSTM/BERT',
      repository: 'https://github.com/CheeseThuong/sentiment-analysis-rnn-lstm-bert',
      category: 'machine-learning',
      featured: true,
      status: 'academic',
      summary: 'Project so sánh RNN, LSTM và BERT cho bài toán sentiment analysis trên IMDB 50K.',
      problem: 'Đánh giá các hướng mô hình tuần tự và transformer trên cùng bài toán phân loại cảm xúc.',
      evidence: 'Repository dùng IMDB 50K, PyTorch, Hugging Face và cung cấp Kaggle notebook.',
      stack: ['Python', 'PyTorch', 'Hugging Face', 'RNN', 'LSTM', 'BERT', 'Kaggle']
    },
    {
      id: 'fish-pond-water-level',
      title: 'Fish Pond Water Level Prediction',
      repository: 'https://github.com/CheeseThuong/Predicting-water-levels-using-Linear-Regression',
      category: 'machine-learning',
      featured: true,
      status: 'academic',
      summary: 'Ứng dụng dự đoán mực nước ao cá bằng Linear, Ridge và Polynomial Regression với giao diện Streamlit.',
      problem: 'So sánh các mô hình regression cho dữ liệu mực nước và đưa luồng dự đoán vào ứng dụng web.',
      evidence: 'Repository dùng scikit-learn, Streamlit và dataset mô phỏng gồm 800 samples.',
      stack: ['Python', 'scikit-learn', 'Linear Regression', 'Ridge', 'Polynomial Regression', 'Streamlit']
    },
    {
      id: 'botchat-support-students-tbd',
      title: 'BotChat Support Students TBD',
      repository: 'https://github.com/CheeseThuong/BotChat-Support-Students-TBD',
      category: 'speech-nlp',
      featured: false,
      status: 'academic',
      summary: 'Retrieval chatbot hỗ trợ sinh viên bằng đối sánh văn bản truyền thống và giao diện desktop Tkinter.',
      problem: 'Tìm câu trả lời phù hợp từ tập nội dung hỗ trợ sinh viên mà không dựa vào mô hình sinh.',
      evidence: 'Project dùng TF-IDF, cosine similarity, NLTK và pandas; không phải LLM hoặc RAG.',
      stack: ['Python', 'TF-IDF', 'Cosine Similarity', 'NLTK', 'pandas', 'Tkinter']
    },
    {
      id: 'interpretation-of-the-i-ching',
      title: 'Interpretation of the I Ching',
      repository: 'https://github.com/CheeseThuong/Interpretation-of-the-I-Ching',
      category: 'full-stack',
      featured: true,
      status: 'prototype',
      summary: 'Prototype ứng dụng lập quẻ với React 19, TypeScript và khả năng export kết quả dưới dạng PNG/SVG.',
      problem: 'Tổ chức luồng lập quẻ, trình bày kết quả và xuất nội dung thành định dạng hình ảnh.',
      evidence: 'AI Oracle và Decision Scorer hiện là mock; nhiều dữ liệu vẫn ở trạng thái TODO.',
      stack: ['React 19', 'TypeScript', 'Vite', 'Vitest', 'PNG/SVG export']
    },
    {
      id: 'tbd-bank',
      title: 'TBD Bank',
      repository: 'https://github.com/CheeseThuong/TBD-Bank',
      category: 'full-stack',
      featured: false,
      status: 'academic',
      summary: 'Ứng dụng ngân hàng xây dựng với ASP.NET Core 9, Entity Framework Core, Identity và Clean Architecture.',
      problem: 'Xử lý các nghiệp vụ tài khoản cơ bản trong một kiến trúc backend có phân tách trách nhiệm.',
      evidence: 'Repository mô tả deposit, withdraw, transfer, history và chức năng admin.',
      stack: ['ASP.NET Core 9', 'Entity Framework Core', 'Identity', 'Clean Architecture']
    },
    {
      id: 'kpi-grading-system',
      title: 'KPI Grading System',
      repository: 'https://github.com/CheeseThuong/KPI-GRADING-SYSTEM',
      category: 'full-stack',
      featured: false,
      status: 'academic',
      summary: 'Hệ thống quản lý KPI giảng viên với authentication, dashboard và luồng reporting.',
      problem: 'Quản lý dữ liệu chấm KPI và cung cấp giao diện theo dõi, tổng hợp báo cáo.',
      evidence: 'Repository dùng Node.js, Express, MongoDB, EJS và Chart.js.',
      stack: ['Node.js', 'Express', 'MongoDB', 'EJS', 'Chart.js']
    },
    {
      id: 'flask-cicd-app',
      title: 'Flask CI/CD App',
      repository: 'https://github.com/CheeseThuong/flask-cicd-app',
      category: 'devops-labs',
      featured: false,
      status: 'lab',
      summary: 'Flask application dùng làm bài thực hành CI/CD từ kiểm thử đến container và triển khai VPS.',
      problem: 'Chuẩn hóa luồng build, test, đóng gói và triển khai cho một ứng dụng Flask nhỏ.',
      evidence: 'Pipeline gồm pytest, Docker, GitHub Actions, Docker Hub và Ubuntu VPS.',
      stack: ['Flask', 'pytest', 'Docker', 'GitHub Actions', 'Docker Hub', 'Ubuntu']
    },
    {
      id: 'student-github-actions-lab',
      title: 'Student GitHub Actions Lab',
      repository: 'https://github.com/CheeseThuong/student-github-actions-lab',
      category: 'devops-labs',
      featured: false,
      status: 'lab',
      summary: 'Node.js lab tập trung vào workflow GitHub Actions cho build, test và artifact.',
      problem: 'Thực hành một pipeline CI có kiểm thử tự động, lưu artifact và bước deployment mô phỏng.',
      evidence: 'Repository dùng Node.js, Jest và workflow build/test/artifact với simulated deployment.',
      stack: ['Node.js', 'Jest', 'GitHub Actions', 'CI artifacts']
    },
    {
      id: 'student-docker-devops-lab',
      title: 'Student Docker DevOps Lab',
      repository: 'https://github.com/CheeseThuong/student-docker-devops-lab',
      category: 'devops-labs',
      featured: false,
      status: 'lab',
      summary: 'DevOps lab được giữ trong project archive và chưa dùng làm case study chi tiết.',
      problem: 'Lưu lại bài thực hành Docker/DevOps trong catalog mà không suy diễn thêm phạm vi triển khai.',
      evidence: 'Catalog chỉ xác minh trạng thái archive; mô tả sâu cần kiểm tra README/source ở phase riêng.',
      stack: []
    }
  ];

  global.PORTFOLIO_PROJECTS = Object.freeze(
    projects.map((project) => Object.freeze({
      ...project,
      stack: Object.freeze([...project.stack]),
      ...(project.metric ? { metric: Object.freeze({ ...project.metric }) } : {})
    }))
  );
})(window);
