(function defineProjectRenderer(global) {
  'use strict';

  const categories = Object.freeze([
    { id: 'all', label: 'Tất cả' },
    { id: 'speech-nlp', label: 'Speech & NLP' },
    { id: 'rag-ai-app', label: 'RAG & AI Applications' },
    { id: 'machine-learning', label: 'Machine Learning' },
    { id: 'full-stack', label: 'Full-stack Systems' },
    { id: 'devops-labs', label: 'DevOps & Labs' }
  ]);

  const categoryLabels = Object.freeze({
    'speech-nlp': 'Speech & NLP',
    'rag-ai-app': 'RAG & AI Applications',
    'machine-learning': 'Machine Learning',
    'full-stack': 'Full-stack Systems',
    'devops-labs': 'DevOps & Labs'
  });

  const statusLabels = Object.freeze({
    research: 'Research project',
    academic: 'Academic project',
    prototype: 'Prototype',
    lab: 'Lab'
  });

  const categoryIcons = Object.freeze({
    'speech-nlp': 'fas fa-wave-square',
    'rag-ai-app': 'fas fa-diagram-project',
    'machine-learning': 'fas fa-chart-line',
    'full-stack': 'fas fa-code-branch',
    'devops-labs': 'fas fa-box'
  });

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function createExternalLink(url, label, className) {
    const link = createElement('a', className, label);
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    const screenReaderText = createElement('span', 'visually-hidden', ' (mở trong tab mới)');
    link.append(screenReaderText);
    return link;
  }

  function createProjectCard(project, isFeatured) {
    const card = createElement('article', `project-card${isFeatured ? ' project-card--featured' : ''}`);
    card.setAttribute('role', 'listitem');
    card.dataset.projectId = project.id;
    card.dataset.category = project.category;

    const body = createElement('div', 'project-card__body');
    const meta = createElement('div', 'project-card__meta');
    const visual = createElement('span', 'project-card__icon');
    visual.setAttribute('aria-hidden', 'true');
    const icon = createElement('i', categoryIcons[project.category] || 'fas fa-code');
    icon.setAttribute('aria-hidden', 'true');
    visual.append(icon);
    meta.append(visual);
    meta.append(createElement('span', 'project-card__category', categoryLabels[project.category]));
    meta.append(createElement('span', `project-card__status project-card__status--${project.status}`, statusLabels[project.status]));

    const title = createElement('h3', 'project-card__title', project.title);
    const summary = createElement('p', 'project-card__desc', project.summary);
    const evidence = createElement('p', 'project-card__evidence');
    const evidenceText = project.metric
      ? `${project.metric.label}: ${project.metric.value}. ${project.metric.context}`
      : project.evidence;
    evidence.textContent = evidenceText;

    const stack = createElement('ul', 'project-card__tags');
    stack.setAttribute('aria-label', `Công nghệ của ${project.title}`);
    if (project.stack.length) {
      project.stack.slice(0, isFeatured ? 4 : 3).forEach((technology) => {
        stack.append(createElement('li', 'project-tag', technology));
      });
    } else {
      stack.append(createElement('li', 'project-tag project-tag--pending', 'Chưa mô tả sâu'));
    }

    if (isFeatured) {
      body.append(meta, title, summary, evidence, stack);
    } else {
      body.append(meta, title, summary, stack);
    }

    const footer = createElement('footer', 'project-card__footer');
    footer.append(createExternalLink(project.repository, 'Xem repository', 'project-card__link'));
    if (project.demo) {
      footer.append(createExternalLink(project.demo, 'Mở demo', 'project-card__link'));
    }

    card.append(body, footer);
    return card;
  }

  function renderProjectList(host, projects, options = {}) {
    const fragment = document.createDocumentFragment();

    if (!projects.length) {
      const emptyState = createElement('p', 'project-empty', 'Không có project phù hợp với bộ lọc này.');
      emptyState.setAttribute('role', 'status');
      fragment.append(emptyState);
    } else {
      projects.forEach((project) => {
        fragment.append(createProjectCard(project, options.featured === true));
      });
    }

    host.replaceChildren(fragment);
  }

  function init() {
    const projects = Array.isArray(global.PORTFOLIO_PROJECTS) ? global.PORTFOLIO_PROJECTS : [];
    const featuredHost = document.getElementById('selectedWork');
    const filterHost = document.getElementById('projectFilters');
    const archiveHost = document.getElementById('projectArchive');

    if (!featuredHost || !filterHost || !archiveHost) return;

    const featuredProjects = projects.filter((project) => project.featured).slice(0, 5);
    renderProjectList(featuredHost, featuredProjects, { featured: true });

    let activeCategory = 'all';

    function renderArchive() {
      const visibleProjects = activeCategory === 'all'
        ? projects
        : projects.filter((project) => project.category === activeCategory);

      renderProjectList(archiveHost, visibleProjects);
      archiveHost.setAttribute('aria-label', `Kho dự án, ${visibleProjects.length} kết quả`);

      filterHost.querySelectorAll('button[data-category]').forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.category === activeCategory));
      });
    }

    const filterFragment = document.createDocumentFragment();
    categories.forEach((category) => {
      const count = category.id === 'all'
        ? projects.length
        : projects.filter((project) => project.category === category.id).length;
      const button = createElement('button', 'project-filter__button', `${category.label} (${count})`);
      button.type = 'button';
      button.dataset.category = category.id;
      button.setAttribute('aria-pressed', String(category.id === activeCategory));
      button.addEventListener('click', () => {
        activeCategory = category.id;
        renderArchive();
      });
      filterFragment.append(button);
    });

    filterHost.replaceChildren(filterFragment);
    renderArchive();
  }

  global.PortfolioProjects = Object.freeze({ init });
})(window);
