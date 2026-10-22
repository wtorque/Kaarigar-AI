const fs = require('fs');
const path = require('path');

const dirs = [
  'public/images/products',
  'public/images/categories',
  'public/images/artisans',
  'public/images/hero',
];

dirs.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Helper to create an SVG with warm aesthetic styling
function makeSvg(width, height, bgGradient, contentSvg, title = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      ${bgGradient}
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-opacity="0.18" flood-color="#4A2E1B"/>
    </filter>
    <radialGradient id="sunGlow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#FFF8EE" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#EFE4D2" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g1)" rx="16"/>
  <rect width="100%" height="100%" fill="url(#sunGlow)"/>
  ${contentSvg}
</svg>`;
}

// 1. Categories
const categories = [
  {
    name: 'handicrafts',
    title: 'Handicrafts',
    bg: '<stop offset="0%" stop-color="#7C5036"/><stop offset="100%" stop-color="#4E2B18"/>',
    icon: `<g filter="url(#shadow)">
      <circle cx="200" cy="180" r="100" fill="#B37854" opacity="0.3"/>
      <!-- Elephant motif -->
      <path d="M140,230 C130,200 135,160 160,140 C190,115 240,115 270,145 C285,160 290,185 285,210 L280,240 L260,240 L260,200 C250,200 240,190 230,200 L230,240 L210,240 L210,190 L180,190 L180,240 L160,240 L160,210 C150,225 145,230 140,230 Z" fill="#E6C8A8"/>
      <path d="M275,170 C290,175 300,195 300,220 C295,225 285,220 285,210" fill="none" stroke="#E6C8A8" stroke-width="8" stroke-linecap="round"/>
      <circle cx="255" cy="155" r="4" fill="#4E2B18"/>
    </g>`
  },
  {
    name: 'textiles',
    title: 'Textiles',
    bg: '<stop offset="0%" stop-color="#1B4965"/><stop offset="100%" stop-color="#0E273C"/>',
    icon: `<g filter="url(#shadow)">
      <rect x="90" y="110" width="220" height="180" rx="12" fill="#D4AF37" opacity="0.25"/>
      <!-- Folded silk layers -->
      <path d="M100,140 C150,110 250,110 300,140 L280,240 C230,210 130,210 80,240 Z" fill="#2E6F95"/>
      <path d="M90,170 C140,140 240,140 290,170 L270,260 C220,230 120,230 70,260 Z" fill="#E5B94E"/>
      <path d="M80,200 C130,170 230,170 280,200 L260,280 C210,250 110,250 60,280 Z" fill="#C14953"/>
    </g>`
  },
  {
    name: 'home-decor',
    title: 'Home Decor',
    bg: '<stop offset="0%" stop-color="#9C5D3D"/><stop offset="100%" stop-color="#64361E"/>',
    icon: `<g filter="url(#shadow)">
      <!-- Pierced Terracotta Pot -->
      <path d="M150,260 C130,220 140,170 170,150 L170,130 L230,130 L230,150 C260,170 270,220 250,260 Z" fill="#D78152"/>
      <ellipse cx="200" cy="130" rx="30" ry="10" fill="#B35F31"/>
      <circle cx="185" cy="190" r="6" fill="#FFF3E0"/>
      <circle cx="215" cy="190" r="6" fill="#FFF3E0"/>
      <circle cx="200" cy="210" r="8" fill="#FFF3E0"/>
      <circle cx="180" cy="230" r="5" fill="#FFF3E0"/>
      <circle cx="220" cy="230" r="5" fill="#FFF3E0"/>
    </g>`
  },
  {
    name: 'jewelry',
    title: 'Jewelry',
    bg: '<stop offset="0%" stop-color="#4F5D75"/><stop offset="100%" stop-color="#2D3142"/>',
    icon: `<g filter="url(#shadow)">
      <!-- Tribal Jhumka Earrings -->
      <path d="M160,130 L200,100 L240,130 Z" fill="#D8D8D8"/>
      <path d="M160,140 C160,190 240,190 240,140 Z" fill="#C0C0C0"/>
      <line x1="170" y1="190" x2="170" y2="230" stroke="#E0E0E0" stroke-width="4"/>
      <line x1="185" y1="190" x2="185" y2="240" stroke="#E0E0E0" stroke-width="4"/>
      <line x1="200" y1="190" x2="200" y2="245" stroke="#E0E0E0" stroke-width="4"/>
      <line x1="215" y1="190" x2="215" y2="240" stroke="#E0E0E0" stroke-width="4"/>
      <line x1="230" y1="190" x2="230" y2="230" stroke="#E0E0E0" stroke-width="4"/>
      <circle cx="170" cy="235" r="5" fill="#FFFFFF"/>
      <circle cx="185" cy="245" r="5" fill="#FFFFFF"/>
      <circle cx="200" cy="250" r="6" fill="#FFFFFF"/>
      <circle cx="215" cy="245" r="5" fill="#FFFFFF"/>
      <circle cx="230" cy="235" r="5" fill="#FFFFFF"/>
    </g>`
  },
  {
    name: 'bags',
    title: 'Bags & Accessories',
    bg: '<stop offset="0%" stop-color="#9A8C70"/><stop offset="100%" stop-color="#60533C"/>',
    icon: `<g filter="url(#shadow)">
      <!-- Jute Tote Bag -->
      <path d="M150,140 C150,90 250,90 250,140" fill="none" stroke="#5E432A" stroke-width="12" stroke-linecap="round"/>
      <path d="M130,140 L270,140 L285,260 L115,260 Z" fill="#D8C29D"/>
      <line x1="115" y1="180" x2="285" y2="180" stroke="#BF9E6A" stroke-width="3" stroke-dasharray="6,6"/>
      <line x1="115" y1="220" x2="285" y2="220" stroke="#BF9E6A" stroke-width="3" stroke-dasharray="6,6"/>
    </g>`
  },
  {
    name: 'paintings',
    title: 'Paintings',
    bg: '<stop offset="0%" stop-color="#8E3B29"/><stop offset="100%" stop-color="#551D12"/>',
    icon: `<g filter="url(#shadow)">
      <rect x="110" y="110" width="180" height="180" rx="8" fill="#F4E9D8" stroke="#D3A248" stroke-width="6"/>
      <!-- Madhubani Sun / Fish Motif -->
      <circle cx="200" cy="200" r="45" fill="#DE6B48"/>
      <circle cx="200" cy="200" r="35" fill="#EBBAB9"/>
      <circle cx="190" cy="190" r="6" fill="#4A180E"/>
      <path d="M200,145 L200,125 M200,255 L200,275 M145,200 L125,200 M255,200 L275,200" stroke="#D3A248" stroke-width="4" stroke-linecap="round"/>
      <path d="M165,165 L150,150 M235,235 L250,250 M235,165 L250,150 M165,235 L150,250" stroke="#D3A248" stroke-width="4" stroke-linecap="round"/>
    </g>`
  },
  {
    name: 'kitchen',
    title: 'Kitchen & Dining',
    bg: '<stop offset="0%" stop-color="#6E4730"/><stop offset="100%" stop-color="#3B2213"/>',
    icon: `<g filter="url(#shadow)">
      <!-- Turned Wood Bowl & Spoon -->
      <ellipse cx="200" cy="200" rx="90" ry="40" fill="#B57647"/>
      <path d="M110,200 C110,250 290,250 290,200 Z" fill="#8C4E26"/>
      <ellipse cx="200" cy="200" rx="75" ry="30" fill="#582C13"/>
      <!-- Spoon -->
      <path d="M130,130 C120,110 160,110 170,130 L250,220 C255,225 245,235 240,230 Z" fill="#D2996E"/>
    </g>`
  },
  {
    name: 'festival',
    title: 'Festival Special',
    bg: '<stop offset="0%" stop-color="#AF5D24"/><stop offset="100%" stop-color="#692803"/>',
    icon: `<g filter="url(#shadow)">
      <!-- Lit Diya -->
      <path d="M120,220 C120,260 280,260 280,220 C270,195 240,190 200,190 C160,190 130,195 120,220 Z" fill="#D77B3C"/>
      <ellipse cx="200" cy="210" rx="70" ry="18" fill="#9C4410"/>
      <!-- Flame -->
      <path d="M200,120 C190,155 180,175 190,195 C195,200 205,200 210,195 C220,175 210,155 200,120 Z" fill="#FFC837"/>
      <path d="M200,140 C195,160 190,175 195,188 C198,192 202,192 205,188 C210,175 205,160 200,140 Z" fill="#FFFFFF"/>
    </g>`
  }
];

categories.forEach(cat => {
  const svg = makeSvg(400, 300, cat.bg, cat.icon, cat.title);
  fs.writeFileSync(path.join(__dirname, '..', `public/images/categories/${cat.name}.webp`), svg);
  fs.writeFileSync(path.join(__dirname, '..', `public/images/categories/${cat.name}.svg`), svg);
});

// 2. Products
const products = [
  { name: 'wooden-elephant', title: 'Handcarved Wooden Elephant', bg: '<stop offset="0%" stop-color="#EEDBC7"/><stop offset="100%" stop-color="#CBB194"/>', motif: categories[0].icon },
  { name: 'wooden-elephant-angle', title: 'Handcarved Wooden Elephant Alt', bg: '<stop offset="0%" stop-color="#EEDBC7"/><stop offset="100%" stop-color="#CBB194"/>', motif: categories[0].icon },
  { name: 'chanderi-saree', title: 'Chanderi Silk Saree', bg: '<stop offset="0%" stop-color="#D7E6ED"/><stop offset="100%" stop-color="#99BACB"/>', motif: categories[1].icon },
  { name: 'chanderi-pallu', title: 'Chanderi Silk Pallu', bg: '<stop offset="0%" stop-color="#D7E6ED"/><stop offset="100%" stop-color="#99BACB"/>', motif: categories[1].icon },
  { name: 'handpainted-lamp', title: 'Handpainted Lamp', bg: '<stop offset="0%" stop-color="#F2DECB"/><stop offset="100%" stop-color="#D6A784"/>', motif: categories[2].icon },
  { name: 'lamp-lit', title: 'Lamp Lit', bg: '<stop offset="0%" stop-color="#F2DECB"/><stop offset="100%" stop-color="#D6A784"/>', motif: categories[2].icon },
  { name: 'jute-handbag', title: 'Jute Handbag', bg: '<stop offset="0%" stop-color="#EBE2CD"/><stop offset="100%" stop-color="#C3B495"/>', motif: categories[4].icon },
  { name: 'terracotta-vase', title: 'Terracotta Vase', bg: '<stop offset="0%" stop-color="#F0D9C8"/><stop offset="100%" stop-color="#D49F7B"/>', motif: categories[2].icon },
  { name: 'madhubani-art', title: 'Madhubani Wall Art', bg: '<stop offset="0%" stop-color="#F7EADB"/><stop offset="100%" stop-color="#DDBA98"/>', motif: categories[5].icon },
  { name: 'wooden-bowl-set', title: 'Wooden Serving Bowl Set', bg: '<stop offset="0%" stop-color="#E7DACB"/><stop offset="100%" stop-color="#BA9B81"/>', motif: categories[6].icon },
  { name: 'tribal-earrings', title: 'Tribal Silver Earrings', bg: '<stop offset="0%" stop-color="#E0E5EC"/><stop offset="100%" stop-color="#B2BDCD"/>', motif: categories[3].icon },
  { name: 'brass-diya', title: 'Peacock Brass Diya', bg: '<stop offset="0%" stop-color="#F8E7BE"/><stop offset="100%" stop-color="#D8B564"/>', motif: categories[7].icon },
  { name: 'banarasi-dupatta', title: 'Banarasi Dupatta', bg: '<stop offset="0%" stop-color="#FAD4D8"/><stop offset="100%" stop-color="#DE8C98"/>', motif: categories[1].icon },
];

products.forEach(prod => {
  const svg = makeSvg(500, 500, prod.bg, prod.motif, prod.title);
  fs.writeFileSync(path.join(__dirname, '..', `public/images/products/${prod.name}.webp`), svg);
  fs.writeFileSync(path.join(__dirname, '..', `public/images/products/${prod.name}.svg`), svg);
});

// 3. Artisans
const artisans = [
  { name: 'suresh', craft: 'Bastar Woodcraft', color: '#76513B' },
  { name: 'meena', craft: 'Chanderi Weaving', color: '#A66B4D' },
  { name: 'ravi', craft: 'Jaipur Blue Pottery', color: '#3A5A60' },
  { name: 'kavita', craft: 'Varanasi Jute', color: '#826251' },
  { name: 'ramesh', craft: 'Molela Terracotta', color: '#A85A32' },
  { name: 'sunita', craft: 'Madhubani Painting', color: '#914236' },
  { name: 'hari', craft: 'Saharanpur Wood', color: '#5C4033' },
  { name: 'lata', craft: 'Bhil Tribal Jewelry', color: '#667085' },
];

artisans.forEach(art => {
  const avatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <circle cx="100" cy="100" r="100" fill="${art.color}"/>
    <circle cx="100" cy="80" r="40" fill="#F4E9D8"/>
    <path d="M40,180 C40,135 70,130 100,130 C130,130 160,135 160,180 Z" fill="#E4D5BE"/>
    <!-- Headwrap or cultural accent -->
    <path d="M60,65 C60,40 140,40 140,65 Z" fill="#FAF7F1" opacity="0.8"/>
  </svg>`;
  fs.writeFileSync(path.join(__dirname, '..', `public/images/artisans/${art.name}.webp`), avatarSvg);
  fs.writeFileSync(path.join(__dirname, '..', `public/images/artisans/${art.name}.svg`), avatarSvg);
});

