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
    intro: "Away from the desk, there's music, photography, books, films, and time spent with the people I love. Some of those interests find their way into my work. Most are just for me.",
    interests: [
      { title: "Photography", body: "" },
      { title: "Music", body: "Listening to music. I sang and played instruments before I designed anything." },
      { title: "Books", body: "Reading books." },
      { title: "Films", body: "Seeing movies." },
      { title: "Friends & family", body: "Time spent with the people I love." },
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
  contactLine: "Building a brand, strengthening a design team, or planning something I'd be a good fit for? I'd love to hear about it.",

  photoCredit: "Portraits by KN Photography",
};
