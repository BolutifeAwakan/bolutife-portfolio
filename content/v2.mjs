// Content for the v2 site that the current Sanity schema doesn't hold yet.
// Every line here comes from Bolutife's own words (her brief and messages,
// October 2026). Nothing is invented. Both design directions read this file
// through lib/model.mjs, so an edit here shows up in both.
//
// When these fields are added to Sanity, lib/model.mjs prefers the Sanity
// value and falls back to this file.

export default {
  headline: "I build brands, lead creative teams, and help businesses get more from design.",
  supporting:
    "I've spent over a decade working across design, creative direction, and business. These days, I'm also building initiatives, developing people, and sharing what I learn along the way.",
  identity: ["Designer", "Design Leader", "Founder"],
  base: "Lagos, Nigeria",

  // Homepage introduction (content revision, October 2026).
  intro: [
    "I started out as a self-taught graphic designer. Over a decade later, I've built brands, led creative teams, and started ventures of my own.",
    "I still care deeply about the craft. I'm just as interested in the people, decisions, and systems that make the work matter.",
  ],

  // Homepage summaries for the selected projects, keyed by slug.
  // Sharper source files for card pictures, where Sanity holds a larger copy of the same image.
  workThumbs: {
    traction: { url: "https://cdn.sanity.io/images/4t9br1cb/production/d58d3cf173bcf22f5600ba07060bafa80e1df4c2-2088x1392.png", w: 2088, h: 1392 },
  },
  projectSummaries: {
    "make-music-lagos": "A visual identity celebrating the sound, culture, and creative energy of Lagos.",
    housepadi: "An approachable identity for a property management platform, making the category feel simpler and more accessible.",
    lemuwe: "A restrained identity for a contemporary fashion label, built through typography, proportion, and space.",
  },

  // The Arc (direction C). The cover line and the three acts come from the
  // positioning strategy (October 2026), built on her own account of her career.
  cover: {
    lead: "Making design count",
    doors: [
      { key: "make", text: "the brands I build", proof: "Identities and brand worlds for music, fintech, fashion and founders" },
      { key: "lead", text: "the teams I lead", proof: "Leading design teams across fintech and health tech" },
      { key: "build", text: "the leaders I grow", proof: "Design Lever, Lilac Africa and four years of mentoring across 15 countries" },
    ],
  },
  now: [
    { label: "Day job", text: "Leading brand at a fintech" },
    { label: "Building", text: "Design Lever and Lilac Africa" },
  ],
  arc: {
    make: { title: "Make", line: "Over a decade of brand work, from music and entertainment into tech." },
    lead: { title: "Lead", line: "From making the work to leading the teams who make it, across fintech and health tech." },
    build: { title: "Build the conditions", line: "A company, a social enterprise, mentoring and the stage: the conditions that let design win." },
  },
  stagePromise: "Hope, then a first step.",

  belief:
    "Great design requires more than creative ability. It depends on strategic thinking, execution, capable people, leadership, business understanding, and the conditions that enable good work.",

  // Her own description of how she works (lightly edited from her notes).
  operator:
    "As much as I'm a visionary, I'm also an operator. I like to break things down to their fundamentals and build them back up, and to get results in execution as much as in strategy.",

  practice: [
    {
      title: "Branding",
      body: "I develop brand positioning, identities, and visual systems that connect business direction with how people recognise and experience a brand.",
    },
    {
      title: "Creative direction",
      body: "I shape creative direction across campaigns, launches, and brand experiences, guiding ideas from concept through execution.",
    },
    {
      title: "Design leadership",
      body: "I lead design teams and build the people, processes, and standards that help businesses get more value from design.",
    },
  ],

  venturesIntro: "Some of the ideas I care about have become businesses of their own.",

  path: [
    { when: "Before design", text: "Studied food technology. Sang and played instruments. Taught myself graphic design." },
    { when: "Music and entertainment", text: "Started my design career in entertainment, working with Mavin and artists including Johnny Drille, Chike, Di'Ja and Waje." },
    { when: "Technology", text: "Moved into tech and fintech, building brand systems at Terragon, Interswitch and Traction." },
    { when: "Health tech", text: "Led design for a global health tech platform." },
    { when: "Now", text: "Leading design teams, building Design Lever and Lilac Africa, and sharing what I learn." },
  ],

  ventures: [
    {
      slug: "design-lever",
      name: "Design Lever Inc.",
      role: "Founder",
      kind: "Company",
      line: "A design leadership firm helping African businesses build stronger design functions while creating opportunities for designers to grow.",
      body: "Design Lever helps growth-stage businesses use design for growth, revenue and savings, and helps great designers become great leaders.",
      offers: [
        { title: "Fractional executive leadership", body: "Executive design leadership consultations for businesses." },
        { title: "Research", body: "Mapping what is possible with design and designers." },
        { title: "Academy", body: "For budding design leaders." },
        { title: "Research pathway", body: "A pathway into design research." },
      ],
      // From Design Lever's own site.
      image: { src: "https://www.designleverinc.com/images/scenes/fly-academy.webp", alt: "A design leader working with a team around a table", pos: "50% 40%" },
      url: "https://www.designleverinc.com",
      cta: "Explore Design Lever",
    },
    {
      slug: "lilac-africa",
      name: "Lilac Africa",
      role: "Co-founder",
      kind: "Social enterprise",
      line: "Creating better access to education, mentorship, and career opportunities for women in design and technology.",
      body: "Lilac Africa gives women in design and technology a path into opportunity, a community to learn with, and mentorship.",
      offers: [],
      // From Lilac Africa's own site.
      image: { src: "/assets/talks/lilac-session-full.webp", alt: "A Lilac Africa session: a full room of women facing a panel of speakers", pos: "50% 55%" },
      url: "https://www.lilacafrica.com/",
      cta: "Visit Lilac Africa",
    },
  ],

  // Books. Store facts verified on Selar (selar.com/m/Bolutife01) and in her
  // Drive, 31 October 2026. Prices are the store's; keep them in step with it.
  books: [
    {
      slug: "worth-the-work",
      title: "Worth the Work",
      role: "Author",
      byline: "Book by Bolutife Awakan",
      line: "A practical guide to pricing creative work, understanding your costs, and building a sustainable creative business.",
      subtitle: "A practical guide to pricing creative work and building a sustainable business.",
      cover: "https://files.selar.co/product-images/2026/products/Bolutife01/worth-the-work-for-senior-selar.com-6a10bf8d17516.jpg",
      path: "/shop/worth-the-work",
      storeUrl: "https://selar.com/m/Bolutife01",
      cta: "Explore the book",
      editions: [
        { title: "For senior designers", detail: "Digital edition, with the companion pricing calculator", price: "$25", url: "https://selar.com/worththeworkforseniors" },
        { title: "For junior designers", detail: "Digital starter edition for designers one to three years in", price: "$10", url: "https://selar.com/worththeworkforjuniors" },
        { title: "Physical copy", detail: "Printed edition of the senior guide", price: "$25", url: "https://selar.com/worththeworkprint" },
      ],
    },
    {
      slug: "signature",
      title: "Signature",
      role: "Author",
      byline: "Book by Bolutife Awakan",
      subtitle: "The Journey to your Authentic Self",
      line: "A book on personal branding that starts with one question: who am I?",
      cover: "https://res.cloudinary.com/paystack/image/upload/q_auto/w_1080,c_limit/public/files/products/qccrdz4t18so0f2avvna.jpg",
      path: "/shop/signature",
      cta: "About the book",
      available: false,
    },
  ],
  storeUrl: "https://selar.com/m/Bolutife01",

  mentoring: "Mentor for four years, across 15 countries in Africa, Europe, the UK and the Americas.",

  speaking: {
    promise:
      "I've spent over a decade designing, leading teams, and working with businesses. When I speak, I share what that experience has taught me, including the things I wish I'd understood much earlier.",
    support: "My conversations usually sit somewhere between branding, design leadership, creative careers, business, and women in technology.",
    tracks: [
      { title: "Branding", body: "How branding shapes what people think and do, and how to put that to work." },
      { title: "Design leadership", body: "How great designers become great leaders, and what emerging markets can teach the world." },
      { title: "Business of design", body: "How design earns revenue, saves money and drives growth, and how to measure it so the business believes it." },
      { title: "Creative careers", body: "Building a sustainable creative career, including how to price creative work." },
      { title: "Women in Technology", body: "Women's empowerment, social enterprising, and building a personal brand that creates opportunities." },
    ],
    talks: [
      { title: "Rethinking Design Leadership: What emerging markets can teach the world", event: "Extended Pack Collective, UK 2026" },
      { title: "Beyond Visibility: Building a Personal Brand That Creates Opportunities", track: "Women in Technology", event: "WIMD Summit 2026" },
    ],
    formats: ["Keynotes", "Workshops", "Panels", "Guest lectures"],
  },

  side: {
    intro: "Away from the desk, there's fashion, music, books, films, and time spent with the people I love. Some of those interests find their way into my work. Most are just for me.",
    // Each interest is one card on the desk. `photo` is a slug from lib/photos.mjs;
    // without one the card is a coloured note until a real photo is added.
    interests: [
      // Each interest is a card on the desk (`image` or a local `photo` slug on its
      // face) and opens into its own little world (`format`).
      // Music and book covers come from Apple Music / Apple Books; music plays the
      // store's 30-second preview. Friends & family uses stand-in photos
      // (`standin: true`, from Unsplash) until her own hangout photos replace them.
      {
        title: "Fashion", format: "lookbook", photo: "chair-gold",
        body: "Dressing is how I tell my own story.",
        gallery: ["fla-look", "garden-sun", "steps-smile", "lawn-stand", "arch-white", "textile-dark", "lawn-crouch", "arch-mono", "doorway-dark"],
      },
      {
        title: "Music", format: "playlist",
        image: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/f1/61/a1/f161a175-cbb5-b371-bc0c-14d6fd60264e/67730ee9-be73-467c-80df-07f47e56c05b.jpg/600x600bb.jpg",
        body: "I sang and played instruments before I designed anything.",
        items: [
          {"title": "Beautiful Rain", "by": "The Cavemen", "album": "Roots", "art": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/f1/61/a1/f161a175-cbb5-b371-bc0c-14d6fd60264e/67730ee9-be73-467c-80df-07f47e56c05b.jpg/600x600bb.jpg", "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/21/64/fe/2164fec6-95bc-ffde-52bc-971d14f14b77/mzaf_9155742022724506071.plus.aac.p.m4a", "url": "https://music.apple.com/us/album/beautiful-rain/1527596673", "note": "On repeat"},
          {"title": "Bibanke", "by": "Aṣa", "album": "Aṣa", "art": "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/85/9e/2a/859e2a4d-694b-6ecd-ba0f-ee74ea1d4c9f/cover.jpg/600x600bb.jpg", "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/bf/1c/1e/bf1c1e27-b4ed-7ca8-6095-52ec099299b6/mzaf_11087570720656217643.plus.aac.p.m4a", "url": "https://music.apple.com/us/album/bibanke/1444729965"},
          {"title": "Free Mind", "by": "Tems", "album": "For Broken Ears", "art": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/c6/4d/ed/c64ded15-9cd9-4bd7-a3ea-051178b2427d/195497234301.jpg/600x600bb.jpg", "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/23/76/10/2376109d-960f-5238-d0c2-a3f31b876477/mzaf_3424759630146198062.plus.aac.p.m4a", "url": "https://music.apple.com/us/album/free-mind/1532252592"},
          {"title": "Water No Get Enemy", "by": "Fela Kuti", "album": "Expensive Shit", "art": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/00/72/0b/00720bab-3cba-5f1c-5405-1cd5a3037491/720841207597_Cover.jpg/600x600bb.jpg", "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e0/49/a3/e049a3fd-c94b-5289-9519-02d1ee8706fa/mzaf_5005095867929399591.plus.aac.p.m4a", "url": "https://music.apple.com/us/album/water-no-get-enemy/739004054"},
          {"title": "Last Last", "by": "Burna Boy", "album": "Love, Damini", "art": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ca/eb/31/caeb3173-eaf0-0cd5-65ea-585adfe312ba/075679745156.jpg/600x600bb.jpg", "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/42/c0/0f/42c00f8b-fff6-2529-70c3-861c21143c0a/mzaf_2842108628707526245.plus.aac.p.m4a", "url": "https://music.apple.com/us/album/last-last/1623677591"},
        ],
      },
      {
        title: "Books", format: "shelf",
        image: "https://is1-ssl.mzstatic.com/image/thumb/Publication122/v4/a3/c3/73/a3c37376-b40b-d71f-9f18-78c2f9d08831/9780593653425.d.jpg/600x600bb.jpg",
        body: "Reading books.",
        items: [
          {"title": "The Creative Act", "by": "Rick Rubin", "cover": "https://is1-ssl.mzstatic.com/image/thumb/Publication122/v4/a3/c3/73/a3c37376-b40b-d71f-9f18-78c2f9d08831/9780593653425.d.jpg/600x600bb.jpg", "url": "https://books.apple.com/us/book/the-creative-act/id1621808272", "now": true, "spine": "#cbcfc6", "ink": "#151515", "w": 30},
          {"title": "Uplifting Design", "by": "Dan Makoski", "cover": "/assets/books/uplifting_design.jpg", "url": "https://books.apple.com/us/book/uplifting-design-transforming-business-society-through/id6472603540", "spine": "#141414", "ink": "#ffffff", "w": 30},
          {"title": "Worth the Work", "by": "Bolutife Awakan", "cover": "/assets/books/wtw_senior.jpg", "url": "https://selar.com/m/Bolutife01", "spine": "#5b5cf3", "ink": "#ffffff", "w": 28},
          {"title": "The Culture Map", "by": "Erin Meyer", "cover": "/assets/books/culture_map.jpg", "url": "https://books.apple.com/us/book/the-culture-map/id1209985939", "spine": "#f5e21b", "ink": "#1b1b1b", "w": 34},
          {"title": "Becoming", "by": "Michelle Obama", "cover": "https://is1-ssl.mzstatic.com/image/thumb/Publication114/v4/40/85/6c/40856c45-c99f-f27e-8546-246000f0d91c/9781524763152.d.jpg/600x600bb.jpg", "url": "https://books.apple.com/us/book/becoming/id1352746782", "spine": "#bacaca", "ink": "#151515", "w": 44},
          {"title": "Show Your Work!", "by": "Austin Kleon", "cover": "https://is1-ssl.mzstatic.com/image/thumb/Publication122/v4/07/fd/9d/07fd9dad-85b2-a5ee-722a-8cbd830682e5/9780761181361.jpg/600x600bb.jpg", "url": "https://books.apple.com/us/book/show-your-work/id6443055057", "spine": "#fed109", "ink": "#151515", "w": 24},
          {"title": "Radical Candor", "by": "Kim Scott", "cover": "https://is1-ssl.mzstatic.com/image/thumb/Publication123/v4/5f/0d/0e/5f0d0e84-d2be-bc40-d482-503e43b83252/9781250235381.jpg/600x600bb.jpg", "url": "https://books.apple.com/us/book/radical-candor-fully-revised-updated-edition/id1455111465", "spine": "#fbb325", "ink": "#151515", "w": 36},
          {"title": "Good Strategy Bad Strategy", "by": "Richard Rumelt", "cover": "https://is1-ssl.mzstatic.com/image/thumb/Publication3/v4/ac/58/04/ac5804ff-e4cf-9576-e666-aa14d0deefb9/9780307886255.jpg/600x600bb.jpg", "url": "https://books.apple.com/us/book/good-strategy-bad-strategy/id422539860", "spine": "#0d0304", "ink": "#e9c46a", "w": 34},
          {"title": "Shoe Dog", "by": "Phil Knight", "cover": "https://is1-ssl.mzstatic.com/image/thumb/Publication115/v4/46/d1/4c/46d14cc4-205b-ed79-5630-9a851d231f5e/9781501135934.jpg/600x600bb.jpg", "url": "https://books.apple.com/us/book/shoe-dog/id1052919171", "spine": "#231f20", "ink": "#f05a28", "w": 40},
          {"title": "The Making of a Manager", "by": "Julie Zhuo", "cover": "https://is1-ssl.mzstatic.com/image/thumb/Publication221/v4/2a/d2/59/2ad259e4-a936-3653-1c95-cb84468f90eb/9780735219571.d.jpg/600x600bb.jpg", "url": "https://books.apple.com/us/book/the-making-of-a-manager/id1350231477", "spine": "#6ec1af", "ink": "#151515", "w": 32},
          {"title": "Start with Why", "by": "Simon Sinek", "cover": "https://is1-ssl.mzstatic.com/image/thumb/Publication211/v4/c6/a0/37/c6a0375d-c504-bb31-6c27-fabcb38b36a4/9798217045648.d.jpg/600x600bb.jpg", "url": "https://books.apple.com/us/book/start-with-why-15th-anniversary-edition/id6745240120", "spine": "#fcfcfc", "ink": "#c8102e", "w": 30}
        ],
      },
      {
        title: "Films", format: "posters",
        image: "https://upload.wikimedia.org/wikipedia/en/c/c8/Lionheart_%282018_film%29_poster.jpg",
        imageAlt: "Lionheart film poster",
        body: "Seeing movies.",
        // Posters are the films' own (from their Wikipedia pages).
        items: [
          {"title": "Lionheart", "year": "2018", "by": "Genevieve Nnaji", "posters": ["https://upload.wikimedia.org/wikipedia/en/c/c8/Lionheart_%282018_film%29_poster.jpg"]},
          {"title": "The Woman King", "year": "2022", "by": "Gina Prince-Bythewood", "posters": ["https://upload.wikimedia.org/wikipedia/en/0/0a/The_Woman_King_%28film%29_poster.jpg", "https://upload.wikimedia.org/wikipedia/en/2/2c/The_Woman_King_poster.jpg"]},
          {"title": "Hidden Figures", "year": "2016", "by": "Theodore Melfi", "posters": ["https://upload.wikimedia.org/wikipedia/en/4/4f/The_official_poster_for_the_film_Hidden_Figures%2C_2016.jpg"]},
          {"title": "Spirited Away", "year": "2001", "by": "Hayao Miyazaki", "posters": ["https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png"]},
        ],
      },
      {
        title: "Friends & family", format: "moments",
        image: "/assets/side/friends-coco-v2.jpg",
        imageAlt: "Bolutife and a friend taking a mirror selfie in a lift",
        body: "Time spent with the people I love.",
        // Her own photos and video stills, from her footage archive.
        items: [
          {"image": "/assets/side/friends-coco-v2.jpg", "alt": "Bolutife and a friend taking a mirror selfie in a lift"},
          {"image": "/assets/side/friends-laugh-v2.jpg", "alt": "Bolutife laughing with a friend in a pink top"},
          {"image": "/assets/side/friends-airport-v2.jpg", "alt": "Bolutife and a friend smiling in an airport terminal"},
          {"image": "/assets/side/friends-cafe-v2.jpg", "alt": "Bolutife and a friend outside a café"},
        ],
      },
      {
        title: "Sports", format: "sports",
        image: "https://images.unsplash.com/photo-1781152791873-ced9456b14ac?w=1600&q=85&auto=format&fit=crop",
        imageAlt: "Football under stadium lights",
        body: "Watching, playing and keeping up.",
        // Unsplash: Maryam Tello (football), Khanh Do (table tennis), Emanuel Ekström (Formula 1).
        items: [
          {"title": "Football", "image": "https://images.unsplash.com/photo-1781152791873-ced9456b14ac?w=1600&q=85&auto=format&fit=crop", "alt": "Football under stadium lights"},
          {"title": "Table tennis", "image": "https://images.unsplash.com/photo-1758798480119-409a9e9925ad?w=1600&q=85&auto=format&fit=crop", "alt": "Two people playing table tennis outdoors"},
          {"title": "Car racing", "image": "https://images.unsplash.com/photo-1762857362511-86142780dc43?w=1600&q=85&auto=format&fit=crop", "alt": "A red Formula 1 car"},
        ],
      },
    ],
  },

  thoughtsIntro: "Some things I've learned by doing. Others I'm still thinking through.",
  experimentsIntro: [
    "Not everything I make starts with a brief. Sometimes I'm following an idea, trying a technique, or simply seeing what happens when I make something differently.",
    "This is where those explorations live.",
  ],
  experimentsKinds: [
    "Typography explorations",
    "Motion tests",
    "Visual studies",
    "Creative coding",
    "Photography experiments",
    "Print experiments",
    "Unused concepts",
    "Self-initiated work",
  ],
  shopIntro: "Books and resources built from the things I've learned about branding, design, and the business of creative work.",
  // Her Connectr page for booking calls. Every "Book a call" goes straight there once set.
  bookingUrl: "https://conectr.me/bolutifeawakan",
  // Roles in the order of her CV (her list, 31 Oct 2026). Countries from her CV.
  roles: [
    { org: "Risevest", role: "Group Design Lead", period: "2026 - Now", country: "Nigeria" },
    { org: "Neo Health", role: "Head of Design", period: "2024", country: "US" },
    { org: "Capex Funds", role: "Creative Director", period: "2021 - 2023", country: "US" },
    { org: "Interswitch Group", role: "Senior Brand Designer", period: "2024 - 2025", country: "Nigeria" },
    { org: "Traction Apps", role: "Brand & Creatives Manager", period: "2022 - 2024", country: "Nigeria" },
    { org: "Terragon Group", role: "Senior Brand & Marketing Designer", period: "2021 - 2022", country: "Nigeria" },
    { org: "MSports Limited", role: "Brand Designer", period: "2020", country: "West Africa" },
    { org: "Showgear Limited", role: "Creative Designer", period: "2016 - 2020", country: "Nigeria" },
  ],

  // Added to the top of Recognition.
  awardsLatest: [{ title: "Exponential Design Leader", org: "", year: "2026" }],

  // Press and speaking downloads on Thoughts. Each asks for a name and email first.
  // Talks given, with photos from the 2026 press kit.
  pastTalks: [
    { event: "Cloudde Tech Conference, Ibadan", title: "Attracting high-value clients as a value-based designer", format: "Panel", year: "2024", img: "cloudde-lens", pos: "55% 62%" },
    { event: "Design Spin-Off by Sections", title: "The role of design leadership in driving growth", format: "Panel", year: "2024", img: "design-spinoff" },
    { event: "Untitled Designers' Conference", title: "Branding with authenticity amid content noise", format: "Keynote", year: "2024", img: "untitled-designers" },
    { event: "Design Matters '23", title: "Creativity for social change", format: "Talk", year: "2023", img: "design-matters" },
  ],
  // Places she has spoken that have no photo card yet; shown with the venues line.
  moreVenues: [],
  // Press, TV and radio, newest first. Each shows the outlet's logo in place of its name.
  // The radio interview wasn't recorded, so it has no link.
  press: [
    { pub: "TVC", logo: "tvc", ar: 2.96, title: "AI is a threat to professionals: why creatives must step up", kind: "TV interview, Wake Up Nigeria", date: "September 2026", url: "https://www.youtube.com/watch?v=b9olhllG2DA", go: "Watch" },
    { pub: "Royal Roots 107.1 FM, Lagos", logo: "royal-roots", ar: 3.18, title: "Design as infrastructure: turning creative work into business value", kind: "Radio interview, The Creative Exchange", date: "September 2026" },
    { pub: "Vanguard", logo: "vanguard", ar: 4.63, ext: "svg", title: "1,500 women, one mission: building tech pathways for African women", kind: "Feature", date: "September 2026", url: "https://www.vanguardngr.com/2026/09/1500-women-one-mission-building-tech-pathways-for-african-women/" },
    { pub: "Technext", logo: "technext", ar: 4.5, title: "The future is Lilac: raising the next generation of female tech leaders", kind: "Feature", date: "April 2025", url: "https://technext24.com/2025/04/08/lilac-raising-next-female-tech-leaders/" },
    { pub: "Techeconomy", logo: "techeconomy", ar: 6.1, ext: "svg", title: "Lilac: raising the next generation of female tech leaders", kind: "Feature", date: "April 2025", url: "https://techeconomy.ng/lilac-raising-the-next-generation-of-female-tech-leaders" },
    { pub: "EduTimes Africa", logo: "edutimes", ar: 3.69, title: "Understanding branding: how education made me", kind: "Interview", date: "April 2024", url: "https://edutimesafrica.com/understanding-branding-how-education-made-me-interview-with-bolutife-awakan/" },
    { pub: "The Creatives Note", logo: "creatives-note", ar: 10.28, title: "On finding design, constantly learning, investing in herself and the role of strategy in design", kind: "Interview", date: "April 2024", url: "https://thecreativesnote.substack.com/p/bolutife-awakan-brand-designer-on-finding-design" },
  ],
  downloads: [
    { key: "press-kit", title: "Press kit", note: "Bio, photos and talk topics in one PDF.", file: "/assets/press/bolutife-awakan-press-kit-2026.pdf" },
    { key: "headshots", title: "Headshots", note: "Six portraits, high resolution.", file: "/assets/press/bolutife-awakan-headshots.zip" },
    { key: "cv", title: "Request CV", href: "/contact?about=cv" },
  ],

  contactLine: "Building a brand, strengthening a design team, or planning something I'd be a good fit for? I'd love to hear about it.",

  photoCredit: "Portraits by KN Photography",
};