// 4. Hero composite artwork
const heroSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 650" width="1000" height="650">
  <defs>
    <linearGradient id="heroBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EFE6D8"/>
      <stop offset="50%" stop-color="#E2D4BF"/>
      <stop offset="100%" stop-color="#CBBBA1"/>
    </linearGradient>
    <radialGradient id="sun" cx="70%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#FFF8EE" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#E2D4BF" stop-opacity="0"/>
    </radialGradient>
    <filter id="heroShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="15" stdDeviation="15" flood-opacity="0.2" flood-color="#3D2619"/>
    </filter>
  </defs>
  <rect width="1000" height="650" fill="url(#heroBg)" rx="24"/>
  <rect width="1000" height="650" fill="url(#sun)"/>

  <!-- Table surface -->
  <path d="M0,450 Q500,430 1000,450 L1000,650 L0,650 Z" fill="#A88B70" opacity="0.4"/>

  <!-- Large Terracotta Urn/Vase with carving -->
  <g filter="url(#heroShadow)">
    <path d="M680,480 C630,420 640,320 680,240 C700,200 700,160 690,140 L760,140 C750,160 750,200 770,240 C810,320 820,420 770,480 Z" fill="#C47348"/>
    <ellipse cx="725" cy="140" rx="35" ry="12" fill="#9E5028"/>
    <!-- Tribal floral engraving bands -->
    <path d="M665,300 Q725,315 785,300" stroke="#7A3916" stroke-width="6" fill="none"/>
    <path d="M650,370 Q725,390 800,370" stroke="#7A3916" stroke-width="6" fill="none"/>
  </g>

  <!-- Pierced Table Lamp glowing -->
  <g filter="url(#heroShadow)">
    <circle cx="560" cy="400" r="75" fill="#DC8959"/>
    <circle cx="560" cy="385" r="10" fill="#FFFBE6"/>
    <circle cx="535" cy="410" r="8" fill="#FFFBE6"/>
    <circle cx="585" cy="410" r="8" fill="#FFFBE6"/>
    <circle cx="550" cy="435" r="7" fill="#FFFBE6"/>
    <circle cx="570" cy="435" r="7" fill="#FFFBE6"/>
  </g>

  <!-- Handcarved Wooden Elephant -->
  <g filter="url(#heroShadow)">
    <path d="M430,490 C410,440 420,380 460,350 C500,320 560,330 580,370 C600,400 595,440 585,490 L560,490 L560,450 C550,450 540,440 530,450 L530,490 L500,490 L500,440 L465,440 L465,490 Z" fill="#7C5237"/>
    <circle cx="565" cy="365" r="5" fill="#2E180D"/>
  </g>

  <!-- Handwoven Chanderi / Banarasi Silk Textile Draped -->
  <g filter="url(#heroShadow)">
    <path d="M720,380 C800,350 900,380 960,440 L940,550 C860,490 760,470 700,500 Z" fill="#8E2D3B"/>
    <!-- Gold Zari Border -->
    <path d="M710,440 C780,410 880,430 940,490" stroke="#E5B94E" stroke-width="12" fill="none"/>
    <path d="M705,455 C775,425 875,445 935,505" stroke="#FAF7F1" stroke-width="3" stroke-dasharray="4,4" fill="none"/>
  </g>

  <!-- Woven River Grass Basket -->
  <g filter="url(#heroShadow)">
    <ellipse cx="440" cy="330" rx="55" ry="25" fill="#C5A674"/>
    <path d="M385,330 C385,400 495,400 495,330 Z" fill="#B38F56"/>
  </g>

  <!-- Wooden Bowls Foreground -->
  <g filter="url(#heroShadow)">
    <ellipse cx="710" cy="495" rx="65" ry="28" fill="#5E3821"/>
    <path d="M645,495 C645,550 775,550 775,495 Z" fill="#472613"/>
  </g>
</svg>`;

fs.writeFileSync(path.join(__dirname, '..', 'public/images/hero/hero-crafts.webp'), heroSvg);
fs.writeFileSync(path.join(__dirname, '..', 'public/images/hero/hero-crafts.svg'), heroSvg);

console.log('Craft assets generated successfully!');
