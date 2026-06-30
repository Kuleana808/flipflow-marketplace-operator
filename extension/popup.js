const listingTitle = document.getElementById('listingTitle');
const price = document.getElementById('price');
const condition = document.getElementById('condition');
const pickupArea = document.getElementById('pickupArea');
const details = document.getElementById('details');
const buyerName = document.getElementById('buyerName');
const buyerContext = document.getElementById('buyerContext');
const replyType = document.getElementById('replyType');

const marketplaceOutput = document.getElementById('marketplaceOutput');
const craigslistOutput = document.getElementById('craigslistOutput');
const profileOutput = document.getElementById('profileOutput');
const replyOutput = document.getElementById('replyOutput');
const savedSnippets = document.getElementById('savedSnippets');

const STORAGE_KEY = 'flipflow_saved_snippets_v1';

function clean(value) {
  return (value || '').trim();
}

function titleCase(text) {
  return clean(text)
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function detailLines(raw) {
  return clean(raw)
    .split(/\n+/)
    .map((line) => clean(line.replace(/^[-•]+\s*/, '')))
    .filter(Boolean);
}

function issueNote(raw) {
  return /issue|scratch|dent|crack|wear|repair|as[-\s]?is|chip|tear/i.test(raw)
    ? 'Priced with the condition in mind. Please read the details before pickup.'
    : 'Clean listing, priced to move, and ready for a serious buyer.';
}

function getListingPayload() {
  return {
    title: clean(listingTitle.value),
    price: clean(price.value),
    condition: clean(condition.value),
    pickupArea: clean(pickupArea.value),
    details: clean(details.value)
  };
}

function generateListingVariants() {
  const payload = getListingPayload();
  if (!payload.title || !payload.price || !payload.details) {
    marketplaceOutput.textContent = 'Add a title, price, and details first.';
    return;
  }

  const lines = detailLines(payload.details);
  const bullets = lines.slice(0, 5).map((line) => `• ${line}`).join('\n');
  const shortTitle = titleCase(payload.title);
  const area = payload.pickupArea || 'Message for pickup area';
  const note = issueNote(payload.details);

  marketplaceOutput.textContent = `${shortTitle}\n\nPrice: $${payload.price}\nCondition: ${payload.condition}\nPickup: ${area}\n\n${bullets}\n\n${note}\n\nMessage me with your pickup window if you're ready.`;

  craigslistOutput.textContent = `${shortTitle} - $${payload.price}\n\n${lines.join('\n')}\n\nCondition: ${payload.condition}\nPickup area: ${area}\n\nSerious buyers: include pickup timing in the first message.`;

  profileOutput.textContent = `Selling ${shortTitle.toLowerCase()} and similar local inventory. Fast replies, clear pickup windows, and straightforward item notes. Message with what you're after and when you can pick up.`;
}

function generateReply() {
  const name = clean(buyerName.value) || 'there';
  const context = clean(buyerContext.value);
  const item = clean(listingTitle.value) || 'the item';
  const replyMap = {
    available: `Hey ${name} — yes, ${item} is still available. If you want it, send your best pickup window and I’ll tell you if it’s still open.`,
    lowball: `Hey ${name} — thanks for the offer. I can’t do that number right now, but if you can come closer and pick up on time, I’ll keep you first in line.`,
    pickup: `Perfect ${name} — send the day + time that works best for pickup, and I’ll confirm the exact location and what to bring.`,
    ghost: `Hey ${name} — checking once before I move to the next buyer. If you still want ${item}, send a real pickup window and I’ll hold it for that slot.`
  };
  replyOutput.textContent = context ? `${replyMap[replyType.value]}\n\nContext used: ${context}` : replyMap[replyType.value];
}

function copyText(text) {
  navigator.clipboard.writeText(text).catch(() => {});
}

function renderSaved(items) {
  if (!items.length) {
    savedSnippets.innerHTML = '<p class="empty">No saved snippets yet.</p>';
    return;
  }
  savedSnippets.innerHTML = items.map((item) => `
    <div class="saved-item">
      <strong>${item.title}</strong>
      <p>${item.preview}</p>
    </div>
  `).join('');
}

async function loadSaved() {
  const data = await chrome.storage.local.get(STORAGE_KEY);
  renderSaved(data[STORAGE_KEY] || []);
}

async function saveSnippet() {
  const payload = getListingPayload();
  if (!payload.title || !payload.details) return;
  const data = await chrome.storage.local.get(STORAGE_KEY);
  const existing = data[STORAGE_KEY] || [];
  const item = {
    title: titleCase(payload.title),
    preview: payload.details.slice(0, 100),
    timestamp: new Date().toISOString()
  };
  const next = [item, ...existing].slice(0, 12);
  await chrome.storage.local.set({ [STORAGE_KEY]: next });
  renderSaved(next);
}

async function clearSaved() {
  await chrome.storage.local.remove(STORAGE_KEY);
  renderSaved([]);
}

document.getElementById('generateListingBtn').addEventListener('click', generateListingVariants);
document.getElementById('generateReplyBtn').addEventListener('click', generateReply);
document.getElementById('copyListingBtn').addEventListener('click', () => copyText(marketplaceOutput.textContent));
document.getElementById('copyReplyBtn').addEventListener('click', () => copyText(replyOutput.textContent));
document.getElementById('saveSnippetBtn').addEventListener('click', saveSnippet);
document.getElementById('clearSavedBtn').addEventListener('click', clearSaved);

generateListingVariants();
generateReply();
loadSaved();
