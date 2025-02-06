// Base64 编码表
const BASE64_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

// 实现 btoa 函数
function btoa(str: string): string {
  let output = ''
  let chr1, chr2, chr3, enc1, enc2, enc3, enc4
  let i = 0

  while (i < str.length) {
    chr1 = str.charCodeAt(i++)
    chr2 = str.charCodeAt(i++)
    chr3 = str.charCodeAt(i++)

    enc1 = chr1 >> 2
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
    enc4 = chr3 & 63

    if (Number.isNaN(chr2)) {
      enc3 = enc4 = 64
    }
    else if (Number.isNaN(chr3)) {
      enc4 = 64
    }

    output += BASE64_MAP.charAt(enc1)
    + BASE64_MAP.charAt(enc2)
    + BASE64_MAP.charAt(enc3)
    + BASE64_MAP.charAt(enc4)
  }

  return output
}

// 将 SVG 转换为 data URL
function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

// 基础图形
const basicPatterns = {
  circle: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
  square: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
  triangle: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L22 20H2L12 3Z" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
  pentagon: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L22 9.27L19.1 20H4.9L2 9.27L12 2Z" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
  hexagon: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L21.5 7V17L12 22L2.5 17V7L12 2Z" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
  octagon: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.86 2H16.14L22 7.86V16.14L16.14 22H7.86L2 16.14V7.86L7.86 2Z" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
  roundedSquare: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="6" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
  oval: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><ellipse cx="12" cy="12" rx="10" ry="7" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
}

// 特殊图形
const specialPatterns = {
  star: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
  doubleStar: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L14 7L19 7L15 10L16 15L12 12L8 15L9 10L5 7L10 7L12 2Z M12 8L13.5 12L17 12L14 14L15 18L12 16L9 18L10 14L7 12L10.5 12L12 8Z" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
  diamond: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L22 12L12 22L2 12L12 2Z" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
  flower: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4"/><path d="M12 2C14 2 14 6 12 8C10 6 10 2 12 2Z M12 22C14 22 14 18 12 16C10 18 10 22 12 22Z M2 12C2 14 6 14 8 12C6 10 2 10 2 12Z M22 12C22 14 18 14 16 12C18 10 22 10 22 12Z" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
  clover: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C14 2 14 6 12 8C10 6 10 2 12 2ZM12 22C14 22 14 18 12 16C10 18 10 22 12 22ZM2 12C2 14 6 14 8 12C6 10 2 10 2 12ZM22 12C22 14 18 14 16 12C18 10 22 10 22 12Z" stroke="#3ABEF9" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="2" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
  bow: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 12C2 8 6 6 10 8C10 10 10 14 10 16C6 18 2 16 2 12ZM22 12C22 8 18 6 14 8C14 10 14 14 14 16C18 18 22 16 22 12ZM10 12H14" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
}

// 自然元素
const naturePatterns = {
  moon: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79Z" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
  sun: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="5"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
  cloud: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18 10H16.74C16.37 7.69 14.34 6 12 6C10.34 6 8.84 6.84 8 8.2C5.68 8.4 4 10.46 4 13C4 15.76 6.24 18 9 18H18C20.21 18 22 16.21 22 14C22 11.79 20.21 10 18 10Z" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
  raindrop: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L18 12C18 17 15 20 12 20C9 20 6 17 6 12L12 2Z" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
  leaf: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C20 2 22 12 22 19C16 17 8 17 2 19C2 12 4 2 12 2ZM12 2C12 10 12 18 12 22" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
  snowflake: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2V22M2 12H22M4 4L20 20M20 4L4 20" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
}

// 动物图案
const animalPatterns = {
  cat: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" stroke="#3ABEF9" stroke-width="2" fill="none"/><path d="M8 10L10 12L8 14M16 10L14 12L16 14M12 14L11 16H13L12 14" stroke="#3ABEF9" stroke-width="2" fill="none"/><path d="M7 8L3 4M17 8L21 4" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
  rabbit: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="14" r="6" stroke="#3ABEF9" stroke-width="2" fill="none"/><path d="M8 4C8 6 10 8 12 8C14 8 16 6 16 4" stroke="#3ABEF9" stroke-width="2" fill="none"/><circle cx="10" cy="12" r="1" fill="#3ABEF9"/><circle cx="14" cy="12" r="1" fill="#3ABEF9"/></svg>'),
}

// 物品图案
const objectPatterns = {
  bell: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C16 2 18 6 18 12H6C6 6 8 2 12 2ZM5 12H19C19 14 18 16 12 16C6 16 5 14 5 12ZM10 16C10 18 14 18 14 16" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
  crown: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 12L6 6L12 8L18 6L22 12L18 16H6L2 12Z" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
  gift: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="8" width="16" height="14" stroke="#3ABEF9" stroke-width="2" fill="none"/><path d="M12 8V22M4 12H20M8 8C8 4 12 4 12 8C12 4 16 4 16 8" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
}

// 音乐图案
const musicPatterns = {
  note: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="18" r="4" stroke="#3ABEF9" stroke-width="2" fill="none"/><path d="M10 18V4L20 6V16" stroke="#3ABEF9" stroke-width="2" fill="none"/><circle cx="20" cy="16" r="2" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
  headphone: svgToDataUrl('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 14C4 8 8 4 12 4C16 4 20 8 20 14" stroke="#3ABEF9" stroke-width="2" fill="none"/><path d="M4 14V18C4 20 6 20 6 18V16C6 14 4 14 4 14ZM20 14V18C20 20 18 20 18 18V16C18 14 20 14 20 14Z" stroke="#3ABEF9" stroke-width="2" fill="none"/></svg>'),
}

// 所有图案合并为一个数组
export const patterns = [
  ...Object.values(basicPatterns),
  ...Object.values(specialPatterns),
  ...Object.values(naturePatterns),
  ...Object.values(animalPatterns),
  ...Object.values(objectPatterns),
  ...Object.values(musicPatterns),
]
