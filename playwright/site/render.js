async function loadFixture() {
  const params = new URLSearchParams(window.location.search);
  const fixture = params.get('fixture');
  const type = params.get('type') || 'bootstrap';

  if (!fixture) return;

  const basePath = type === 'bootstrap' ? '../fixtures' : '../.generated';
  const fileName = type === 'bootstrap' ? 'input.html' : 'tailwind.html';
  const res = await fetch(`${basePath}/${fixture}/${fileName}`);

  if (res.ok) {
    const html = await res.text();
    document.getElementById('app').innerHTML = html;
  } else {
    document.getElementById('app').innerHTML = `<p style="color:red">Failed to load fixture ${fixture}</p>`;
  }
}

loadFixture();