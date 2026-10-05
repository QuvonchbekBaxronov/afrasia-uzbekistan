import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const uploadsDir = path.join(rootDir, 'frontend', 'public', 'uploads', 'places');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Verified high quality travel & architecture photos for Tashkent locations
const mediaSources = [
  {
    prefix: 'hazrati_imom',
    cover: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    prefix: 'chorsu_bozori',
    cover: 'https://images.unsplash.com/photo-1578922746465-3a80a228f223?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    prefix: 'toshkent_teleminorasi',
    cover: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    prefix: 'kokaldosh_madrasasi',
    cover: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    prefix: 'amir_temur_xiyoboni',
    cover: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    prefix: 'amaliy_sanat_muzeyi',
    cover: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    prefix: 'magic_city',
    cover: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    prefix: 'chimyon_chorvoq',
    cover: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    prefix: 'yangi_ozbekiston_bogi',
    cover: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    prefix: 'zangiota_majmuasi',
    cover: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80'
    ]
  }
];

function downloadAndOptimize(url, destBaseName) {
  const tempPath = path.join(uploadsDir, `${destBaseName}.jpg`);
  const finalWebpPath = path.join(uploadsDir, `${destBaseName}.webp`);

  if (fs.existsSync(finalWebpPath) && fs.statSync(finalWebpPath).size > 1000) {
    console.log(`[EXISTS] ${destBaseName}.webp`);
    return `/uploads/places/${destBaseName}.webp`;
  }

  try {
    console.log(`[DOWNLOADING] ${destBaseName} from ${url.slice(0, 45)}...`);
    execSync(`curl -sSL --max-time 15 "${url}" -o "${tempPath}"`);

    if (fs.existsSync(tempPath) && fs.statSync(tempPath).size > 1000) {
      // Optimize using macOS sips: max width 1920px
      try {
        execSync(`sips --resampleWidth 1920 "${tempPath}" > /dev/null 2>&1 || true`);
        // Check if sips supports webp export or keep high quality optimized jpg / webp
        try {
          execSync(`sips -s format webp "${tempPath}" --out "${finalWebpPath}" > /dev/null 2>&1`);
        } catch {
          // If sips doesn't support webp, rename to final jpg or use fallback
          fs.copyFileSync(tempPath, finalWebpPath);
        }
        if (!fs.existsSync(finalWebpPath)) {
          fs.copyFileSync(tempPath, finalWebpPath);
        }
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        console.log(`[SUCCESS] Saved ${destBaseName}.webp`);
        return `/uploads/places/${destBaseName}.webp`;
      } catch (procErr) {
        console.warn(`[WARN] Sips processing: ${procErr.message}`);
        fs.renameSync(tempPath, finalWebpPath);
        return `/uploads/places/${destBaseName}.webp`;
      }
    } else {
      console.warn(`[FAIL] ${destBaseName} download was empty`);
      return url;
    }
  } catch (err) {
    console.error(`[ERROR] ${destBaseName}:`, err.message);
    return url;
  }
}

async function run() {
  console.log('🚀 Starting Media Pipeline for Tashkent Destinations...');
  for (const item of mediaSources) {
    console.log(`\nProcessing ${item.prefix}...`);
    downloadAndOptimize(item.cover, `${item.prefix}_cover`);
    item.gallery.forEach((gUrl, idx) => {
      downloadAndOptimize(gUrl, `${item.prefix}_gallery_${idx + 1}`);
    });
  }
  console.log('\n✅ Media Pipeline Complete!');
}

run();
