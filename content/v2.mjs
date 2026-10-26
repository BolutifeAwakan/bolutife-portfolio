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
  identity: ["Design Leader", "Brand Strategist", "Founder"],

  belief:
    "Great design requires more than creative ability. It depends on strategic thinking, execution, capable people, leadership, business understanding, and the conditions that enable good work.",

  // Her own description of how she works (lightly edited from her notes).
  operator:
    "As much as I'm a visionary, I'm also an operator. I like to break things down to their fundamentals and build them back up, and to get results in execution as much as in strategy.",

  practice: [
    {
      title: "Brand and identity",
      body: "Identities and the worlds around brands: positioning, visual systems, and the direction that holds them together.",
    },
    {
      title: "Creative direction",
      body: "Leading the creative work on campaigns, launches, events and film, from the first idea to the last asset.",
    },
    {
      title: "Design leadership",
      body: "Leading design teams, and building the conditions that let good design work inside a business.",
    },
  ],

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
      line: "Making design count by building the infrastructure of African design leadership.",
      body: "Design Lever helps growth-stage businesses use design for growth, revenue and savings, and helps great designers become great leaders.",
      offers: [
        { title: "Fractional executive leadership", body: "Design leadership for companies that need it before they need a full-time hire." },
        { title: "Research", body: "Studying what is possible with design and designers, to close the knowledge and experience gaps." },
        { title: "Academy", body: "Programmes for designers growing into leadership." },
        { title: "Research pathway", body: "A route for designers to build the evidence the industry needs to grow faster and compete globally." },
      ],
      url: "https://www.designleverinc.com",
      cta: "Visit Design Lever",
    },
    {
      slug: "lilac-africa",
      name: "Lilac Africa",
      role: "Founder",
      kind: "Social enterprise",
      line: "Better opportunities, community learning and mentorship for women in technology.",
      body: "I started Lilac Africa to give women in tech a softer landing: a path into opportunity, a community to learn with, and mentors who have done it.",
      offers: [
        { title: "Lilac Luminaries", body: "A live, virtual pan-African masterclass programme for senior women in design and technology." },
      ],
      url: "",
      cta: "",
    },
  ],

  books: [
    {
      title: "Worth the Work",
      role: "Author",
      line: "My book, published on Amazon KDP.",
      url: "https://worth-the-work.vercel.app",
      cta: "About the book",
    },
  ],

  mentoring: "Mentor for four years, across 15 countries in Africa, Europe, the UK and the Americas.",

  speaking: {
    promise: "I like to inspire people, give them hope, and help them start building something practical with their lives.",
    tracks: [
      { title: "Design's value, measured", body: "How design earns revenue, saves money and drives growth, and how to measure it so the business believes it." },
      { title: "Design leadership", body: "How great designers become great leaders, and what emerging markets can teach the world." },
      { title: "Women and social enterprise", body: "Building a personal brand that creates opportunities, and building things that open doors for others." },
      { title: "Brand", body: "How branding shapes what people think and do, and how to put that to work." },
    ],
    talks: [
      { title: "Rethinking Design Leadership: What emerging markets can teach the world", track: "Design leadership" },
      { title: "Beyond Visibility: Building a Personal Brand That Creates Opportunities", track: "Women and social enterprise", event: "WIMD Summit 2026" },
    ],
    formats: ["Keynotes", "Workshops", "Panels", "Fireside conversations"],
  },

  side: {
    intro: "Away from work, I'm a reader, a film watcher and a music lover, and I'm happiest with friends and family. I'm an introvert by nature and an extrovert when it counts. Faith, learning and curiosity run through all of it.",
    interests: [
      { title: "Films", body: "Seeing movies." },
      { title: "Books", body: "Reading, and breaking ideas down to their fundamentals." },
      { title: "Music", body: "I sang and played a few instruments before I designed anything." },
      { title: "Friends and family", body: "The first daughter of my family, used to looking out for my siblings." },
      { title: "Sharing what I learn", body: "I teach by practice: what I'm working on is what I share." },
    ],
  },

  photoCredit: "Portraits by KN Photography",
};
