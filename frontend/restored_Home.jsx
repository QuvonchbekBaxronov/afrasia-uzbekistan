Created At: 2026-07-22T11:38:28Z
Completed At: 2026-07-22T11:38:28Z
File Path: `file:///d:/Viviuzbekistan/frontend/src/pages/Home.jsx`
Total Lines: 703
Total Bytes: 32272
Showing lines 1 to 120
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
1: import React, { useState, useEffect } from 'react';
2: import { useNavigate, Link } from 'react-router-dom';
3: import { uzbMapPaths } from '../data/uzb_map_paths';
4: import axios from 'axios';
5: 
6: // Professional animated SVG weather icons builder (looks like high-end AI/weather app visuals)
7: function getWeatherIconSVG(code, className = "w-12 h-12") {
8:   // 0: Sunny
9:   if (code === 0) {
10:     return (
11:       <svg className={`${className} animate-[spin_25s_linear_infinite]`} viewBox="0 0 24 24" fill="none">
12:         <defs>
13:           <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
14:             <stop offset="0%" stopColor="#FFF9C4" />
15:             <stop offset="50%" stopColor="#FBC02D" />
16:             <stop offset="100%" stopColor="#F57F17" />
17:           </radialGradient>
18:           <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
19:             <feGaussianBlur stdDeviation="2" result="blur" />
20:             <feComposite in="SourceGraphic" in2="blur" operator="over" />
21:           </filter>
22:         </defs>
23:         <circle cx="12" cy="12" r="5.5" fill="url(#sunGlow)" filter="url(#glow)" />
24:         <g stroke="#F57F17" strokeWidth="1.8" strokeLinecap="round" opacity="0.9">
25:           <line x1="12" y1="2" x2="12" y2="4" />
26:           <line x1="12" y1="20" x2="12" y2="22" />
27:           <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
28:           <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
29:           <line x1="2" y1="12" x2="4" y2="12" />
30:           <line x1="20" y1="12" x2="22" y2="12" />
<truncated 2528 bytes>
" y1="16" x2="13" y2="20" className="animate-[bounce_0.9s_infinite]" />
81:         </g>
82:       </svg>
83:     );
84:   }
85:   // 71..75, 85, 86: Snow
86:   if ([71, 73, 75, 85, 86].includes(code)) {
87:     return (
88:       <svg className={className} viewBox="0 0 24 24" fill="none">
89:         <defs>
90:           <linearGradient id="snowCloud" x1="0%" y1="0%" x2="100%" y2="100%">
91:             <stop offset="0%" stopColor="#CFD8DC" />
92:             <stop offset="100%" stopColor="#78909C" />
93:           </linearGradient>
94:         </defs>
95:         <path d="M5 14h11a4 4 0 001.25-7.8A3.5 3.5 0 0011 3a4.5 4.5 0 00-6 4.2A3 3 0 005 14z" fill="url(#snowCloud)" />
96:         <circle cx="7" cy="17" r="1" fill="#FFF" className="animate-ping" />
97:         <circle cx="11" cy="18" r="1" fill="#FFF" className="animate-ping" />
98:         <circle cx="15" cy="17" r="1" fill="#FFF" className="animate-ping" />
99:       </svg>
100:     );
101:   }
102:   // 95..99: Thunderstorm
103:   if ([95, 96, 99].includes(code)) {
104:     return (
105:       <svg className={className} viewBox="0 0 24 24" fill="none">
106:         <defs>
107:           <linearGradient id="stormCloud" x1="0%" y1="0%" x2="100%" y2="100%">
108:             <stop offset="0%" stopColor="#37474F" />
109:             <stop offset="100%" stopColor="#212121" />
110:           </linearGradient>
111:         </defs>
112:         <path d="M5 14h11a4 4 0 001.25-7.8A3.5 3.5 0 0011 3a4.5 4.5 0 00-6 4.2A3 3 0 005 14z" fill="url(#stormCloud)" />
113:         <path d="M10 14l-2 3h3l-1 3 3-4h-3z" fill="#FFD54F" filter="drop-shadow(0 0 2px #FFD54F)" />
114:       </svg>
115:     );
116:   }
117:   // Fallback
118:   return (
119:     <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
120:       <circle cx="12" cy="12" r="6" />
The above content does NOT show the entire file contents. If you need to view any lines of the file which were not shown to complete your task, call this tool again to view those lines.

Created At: 2026-07-22T11:38:32Z
Completed At: 2026-07-22T11:38:33Z
File Path: `file:///d:/Viviuzbekistan/frontend/src/pages/Home.jsx`
Total Lines: 703
Total Bytes: 32272
Showing lines 250 to 400
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
250:       condition: info.text,
251:       icon: info.icon,
252:       code: current.weathercode,
253:       clouds: current.weathercode > 0 ? 60 : 10,
254:       forecast
255:     };
256:   };
257: 
258:   const activeRegionId = hoveredRegion?.id || selectedRegion?.id || 'toshkent_city';
259:   const activeRegionName = hoveredRegion?.name || selectedRegion?.name || 'Toshkent shahri';
260:   const weather = getRegionWeather(activeRegionId);
261: 
262:   // SVG Geographic details
263:   const waterBodies = [
264:     { id: 'aral_sea', name: 'Orol dengizi', d: 'M 130 180 Q 150 160 170 185 Q 160 210 135 205 Z' },
265:     { id: 'aydarkul', name: 'Aydarko\'l', d: 'M 620 285 Q 650 275 680 290 Q 660 305 630 300 Z' }
266:   ];
267: 
268:   const rivers = [
269:     { id: 'amudaryo', d: 'M 590 530 Q 560 480 500 450 T 400 420 T 300 370 T 220 330 T 160 215' },
270:     { id: 'sirdaryo_river', d: 'M 930 260 Q 880 250 820 270 T 730 240 T 710 180' }
271:   ];
272: 
273:   const mountains = [
274:     { x: 800, y: 170, scale: 1.2 }, { x: 825, y: 150, scale: 1.4 }, { x: 850, y: 160, scale: 1.1 },
275:     { x: 710, y: 330, scale: 1.2 }, { x: 730, y: 350, scale: 1.3 },
276:     { x: 620, y: 440, scale: 1.3 }, { x: 640, y: 460, scale: 1.4 },
277:     { x: 600, y: 500, scale: 1.1 }, { x: 615, y: 520, scale: 1.2 }
278:   ];
279: 
280:   const handleSearchSubmit = (e) => {
281:     e.preventDefault();
282:     const query = searchQuery.toLowerCase().trim();
283:     const match = uzbMapPaths.find(p => p.name.toLowerCase().includes(query) || p.id.toLowerCase().includes(query));
284:     if (match) {
285
<truncated 4656 bytes>
eight="110%">
368:                     <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.12" />
369:                   </filter>
370:                 </defs>
371: 
372:                 {/* 1. Base Regions */}
373:                 <g className="map-regions" filter="url(#shadowWhite)">
374:                   {uzbMapPaths.map((reg) => (
375:                     <path
376:                       key={reg.id}
377:                       d={reg.d}
378:                       fill={hoveredRegion?.id === reg.id || selectedRegion?.id === reg.id ? '#DD2C00' : reg.color}
379:                       stroke={hoveredRegion?.id === reg.id || selectedRegion?.id === reg.id ? '#FFFFFF' : '#FFFFFF'}
380:                       strokeWidth={hoveredRegion?.id === reg.id || selectedRegion?.id === reg.id ? 2.5 : 1}
381:                       className="transition-all duration-300 cursor-pointer hover:opacity-95"
382:                       onMouseEnter={() => setHoveredRegion(reg)}
383:                       onMouseLeave={() => setHoveredRegion(null)}
384:                       onClick={() => navigate(reg.link)}
385:                     />
386:                   ))}
387:                 </g>
388: 
389:                 {/* 2. Cloud Shadow Overlay */}
390:                 <g className="map-clouds-shadow pointer-events-none">
391:                   {uzbMapPaths.map((reg) => {
392:                     const rWeather = getRegionWeather(reg.id);
393:                     if (rWeather && rWeather.clouds > 50) {
394:                       return (
395:                         <path
396:                           key={`cloud-sh-${reg.id}`}
397:                           d={reg.d}
398:                           fill="#37474F"
399:                           opacity="0.14"
400:                           className="transition-all duration-300"
The above content does NOT show the entire file contents. If you need to view any lines of the file which were not shown to complete your task, call this tool again to view those lines.

Created At: 2026-07-22T11:38:37Z
Completed At: 2026-07-22T11:38:37Z
File Path: `file:///d:/Viviuzbekistan/frontend/src/pages/Home.jsx`
Total Lines: 703
Total Bytes: 32272
Showing lines 400 to 520
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
400:                           className="transition-all duration-300"
401:                         />
402:                       );
403:                     }
404:                     return null;
405:                   })}
406:                 </g>
407: 
408:                 {/* 3. Water Bodies */}
409:                 <g className="map-water pointer-events-none">
410:                   {waterBodies.map((lake) => (
411:                     <path
412:                       key={lake.id}
413:                       d={lake.d}
414:                       fill="url(#waterGradWhite)"
415:                       stroke="#0288d1"
416:                       strokeWidth="0.5"
417:                     />
418:                   ))}
419:                 </g>
420: 
421:                 {/* 4. Rivers */}
422:                 <g className="map-rivers pointer-events-none">
423:                   {rivers.map((river) => (
424:                     <path
425:                       key={river.id}
426:                       d={river.d}
427:                       fill="none"
428:                       stroke="#4fc3f7"
429:                       strokeWidth="3.5"
430:                       strokeLinecap="round"
431:                       strokeDasharray="4 2"
432:                       opacity="0.8"
433:                     />
434:                   ))}
435:                 </g>
436: 
437:                 {/* 5. Mountain Reliefs */}
438:                 <g className="map-mountains pointer-events-none opacity-60">
439:                   {mountains.map((mtn, idx) => (
440:                     <g key={`mtn-${id
<truncated 1639 bytes>
                   
475:                     return (
476:                       <g 
477:                         key={`lbl-${reg.id}`} 
478:                         transform={`translate(${reg.labelX}, ${reg.labelY})`}
479:                       >
480:                         <rect
481:                           x={xOffset}
482:                           y="-10"
483:                           width={width}
484:                           height={20}
485:                           rx="10"
486:                           fill="white"
487:                           stroke="#B2DFDB"
488:                           strokeWidth="1.5"
489:                           className="shadow-sm"
490:                         />
491:                         <circle
492:                           cx={xOffset + 8}
493:                           cy="0"
494:                           r="3"
495:                           fill={hoveredRegion?.id === reg.id || selectedRegion?.id === reg.id ? '#DD2C00' : '#009688'}
496:                         />
497:                         <text
498:                           x={6}
499:                           y="3"
500:                           textAnchor="middle"
501:                           className="text-[9px] font-sans font-extrabold fill-dark tracking-wide"
502:                         >
503:                           {reg.name}
504:                         </text>
505:                       </g>
506:                     );
507:                   })}
508:                 </g>
509:               </svg>
510: 
511:             </div>
512:           </div>
513: 
514:         </div>
515:       </section>
516: 
517:       {/* O'ZBEKISTON HAQIDA */}
518:       <section className="py-20 bg-white">
519:         <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
520:           <div className="text-center mb-12">
The above content does NOT show the entire file contents. If you need to view any lines of the file which were not shown to complete your task, call this tool again to view those lines.
