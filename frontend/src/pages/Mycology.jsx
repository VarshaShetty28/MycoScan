import React, { useState } from 'react';
import { FaLeaf, FaSkull, FaFirstAid, FaTree, FaExclamationTriangle, FaBook, FaArrowRight } from 'react-icons/fa';
import { MdScience, MdVisibility, MdWarning } from 'react-icons/md';

const Mycology = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [hoveredPart, setHoveredPart] = useState(null);

  // Mushroom Anatomy Parts
  const mushroomParts = {
    cap: {
      name: "Cap (Pileus)",
      description: "The top portion of the mushroom. Can be convex, flat, or funnel-shaped. Surface texture and color are key identification features.",
      color: "#8B4513"
    },
    gills: {
      name: "Gills (Lamellae)",
      description: "Thin, blade-like structures under the cap where spores are produced. Note attachment to stem, spacing, and color.",
      color: "#D2691E"
    },
    stem: {
      name: "Stem (Stipe)",
      description: "Supports the cap. Can be hollow or solid, smooth or textured. May have special features like rings or scales.",
      color: "#DEB887"
    },
    ring: {
      name: "Ring (Annulus)",
      description: "A collar-like structure on the stem, remnant of the partial veil. Important for identifying many species, especially Amanitas.",
      color: "#F5DEB3"
    },
    volva: {
      name: "Volva",
      description: "Cup-like structure at the base of the stem. Critical identifier for deadly Amanita species. May be buried underground.",
      color: "#FAEBD7"
    },
    mycelium: {
      name: "Mycelium",
      description: "The vegetative part of the fungus, consisting of thread-like hyphae. Usually hidden underground or in wood.",
      color: "#FFFFFF"
    },
    scales: {
      name: "Scales",
      description: "Raised patches on the cap surface. Can be remnants of the universal veil. Pattern and color help with identification.",
      color: "#654321"
    },
    pores: {
      name: "Pores (in Boletes)",
      description: "Some mushrooms have pores instead of gills. These are tiny tubes where spores are produced. Common in boletes.",
      color: "#FFD700"
    }
  };

  // SVG Mushroom Diagram Component
  const MushroomDiagram = () => (
    <div className="bg-white rounded-xl border-2 border-purple-200 p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Mushroom Anatomy - Interactive Diagram</h3>
      
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* SVG Diagram */}
        <div className="flex-1 max-w-md">
          <svg viewBox="0 0 400 500" className="w-full h-auto">
            {/* Background */}
            <rect width="400" height="500" fill="#f9fafb"/>
            
            {/* Mycelium */}
            <g 
              onMouseEnter={() => setHoveredPart('mycelium')}
              onMouseLeave={() => setHoveredPart(null)}
              className="cursor-pointer"
            >
              <path d="M150 450 Q200 470 250 450" stroke="#999" strokeWidth="2" fill="none" strokeDasharray="2,2"/>
              <path d="M160 460 Q200 480 240 460" stroke="#999" strokeWidth="2" fill="none" strokeDasharray="2,2"/>
              <path d="M170 470 Q200 490 230 470" stroke="#999" strokeWidth="2" fill="none" strokeDasharray="2,2"/>
              <circle cx="150" cy="450" r="3" fill="#999"/>
              <circle cx="250" cy="450" r="3" fill="#999"/>
              <circle cx="160" cy="460" r="3" fill="#999"/>
              <circle cx="240" cy="460" r="3" fill="#999"/>
              <text x="280" y="470" fontSize="14" fill="#666">Mycelium</text>
            </g>

            {/* Volva */}
            <g 
              onMouseEnter={() => setHoveredPart('volva')}
              onMouseLeave={() => setHoveredPart(null)}
              className="cursor-pointer"
            >
              <ellipse cx="200" cy="420" rx="40" ry="25" 
                fill={hoveredPart === 'volva' ? '#FFE4B5' : '#FAEBD7'} 
                stroke="#8B4513" strokeWidth="2"/>
              <path d="M160 420 Q200 440 240 420" fill="none" stroke="#8B4513" strokeWidth="1"/>
              <text x="250" y="425" fontSize="14" fill="#666">Volva</text>
            </g>

            {/* Stem */}
            <g 
              onMouseEnter={() => setHoveredPart('stem')}
              onMouseLeave={() => setHoveredPart(null)}
              className="cursor-pointer"
            >
              <rect x="180" y="250" width="40" height="170" 
                fill={hoveredPart === 'stem' ? '#F5DEB3' : '#DEB887'} 
                stroke="#8B4513" strokeWidth="2"/>
              <line x1="190" y1="260" x2="190" y2="410" stroke="#CD853F" strokeWidth="1" opacity="0.5"/>
              <line x1="210" y1="260" x2="210" y2="410" stroke="#CD853F" strokeWidth="1" opacity="0.5"/>
              <text x="230" y="350" fontSize="14" fill="#666">Stem</text>
            </g>

            {/* Ring */}
            <g 
              onMouseEnter={() => setHoveredPart('ring')}
              onMouseLeave={() => setHoveredPart(null)}
              className="cursor-pointer"
            >
              <ellipse cx="200" cy="290" rx="35" ry="8" 
                fill={hoveredPart === 'ring' ? '#FFEFD5' : '#F5DEB3'} 
                stroke="#8B4513" strokeWidth="2"/>
              <path d="M165 290 Q200 300 235 290" fill="none" stroke="#8B4513" strokeWidth="1"/>
              <text x="245" y="295" fontSize="14" fill="#666">Ring</text>
            </g>

            {/* Cap */}
            <g 
              onMouseEnter={() => setHoveredPart('cap')}
              onMouseLeave={() => setHoveredPart(null)}
              className="cursor-pointer"
            >
              <path d="M100 200 Q200 100 300 200 Q250 250 200 250 Q150 250 100 200" 
                fill={hoveredPart === 'cap' ? '#A0522D' : '#8B4513'} 
                stroke="#654321" strokeWidth="2"/>
              
              {/* Scales on cap */}
              <g onMouseEnter={() => setHoveredPart('scales')}>
                <circle cx="150" cy="160" r="8" fill="#654321" opacity="0.7"/>
                <circle cx="200" cy="140" r="10" fill="#654321" opacity="0.7"/>
                <circle cx="250" cy="165" r="7" fill="#654321" opacity="0.7"/>
                <circle cx="180" cy="180" r="6" fill="#654321" opacity="0.7"/>
                <circle cx="220" cy="175" r="8" fill="#654321" opacity="0.7"/>
                <text x="310" y="160" fontSize="14" fill="#666">Scales</text>
              </g>
              
              <text x="310" y="130" fontSize="14" fill="#666">Cap</text>
            </g>

            {/* Gills */}
            <g 
              onMouseEnter={() => setHoveredPart('gills')}
              onMouseLeave={() => setHoveredPart(null)}
              className="cursor-pointer"
            >
              {[...Array(20)].map((_, i) => (
                <line 
                  key={i}
                  x1={120 + i * 8} 
                  y1="250" 
                  x2={150 + i * 5} 
                  y2="210" 
                  stroke={hoveredPart === 'gills' ? '#CD853F' : '#D2691E'} 
                  strokeWidth="2"
                  opacity="0.8"
                />
              ))}
              <text x="85" y="235" fontSize="14" fill="#666">Gills</text>
            </g>

            {/* Labels with arrows */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
              </marker>
            </defs>
          </svg>
        </div>

        {/* Information Panel */}
        <div className="flex-1 space-y-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-bold text-purple-900 mb-2">
              {hoveredPart ? mushroomParts[hoveredPart]?.name : 'Hover over parts to learn more'}
            </h4>
            <p className="text-gray-700">
              {hoveredPart ? mushroomParts[hoveredPart]?.description : 'Each part of the mushroom provides important clues for identification. Understanding these structures is essential for safe foraging.'}
            </p>
          </div>

          {/* Parts List */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Key Structures:</h4>
            {Object.entries(mushroomParts).map(([key, part]) => (
              <div 
                key={key}
                className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  hoveredPart === key 
                    ? 'border-purple-400 bg-purple-50' 
                    : 'border-gray-200 hover:border-purple-200'
                }`}
                onMouseEnter={() => setHoveredPart(key)}
                onMouseLeave={() => setHoveredPart(null)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{part.name}</span>
                  <FaArrowRight className="text-purple-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Spore Print Tip</h4>
          <p className="text-sm text-gray-700">
            Remove the stem and place the cap gill-side down on white and black paper. 
            Cover with a bowl for 4-12 hours to collect spore print for identification.
          </p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 mb-2">Safety Note</h4>
          <p className="text-sm text-gray-700">
            Always check for the presence of a volva by carefully digging around the base. 
            This cup-like structure is a key identifier of deadly Amanita species.
          </p>
        </div>
      </div>
    </div>
  );

  const commonEdible = [
    // ... (keep existing commonEdible array)
  ];

  const deadlyPoisonous = [
    // ... (keep existing deadlyPoisonous array)
  ];

  const identificationKeys = [
    // ... (keep existing identificationKeys array)
  ];

  const safetyRules = [
    // ... (keep existing safetyRules array)
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Mycology Learning Center</h1>
          <p className="text-xl text-purple-200 max-w-3xl">
            A comprehensive guide to mushroom identification, safety, and the fascinating science of fungi
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        
        {/* NEW: Mushroom Anatomy Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <MdScience className="text-purple-600" />
            Understanding Mushroom Anatomy
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Before identifying mushrooms in the field, it's crucial to understand their basic anatomy. 
            Each part provides important clues for safe and accurate identification.
          </p>
          <MushroomDiagram />
        </section>

        {/* Rest of your existing sections... */}
        {/* Keep all the existing sections (Identification Guide, Common Edible Species, etc.) */}
        
      </div>
    </div>
  );
};

export default Mycology;