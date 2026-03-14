async function loadFixture() {
  const params = new URLSearchParams(window.location.search);
  const fixture = params.get('fixture');
  const type = params.get('type') || 'bootstrap';
  const framework = params.get('framework') || 'bootstrap';

  if (!fixture) return;

  if (type === 'bootstrap' || type === 'framework') {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `../vendor/${framework}.min.css`;
    document.head.appendChild(link);
  }

  const basePath = (type === 'bootstrap' || type === 'framework') ? '../fixtures' : '../.generated';
  const fileName = (type === 'bootstrap' || type === 'framework') ? 'input.html' : 'tailwind.html';
  const fetchPath = `${basePath}/${fixture}/${fileName}`;
  const res = await fetch(fetchPath);

  if (res.ok) {
    const html = await res.text();
    document.getElementById('app').innerHTML = html;
  } else {
    document.getElementById('app').innerHTML = `<p style="color:red">Failed to load fixture ${fixture} from ${fetchPath}</p>`;
  }
}

loadFixture();