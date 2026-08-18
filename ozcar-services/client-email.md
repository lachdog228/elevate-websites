# Client email — sending the mockup

Draft for sending the OZCAR Services mockup. Fill the two placeholders before
sending: the owner's first name and the preview link.

**Get the link first.** Drop `ozcar-services-netlify.zip` on
<https://app.netlify.com/drop>. Netlify gives back a `*.netlify.app` address —
that is the link to paste. It costs nothing and does not need a domain yet.

---

**Subject:** OZCAR Services — your new website, ready to look at

---

Hi [NAME],

The first version of the OZCAR Services site is done and ready for you to have
a look at:

**[PREVIEW LINK]**

Give it a click through on your phone as well as a computer. Most people
searching "trailer hire Geelong" are on a phone, so that is what it is built
around — the number is tappable on every page, and there is a call button that
follows you down the screen so nobody has to hunt for it.

Two things you will notice, both on purpose:

**The photos are mostly stand-ins.** Your tractor shot is in there on the
vehicle transport section. The rest are placeholders so you can see the layout
properly. If you can send me the full-size versions of the Hilux on the trailer
and the empty trailer with the toolbox — straight off your phone, not saved off
a webpage — plus anything you have of a towing job, they will go straight in.
Real photos of your own gear will lift it more than anything else on the list.

**A few details are highlighted in orange.** Trailer length, load capacity,
hire rates, deposit, minimum hire. I have left them blank rather than guess at
them. Same reason there is no email address on the site — I did not want to
invent one.

Everything else is real: your address, phone number, 24 hour opening, and all
four of your Google reviews word for word. The 5.0 rating is on the home page
and built into the code Google reads, so it can show in search results.

Have a look and let me know what you think. Once you have been through it, we
can jump on a quick call and knock over what is left to get it live.

To save time, worth having handy for that call:

- The trailer details above — sizes, capacity, rates, hire periods, deposit
- Whether you want a domain (something like ozcarservices.com.au) or to start
  on a free web address
- An email address for enquiries to land in, if you want them emailed
- Whether you hire out the bike trailer and the caged box trailer from your
  logo — if so I will add them as their own listings

Cheers,
Lachlan

---

## Shorter version, if you would rather text it

His reviews mention he is quick to reply to messages, so a text may land better
than an email.

> Hi [NAME], the OZCAR website is ready for you to look at: [LINK]
>
> Have a look on your phone. Photos are mostly stand-ins for now and a few
> details are highlighted in orange where I need your numbers — everything else
> is real. Let me know what you think and we will jump on a quick call to get
> it live.
>
> Lachlan

---

## Notes for you, not for him

- **Do not promise a live date on the call** until the domain question is
  settled. If he wants ozcarservices.com.au it needs registering and pointing at
  Netlify, which is a day or so of DNS propagation.
- **The enquiry form works the moment it is on Netlify** — submissions appear
  under Forms in the dashboard. Worth sending a test one yourself before the
  call so you can tell him it is working.
- **The canonical URLs still say `www.ozcarservices.com.au`.** If he goes with a
  different domain, or stays on the netlify.app address for a while, run the
  find-and-replace in the README first. Leaving it wrong tells Google the real
  page lives somewhere it does not.
- **The map on the contact page** could not be checked in the build environment.
  Have a look at it on the live preview before you send the link.
- **The logo.** The site uses a type-only wordmark at the moment. If he sends
  the logo as a PNG with a transparent background, or the original artwork file,
  it can go in the header properly. A JPEG on white will not sit on the dark
  background without cutting out.
