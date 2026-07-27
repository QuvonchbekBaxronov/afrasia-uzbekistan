import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Since this is a module, we can read db.js as text and parse it or import it.
// db.js uses ES modules. Let's just import it dynamically since package.json has type: module.
import { regions, cuisine } from './src/data/db.js';

// Format regions
const formattedRegions = regions.map(r => {
  return {
    ...r,
    famousPlaces: r.famousPlaces.map(placeName => ({
      name: placeName,
      history: `${placeName} haqida qisqacha tarix... (Admin paneldan o'zgartiring)`,
      location: `${r.name}, ${placeName}`,
      mapUrl: `https://maps.google.com/?q=${encodeURIComponent(placeName)}`,
      image: `/images/placeholder.jpg`
    }))
  };
});

const formattedCuisine = cuisine.map(c => {
  return {
    ...c,
    recipe: `${c.name} tayyorlanish usuli... (Admin paneldan to'ldiring)`,
    ingredients: ["Mahsulot 1", "Mahsulot 2"],
    restaurants: [
      {
        name: "Maxsus Restoran",
        location: c.region,
        mapUrl: `https://maps.google.com/?q=${encodeURIComponent(c.name)}`
      }
    ]
  };
});

const newDb = {
  regions: formattedRegions,
  cuisine: formattedCuisine
};

fs.writeFileSync('./db.json', JSON.stringify(newDb, null, 2));
console.log("Muvaffaqiyatli saqlandi!");
