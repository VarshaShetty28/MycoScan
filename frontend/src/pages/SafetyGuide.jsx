import React from "react";
import { MdSafetyCheck, MdVisibility, MdReport } from "react-icons/md";
import { FaLeaf } from "react-icons/fa";

export default function SafetyGuide() {
  return (
    <div className="mt-20 flex flex-col">
      <div className="flex-grow mt-11 px-6 py-8 max-w-5xl mx-auto text-gray-900">
        {/* Header */}
        <h1 className="text-4xl font-bold text-purple-700 mb-6 flex items-center gap-2">
          <MdSafetyCheck className="text-purple-500" />
          Safety Guide
        </h1>

        {/* Intro paragraph */}
        <p className="mb-6 text-lg text-gray-700">
          This guide outlines best practices to ensure your safety while
          identifying or handling mushrooms. Always stay cautious and follow the
          rules below.
        </p>

        {/* Cards Section */}
        <div className="space-y-6">
          {/* Card 1 */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 shadow-md hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2 text-green-700">
              <FaLeaf className="text-green-600" />
              Do Not Touch Unknown Species
            </h2>
            <p className="text-gray-700">
              Some mushrooms are toxic even by touch. Avoid direct contact with
              unfamiliar fungi unless guided by a trained mycologist.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-md hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2 text-blue-700">
              <MdVisibility className="text-blue-600" />
              Observe Before You Act
            </h2>
            <p className="text-gray-700">
              Use visual tools, such as image comparison and spore prints, to
              identify mushrooms. Don't rely solely on color or shape.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 shadow-md hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2 text-red-700">
              <MdReport className="text-red-600" />
              Report Suspicious Species
            </h2>
            <p className="text-gray-700">
              If you find mushrooms that seem toxic or invasive, report them to
              local wildlife or environmental authorities to prevent spreading.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}