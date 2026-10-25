// Starter content, mirrored from the Framer site (October 2026).
// The live site reads from Sanity; this file is the fallback and the source
// for the one-time import.

const FR = "https://framerusercontent.com/images/";
const FA = "https://framerusercontent.com/assets/";
const m = (id, size = "full") => ({ url: (id.endsWith(".mp4") ? FA : FR) + id, size });
const half = (id) => m(id, "half");

export default {
  settings: {
    name: "Bolutife Awakan",
    role: "Design. Strategy. Creative Direction",
    intro: "I care about work that goes into the world and helps people feel and do something. 10 years of it, across Africa, US, and Europe",
    portrait: m("SVEGHmRfolBIN4qo1afyfH7NOic.png"),
    clientLogos: [],
    newsletterBlurb: "Join my newsletter where I share insights, stories, and resources for entrepreneurs and brand builders.",
    newsletterUrl: "",

    aboutTags: ["Design", "Sports", "Music"],
    aboutPortrait: m("9vkqDqHCLLTttnzUv4cnm8zgf1A.jpg"),
    aboutParagraphs: [
      "I'm Bolutife, a brand identity designer and CD who believes that to be a better designer is to be a better human. You can't design something people feel until you've done the work to feel things yourself. I've spent over a decade building brands across Lagos, Nigeria, the US, Canada, and parts of Europe, and the thing my clients and employers say about me most is that I'm their partner. I care, and I never leave them to figure things out alone. I learnt that early, being the first child of many siblings. Care, ownership and responsibility aren't just some skills I picked up, they are a part of my person.",
      "I'm tactical enough to execute and visionary enough to imagine what hasn't been tried yet. Have a look at the work. If it moves you the way it's moved my clients, say hello.",
    ],
    nowPlaying: {
      song: "Beautiful Rain",
      album: "ROOTS",
      artist: "The Cavemen.",
      cover: { url: "https://i.scdn.co/image/ab67616d00001e02a05af10a651535ba44f93ac8", size: "full" },
      url: "",
    },
    career: [
      { year: "2025", text: "Led the rebrand of Traction Apps, supporting a $6M raise" },
      { year: "2024", text: "Head of Design at Neo Health, a global healthtech platform" },
      { year: "2023", text: "Recognized among the top 0.8% of freelance designers worldwide (Team&Tonic)" },
      { year: "2023", text: "Created brand systems still in use years later at companies like Terragon and Interswitch" },
    ],
    education: [
      { year: "2025", title: "Executive MBA for Design Leaders", org: "Future London Academy" },
      { year: "2024", title: "International MBA", org: "Rome Business School" },
      { year: "2024", title: "Masters of Business Administration", org: "Valencia de Universidad" },
      { year: "2023", title: "Design Management Fellow", org: "Coho" },
    ],
    experience: [
      { period: "(2023 - Now)", role: "Chief Design Officer", org: "Neo Health" },
      { period: "(2021 - 2023)", role: "Creative Director", org: "Capex Funds" },
      { period: "(2018 - 2021)", role: "Brand & Creatives Manager", org: "Traction" },
      { period: "(2016 - 2018)", role: "Senior Brand Designer", org: "Interswitch Group" },
      { period: "(2016 - 2020)", role: "Creative Designer", org: "Showgear / Make Music Lagos" },
      { period: "(2013 - 2016)", role: "Senior Brand & Marketing Designer", org: "Terragon" },
    ],
    offDutyLine: "When I’m not designing, you’ll find me mapping cities, curating playlists, or chasing ideas that blur the line between art, business, and culture.",
    aboutPhotos: [m("pBKVJUTqDFzSMHw7sdJJLq26z0.jpg"), m("ulFuaiKebbWtSI8xtd9cdvk.jpg"), m("QKkVuCsY5WhgmCoFRuIYeJaPf8.jpg"), m("n7cuoDLqLmhCZBtDJGN6yhHA.jpg")],
    appearances:
      "Untitled Designers Conference — keynote on design leadership and collaboration.\nTech Nation AMA Sessions — sharing insights with global talent applicants.\nIdeation Hub Trainings — workshops on the role of product managers in design.\nPanels & Guest Lectures — across branding, strategy, and creative careers.",

    speakingIntro:
      "I don’t believe in talks that sound good but leave no trace. When I speak, my goal is simple: give people stories, tools, and perspectives they can carry into their work the next day. I’ve spoken to founders, students, and creative communities on stages, in classrooms, and at conferences always with the same approach: make it practical, make it human, and make it memorable.",
    speakingImage: m("YEVn40vHIExsZK8kyUJbuNnc.png"),
    speakingTopics: ["Design", "Branding", "Leadership", "Strategy", "Storytelling", "Women led initiatives"],
    signatureTopics: [
      { title: "Branding", body: "How to build brands that are remembered, not just noticed." },
      { title: "Design & Product", body: "Lessons from creating products that balance clarity with creativity." },
      { title: "Leadership & Collaboration", body: "My ‘Friendship OS’ philosophy: warmth with boundaries." },
      { title: "Women in Tech", body: "Navigating, leading, and reshaping spaces where representation matters." },
    ],
    speakingPhotos: [m("RQNH07Mhjr4QAbTkJWzkLuJVQ.png"), m("NrKpkqTDIaFKmJU43up34MqbOQ.jpg"), m("9FFlgrwba9Wk6z2VMmSWVBfkTU.png")],
    bioUrl: "",
    headshotsUrl: "",
    pressKitUrl: "",

    email: "hello@bolutifeawakan.com",
    locations: ["Lagos, Nigeria", "London, UK"],
    socials: [
      { label: "YouTube", url: "https://www.youtube.com/@BolutifeAwakan" },
      { label: "Linkedin", url: "https://www.linkedin.com/in/bolutifeawakan/" },
    ],
    footerLine: "Building something that matters? Let’s make it unforgettable.",
  },

  services: [
    {
      title: "Branding & Strategy",
      body: "I work with founders and teams to build lasting brands from inside out, designing the identity, positioning, and direction that inspires action.",
      tags: ["Brand Strategy", "Visual Design", "Creative Direction"],
    },
    {
      title: "Digital & Product Design",
      body: "I design digital experiences like products and websites that feel natural, clear, human, and delightful to use.",
      tags: ["Web Design", "App Design", "UX Research"],
    },
    {
      title: "Team Trainings & Workshops",
      body: "For teams with wrong structure, unclear direction, no real connection to what the business needs. I build the conditions for the team to perform its best.",
      tags: ["Design Leadership", "Team Workshops", "Creative Strategy"],
    },
  ],

  playground: {
    title: "Playground",
    intro: "Shots, experiments and small explorations. The things I make between the big projects, just to see what happens.",
  },
  shots: [],
  loader: {
    enabled: true,
    line1: "Bolutife",
    line2: "Awakan",
    line3: "of London",
    backdrop: "https://cdn.sanity.io/images/4t9br1cb/production/aa31ca423dcb22c24a4c5cdf71a972734c1504ad-327x423.png",
    portrait: "https://cdn.sanity.io/images/4t9br1cb/production/4e35ed5e21ac3ceed0c0f3f852b8305524b5d982-218x282.png",
  },
  awards: [
    { year: "2025", title: "Top 0.8% of Freelance Designers Worldwide", org: "Team & Tonic", hoverImage: "https://cdn.sanity.io/images/4t9br1cb/production/bcf208522c4bf169934c3cc785bac2fb1bfc7565-840x594.png" },
    { year: "2024", title: "Cloudde Tech Honourary Award", org: "Cloudde", hoverImage: "https://cdn.sanity.io/images/4t9br1cb/production/abf04f94dc8bdfed04d54f563d0553e5811faf10-840x594.png" },
    { year: "2023", title: "Brand Designer of the Year", org: "No Code Tech Summit", hoverImage: "https://cdn.sanity.io/images/4t9br1cb/production/10e4dbcaeaa5fd5daec8790224319332b078eba0-840x594.png" },
  ],

  testimonials: [
    {
      quote: "\"Bolutife is an absolutely amazing designer. She didn’t just capture the essence of our brand in the identity design, she also has an amazing personality. So enthusiastic about our business and brand that she delivered more than we paid her for. She was patient and carried us along throughout the entire process, it felt like we were in on the big decisions too. I would recommend her over and over again.\"",
      name: "Oyindamola Bakare",
      role: "Founder, HousePadi",
      avatar: m("CkbRIDuzamqbTp0jdlaYy2svvVc.png"),
    },
    {
      quote: "\"I consider myself incredibly lucky to have partnered with Bolu as our brand designer. She's not your typical designer; she's a brand magician! Bolu's creativity knows no bounds. She doesn't just create designs; she crafts experiences that leave a lasting impression. Rayna UI is a living example.\"",
      name: "Ogaga John",
      role: "Co-founder, Rayna UI",
      avatar: m("lFIK4JqXHmKv7UYmzI1PyyEIu4.png"),
    },
    {
      quote: "“Bolu’s evident energy and enthusiasm shines through her work, with her dynamism with colour and bold approaches.”",
      name: "Victor Fatanmi",
      role: "Lead Partner, FourthCanvas / CEO. Fullgap",
      avatar: m("63Lpo8Nh8nDLeteLGlLElNmR8RU.png"),
    },
  ],

  notes: [
    {
      title: "Friendship as Leadership - why teams thrive when leaders build trust",
      url: "https://bolutifeawakan.framer.website/note-items/the-moodboard-before-the-moodboard",
      thumbnail: m("jj1AY4UgiJClgu5Qr8R6xJrZRJo.png"),
    },
    {
      title: "The Future of Brand Systems - scaling without losing soul",
      url: "https://bolutifeawakan.framer.website/note-items/the-village-concept-building-brands-people-belong-to",
      thumbnail: m("X60i0xw24qk3uAo8923dsqScN9E.png"),
    },
    {
      title: "Designing for Healthcare - lessons from building for impact in Africa.",
      url: "https://medium.com/the-year-of-the-looking-glass",
      thumbnail: m("3RfI5CYSX0Cpede23gkTLSYNv0.png"),
    },
  ],

  projects: [
    {
      slug: "make-music-lagos",
      title: "Make Music Lagos",
      summary: "Bringing Lagos to the global World Music Day map with a vibrant identity rooted in culture and creativity",
      thumbnail: m("h6Fld8RjOVqC5udQdF3XiGSC08A.gif"),
      featured: true,
      client: "Make Music Lagos",
      services: "Music & Entertainment",
      year: "2022",
      tags: ["Art Direction", "Print & Production", "Design"],
      intro: "Make Music Lagos is a franchise of World Music Day, UK, a celebration of the World Music Day on June 21st with Lagos as the centre. Big concerts, multiple states, merchandise, event branding that needed to work everywhere.",
      cover: m("KHirkXTxKzQ5qCZ230vzoCOBzU.png"),
      sections: [
        {
          heading: "The Inspiration",
          body: "When I got the brief, I was stuck for months. I researched, sketched, pushed directions that felt close but none of the earliest iterations felt right. The people loved the previous year's identity but that put a lot of pressure on me. Then just as I decided to destress, I found magic. One evening I was on a bus with a woman sitting nearby who was wearing an outfit with some patterns, and shapes that immediately spoke to me, the kinds of shapes you rarely see in a fabric. I took a picture and when I got home I started extracting the shapes and exploring the possibility of building a typeface from them. That eventually became the display typography for the entire brand system that year.",
          images: [m("hrvo1WBylbUYxRVnjlvI7IBs1vg.png"), m("Ee5UJ7rZYoy58bY5gZEddCB8zlE.png"), half("b6pMHrsL14MND7O7YsQfX5t51As.png"), half("UolaQazXKvsFnk62UonHblPhA.jpg")],
        },
        {
          heading: "The System",
          body: "We built the identity around a flexible system that could speak to multiple audiences across the country while maintaining its core character. The color palette celebrates the country's energy: the bold blues, vibrant reds, sunshine yellows, and fresh greens that run through African culture, agriculture, everyday life worked together to create a visual rhythm that felt both distinctly Nigerian and globally relevant.",
          images: [half("ulU6AYVmuyWUa5gmb03Ftrcwpmo.png"), half("Oo6Dh5Bbco1TFINkIpHTfTw5sgs.png")],
        },
        {
          heading: "Going Live",
          body: "Post-covid, there were many uncertainties which led to low event turnout and sales from 2020 to 2021. The goal for 2022 was to drive event turnout, and merchandise sales, and to do that effectively, I knew it was important that we get people excited to be a part of the festival again.\n\nAfter the first visuals went live and we opened the store, we had our first batch of merchandise sold out in days, sales jumped over 70% from the previous years combined, the identity received special recognition from the UK World Music Day board and even won me a brand designer of the year award. Make Music Lagos then went from a growing local event to a recognised name on the global map.",
          images: [m("t6auaMQ1o0CXyaOpDMct7OWNt5k.png"), m("kdSKNYg5BdEW9AqDJaAF8jQw8BU.png"), m("nmes1Rtc0FgaV4fKAoTp3aHoo.png"), m("fmAeWoML9CRgDG1iQ3po1ho.png")],
        },
        {
          heading: "Credits",
          body: "Key Players:\n\nCreative Direction/Art Direction - Bolutife Awakan;\nMotion Designer - Oluwaseun Awakan;\nGraphic Designer - Oluwatimilehin Sode;\nVideo Editor - Gbenga Owolabi;\n\nPlus a team of 18 creatives across Nigeria.",
          images: [],
        },
      ],
    },
    {
      slug: "housepadi",
      title: "HousePadi",
      summary: "Turning property management from a paper-heavy chore into a brand that feels as easy.",
      thumbnail: m("fbJ7uwHJGTOBe764zdIdrL2RRs.png"),
      featured: true,
      client: "Oyindamola Bakare",
      services: "Startup",
      year: "2023",
      tags: ["Brand Strategy", "Design", "Product Design & Development"],
      intro: "Property management in Nigeria is exhausting. Landlords chasing rent, and tenants chasing landlords on Whatsapp. Oyindamola, the founder of Housepadi came to me with a simple ask, build a brand that makes property management feel easy for both parties.",
      cover: m("fbJ7uwHJGTOBe764zdIdrL2RRs.png"),
      sections: [
        {
          heading: "The Challenge",
          body: "The challenge I had was that 'easy' meant different things to different people. HousePadi's users weren't just young, tech-savvy renters. They were also older landlords who needed to trust and feel like the product sits seamlessly within their workflow. The brand had to feel approachable to both without talking down to either, and that's what drove every design decision.",
          images: [m("XYmF5SFKILljbB62DWSyZUQ9Vzs.png"), half("hRVMsKRaiQpyyJeeuo5uW4suts.png"), half("jhHHLRQfejfN014chEP8LjiFBk.png"), m("sOlmnStxfm574ww5pFDzt5s4RA.png")],
        },
        {
          heading: "The System",
          body: "The logo followed the same logic, a building stylized as an 'H' simple enough to feel modern, structured enough to feel trustworthy.\nFor the colour choices, I wanted something that felt calm and confident at the same time, from mild greens and yellows that are 'easy' on the eyes, paired with deeper, darker tones that add weight and reliability.",
          images: [m("uSOKwflJKz6grLkd86hxflxfnY.png"), half("kt33Vgz5ES4sYf84SZsXDr7PE.png"), half("MJ92yaPHPhzNrBnXK25RyZdYP8.png")],
        },
        {
          heading: "",
          body: "For typography, Aeonik gave the brand the right balance it needed, clean, distinctive and professional. It could sit comfortably in a product interface and in more brand interfacing touchpoints like a billboard. The system was built to travel through digital assets like social media, the product UI, and printed branded materials, everything had to speak the same language across every touchpoint.",
          images: [m("HiPnvtWIRyAIjb7T0gFRjjbrTU.png"), half("noj2eExUU6sMyU6t7wSvTPjUXI.png"), half("s7HAfHviv0Hc3Zw4xqgnKHNyE.png"), m("HMyQv44ubAgeG7D2n8V85CHew.png"), m("2S58zAsUgOXRFDg9Yn5N6jk50.png")],
        },
        {
          heading: "The Outcome",
          body: "In less than week one, HousePadi had over 300 signups, quite impressive for such a niched product, but what stayed with me was what Oyinda said to me after we were finished. “You are an amazing designer, you didn’t just capture the essence of our brand in the identity design, you also have an amazing personality, so enthusiastic about our business that you delivered more than we paid for. You were patient and carried us along throughout the entire process, it felt like we were in on the big decisions too. Thank you”",
          images: [m("tHG8XDDJJoAj6O153SDQ3EtTW2A.png")],
        },
      ],
    },
    {
      slug: "lemuwe",
      title: "Lemuwé",
      summary: "A Scandinavian-inspired identity system built around elegance, simplicity, and space.",
      thumbnail: m("NNTZtfATDPm74588obdEWETU9sw.gif"),
      featured: true,
      client: "MerrJep",
      services: "Fashion",
      year: "2025",
      tags: ["Brand Strategy", "Brand Identity", "Motion Design"],
      intro: "Lemuwé was ready to go to market but there was no identity, no market presence in Europe, and no track record to lean on. The ask was to build a brand that could sit next to Europe's established minimal fashion houses and not look out of place.",
      cover: m("gOWYZNr4PNspZO517FWsqssNmfw.png"),
      sections: [
        {
          heading: "The Beginning",
          body: "There was no existing system to build from. No room to ease into it either, the brand needed to land credible from day one. It couldn't feel conservative or culturally narrow, and it also couldn't chase trends the way fast fashion does. The goal was a system that could scale into packaging, photography, retail and feel like everyday premium wear brand, and not a brand trying too hard to prove it belonged in the luxury space.",
          images: [m("Xzqr89kmQ4wgSRt3481zV6hga4.png")],
        },
        {
          heading: "Creative Direction",
          body: "One idea guided the creative direction, it's the idea that space is a luxury signal. The audience respond to intention, so restraint became the strategy. That turned into the line that guided every decision: The Elegance of Spaces.\n\nThe logo needed to be minimal, refined, credible on sight, and I made the decision to go with a serif type wordmark because it signals heritage and craftsmanship. The hard part was keeping it modern instead of vintage. The wordmark has an accent mark built to flex across packaging, digital tags, and submarks without losing consistency wherever it shows up.",
          images: [half("zHTrJPSS4Miwa7vhYP57Nh6Nbj0.gif"), half("zNCJ8FXizovQg2yanUnLoWjUwX8.gif")],
        },
        {
          heading: "The Identity",
          body: "For colour, I pulled from actual Scandinavian materials synonymous with spaces and architecture, instead of the usual black-and-white luxury cliché. Stone, sand, shadow, bark, natural light. Low saturation kept the palette controlled. Photography carried most of the brand's credibility. Clothing that looks lived-in with calm confidence and consistency.",
          images: [m("vAuIP0D7kSjt4BN9fA6YRKfUOnY.mp4"), half("exR8IAtl5RqE4MVdIjPiHefT608.png"), half("T5Tx8o8syoJ3F91tdzlSnnnar8.png"), m("YZ2cNaLPImhrwiHzRwurkCDYbtw.gif"), m("KNGV6vpX2uSE3ffBhnsPJu2ii1c.png")],
        },
        {
          heading: "My Reflections",
          body: "This project confirmed something I already believed, designing luxury isn't about adding more, it's about knowing what to take out. When you're building from zero, you want to over-explain, over-style, prove the brand is worth something. With a European luxury audience, that instinct works against you, the quietest brands are usually the ones people trust most.",
          images: [m("mGx1KzcgRzbcOvKLdyT4SFbFXA.jpg"), m("lMjVWiM0MpjPQ2BfjgORpeKfXhY.png"), half("qexzSOvFQNTdG1pgYYq56oZBTvs.png"), half("rm8qKfAL2WjXAdw3WrGPqqfRnk.png"), m("vdkJSJKBquaflLTSXPiuv9sEgk.png")],
        },
      ],
    },
    {
      slug: "design-spinoff",
      title: "Design Spinoff",
      summary: "An experiential design event built to spark conversation, share knowledge, and connect creatives in fresh ways.",
      thumbnail: m("adVpkGLNZJ67oJpTWBlYzcbSUxo.gif"),
      featured: false,
      client: "Emmanuel Michael",
      services: "Design Event",
      year: "2023",
      tags: ["Brand Strategy", "Brand design", "Print & Production"],
      intro: "Most design events feel the same with a stage, slides, a keynote, everyone claps, and leaves. I and Emmanuel wanted to have intimate conversations with actual leaders and builders in the community.",
      cover: m("oADIonBmFapXsejnsUqBKnWAwM.png"),
      sections: [
        {
          heading: "Context",
          body: "This was for Sections, a community for senior digital designers in Nigeria. The goal was to get senior design leaders in a room talking honestly about real challenges in the industry so that conversation could reach designers coming up behind them.\nWe decided to design the set like a live podcast and later share that with the world, with two speakers, one host, one conversation in a small room that made people want to talk without holding back. It was about getting designers to think beyond their own work, to how that work affects the industry around them.",
          images: [m("adVpkGLNZJ67oJpTWBlYzcbSUxo.gif"), half("iIUp8viNslr9Qik7d1cRH7BDLg.png"), half("37UZJlEDGmp7C2I4Fuy4ZWleEFE.png"), m("KQXTEGrOs2gt75v0Y2F9SfGqSw.png")],
        },
        {
          heading: "The Brand Direction",
          body: "For the design direction, I played around the idea of spread and dialogue. Imagine 50 senior designers talking in one room but their discussion doesn't stay in that room, it spreads. High concentration in the middle, dispersing outward, further stressing the 'change happens from top to bottom' idea.\nI applied some dynamism to the logomark with the stretched letters in the wordmark first, for balance and then I thought, we would have different people with different experiences, and personalities and imperfections too, all in one shared space as a collective. Colour was electric green, orange, yellow, black with the African touch, vibrant, energetic and exciting enough for more people to want to get in.",
          images: [half("xfP5KfqDP9ITu7J18ZlquRnZCk.png"), half("xH8OLgTvlMt4slhFchD8WeMO41g.png")],
        },
        {
          heading: "",
          body: "I led the whole thing, from concept, brand system, layout, every touchpoint at the event. On event day, I wanted something flat to feel dimensional in a real room. So I tested, printed, adjusted until it worked physically, not just on a screen.\nThis was a successful event, the room was full. People connected with it online too, with how open the conversations felt.",
          images: [m("Fcqmir1w6KYhFPYJZZoKLpUVezA.png"), half("zsIsDQ3M4QK7j83exe4dxReIRpU.png"), half("gwUfHiJkp1IBBZ1EPClAowtz3c.png")],
        },
      ],
    },
    {
      slug: "traction",
      title: "Traction",
      summary: "Rebranding one of Nigeria’s most exciting fintechs with a story of transformation that supported a $6M raise.",
      thumbnail: m("7U7vdzZQuTtiMs8uZZGSEvwVaRg.png"),
      featured: false,
      client: "Traction",
      services: "Fintech Startup",
      year: "2022",
      tags: ["Brand Strategy", "Brand Identity", "Art Direction", "Motion Design", "Packaging Design"],
      intro: "When Traction came to me, they were at an interesting inflection point. They'd spent three years building a platform that was revolutionizing how small businesses in Nigeria handle their finances, but their brand wasn't keeping up with their ambitions. You know that moment when you look in the mirror and realize you've outgrown your teenage clothes? That was Traction with their brand.",
      cover: m("LO0HhGDkciY8EMaXu9wKmQj4A.png"),
      sections: [
        {
          heading: "The Identity Crisis",
          body: "The first red flag? Their logo was basically a twin of a major tech corporation's icon. Not exactly the unique identity you want when you're trying to be the go-to financial partner for Africa's SMEs. But hey, we've all been there – sometimes you need to walk before you can run. Here's where it gets interesting. When we started digging into how Traction's own employees viewed the brand, we discovered something fascinating: ask ten different team members what Traction was, and you'd get ten different answers. It was like a corporate version of the blind men and the elephant. Plus, there were more versions of their logo floating around than there are Nigerian jollof recipes (okay, maybe not that many, but you get the idea).",
          images: [m("aChwMQ8nmkm20e7a63zmX7Bwl1k.mp4")],
        },
        {
          heading: "The Butterfly Effect",
          body: "The first thing we tackled was the name. \"Traction Apps\" made them sound like a software company, when in reality they were building nothing less than the growth operating system for African SMEs. So we stripped it down to just \"Traction\" – simple, powerful, and most importantly, scalable. Remember those four squares in their old logo? We saw something there that nobody else had noticed. With some careful tweaking – rounding the corners just so, adjusting the angles carefully – those squares transformed into something entirely new: a butterfly. It wasn't just about making something pretty; this was about telling Traction's story of transformation and growth. Every small business they help is going through its own metamorphosis, after all.",
          images: [half("q0yaUUcO8be0gjWfqWiQTWy8hUc.png"), half("efBZandsznN5tMCvZpBvfhqehM.png"), m("IlolYUw8gRiswlEmY59qHbJA0.mp4")],
        },
        {
          heading: "The New Identity",
          body: "The old blue was... well, let's just say it was enthusiastic. Very enthusiastic. We toned it down to what we called \"Epic Blue\" – professional enough for a financial company but friendly enough for the small business owner who's just starting out. We swapped the previous yellow for green, partly because competitors were heavy on the yellow, but mostly because green speaks to growth and prosperity – exactly what Traction helps their clients achieve. After months of testing (yes, months – good type is worth the wait), we landed on Satoshi and Axiforma. These weren't just pretty fonts; they were workhorses that could handle everything from mobile apps to billboards. We went with lowercase for the logo – because sometimes the power move is to be approachable rather than imposing. Here's where things got really interesting. Instead of the usual \"here's your logo, good luck\" handoff, we developed an 8-week launch strategy. We created a team of \"Brand Champions\" within the company – think of them as brand DJs, mixing and maintaining the right identity vibe across all departments. We even made sure the brand became part of employee onboarding. Because what's the point of a great brand if your own people don't know how to keep it alive?",
          images: [m("2scR0ZehbfOULDi1RQie01zoI.mp4"), half("pNE0zsa0YBwbEO29C1748KalUOk.png"), half("DnjjbRMh1tslVnWOHrtqKhNmbXY.png"), m("8sSzWxlCJ1atqDAsdEhtDHIc3M.png")],
        },
        {
          heading: "Brand Motifs",
          body: "",
          images: [half("L2MKBiDGXyVih262Q7bWLynftwY.png"), half("9DyH4tFuWICJeKD5hOMdE5zYk.png"), half("3DNKGI90gFqSidh2xvAUGpBpS8.png"), half("qKYsULTW4Rc0fxmS0yCfMaaViVo.png"), m("A6RVYU7ltkBra1NU2Ik9tTtAqA.png")],
        },
        {
          heading: "The Result",
          body: "Look, we could throw around some fancy metrics, but here's the truth: brands are marathons, not sprints. What we do know is that we took a company that was doing revolutionary work for African SMEs and gave them an identity that finally matched their ambitions. Their team can now confidently tell the world who they are and what they stand for. Most importantly, when small business owners across Nigeria see that butterfly logo, they don't see just another fintech company – they see a growth partner who gets them. And really, isn't that what great branding is all about?",
          images: [],
        },
      ],
    },
  ],
};
