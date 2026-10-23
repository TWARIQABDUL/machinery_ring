import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "rw";

const STORAGE_KEY = "mr-lang";

/**
 * Reviewed Kinyarwanda strings from docs/TRANSLATION (1).pdf — replacing the
 * Google Translate widget, which was the subject of a translation-quality
 * complaint. Only covers what's actually been reviewed and approved there
 * (nav, footer, buttons, the Home page): anything not listed here has no
 * approved Kinyarwanda copy yet, so it stays in English regardless of the
 * selected language rather than guessing at a translation.
 */
export const STRINGS = {
  "nav.home": { en: "Home", rw: "Ahabanza" },
  "nav.about": { en: "About Us", rw: "Abo turi" },
  "nav.services": { en: "Services", rw: "Serivisi" },
  "nav.ourWork": { en: "Our Work", rw: "Ibikorwa byacu" },
  "nav.contact": { en: "Contact", rw: "Twandikire" },

  "cta.requestService": { en: "Request a service", rw: "Saba serivisi" },
  "cta.seeServices": { en: "See our services", rw: "Reba serivisi zacu" },

  "footer.tagline": {
    en: "Machinery Ring Rwanda helps farmers access agricultural machinery, practical training and coordinated services through local farmer groups.",
    rw: "Machinery Ring Rwanda ifasha abahinzi kubona serivisi z'imashini z'ubuhinzi, amahugurwa ngiro n'ubufasha mu gutegura ibikorwa, binyuze mu matsinda yabo yo mu gace batuyemo.",
  },
  "footer.about": { en: "About", rw: "Abo turi" },
  "footer.privacy": { en: "Privacy", rw: "Uko dukoresha amakuru yawe" },

  "home.title": {
    en: "Farm machinery and practical skills through farmer cooperation",
    rw: "Serivisi z'imashini n'ubumenyi ngiro binyuze mu bufatanye bw'abahinzi",
  },
  "home.body": {
    en: "Machinery Ring Rwanda brings farmers together to access machinery services, learn practical farming skills and organise work through local farmer groups. We help farmers discuss what they need and arrange suitable support without every household having to own every machine.",
    rw: "Machinery Ring Rwanda ihuza abahinzi kugira ngo babone serivisi z'imashini, bunguke ubumenyi ngiro kandi bategure ibikorwa binyuze mu matsinda yabo. Tubafasha kugaragaza ibyo bakeneye no gushaka ubufasha buboneye, bitabaye ngombwa ko buri rugo rugura imashini zose rukeneye.",
  },
  "home.supportEyebrow": { en: "How we support farmers", rw: "Uko dufasha abahinzi" },
  "home.pillar1.title": { en: "Agricultural services", rw: "Serivisi z'imashini" },
  "home.pillar1.body": {
    en: "Enquire about maize and bean planting, maize shelling and rice threshing. Equipment, operators, location and timing are checked before work is confirmed.",
    rw: "Baza ibijyanye no gutera ibigori n'ibishyimbo, guhungura ibigori no guhura umuceri. Tubanza kugenzura imashini, abazikoresha, aho umurima uherereye n'igihe ikenewe.",
  },
  "home.pillar2.title": { en: "Practical learning", rw: "Amahugurwa ngiro" },
  "home.pillar2.body": {
    en: "Training and demonstrations cover machinery use, soil health, crop management, post-harvest handling and farm-business skills.",
    rw: "Amahugurwa n'ibyerekanwa bikubiyemo gukoresha imashini, kubungabunga ubutaka, gufata neza umusaruro no gucunga ibikorwa by'ubuhinzi.",
  },
  "home.pillar3.title": { en: "Farmer organisation", rw: "Amatsinda y'abahinzi" },
  "home.pillar3.body": {
    en: "Local Rings help members communicate, plan activities and coordinate service requests.",
    rw: "Amatsinda ya Machinery Ring afasha abanyamuryango guhanahana amakuru, gutegura ibikorwa no guhuza ubusabe bwa serivisi.",
  },

  "contact.title": { en: "Contact Machinery Ring Rwanda", rw: "Twandikire Machinery Ring Rwanda" },
  "contact.intro": {
    en: "Contact Machinery Ring Rwanda about services, membership, training or a proposed partnership. Tell us what you need and where the activity would take place.",
    rw: "Twandikire Machinery Ring Rwanda ku bijyanye na serivisi, kuba umunyamuryango, amahugurwa cyangwa ubufatanye. Tubwire icyo ukeneye n'aho igikorwa cyaba.",
  },
  "contact.faq1.q": { en: "Can non-members request a service?", rw: "Ese utari umunyamuryango ashobora gusaba serivisi?" },
  "contact.faq1.a": {
    en: "Yes. Contact us to discuss availability and the applicable conditions. The team will explain any difference between member and non-member rates.",
    rw: "Yego. Twandikire tuganire ku kuboneka kwa serivisi n'ibisabwa. Tuzagusobanurira aho ibiciro by'abanyamuryango n'abatari bo bitandukaniye.",
  },
  "contact.faq2.q": { en: "Can I choose a date?", rw: "Ese nshobora guhitamo itariki?" },
  "contact.faq2.a": {
    en: "Tell us your preferred date or period. We will check availability before confirming the work.",
    rw: "Tubwire itariki cyangwa igihe wifuza. Tuzabanza kugenzura ibishoboka mbere yo kwemeza akazi.",
  },
  "contact.faq3.q": { en: "Are transport and inputs included?", rw: "Ese igiciro kirimo ubwikorezi n'inyongeramusaruro?" },
  "contact.faq3.a": {
    en: "The team will explain what the quotation covers. Transport, inputs and labour responsibilities must be agreed before the work starts.",
    rw: "Tuzagusobanurira ibikubiye mu giciro. Ibijyanye n'ubwikorezi, inyongeramusaruro n'abakozi bigomba kumvikanwaho mbere y'akazi.",
  },
  "contact.faq4.q": { en: "Can farmers outside Gashora contact us?", rw: "Ese abahinzi bo hanze ya Gashora bashobora kwandikira?" },
  "contact.faq4.a": {
    en: "Yes. Share your location and needs. We will discuss whether support can be arranged; sending an enquiry does not confirm service coverage.",
    rw: "Yego. Tubwire aho uherereye n'icyo ukeneye. Tuganire ku bufasha bushoboka. Kwandikira ntibihita byemeza ko serivisi izatangwa aho uherereye.",
  },

  "form.fullName": { en: "Full name", rw: "Amazina yose" },
  "form.phone": { en: "Telephone number", rw: "Nimero ya telefone" },
  "form.district": { en: "District", rw: "Akarere" },
  "form.sector": { en: "Sector", rw: "Umurenge" },
  "form.cell": { en: "Cell", rw: "Akagari" },
  "form.village": { en: "Village", rw: "Umudugudu" },
  "form.localRing": { en: "Local Ring or membership status", rw: "Itsinda rya Machinery Ring cyangwa uko uri umunyamuryango" },
  "form.unsure": { en: "Unsure", rw: "Sindabimenya" },
  "form.nonMember": { en: "Non-member", rw: "Sindi umunyamuryango" },
  "form.serviceNeeded": { en: "Service needed", rw: "Serivisi ukeneye" },
  "form.crop": { en: "Crop", rw: "Igihingwa" },
  "form.areaOrQuantity": { en: "Area or quantity", rw: "Ubuso cyangwa ingano y'umusaruro" },
  "form.preferredTiming": { en: "Preferred date or period", rw: "Itariki cyangwa igihe wifuza" },
  "form.sendRequest": { en: "Send request", rw: "Ohereza ubusabe" },

  "form.received.title": { en: "Request received", rw: "Ubusabe bwakiriwe" },
  "form.received.body": {
    en: "Thank you. Your request has been received. Our team will contact you to discuss the next steps. This does not confirm a booking.",
    rw: "Murakoze. Ubusabe bwanyu bwakiriwe. Tuzabavugisha tuganire ku ntambwe zikurikira. Ibi ntibihita byemeza gahunda ya serivisi.",
  },

  "shared.contactUs": { en: "Contact us", rw: "Twandikire" },
  "shared.joinWhatsapp": { en: "Join on WhatsApp", rw: "Injira kuri WhatsApp" },
  "shared.joinLinkSoon": { en: "Join link coming soon", rw: "Ihuza ryo kwinjira riraza vuba" },

  // ── About page ──────────────────────────────────────────────────────────
  "about.hero.title": { en: "About Machinery Ring Rwanda", rw: "Ibyerekeye Machinery Ring Rwanda" },
  "about.hero.body": {
    en: "Our mission is to help farmers in Rwanda improve productivity and livelihoods through affordable shared machinery services, practical training and stronger farmer cooperation, while promoting sustainable farming practices.",
    rw: "Intego yacu ni ugufasha abahinzi bo mu Rwanda kongera umusaruro no guteza imbere imibereho yabo, binyuze muri serivisi zisangiwe z'imashini zihendutse, amahugurwa ngiro n'ubufatanye bukomeye bw'abahinzi, mu gihe dushyigikira uburyo bwo guhinga burambye.",
  },
  "about.hero.cta1": { en: "Get in touch", rw: "Twandikire" },
  "about.hero.cta2": { en: "See our work", rw: "Reba ibikorwa byacu" },
  "about.quote": {
    en: "817 farmers across five local Rings are changing how agricultural machinery is accessed in Rwanda — through cooperation, not individual ownership. No single household needs to buy every machine it needs.",
    rw: "Abahinzi 817 bo mu matsinda atanu bahindura uburyo imashini z'ubuhinzi zibonekamo mu Rwanda, binyuze mu bufatanye, aho gutunga imashini umuntu ku giti cye. Nta rugo rukeneye kugura imashini zose rukeneye.",
  },
  "about.howEyebrow": { en: "What is a Machinery Ring", rw: "Itsinda rya Machinery Ring ni iki" },
  "about.howTitle": { en: "How it works in three steps", rw: "Uko rikora mu ntambwe eshatu" },
  "about.howDescription": {
    en: "A Machinery Ring is a local, farmer-led self-help organisation. Members share equipment access so every farm benefits from mechanisation without every farm owning every machine.",
    rw: "Itsinda rya Machinery Ring ni umuryango w'abahinzi bo mu gace bifashisha wenyine. Abanyamuryango basangira uburyo bwo kubona imashini kugira ngo buri murima ugire umusaruro w'ikoreshwa ry'imashini, nta n'umwe ukeneye kugura imashini zose.",
  },
  "about.step1.title": { en: "Share what you need", rw: "Sangiza icyo ukeneye" },
  "about.step1.body": {
    en: "Farmers bring requests to their local Ring — the crop, the service and the timing. The Ring coordinates who can provide it and when.",
    rw: "Abahinzi bazana ubusabe bwabo ku itsinda ryabo — igihingwa, serivisi n'igihe. Itsinda rihuza uwabitanga n'igihe.",
  },
  "about.step2.title": { en: "Equipment meets the work", rw: "Imashini ihura n'akazi" },
  "about.step2.body": {
    en: "Machinery owners offer services to fellow members at agreed rates that cover real costs. No single household needs to buy every machine.",
    rw: "Abafite imashini batanga serivisi ku bandi banyamuryango ku giciro cyumvikanyweho gitwara amafaranga akoreshwa. Nta rugo rukeneye kugura imashini zose.",
  },
  "about.step3.title": { en: "Skills follow the access", rw: "Ubumenyi bukurikira uburyo bwo kubona imashini" },
  "about.step3.body": {
    en: "Training, demonstrations and field days help farmers use equipment well and manage seasonal work more effectively.",
    rw: "Amahugurwa, ibyerekanwa n'iminsi yo mu murima bifasha abahinzi gukoresha neza imashini no gucunga neza ibikorwa by'ibihe.",
  },
  "about.missionEyebrow": { en: "Our mission", rw: "Intego yacu" },
  "about.missionTitle": { en: "Help farmers improve productivity and livelihoods", rw: "Gufasha abahinzi kongera umusaruro no guteza imbere imibereho yabo" },
  "about.missionBody": {
    en: "Our mission is to help farmers in Rwanda improve productivity and livelihoods through affordable shared machinery services, practical training and stronger farmer cooperation, while promoting sustainable farming practices.",
    rw: "Intego yacu ni gufasha abahinzi bo mu Rwanda kongera umusaruro no guteza imbere imibereho yabo binyuze mu serivisi z'imashini zasangirwa ku giciro gikwiye, amahugurwa ngiro n'ubufatanye bw'abahinzi buruhamye, bitangirana no guteza imbere ubuhinzi burambye.",
  },
  "about.mission1": { en: "Coordinate machinery access and service delivery across local Rings", rw: "Guhuza uburyo bwo kubona imashini no gutanga serivisi mu matsinda yo mu gace" },
  "about.mission2": { en: "Develop practical farming, post-harvest and business skills", rw: "Guteza imbere ubumenyi ngiro mu buhinzi, mu gucunga umusaruro no mu bucuruzi" },
  "about.mission3": { en: "Strengthen local leadership, group structure and coordination", rw: "Gushimangira ubuyobozi bwo mu gace, imiterere y'amatsinda no guhuza ibikorwa" },
  "about.approachEyebrow": { en: "Our approach", rw: "Uburyo bwacu" },
  "about.approachTitle": { en: "Local participation shapes every activity", rw: "Uruhare rw'abo mu gace ni rwo rugena buri gikorwa" },
  "about.approachBody": {
    en: "Services and programmes are built around what local Rings and farmers say they need, not the other way around. Coordination means listening first.",
    rw: "Serivisi na gahunda bishingira ku byo amatsinda n'abahinzi bavuga ko bakeneye, atari uko byagenda ukundi. Guhuza ibikorwa bisaba kumva mbere na mbere.",
  },
  "about.approach1": { en: "Farmer priorities shape which services are developed first", rw: "Ibyihutirwa by'abahinzi ni byo bigena serivisi ziteza imbere mbere" },
  "about.approach2": { en: "Equipment access and practical training work together", rw: "Uburyo bwo kubona imashini n'amahugurwa ngiro bikorana" },
  "about.approach3": { en: "Women's participation is built into every programme, not added on", rw: "Uruhare rw'abagore rushyirwa muri buri gahunda uhereye mu ntangiriro, atari ukongerwaho" },
  "about.devEyebrow": { en: "Our development in Rwanda", rw: "Iterambere ryacu mu Rwanda" },
  "about.devTitle": { en: "Growing from 2024 through a Kenya–Rwanda project", rw: "Gukura guhereye mu 2024 binyuze mu mushinga wa Kenya na Rwanda" },
  "about.devBody": {
    en: "Implementation in Rwanda began in 2024, focusing on establishing local Rings, introducing equipment, organising training and developing demonstration farms. Machinery Ring Rwanda obtained legal recognition in 2025. Local participation helps shape which services are developed and how they are organised.",
    rw: "Ibikorwa mu Rwanda byatangiye mu 2024, byibanda ku gushinga amatsinda yo mu gace, kuzana imashini, gutegura amahugurwa no gukora imirima y'ibyerekanwa. Machinery Ring Rwanda yemejwe n'amategeko mu 2025. Uruhare rw'abo mu gace rufasha kugena serivisi ziteza imbere n'uko zitunganywa.",
  },
  "about.devCaption": {
    en: "Machinery Ring Rwanda farmers and staff — the community behind the organisation.",
    rw: "Abahinzi n'abakozi ba Machinery Ring Rwanda — umuryango ushyigikira ubufatanye.",
  },
  "about.ringsEyebrow": { en: "Our local Rings", rw: "Amatsinda yacu yo mu gace" },
  "about.ringsTitle": { en: "Our established network in Gashora Sector, Bugesera District", rw: "Urusobe rwacu rushinzwe muri Gashora, Akarere ka Bugesera" },
  "about.ringsDescription": {
    en: "Local boards and trained farmer facilitators support communication, group activities and service coordination in each Ring. Join a Ring's WhatsApp group below, or contact us if you're not sure which one covers your area.",
    rw: "Inama z'ubuyobozi n'abahuzabikorwa bahuguwe bafasha guhanahana amakuru, ibikorwa by'itsinda no guhuza serivisi muri buri itsinda. Injira mu itsinda rya WhatsApp hano hasi, cyangwa utwandikire niba utazi iryo gace ritwa.",
  },
  "about.teamEyebrow": { en: "Our team", rw: "Itsinda ryacu" },
  "about.teamTitle": { en: "Coordinating activities and supporting local Rings", rw: "Guhuza ibikorwa no gufasha amatsinda yo mu gace" },
  "about.teamDescription": {
    en: "The project team coordinates activities, supports local Rings and works with technical and development partners.",
    rw: "Itsinda ry'umushinga rihuza ibikorwa, rigafasha amatsinda yo mu gace kandi rikakorana n'abafatanyabikorwa mu ikoranabuhanga n'iterambere.",
  },
  "about.team1.bio": {
    en: "Coordinates activities, farmer support, service planning and partner engagement.",
    rw: "Ahuza ibikorwa, ubufasha ku bahinzi, gahunda za serivisi n'ubufatanye n'abandi bafatanyabikorwa.",
  },
  "about.team2.bio": {
    en: "Supports field coordination, communication with local Rings and the use of digital tools for records and activity planning.",
    rw: "Afasha guhuza ibikorwa byo mu mirima, guhanahana amakuru n'amatsinda no gukoresha ikoranabuhanga mu kubika inyandiko no gutegura ibikorwa.",
  },
  "about.team3.bio": {
    en: "Supports financial reporting, activity monitoring and organisational learning.",
    rw: "Afasha mu gutegura raporo z'imari, gukurikirana ibikorwa no gukura amasomo mu byakozwe.",
  },
  "about.join1.title": { en: "Joining a Machinery Ring", rw: "Kwinjira mu Itsinda rya Machinery Ring" },
  "about.join1.body": {
    en: "Contact our team or a local Ring representative to learn about membership, the applicable conditions and available services. Non-members may also enquire about services and the terms that apply to them.",
    rw: "Twandikire cyangwa uvugishe uhagarariye itsinda ryo mu gace kugira ngo umenye uko wakwinjira, ibisabwa na serivisi zihari. Abatari abanyamuryango na bo bashobora kubaza kuri serivisi n'ibisabwa.",
  },
  "about.join2.title": { en: "Work with us", rw: "Dukorane" },
  "about.join2.body": {
    en: "We welcome discussions about suitable agricultural machinery, farmer training, women's participation and local service development. Contact us with the location, farming need and proposed area of collaboration.",
    rw: "Twishimira kuganira ku mashini z'ubuhinzi zikwiye, amahugurwa y'abahinzi, uruhare rw'abagore n'iterambere rya serivisi zo mu gace. Twandikire tubwira aho uherereye, icyo ukeneye mu buhinzi n'uburyo wifuza dukorana.",
  },
  "about.startConversation": { en: "Start a conversation", rw: "Tangira ikiganiro" },
  "about.cta.title": { en: "Ready to get involved?", rw: "Witeguye kwiyongera?" },
  "about.cta.description": {
    en: "Contact us about joining a local Ring, requesting a service, or working with us on farmer training and development.",
    rw: "Twandikire ku bijyanye no kwinjira mu itsinda ryo mu gace, gusaba serivisi, cyangwa gukorana natwe mu mahugurwa n'iterambere ry'abahinzi.",
  },

  // ── Our Work page ───────────────────────────────────────────────────────
  "ourwork.hero.title": { en: "How we work with farmers across five local Rings", rw: "Uko dukorana n'abahinzi mu matsinda atanu yo mu gace" },
  "ourwork.hero.body": {
    en: "Our work combines farmer organisation, machinery access and practical learning. Local Rings bring requests together, while training and field activities build the skills needed to use and manage equipment.",
    rw: "Ibikorwa byacu bihuza imiterere y'abahinzi, uburyo bwo kubona imashini n'amahugurwa ngiro. Amatsinda yo mu gace ahuza ubusabe, mu gihe amahugurwa n'ibikorwa byo mu murima bibaka ubumenyi bukenewe mu gukoresha no gucunga imashini.",
  },
  "ourwork.browseGallery": { en: "Browse the gallery", rw: "Reba amafoto" },
  "ourwork.stat1": { en: "Registered farmers across five Rings", rw: "Abahinzi biyandikishije mu matsinda atanu" },
  "ourwork.stat2": { en: "Local Rings in Gashora Sector", rw: "Amatsinda yo mu Murenge wa Gashora" },
  "ourwork.stat3": { en: "Training events, 2024–2026", rw: "Amahugurwa yakozwe, 2024–2026" },
  "ourwork.stat4": { en: "Participant attendances recorded", rw: "Abaje mu mahugurwa banditswe" },
  "ourwork.statsNote": {
    en: "Project records presented in August 2026. Attendances include people joining more than one session.",
    rw: "Inyandiko z'umushinga zerekanwe mu Kanama 2026. Abaje barimo abitabiriye inama irenze imwe.",
  },
  "ourwork.project.title": {
    en: "Sustainable mechanization through gender-sensitive Machinery Ring business models",
    rw: "Ikoreshwa ry'imashini rirambye binyuze mu buryo bw'ubucuruzi bwa Machinery Ring bwita ku buringanire",
  },
  "ourwork.project.body": {
    en: "The project \"Sustainable mechanization of value chains through innovative, gender-sensitive business models: Machinery Rings in Kenya and Rwanda\" brings the Machinery Ring approach to East Africa. In Rwanda, activities focus on Gashora Sector — establishing local Rings, introducing equipment, organising farmer training and running demonstration farms.",
    rw: "Umushinga \"Ikoreshwa ry'imashini rirambye mu nzego z'ubukungu binyuze mu buryo bushya bw'ubucuruzi bwita ku buringanire: Machinery Rings muri Kenya na Rwanda\" uzana uburyo bwa Machinery Ring mu karere k'Afurika y'Iburasirazuba. Mu Rwanda, ibikorwa byibanda ku Murenge wa Gashora — gushinga amatsinda yo mu gace, kuzana imashini, gutegura amahugurwa y'abahinzi no gukora imirima y'ibyerekanwa.",
  },
  "ourwork.demo.eyebrow": { en: "Demonstration farms and practical learning", rw: "Imirima y'ibyerekanwa n'amahugurwa ngiro" },
  "ourwork.demo.title": { en: "Learning in the field, with real equipment", rw: "Kwiga mu murima, ukoresheje imashini nyayo" },
  "ourwork.demo.body": {
    en: "Demonstration farms give farmers opportunities to examine equipment and farming practices under local conditions. Activities connect seasonal crop management with machinery suitability, soil management and post-harvest learning.",
    rw: "Imirima y'ibyerekanwa itanga uburyo abahinzi bareba imashini n'uburyo bwo guhinga mu mimerere yo mu gace. Ibikorwa bihuza gucunga ibihingwa mu bihe n'ikoreshwa ry'imashini rikwiye, kubungabunga ubutaka no kwiga ku gucunga umusaruro.",
  },
  "ourwork.demo.footnote": {
    en: "Field experience also helps identify where equipment or service arrangements need improvement.",
    rw: "Uburambe bwo mu murima nabwo bufasha kumenya aho imashini cyangwa uburyo bwa serivisi bikeneye kunozwa.",
  },
  "ourwork.women.eyebrow": { en: "Women's participation", rw: "Uruhare rw'abagore" },
  "ourwork.women.title": { en: "Supporting women's roles in farmer groups and beyond", rw: "Gushyigikira uruhare rw'abagore mu matsinda y'abahinzi no hanze yayo" },
  "ourwork.women.body": {
    en: "We support women's participation through savings-group activities, financial literacy, leadership and digital-skills training. These activities help women take part in the organisational and business work of their farmer groups and build lasting connections with local financial institutions.",
    rw: "Dushyigikira uruhare rw'abagore binyuze mu bikorwa by'amatsinda y'ikigega, ubumenyi mu by'imari, ubuyobozi n'amahugurwa y'ikoranabuhanga. Ibi bikorwa bifasha abagore kugira uruhare mu miterere n'ubucuruzi bw'amatsinda yabo kandi bakubaka umubano urambye n'ibigo by'imari byo mu gace.",
  },
  "ourwork.women1": { en: "Savings-group activities and financial literacy training", rw: "Ibikorwa by'amatsinda y'ikigega n'amahugurwa ku bumenyi mu by'imari" },
  "ourwork.women2": { en: "Leadership, communication and digital-skills development", rw: "Ubuyobozi, itumanaho n'iterambere ry'ubumenyi mu ikoranabuhanga" },
  "ourwork.women3": { en: "Links with local financial institutions and group management", rw: "Umubano n'ibigo by'imari byo mu gace no gucunga amatsinda" },
  "ourwork.cta.title": { en: "Want to be part of the next update?", rw: "Wifuza kuba mu makuru akurikira?" },
  "ourwork.cta.description": {
    en: "Contact us about joining a local Ring, requesting a service, or attending a field day.",
    rw: "Twandikire ku bijyanye no kwinjira mu itsinda ryo mu gace, gusaba serivisi, cyangwa kwitabira umunsi wo mu murima.",
  },
  "ourwork.readBlog": { en: "Read the blog", rw: "Soma amakuru" },

  // ── Services page ───────────────────────────────────────────────────────
  "services.title": { en: "Our Services", rw: "Serivisi zacu" },
  "services.intro": {
    en: "We coordinate agricultural services and practical support through our local network. Tell us what you need so we can check the equipment, operator, location and timing before confirming the work and price.",
    rw: "Duhuza serivisi z'ubuhinzi n'ubufasha ngiro binyuze mu rusobe rwacu rwo mu gace. Tubwire icyo ukeneye kugira ngo tugenzure imashini, uyikoresha, aho uherereye n'igihe mbere yo kwemeza akazi n'igiciro.",
  },
  "services.availableNow": { en: "Available now", rw: "Ihari ubu" },
  "services.availableNote": { en: "Requests assessed and confirmed individually", rw: "Ubusabe busuzumwa kandi bukemezwa bumwe bumwe" },
  "services.inDevelopment": { en: "In development", rw: "Iri gutunganywa" },
  "services.developingNote": { en: "Register interest. Dates depend on confirmed capacity.", rw: "Iyandikishe. Amatariki aterwa n'ubushobozi buremejwe." },
  "services.pricesTitle": { en: "Prices and confirmation", rw: "Ibiciro no kwemeza" },
  "services.pricesBody": {
    en: "Contact us for the applicable rate. The team will explain the unit charged, any member or non-member rate and additional costs before you agree to the work. A service request becomes a booking only after availability, timing and price have been confirmed with you.",
    rw: "Twandikire umenye igiciro gikurikizwa. Itsinda rizakubwira uko igiciro kigenwa, itandukaniro ry'ibiciro hagati y'abanyamuryango n'abatari bo, n'andi mafaranga yiyongera mbere yo kwemeza akazi. Ubusabe bwa serivisi buba gahunda yemejwe gusa nyuma yo kwemeza kuboneka, igihe n'igiciro hamwe nawe.",
  },
} satisfies Record<string, { en: string; rw: string }>;

export type StringKey = keyof typeof STRINGS;

const LanguageContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void }>({
  lang: "en",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Read the remembered language after mount only, so server-rendered markup
  // (always English) matches the client's first render and hydration is safe.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "rw") setLangState(stored);
    } catch {
      // localStorage unavailable — just stay on English
    }
  }, []);

  function setLang(next: Lang) {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore — nothing to persist to
    }
  }

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

/** Returns a translator bound to the current language: t("nav.home") -> "Home" or "Ahabanza". */
export function useT() {
  const { lang } = useLanguage();
  return function t(key: StringKey): string {
    return STRINGS[key][lang];
  };
}
