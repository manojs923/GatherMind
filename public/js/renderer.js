/**
 * renderer.js — Reads plan from localStorage and renders all sections into plan.html
 *
 * localStorage key: 'gathermind_plan'  (set by app.js after successful API call)
 */

const CURRENCY_SYMBOLS = { USD: '$', INR: '₹', EUR: '€', GBP: '£', AED: 'د.إ' };

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('plan-container');
  const savedPlan = localStorage.getItem('gathermind_plan');

  if (!savedPlan) {
    container.innerHTML = `<p>No plan found. Please <a href="index.html">create one</a> first.</p>`;
    return;
  }

  const plan = JSON.parse(savedPlan);
  const sym  = CURRENCY_SYMBOLS[plan.meta?.currency] ?? '$';

  container.innerHTML = `
    <section class="card summary-card">
      <h2>Overview</h2>
      <p>${plan.summary}</p>
    </section>

    <section class="card">
      <h2>Budget Breakdown</h2>
      <ul class="budget-list">
        ${plan.budgetCategories.map(cat => `
          <li>
            <span><strong>${cat.category}</strong>: ${sym}${cat.amount.toLocaleString()}</span>
            <small>${cat.tips}</small>
          </li>
        `).join('')}
      </ul>
    </section>

    <section class="card">
      <h2>Timeline &amp; Milestones</h2>
      <ul class="timeline-list">
        ${plan.timeline
            .slice()
            .sort((a, b) => b.offsetWeeksBefore - a.offsetWeeksBefore)
            .map(item => `
              <li>
                <strong>${item.offsetWeeksBefore === 0 ? 'Event Day' : item.offsetWeeksBefore + ' weeks before'}:</strong>
                ${item.task}
              </li>
            `).join('')}
      </ul>
    </section>

    <section class="card">
      <h2>Vendor Checklists</h2>
      ${plan.vendors.map(v => `
        <div class="vendor-group">
          <h3>${v.category}</h3>
          <ul>
            ${v.checklist.map(q => `<li><label><input type="checkbox"> ${q}</label></li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </section>

    <section class="card">
      <h2>Creative Ideas</h2>
      <p><strong>Theme:</strong> ${plan.ideas.theme.join(', ')}</p>
      <p><strong>Food &amp; Drink:</strong> ${plan.ideas.foodAndDrink.join(', ')}</p>
      <p><strong>Activities:</strong> ${plan.ideas.activities.join(', ')}</p>
    </section>
  `;
});
