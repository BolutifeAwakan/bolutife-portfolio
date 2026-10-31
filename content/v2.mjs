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
      image: { src: "https://www.lilacafrica.com/_next/static/media/leadership.4358f516.webp", alt: "Hands holding a glowing light bulb", pos: "50% 45%" },
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
      { title: "Rethinking Design Leadership: What emerging markets can teach the world", track: "Design leadership" },
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
        gallery: ["garden-sun", "lawn-crouch", "arch-white"],
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
          {"title": "The Creative Act", "by": "Rick Rubin", "cover": "https://is1-ssl.mzstatic.com/image/thumb/Publication122/v4/a3/c3/73/a3c37376-b40b-d71f-9f18-78c2f9d08831/9780593653425.d.jpg/600x600bb.jpg", "url": "https://books.apple.com/us/book/the-creative-act/id1621808272", "now": true},
          {"title": "Dare to Lead", "by": "Brené Brown", "cover": "https://is1-ssl.mzstatic.com/image/thumb/Publication114/v4/ff/d8/7a/ffd87a45-4950-a350-b1e6-e78b1f8de896/9780399592546.jpg/600x600bb.jpg", "url": "https://books.apple.com/us/book/dare-to-lead/id1384267645"},
          {"title": "Half of a Yellow Sun", "by": "Chimamanda Ngozi Adichie", "cover": "https://is1-ssl.mzstatic.com/image/thumb/Publication211/v4/d9/5f/64/d95f64a4-ef5c-f689-6a7d-51f099197421/9780307485779.d.jpg/600x600bb.jpg", "url": "https://books.apple.com/us/book/half-of-a-yellow-sun/id420053899"},
          {"title": "Things Fall Apart", "by": "Chinua Achebe", "cover": "https://is1-ssl.mzstatic.com/image/thumb/Publication127/v4/c9/2d/e4/c92de4ef-7345-602a-a5a9-a3379c837cd3/9780307743855.jpg/600x600bb.jpg", "url": "https://books.apple.com/us/book/things-fall-apart/id1230757278"},
          {"title": "Steal Like an Artist", "by": "Austin Kleon", "cover": "https://is1-ssl.mzstatic.com/image/thumb/Publication122/v4/6c/8f/70/6c8f709c-47bc-d570-af3f-cb3eef8a5b1b/9780761171256.jpg/600x600bb.jpg", "url": "https://books.apple.com/us/book/steal-like-an-artist/id6443055944"},
          {"title": "Atomic Habits", "by": "James Clear", "cover": "https://is1-ssl.mzstatic.com/image/thumb/Publication221/v4/1f/1b/d3/1f1bd34a-aa29-25e8-b133-7e19b38a5702/9780735211308.d.jpg/600x600bb.jpg", "url": "https://books.apple.com/us/book/atomic-habits/id1384286945"},
        ],
      },
      {
        title: "Films", format: "tickets",
        image: "https://images.unsplash.com/photo-1762541693135-fb989de961e1?w=1200&q=80&auto=format&fit=crop",
        imageAlt: "Projector light across an empty cinema",
        body: "Seeing movies.",
        items: [
          {"title": "Lionheart", "year": "2018", "note": "Directed by Genevieve Nnaji"},
          {"title": "The Woman King", "year": "2022", "note": "Directed by Gina Prince-Bythewood"},
          {"title": "Hidden Figures", "year": "2016", "note": "Directed by Theodore Melfi"},
          {"title": "Spirited Away", "year": "2001", "note": "Directed by Hayao Miyazaki"},
        ],
      },
      {
        title: "Friends & family", format: "moments",
        image: "https://images.unsplash.com/photo-1630726410985-a1021e8a232a?w=1200&q=80&auto=format&fit=crop",
        imageAlt: "Friends laughing together outdoors",
        body: "Time spent with the people I love.",
        items: [
          {"image": "https://images.unsplash.com/photo-1630726410985-a1021e8a232a?w=800&q=80&auto=format&fit=crop", "alt": "Friends laughing together outdoors", "standin": true},
          {"image": "https://images.unsplash.com/photo-1731475761027-0b6b33b74547?w=800&q=80&auto=format&fit=crop", "alt": "Friends around a dinner table", "standin": true},
          {"image": "https://images.unsplash.com/photo-1611432580340-af48bd7549ed?w=800&q=80&auto=format&fit=crop", "alt": "Two friends on a sofa", "standin": true},
          {"image": "https://images.unsplash.com/photo-1683549387218-f52690727f51?w=800&q=80&auto=format&fit=crop", "alt": "Friends cooking together in a kitchen", "standin": true},
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
  bookingUrl: "",
  contactLine: "Building a brand, strengthening a design team, or planning something I'd be a good fit for? I'd love to hear about it.",

  photoCredit: "Portraits by KN Photography",
};
