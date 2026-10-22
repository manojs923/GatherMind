/**
 * EVENT_TEMPLATES
 * ──────────────────────────────────────────────────────────────────────────────
 * Provides grounding data for each event type so the AI prompt is anchored to
 * realistic defaults. The `offsetWeeksBefore` values encode planning lead times
 * as integers (weeks before the event date), making date arithmetic trivial on
 * the client: eventDate - offsetWeeksBefore * 7 days.
 */
export const EVENT_TEMPLATES = {
  wedding: {
    defaultCategories: [
      'Venue',
      'Catering',
      'Photography',
      'Attire',
      'Decor',
      'Entertainment',
    ],
    defaultMilestones: [
      { task: 'Book primary venue and set date',                      offsetWeeksBefore: 52 },
      { task: 'Hire photographer and videographer',                   offsetWeeksBefore: 40 },
      { task: 'Select and order wedding attire',                      offsetWeeksBefore: 26 },
      { task: 'Finalize guest list and send formal invitations',      offsetWeeksBefore: 12 },
      { task: 'Confirm catering menu and dietary requirements',       offsetWeeksBefore:  8 },
      { task: 'Arrange transportation and accommodation for guests',  offsetWeeksBefore:  6 },
      { task: 'Final dress fitting and rehearsal dinner',             offsetWeeksBefore:  1 },
    ],
  },

  birthday: {
    defaultCategories: [
      'Venue/Space',
      'Food & Cake',
      'Decor & Theme',
      'Entertainment',
      'Invitations',
    ],
    defaultMilestones: [
      { task: 'Choose theme and secure location',      offsetWeeksBefore: 8 },
      { task: 'Book entertainment or DJ',              offsetWeeksBefore: 6 },
      { task: 'Send out digital invitations',          offsetWeeksBefore: 4 },
      { task: 'Order cake and confirm catering items', offsetWeeksBefore: 2 },
      { task: 'Prepare party favors and decorations',  offsetWeeksBefore: 1 },
    ],
  },

  community: {
    defaultCategories: [
      'Permits & Venue',
      'Logistics & Audio/Visual',
      'Marketing & Outreach',
      'Refreshments',
      'Safety/Staffing',
    ],
    defaultMilestones: [
      { task: 'Secure permits and venue booking',                  offsetWeeksBefore: 16 },
      { task: 'Launch promotional campaign and outreach',          offsetWeeksBefore: 10 },
      { task: 'Confirm speakers, performers, or activities',       offsetWeeksBefore:  6 },
      { task: 'Finalize volunteer schedules and safety checklist', offsetWeeksBefore:  2 },
      { task: 'On-site setup and equipment checks',                offsetWeeksBefore:  0 },
    ],
  },
};

/**
 * getCurrencySymbol
 * Returns the unicode symbol for a given ISO currency code.
 */
export function getCurrencySymbol(code) {
  const symbols = { USD: '$', INR: '₹', EUR: '€', GBP: '£', AED: 'د.إ' };
  return symbols[code] ?? code;
}
