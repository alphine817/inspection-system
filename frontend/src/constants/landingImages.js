const unsplash = (id, { w = 800, h, q = 80 } = {}) => {
  const params = new URLSearchParams({
    auto: 'format',
    fit: 'crop',
    w: String(w),
    q: String(q),
  })
  if (h) params.set('h', String(h))
  return `https://images.unsplash.com/photo-${id}?${params.toString()}`
}

export const landingImages = {
  hero: unsplash('1486406146926-c627a92ad1ab', { w: 1400, q: 85 }),
  heroSide: unsplash('1560518883-ce09059eeffa', { w: 900, q: 85 }),
  features: {
    propertyManagement: unsplash('1564013799919-ab600027ffc6', { w: 600, h: 320, q: 80 }),
    scheduling: unsplash('1506784365847-bbad939e9335', { w: 600, h: 320, q: 80 }),
    checklists: unsplash('1581578731548-c64695cc6952', { w: 600, h: 320, q: 80 }),
  },
  properties: {
    sunset: unsplash('1512917774080-9991f1c4c750', { w: 160, h: 160, q: 80 }),
    greenview: unsplash('1449844908441-8829872d2607', { w: 160, h: 160, q: 80 }),
    lakeview: unsplash('1600596542815-ffad4c1539a9', { w: 160, h: 160, q: 80 }),
  },
  avatars: {
    jane: unsplash('1494790108377-be9c29b29330', { w: 80, h: 80, q: 80 }),
    david: unsplash('1507003211169-0a1dd7228f2d', { w: 80, h: 80, q: 80 }),
    sarah: unsplash('1438761681033-6461ffad8d80', { w: 80, h: 80, q: 80 }),
  },
  rentAutomation: unsplash('1554224155-6726b3ff858f', { w: 900, h: 400, q: 80 }),
}
