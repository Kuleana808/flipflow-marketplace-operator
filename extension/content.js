(() => {
  if (document.getElementById('flipflow-helper-root')) return;

  const marketplaceHints = ['marketplace', 'craigslist', 'offerup'];
  const pageText = `${location.hostname} ${location.pathname}`.toLowerCase();
  if (!marketplaceHints.some((hint) => pageText.includes(hint))) return;

  const root = document.createElement('div');
  root.id = 'flipflow-helper-root';
  root.innerHTML = `
    <button id="flipflow-helper-toggle">FlipFlow</button>
    <div id="flipflow-helper-panel" class="hidden">
      <h3>Quick seller helper</h3>
      <p>Paste rough listing notes or a buyer message. FlipFlow will tighten the copy for faster pickup conversations.</p>
      <textarea id="flipflow-helper-input" placeholder="Paste raw listing notes or a buyer DM..."></textarea>
      <div class="flipflow-actions">
        <button id="flipflow-helper-generate">Generate</button>
        <button id="flipflow-helper-copy">Copy</button>
      </div>
      <div id="flipflow-helper-output">No output yet.</div>
    </div>
  `;
  document.body.appendChild(root);

  const toggle = root.querySelector('#flipflow-helper-toggle');
  const panel = root.querySelector('#flipflow-helper-panel');
  const input = root.querySelector('#flipflow-helper-input');
  const output = root.querySelector('#flipflow-helper-output');

  toggle.addEventListener('click', () => panel.classList.toggle('hidden'));

  root.querySelector('#flipflow-helper-generate').addEventListener('click', () => {
    const raw = (input.value || '').trim();
    if (!raw) {
      output.textContent = 'Paste something first.';
      return;
    }
    const lines = raw.split(/\n+/).map((line) => line.trim()).filter(Boolean);
    const cleaned = lines.slice(0, 5).map((line) => line.replace(/^[-•]+\s*/, '')).join('\n• ');
    output.textContent = `Cleaner seller version:\n\n• ${cleaned}\n\nClose with: Send your pickup window if you're serious.`;
  });

  root.querySelector('#flipflow-helper-copy').addEventListener('click', () => {
    navigator.clipboard.writeText(output.textContent || '').catch(() => {});
  });
})();
