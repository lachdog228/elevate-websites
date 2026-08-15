"""
Page metadata, FAQs and schema hints.

FAQs here are rendered twice by build.py: once as the visible accordion and
once as FAQPage JSON-LD. Editing a question in this file updates both, so
the markup can never claim an answer the page doesn't show.
"""

PAGES = [
    # ───────────────────────────── HOME ─────────────────────────────
    {
        "path": "/",
        "file": "index.html",
        "title": "Web Design Torquay & Geelong | Elevate Website Designs",
        "og_title": "Websites built to get you customers — Torquay & Geelong",
        "description": (
            "Custom-built websites and local SEO for Torquay, Geelong and Surf Coast "
            "businesses. Fast, mobile-first sites designed to turn visitors into calls."
        ),
        "priority": "1.0",
        "changefreq": "weekly",
        "cta_heading": "Ready to get more customers?",
        "cta_sub": "Tell me about your business and I'll come back with a plan and a fixed price — no obligation, no jargon.",
        "faqs": [
            ("How much does a website cost?",
             "<p>Every site is quoted on scope rather than sold as a fixed package, because a "
             "five-page site for a sole trader and a twenty-page site with location pages are "
             "genuinely different builds. Most small business sites in this area land in the "
             "low-to-mid four figures. You get a fixed price in writing before any work starts — "
             "no hourly billing, no surprise invoices.</p>"),
            ("How long does it take to build a website?",
             "<p>Most builds run one to three weeks from our first conversation to going live. "
             "The main variable is how quickly content — photos, service details, business "
             "information — comes back to me. If you already have your content ready, the "
             "shorter end is realistic.</p>"),
            ("Do you work with businesses outside the Surf Coast?",
             "<p>Yes. Most of the work is Torquay, Geelong and the Surf Coast because that's "
             "where I'm based and local knowledge genuinely helps, but the build process works "
             "just as well remotely. If you're elsewhere in Victoria or interstate, get in touch.</p>"),
            ("Will my website show up on Google?",
             "<p>Every site is built with the technical foundations search engines need: clean "
             "structure, fast load times, proper headings, structured data and a sitemap. That "
             "handles the on-page side. Ranking for competitive local searches also depends on "
             "your Google Business Profile, reviews and time — which is what the "
             "<a href=\"/services/local-seo\">local SEO service</a> covers.</p>"),
            ("What happens after the site goes live?",
             "<p>I take care of the domain and hosting from there, so there's nothing technical "
             "for you to manage. I'm available for changes and support "
             "afterwards, either ad-hoc or on a "
             "<a href=\"/services/website-maintenance\">maintenance plan</a> that covers updates, "
             "backups, security patching and uptime monitoring.</p>"),
            ("Do I need to write the content myself?",
             "<p>You don't have to. Copywriting is included in every build — I'll interview you "
             "about the business, then write the pages and send them for review before they go "
             "anywhere near the design. If you'd rather write it yourself, that's fine too.</p>"),
        ],
    },

    # ─────────────────────────── SERVICES HUB ───────────────────────
    {
        "path": "/services",
        "file": "services.html",
        "title": "Web Design & SEO Services | Torquay & Geelong",
        "description": (
            "Web design, local SEO, website maintenance and Google Business Profile "
            "optimisation for small businesses across Torquay, Geelong and the Surf Coast."
        ),
        "priority": "0.9",
        "crumbs": [("Services", None)],
        "page_type": "CollectionPage",
        "cta_heading": "Not sure which one you need?",
        "cta_sub": "Tell me what's happening with your business and I'll tell you honestly what would move the needle — even if that's nothing.",
    },

    # ────────────────────────── SERVICE PAGES ───────────────────────
    {
        "path": "/services/web-design",
        "file": "service-web-design.html",
        "title": "Web Design Torquay & Geelong — Custom Small Business Sites",
        "description": (
            "Custom-coded, mobile-first websites for Surf Coast small businesses. "
            "Fast loading, built to convert visitors into enquiries. Fixed pricing, 1–3 week builds."
        ),
        "priority": "0.9",
        "crumbs": [("Services", "/services"), ("Web Design", None)],
        "service": {
            "name": "Website Design & Build",
            "desc": "Custom-coded, mobile-first website design and development for small businesses "
                    "across Torquay, Geelong and the Surf Coast.",
        },
        "faq_heading": "Web design questions",
        "cta_heading": "Let's build something that works",
        "faqs": [
            ("Do you use WordPress, Wix or Squarespace?",
             "<p>Neither — sites are custom-coded. Page builders add a lot of code you never asked "
             "for, which is the single most common reason small business sites load slowly. A "
             "hand-built site loads faster, scores better on Core Web Vitals, and has a much "
             "smaller surface area for security problems. The trade-off is that you can't drag "
             "blocks around yourself, so if self-editing matters to you, tell me upfront and I'll "
             "build it on a CMS instead.</p>"),
            ("Will I be able to update the website myself?",
             "<p>By default, changes come through me — that's how the speed and security benefits "
             "are kept. If self-editing is important, I can wire in a lightweight CMS for the "
             "sections you'll actually change, like a blog or a gallery, while keeping the rest "
             "hand-built.</p>"),
            ("Is the site mobile-friendly?",
             "<p>Yes, and it's designed mobile-first rather than desktop-first-then-squashed. "
             "For most local trades and service businesses, over half of all traffic is a phone, "
             "often someone standing in their kitchen looking for a number to call. The mobile "
             "layout gets designed first for that reason.</p>"),
            ("Do you provide hosting and the domain?",
             "<p>Yes — I take care of both. Domain registration, DNS, hosting, SSL certificates "
             "and renewals are all managed as part of the service, so there's no control panel to "
             "log into and no renewal notice to miss. If you already have a domain you want to "
             "keep using, that's no problem either.</p>"),
            ("What do you need from me to get started?",
             "<p>A conversation about the business, any photos or logos you have, and your service "
             "details. That's genuinely it. I write the copy, source or optimise imagery, and come "
             "back with a design to react to.</p>"),
        ],
    },
    {
        "path": "/services/local-seo",
        "file": "service-local-seo.html",
        "title": "Local SEO Services Torquay, Geelong & Surf Coast",
        "description": (
            "Get found when Surf Coast customers search for what you do. Local SEO setup and "
            "monthly management — Google Business Profile, local citations, on-page and reporting."
        ),
        "priority": "0.9",
        "crumbs": [("Services", "/services"), ("Local SEO", None)],
        "service": {
            "name": "Local SEO Setup & Management",
            "desc": "Local search optimisation for small businesses across Torquay, Geelong and "
                    "the Surf Coast, covering Google Business Profile, citations and on-page SEO.",
        },
        "faq_heading": "Local SEO questions",
        "cta_heading": "Want to show up when locals search?",
        "faqs": [
            ("How long does local SEO take to work?",
             "<p>Expect movement in the map pack within one to three months, and meaningful "
             "movement in the regular results closer to three to six. Anyone promising page one "
             "in thirty days is either targeting searches nobody makes or is about to do something "
             "that gets your site penalised. Local search moves faster than national SEO, but it "
             "still isn't instant.</p>"),
            ("What's the difference between local SEO and regular SEO?",
             "<p>Local SEO targets searches with geographic intent — \"plumber near me\", "
             "\"cafe Torquay\" — and its main prize is the map pack, the three business listings "
             "with the map above the normal results. Those rankings are driven heavily by your "
             "Google Business Profile, proximity to the searcher, and reviews. Regular SEO targets "
             "non-geographic searches and is won mostly through content and links.</p>"),
            ("Can you guarantee first place on Google?",
             "<p>No, and neither can anyone else. Google's results are personalised by the "
             "searcher's exact location, their history and their device, so there isn't one "
             "fixed \"first place\" to guarantee. What I can commit to is doing the things that "
             "reliably improve rankings and showing you the tracked data each month so you can "
             "see whether it's working.</p>"),
            ("Do I need local SEO if I already have a website?",
             "<p>Possibly not. If your Google Business Profile is well set up, you have steady "
             "reviews and you already rank for your main services, your money may be better spent "
             "elsewhere. I'll audit it and tell you honestly — I'd rather turn down work than sell "
             "you a retainer you don't need.</p>"),
            ("How do you report on results?",
             "<p>A monthly report covering tracked keyword positions, Google Business Profile "
             "views, direction requests and calls, plus organic traffic from Search Console. "
             "Real numbers from Google's own tools, not a vanity dashboard.</p>"),
        ],
    },
    {
        "path": "/services/website-maintenance",
        "file": "service-maintenance.html",
        "title": "Website Maintenance & Support Plans | Surf Coast",
        "description": (
            "Ongoing website maintenance for Surf Coast businesses: security patching, backups, "
            "uptime monitoring, content updates and performance checks. Fixed monthly pricing."
        ),
        "priority": "0.8",
        "crumbs": [("Services", "/services"), ("Website Maintenance", None)],
        "service": {
            "name": "Website Maintenance",
            "desc": "Ongoing website maintenance, security patching, backups, uptime monitoring "
                    "and content updates for small business websites.",
        },
        "faq_heading": "Maintenance questions",
        "cta_heading": "Want your site looked after?",
        "faqs": [
            ("Do I actually need a maintenance plan?",
             "<p>If your site is custom-built and static, the security risk is genuinely low and "
             "you may only need occasional content changes — ad-hoc billing is fine for that. "
             "Maintenance earns its keep when you have a CMS, a booking system, payment handling, "
             "or you simply want someone monitoring uptime so you're not the last to know your "
             "site is down.</p>"),
            ("What's actually included each month?",
             "<p>Security patching, off-site backups, uptime monitoring with alerts, broken link "
             "checks, Core Web Vitals monitoring, and a set allowance of content changes. You also "
             "get a short monthly note telling you what was done — not just a silent invoice.</p>"),
            ("What happens if my site goes down?",
             "<p>Uptime monitoring pings the site continuously and alerts me on failure, usually "
             "before you've noticed. Restoring from the most recent backup is the standard fix "
             "and takes minutes for a site this size.</p>"),
            ("Can I cancel the plan?",
             "<p>Yes, month to month, no lock-in contract and no exit fee. If it isn't providing "
             "value you should be able to stop paying for it.</p>"),
        ],
    },
    {
        "path": "/services/google-business-profile",
        "file": "service-gbp.html",
        "title": "Google Business Profile Optimisation | Geelong & Surf Coast",
        "description": (
            "Google Business Profile setup and optimisation for Surf Coast businesses. Get into "
            "the local map pack with a complete, correctly categorised profile."
        ),
        "priority": "0.8",
        "crumbs": [("Services", "/services"), ("Google Business Profile", None)],
        "service": {
            "name": "Google Business Profile Optimisation",
            "desc": "Google Business Profile setup, optimisation and review strategy for local "
                    "businesses across the Surf Coast and Geelong region.",
        },
        "faq_heading": "Google Business Profile questions",
        "cta_heading": "Want to show up on the map?",
        "faqs": [
            ("What is a Google Business Profile?",
             "<p>It's the free business listing that appears in Google Maps and in the box of "
             "three local businesses above the normal search results. For a local service "
             "business it is frequently a bigger source of calls than the website itself, and "
             "it costs nothing to claim.</p>"),
            ("Why isn't my business showing in the map pack?",
             "<p>The usual causes are an unverified or incomplete profile, the wrong primary "
             "category, too few reviews compared to competitors, business details that don't "
             "match what's on your website, or simply being further from the searcher than the "
             "businesses being shown. An audit will identify which of those apply to you.</p>"),
            ("How many Google reviews do I need?",
             "<p>There's no threshold that flips a switch — what matters is being competitive "
             "with the other businesses ranking for your searches, and receiving reviews steadily "
             "rather than twenty in one week. I'll set up a simple system that makes asking easy. "
             "Buying reviews is not on the table: it violates Google's policies and gets profiles "
             "suspended.</p>"),
            ("Can you manage the profile for me?",
             "<p>Yes — posts, photo updates, review responses and keeping details current are all "
             "part of ongoing management. Google rewards profiles that are actively maintained, "
             "and it's the part most businesses set up once and then never touch again.</p>"),
        ],
    },

    # ───────────────────────── LOCATION PAGES ───────────────────────
    {
        "path": "/web-design-torquay",
        "file": "loc-torquay.html",
        "title": "Web Design Torquay VIC — Websites for Local Business",
        "description": (
            "Web designer based in Torquay building fast, custom websites for local businesses. "
            "Face-to-face meetings, local knowledge, fixed pricing. Get a free quote."
        ),
        "priority": "0.9",
        "crumbs": [("Web Design Torquay", None)],
        "service": {
            "name": "Web Design Torquay",
            "desc": "Custom website design and development for businesses in Torquay, Victoria.",
        },
        "faq_heading": "Torquay web design questions",
        "cta_heading": "Based in Torquay? Let's meet.",
        "cta_sub": "I'm local — happy to meet in person and talk through what your business actually needs.",
        "faqs": [
            ("Are you actually based in Torquay?",
             "<p>Yes. I live and work in Torquay, which means we can meet face to face rather than "
             "doing everything over email. It also means I know the area — the difference between "
             "summer trade and winter trade here shapes what your website needs to do.</p>"),
            ("Do you work with Torquay tradies and trades businesses?",
             "<p>A lot of the work is trades and local services — plumbers, electricians, "
             "builders, landscapers. Those sites are built around one job: making it obvious what "
             "you do, which suburbs you cover, and how to call you, on a phone screen, in about "
             "five seconds.</p>"),
            ("Can you help me get found for \"Torquay\" searches?",
             "<p>That's exactly what the <a href=\"/services/local-seo\">local SEO service</a> is "
             "for. It combines on-page work with Google Business Profile optimisation so you turn "
             "up both in the map pack and the regular results when someone nearby searches for "
             "what you do.</p>"),
        ],
    },
    {
        "path": "/web-design-geelong",
        "file": "loc-geelong.html",
        "title": "Web Design Geelong — Custom Websites for Local Business",
        "description": (
            "Custom web design for Geelong businesses. Fast, mobile-first websites built to "
            "generate enquiries, backed by local SEO. Fixed pricing, 1–3 week builds."
        ),
        "priority": "0.9",
        "crumbs": [("Web Design Geelong", None)],
        "service": {
            "name": "Web Design Geelong",
            "desc": "Custom website design and development for businesses in Geelong, Victoria.",
        },
        "faq_heading": "Geelong web design questions",
        "cta_heading": "Geelong business? Let's talk.",
        "faqs": [
            ("Do you travel to Geelong for meetings?",
             "<p>Yes — Geelong is about twenty-five minutes from Torquay, so an in-person meeting "
             "is easy to arrange. Plenty of clients prefer a call instead, which works just as "
             "well.</p>"),
            ("Is Geelong more competitive than the Surf Coast?",
             "<p>Generally yes. Geelong is a much larger market, so more businesses are competing "
             "for the same searches and ranking takes more sustained work. The upside is the "
             "search volume is far higher — a decent position for a Geelong service term is worth "
             "considerably more traffic than the equivalent in a smaller coastal town.</p>"),
            ("Can you build a site for multiple locations?",
             "<p>Yes. If you serve Geelong plus surrounding suburbs, the right structure is a "
             "dedicated page per location with genuinely distinct content — not the same page with "
             "the suburb name swapped out, which Google treats as thin duplicate content and "
             "largely ignores.</p>"),
        ],
    },
    {
        "path": "/web-design-surf-coast",
        "file": "loc-surfcoast.html",
        "title": "Web Design Surf Coast — Websites That Get You Calls",
        "description": (
            "Web design across the Surf Coast — Jan Juc, Anglesea, Aireys Inlet, Lorne and "
            "Winchelsea. Custom-built sites for seasonal and local trade. Free quote."
        ),
        "priority": "0.85",
        "crumbs": [("Web Design Surf Coast", None)],
        "service": {
            "name": "Web Design Surf Coast",
            "desc": "Custom website design for businesses across the Surf Coast region of Victoria.",
        },
        "faq_heading": "Surf Coast web design questions",
        "cta_heading": "Anywhere on the Surf Coast",
        "faqs": [
            ("Which Surf Coast towns do you cover?",
             "<p>Torquay, Jan Juc, Anglesea, Aireys Inlet, Lorne, Winchelsea, Barwon Heads and "
             "Ocean Grove, plus Geelong and Armstrong Creek. If you're nearby and not on that "
             "list, ask — it's a service area, not a hard boundary.</p>"),
            ("Do you understand seasonal businesses?",
             "<p>It's most of the work down here. Trade along this coast swings hard between the "
             "summer peak and the winter lull, and a site for a seasonal business needs to handle "
             "that — surfacing opening hours that actually change, making bookings easy in "
             "January, and still bringing in local trade in July.</p>"),
            ("Is a website worth it for a small seasonal business?",
             "<p>Often yes, but not always, and I'll say so if I don't think it is. If nearly all "
             "your trade is walk-in and you're already busy through summer, a well-optimised "
             "<a href=\"/services/google-business-profile\">Google Business Profile</a> may get you "
             "further for far less money than a full site.</p>"),
        ],
    },

    # ─────────────────────────── ABOUT / CONTACT ────────────────────
    {
        "path": "/about",
        "file": "about.html",
        "title": "About Lachlan Mooney — Surf Coast Web Designer",
        "description": (
            "I'm Lachlan, a web designer based in Torquay building fast, custom websites for "
            "small businesses across the Surf Coast and Geelong. Here's how I work."
        ),
        "priority": "0.7",
        "crumbs": [("About", None)],
        "page_type": "AboutPage",
        "cta_heading": "Want to work together?",
    },
    {
        "path": "/contact",
        "file": "contact.html",
        "title": "Contact — Get a Free Web Design Quote | Torquay & Geelong",
        "description": (
            "Get in touch for a free, no-obligation web design or SEO quote. Based in Torquay, "
            "serving Geelong and the Surf Coast. Reply within one business day."
        ),
        "priority": "0.95",
        "crumbs": [("Contact", None)],
        "page_type": "ContactPage",
        "faq_heading": "Before you get in touch",
        "faqs": [
            ("What happens after I send an enquiry?",
             "<p>I'll reply within one business day, usually sooner, with either a few follow-up "
             "questions or a time for a short call. There's no automated sales sequence and "
             "nobody else will call you — it's just me.</p>"),
            ("Is the quote really free?",
             "<p>Yes. You get a fixed written price for the work before anything starts, at no "
             "cost and with no obligation to proceed. If I don't think I'm the right fit for what "
             "you need, I'll tell you that instead.</p>"),
            ("What information should I include?",
             "<p>What your business does, which areas you serve, whether you have a site already, "
             "and roughly what you're hoping the website will achieve. Don't worry about getting "
             "it perfect — a couple of sentences is enough to start.</p>"),
        ],
    },
]
