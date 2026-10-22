/**
 * app.js — Main UI controller for the landing/planner form (index.html)
 * ──────────────────────────────────────────────────────────────────────────────
 * Responsibilities:
 *  1. Collect and coerce form data
 *  2. POST to /api/plan
 *  3. Persist the returned plan in localStorage
 *  4. Redirect to plan.html for rendering
 */

const form      = document.getElementById('planner-form');
const submitBtn = document.getElementById('submit-btn');
const btnText   = document.getElementById('btn-text');
const btnLoader = document.getElementById('btn-loading');
const formError = document.getElementById('form-error');

// ── Set minimum date to today ─────────────────────────────────────────────────
const dateInput = document.getElementById('date');
if (dateInput) {
  dateInput.min = new Date().toISOString().split('T')[0];
}

// ── Form submit handler ───────────────────────────────────────────────────────
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError();
  setLoading(true);

  const formData = buildFormPayload();

  // Basic client-side guard before hitting the API
  const clientError = validateClientSide(formData);
  if (clientError) {
    showError(clientError);
    setLoading(false);
    return;
  }

  try {
    const response = await fetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = data?.error ?? 'Failed to generate plan. Please try again.';
      throw new Error(msg);
    }

    // Persist plan and navigate to renderer
    localStorage.setItem('gathermind_plan', JSON.stringify(data));
    window.location.href = '/plan.html';

  } catch (err) {
    showError(err.message);
    console.error('[GatherMind] API error:', err);
  } finally {
    setLoading(false);
  }
});

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * buildFormPayload
 * Reads all form fields and coerces types. Returns the object ready to POST.
 */
function buildFormPayload() {
  return {
    eventType:  document.getElementById('eventType').value,
    eventName:  document.getElementById('eventName').value.trim(),
    date:       document.getElementById('date').value,
    location:   document.getElementById('location').value.trim(),
    guestCount: parseInt(document.getElementById('guestCount').value, 10),
    budget:     parseFloat(document.getElementById('budget').value),
    currency:   document.getElementById('currency').value,
    language:   document.getElementById('language').value,
    style:      document.getElementById('style').value.trim() || undefined,
  };
}

/**
 * validateClientSide
 * Light pre-flight validation before the API call. Returns error string or null.
 */
function validateClientSide(data) {
  if (!data.eventType)          return 'Please select an event type.';
  if (!data.eventName)          return 'Please enter an event name.';
  if (!data.date)               return 'Please select an event date.';
  if (data.date < new Date().toISOString().split('T')[0])
                                return 'Event date must be in the future.';
  if (!data.location)           return 'Please enter a location.';
  if (isNaN(data.guestCount) || data.guestCount < 1)
                                return 'Guest count must be at least 1.';
  if (isNaN(data.budget) || data.budget <= 0)
                                return 'Please enter a valid budget.';
  return null;
}

function setLoading(on) {
  submitBtn.disabled = on;
  btnText.classList.toggle('hidden', on);
  btnLoader.classList.toggle('hidden', !on);
}

function showError(msg) {
  formError.textContent = msg;
  formError.classList.remove('hidden');
  formError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideError() {
  formError.textContent = '';
  formError.classList.add('hidden');
}
