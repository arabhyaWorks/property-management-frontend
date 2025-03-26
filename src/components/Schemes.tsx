import React, { useState } from 'react';
import { Home, Building, Store, Factory, HomeIcon, ChevronDown } from 'lucide-react';

const schemeCategories = [
  {
    title: "Residential Schemes",
    titleHindi: "आवासीय योजनाएं",
    icon: <Home className="h-8 w-8" />,
    schemes: [
      "Jamunipur Residential Scheme (जमुनीपुर आवासीय योजना)",
      "Jamunipur Advanced Residential Scheme (जमुनीपुर बृहत्तर आवासीय योजना)",
      "Rajpura Residential Scheme (राजपुरा आवासीय योजना)",
      "Rajpura Residential Scheme Phase-2 (राजपुरा आवासीय योजना फेज-2)",
      "Hariyanv Residential Scheme (हरियांव आवासीय योजना)"
    ],
    color: "from-blue-50 to-blue-100"
  },
  {
    title: "Bundelkhand Residential-Cum-Industrial Schemes",
    titleHindi: "बुंदेलखंड सह आवासीय योजना",
    icon: <HomeIcon className="h-8 w-8" />,
    schemes: [
      "Sarai Growth Center (सराई ग्रोथ सेंटर)",
      "PIPRIS Industrial-cum-Residential Scheme (पिपरिस औद्योगिक सह आवासीय योजना)"
    ],
    color: "from-green-50 to-green-100"
  },
  {
    title: "Commercial-Cum-Residential Schemes",
    titleHindi: "व्यावसायिक सह आवासीय योजना",
    icon: <Building className="h-8 w-8" />,
    schemes: [
      "Jalalpur Commercial-cum-Residential Scheme (जलालपुर व्यावसायिक सह आवासीय योजना)",
      "Rajpura Commercial-cum-Residential Scheme / Ring Market (राजपुरा व्यावसायिक सह आवासीय योजना / रिंग मार्केट)"
    ],
    color: "from-purple-50 to-purple-100"
  },
  {
    title: "Commercial Schemes",
    titleHindi: "व्यावसायिक योजना",
    icon: <Store className="h-8 w-8" />,
    schemes: [
      "Rajpura Shopping Center (राजपुरा शॉपिंग सेंटर)",
      "Rajpura Bazaar Scheme (राजपुरा बाजार योजना)",
      "Export Building (निर्यात भवन)"
    ],
    color: "from-yellow-50 to-yellow-100"
  },
  {
    title: "Industrial Schemes",
    titleHindi: "औद्योगिक योजना",
    icon: <Factory className="h-8 w-8" />,
    schemes: [
      "Carpet City (कार्पेट सिटी)",
      "I&D Center (आई एंड डी सेंटर - एकीकृत अवसंरचना विकास केंद्र)"
    ],
    color: "from-red-50 to-red-100"
  }
];

export function Schemes() {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  return (
    <section id="schemes" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Schemes under BIDA
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our diverse range of residential, commercial, and industrial development schemes
          </p>
        </div>

        <div className="grid gap-6">
          {schemeCategories.map((category, index) => (
            <div 
              key={index}
              className={`bg-gradient-to-r ${category.color} rounded-xl overflow-hidden transition-all duration-300 ease-in-out`}
            >
              <button 
                onClick={() => setExpandedCategory(expandedCategory === index ? null : index)}
                className="w-full"
              >
                <div className="p-6 flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-3 rounded-full shadow-sm">
                      <div className="text-[#1e3a8a]">{category.icon}</div>
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
                      <p className="text-gray-600">{category.titleHindi}</p>
                    </div>
                  </div>
                  <ChevronDown 
                    className={`h-6 w-6 text-gray-600 transition-transform duration-300 ${
                      expandedCategory === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  expandedCategory === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 space-y-3">
                  {category.schemes.map((scheme, schemeIndex) => (
                    <div 
                      key={schemeIndex}
                      className="bg-white backdrop-blur-lg bg-opacity-90 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                    >
                      {scheme}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}