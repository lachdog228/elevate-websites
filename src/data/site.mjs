/**
 * Single source of truth for every business fact on the site.
 *
 * Content rules that apply to anything added here:
 *   - No invented specs, kW ratings, warranty terms, pricing or turnaround times
 *   - No invented testimonials
 *   - No suburbs beyond the confirmed service area below
 */

export const site = {
  name: 'Sulex Electrics',
  legalName: 'Sulex Electrics',
  owner: 'Alex',
  tagline: 'Real people. Real solar. Real results.',
  taglineAlt: 'We’re more than just a bright spark.',
  foundingDate: '2013',
  rating: '5.0',

  origin: 'https://sulex.com.au',
  domain: 'sulex.com.au',

  phone: '0400 594 109',
  phoneHref: 'tel:+61400594109',
  phoneIntl: '+61400594109',
  email: 'Info@sulex.com.au',
  emailHref: 'mailto:Info@sulex.com.au',
  instagram: '@sulex.com.au',
  instagramUrl: 'https://www.instagram.com/sulex.com.au/',

  hours: 'Monday to Friday, 7:30 am – 5:30 pm',
  hoursShort: 'Mon–Fri, 7:30am–5:30pm',
  hoursSchema: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '07:30',
    closes: '17:30',
  },

  // Outstanding: needs Alex's real Registered Electrical Contractor number.
  // Victorian licensed electricians are generally required to display this on
  // advertising material. Do not invent one — leave the marker visible.
  licence: '[LICENCE_PLACEHOLDER]',

  // Confirmed service area. Do not extend without being asked.
  serviceArea: [
    'Geelong',
    'Surf Coast',
    'Torquay',
    'Winchelsea',
    'Birregurra',
    'Colac',
  ],

  // Exactly three real reviews. Do not add to or edit these.
  reviews: [
    {
      quote:
        'Diagnosed and fixed the switchboard quickly and efficiently. The work is tidy and professional, and nothing is ever a problem.',
      author: 'Jose Carrasco',
    },
    {
      quote:
        'With so many solar installers out there, I feel like I got lucky landing Sulex. Incredibly thorough on our 5 kW system.',
      author: 'Blake Gillespie',
    },
    {
      quote:
        'Friendly, professional, and a great job on the heat pump. We are rapt with the results.',
      author: 'Helen and Peter, Apollo Bay',
    },
  ],
};

/** Nav order is deliberate — three pages only. */
export const nav = [
  { href: '/', label: 'Home', slug: 'index' },
  { href: '/services.html', label: 'What we do', slug: 'services' },
  { href: '/contact.html', label: 'Contact', slug: 'contact' },
];

/**
 * The four offerings, in priority order. Solar / Battery / EV are the headline
 * services; general electrical work sits deliberately lower and quieter.
 */
export const services = [
  {
    id: 'solar',
    name: 'Solar panels',
    short: 'solar',
    cta: 'Ask about solar',
    lead: 'Rooftop solar sized for how your place actually runs, installed by the same person who quoted it.',
    points: [
      'Residential and commercial rooftops',
      'Panel layout planned around your roof, not a template',
      'Tidy cable runs and a clean finish',
    ],
    photo: 'job-solar.jpg',
    photoAlt:
      'Rooftop solar panel array installed on a rural property near Geelong',
  },
  {
    id: 'battery',
    name: 'Solar batteries',
    short: 'batteries',
    cta: 'Ask about batteries',
    lead: 'Store what your panels make through the day so you are still using your own power after dark.',
    points: [
      'New battery installs and retrofits to existing solar',
      'Indoor and outdoor mounting',
      'Switchboard work handled as part of the job',
    ],
    photo: 'job-battery.jpg',
    photoAlt: 'Outdoor home battery unit installed at a Torquay property',
  },
  {
    id: 'ev',
    name: 'EV charging',
    short: 'EV charging',
    cta: 'Ask about EV charging',
    lead: 'Home and workplace charger installs, wired properly and positioned where you actually park.',
    points: [
      'Home charger installs',
      'Workplace and commercial charging',
      'Supply checked before anything gets mounted',
    ],
    photo: null, // No real EV job photo supplied yet — custom SVG used instead.
    photoAlt: null,
  },
];

/** Deliberately lower priority — shown smaller and later on the page. */
export const everydayWork = [
  {
    name: 'Switchboards',
    text: 'Upgrades, safety switches and fault finding on tired boards.',
  },
  {
    name: 'Power points',
    text: 'New outlets, relocations and the ones that stopped working months ago.',
  },
  {
    name: 'Heat pump connections',
    text: 'Wiring and connection for hot water heat pumps.',
  },
  {
    name: 'Solar hot water connections',
    text: 'Electrical connection for solar hot water systems.',
  },
];
