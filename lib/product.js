// lib/product.js
// Real MSB catalog, built from the images in /public/Products.
// NOTE: prices are placeholders until real pricing is supplied.

export const CURRENCY = "$";
export const formatPrice = (n) => `${CURRENCY}${Number(n).toFixed(2)}`;

export const categories = [
  {
    slug: "carry-bag",
    name: "Carry Bag",
    folder: "Carry Bag",
    tagline: "Vest-style shopping bags in every size and colour",
    desc: "Strong, tear-resistant vest carry bags for retail, groceries and takeaway.",
    cover: "B1316.png",
    skus: ["A1013.png", "A1316.png", "B1013.png", "B1316.png", "B1619.png", "B2024.png", "B2227.png", "C1013.jpg", "C1220.jpg", "C1316.jpg", "C1619.jpg", "C2024.jpg", "TBAG8.jpg", "TBAG32.jpg"],
  },
  {
    slug: "garbage-bag",
    name: "Garbage Bag",
    folder: "Garbage Bag",
    tagline: "Heavy-duty bin liners for home and commercial use",
    desc: "Leak-resistant, heavy-duty garbage bags sized for household and commercial bins.",
    cover: "GB303950.png",
    skus: ["GB2026.png", "GB3039100.png", "GB303910.png", "GB303930.png", "GB303950.png", "GB3648.png"],
  },
  {
    slug: "hd-string-bag",
    name: "HD String Bag",
    folder: "HD String Bag",
    tagline: "High-density bags on a roll for produce & counters",
    desc: "High-density polyethylene string bags — light, strong and easy to tear off.",
    cover: "HDS58.jpg",
    skus: ["HD47.jpg", "HDS34.jpg", "HDS58.jpg", "HDS69.jpg", "HDS79.jpg", "HDS88.jpg"],
  },
  {
    slug: "pp-container",
    name: "PP Container",
    folder: "PP Container",
    tagline: "Microwave-safe food containers with lids",
    desc: "Food-grade polypropylene containers with tight-fitting lids. Microwave and freezer safe.",
    cover: "TEKAR16.jpg",
    skus: ["TEKAA500.jpg", "TEKAA650.jpg", "TEKAA750.jpg", "TEKAA1000.jpg", "TEKAB500.jpg", "TEKAB750.jpg", "TEKADS750.jpg", "TEKAR8.jpg", "TEKAR10.jpg", "TEKAR12.jpg", "TEKAR16.jpg", "TEKAR20.jpg", "TEKAR25D.jpg", "TEKAR30.jpg", "TEKAR2500.jpg", "TEKAR3000.jpg", "TEKARS2.jpg", "TEKARS4.jpg"],
  },
  {
    slug: "pp-plastic",
    name: "PP Plastic",
    folder: "PP Plastic",
    tagline: "Clear polypropylene plastic bags",
    desc: "Crystal-clear PP plastic bags for packing food, snacks and small goods.",
    cover: "PP35.jpg",
    skus: ["PP35.jpg"],
  },
];

const imgPath = (folder, file) => encodeURI(`/Products/${folder}/${file}`);

// Turn a SKU code into a readable size label where the pattern is clear.
function sizeLabel(cat, sku) {
  let m;
  if (cat === "carry-bag" && (m = sku.match(/^[A-C](\d{2})(\d{2})$/))) return `${+m[1]}" × ${+m[2]}"`;
  if (cat === "garbage-bag" && (m = sku.match(/^GB(\d{2})(\d{2})(\d*)$/)))
    return `${m[1]}" × ${m[2]}"${m[3] ? ` · ${m[3]} pcs` : ""}`;
  if (cat === "pp-container" && (m = sku.match(/^TEKA[A-Z]*?(\d+)D?$/))) {
    const n = +m[1];
    return n >= 100 ? `${n} ml` : `${n} oz`;
  }
  return null;
}

let id = 0;
export const products = categories.flatMap((c, ci) =>
  c.skus.map((file, i) => {
    id += 1;
    const sku = file.replace(/\.\w+$/, "");
    const size = sizeLabel(c.slug, sku);
    return {
      id,
      sku,
      name: size ? `${c.name} ${size}` : `${c.name} ${sku}`,
      size,
      category: c.slug,
      categoryName: c.name,
      price: +(4 + ((id * 37) % 90) / 4).toFixed(2), // placeholder
      rating: +(4 + ((id * 7) % 10) / 10).toFixed(1), // placeholder
      img: imgPath(c.folder, file),
      desc: c.desc,
      featured: file === c.cover,
    };
  })
);

export const categoryImage = (c) => imgPath(c.folder, c.cover);
export const getCategory = (slug) => categories.find((c) => c.slug === slug);
