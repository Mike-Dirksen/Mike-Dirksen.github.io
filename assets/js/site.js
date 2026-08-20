const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav-list');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.dataset.open === 'true';
    nav.dataset.open = String(!isOpen);
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });
}

const documentChoices = document.querySelectorAll('[data-document-choice]');
const documentPreview = document.querySelector('[data-document-preview]');
const documentOpen = document.querySelector('[data-document-open]');
const documentDownload = document.querySelector('[data-document-download]');

if (documentChoices.length && documentPreview && documentOpen && documentDownload) {
  const documents = {
    resume: {
      label: 'résumé',
      url: '/assets/cv/Michael-Dirksen-Resume.pdf',
      filename: 'Michael-Dirksen-Resume.pdf',
    },
    cv: {
      label: 'CV',
      url: '/assets/cv/Michael-Dirksen-CV.pdf',
      filename: 'Michael-Dirksen-CV.pdf',
    },
  };

  documentChoices.forEach((choice) => {
    choice.addEventListener('click', () => {
      const selected = documents[choice.dataset.documentChoice];
      if (!selected) return;
      documentChoices.forEach((button) => {
        button.setAttribute('aria-pressed', String(button === choice));
      });
      documentPreview.src = selected.url;
      documentPreview.title = `Michael Dirksen ${selected.label} PDF`;
      documentOpen.href = selected.url;
      documentOpen.textContent = `Open ${selected.label} PDF`;
      documentDownload.href = selected.url;
      documentDownload.download = selected.filename;
      documentDownload.textContent = `Download ${selected.label}`;
    });
  });
}

const filters = document.querySelector('[data-library-filters]');
if (filters) {
  const items = [...document.querySelectorAll('[data-library-item]')];
  const count = document.querySelector('[data-result-count]');
  const empty = document.querySelector('.empty-state');
  const applyFilters = () => {
    const query = filters.querySelector('[name="query"]').value.trim().toLowerCase();
    const type = filters.querySelector('[name="type"]').value;
    const topic = filters.querySelector('[name="topic"]').value;
    let visible = 0;
    items.forEach((item) => {
      const matches = (!query || item.textContent.toLowerCase().includes(query)) &&
        (!type || item.dataset.type === type) && (!topic || item.dataset.topics.includes(topic));
      item.hidden = !matches;
      if (matches) visible += 1;
    });
    count.textContent = `${visible} item${visible === 1 ? '' : 's'}`;
    empty.style.display = visible ? 'none' : 'block';
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (type) params.set('type', type);
    if (topic) params.set('topic', topic);
    history.replaceState(null, '', `${location.pathname}${params.size ? `?${params}` : ''}`);
  };
  filters.addEventListener('input', applyFilters);
  filters.querySelector('button').addEventListener('click', () => {
    filters.reset();
    applyFilters();
  });
  const params = new URLSearchParams(location.search);
  filters.querySelector('[name="query"]').value = params.get('q') || '';
  filters.querySelector('[name="type"]').value = params.get('type') || '';
  filters.querySelector('[name="topic"]').value = params.get('topic') || '';
  applyFilters();
}
