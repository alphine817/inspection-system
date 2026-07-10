const unsplash = (id, { w = 800, h = 480, q = 80 } = {}) => {
  const params = new URLSearchParams({
    auto: 'format',
    fit: 'crop',
    w: String(w),
    h: String(h),
    q: String(q),
  })
  return `https://images.unsplash.com/photo-${id}?${params.toString()}`
}

export const listingImages = {
  placeholder: unsplash('1564013799919-ab600027ffc6', { w: 800, h: 480, q: 80 }),
}
