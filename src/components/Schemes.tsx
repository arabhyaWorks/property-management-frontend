import React, { useState } from 'react';
import { Home, Building, Store, Factory, ChevronDown } from 'lucide-react';

const schemeCategories = [
  {
    title: "Residential Schemes",
    titleHindi: "आवासीय योजनाएं",
    icon: <Home className="h-8 w-8" />,
    schemes: [
      {
        name: "Jamunipur Residential Scheme (जमुनीपुर आवासीय योजना)",
        year: "1986-87",
        area: "9.38 acres",
        cost: "133.52 lakh rupees",
        properties: "216",
        allotted: "216",
        available: "0"
      },
      {
        name: "Jamunipur Greater Residential Scheme (जमुनीपुर बृहत्तर आवासीय योजना)",
        year: "1988-89",
        area: "18.74 acres",
        cost: "393 lakh rupees",
        properties: "377",
        allotted: "377",
        available: "0"
      },
      {
        name: "Rajpura Residential Scheme (राजपुरा आवासीय योजना)",
        year: "1988-89",
        area: "16.75 acres",
        cost: "278 lakh rupees",
        properties: "358",
        allotted: "358",
        available: "0"
      },
      {
        name: "Rajpura Residential Scheme Phase-2 (राजपुरा आवासीय योजना फेज-2)",
        year: "1997-98",
        area: "16.75 acres",
        cost: "278 lakh rupees",
        properties: "358",
        allotted: "358",
        available: "0"
      },
      {
        name: "Hariyaw Residential Scheme (हरियांव आवासीय योजना)",
        year: "2008-09",
        area: "23.13 acres",
        cost: "692.99 lakh rupees",
        properties: "619",
        allotted: "617",
        available: "2"
      }
    ],
    color: "from-blue-50 to-blue-100"
  },
  {
    title: "Weaver Shed Cum Residential Schemes",
    titleHindi: "बुनकर शेड सह आवासीय योजना",
    icon: <Home className="h-8 w-8" />,
    schemes: [
      {
        name: "Sarroi Growth Center (सराई ग्रोथ सेंटर)",
        year: "1989-90",
        area: "4.30 acres",
        cost: "23.94 lakh rupees",
        properties: "170",
        allotted: "170",
        available: "0"
      },
      {
        name: "PIPRIS Industrial-cum-Residential Scheme (पिपरिस औद्योगिक सह आवासीय योजना)",
        year: "1996-97",
        area: "11.14 acres",
        cost: "92.70 lakh rupees",
        properties: "315",
        allotted: "313",
        available: "2"
      }
    ],
    color: "from-green-50 to-green-100"
  },
  {
    title: "Commercial-Cum-Residential Schemes",
    titleHindi: "व्यावसायिक सह आवासीय योजना",
    icon: <Building className="h-8 w-8" />,
    schemes: [
      {
        name: "Jalalpur Commercial-cum-Residential Scheme (जलालपुर व्यावसायिक सह आवासीय योजना)",
        year: "1992-93",
        area: "1.25 acres",
        cost: "84.80 lakh rupees",
        properties: "14",
        allotted: "14",
        available: "0"
      },
      {
        name: "Rajpura Commercial-cum-Residential Scheme / Ring Market (राजपुरा व्यावसायिक सह आवासीय योजना / रिंग मार्केट)",
        year: "1996-97",
        area: "4.15 acres",
        cost: "1945.87 lakh rupees",
        properties: "390",
        allotted: "337",
        available: "53"
      }
    ],
    color: "from-purple-50 to-purple-100"
  },
  {
    title: "Commercial Schemes",
    titleHindi: "व्यावसायिक योजना",
    icon: <Store className="h-8 w-8" />,
    schemes: [
      {
        name: "Rajpura Shopping Center (राजपुरा शॉपिंग सेंटर)",
        year: "1984-85",
        area: "0.16 acres",
        cost: "4.24 lakh rupees",
        properties: "16",
        allotted: "16",
        available: "0"
      },
      {
        name: "Rajpura Bazaar Scheme (राजपुरा बाजार योजना)",
        year: "1987-88",
        area: "0.11 acres",
        cost: "16.10 lakh rupees",
        properties: "36",
        allotted: "36",
        available: "0"
      },
      {
        name: "Niryat Bhawan (निर्यात भवन)",
        year: "1987-88",
        area: "1.25 acres",
        cost: "305 lakh rupees",
        properties: "143",
        allotted: "135",
        available: "8"
      }
    ],
    color: "from-yellow-50 to-yellow-100"
  },
  {
    title: "Industrial Schemes",
    titleHindi: "औद्योगिक योजना",
    icon: <Factory className="h-8 w-8" />,
    schemes: [
      {
        name: "Carpet City (कार्पेट सिटी)",
        year: "2001-02",
        area: "48.06 acres",
        cost: "954.3 lakh rupees",
        properties: "222",
        allotted: "222",
        available: "0"
      },
      {
        name: "IIDC (आई एंड डी सेंटर - एकीकृत अवसंरचना विकास केंद्र)",
        year: "2003-04",
        area: "50.13 acres",
        cost: "797 lakh rupees",
        properties: "448",
        allotted: "443",
        available: "5"
      }
    ],
    color: "from-red-50 to-red-100"
  }
];

export function Schemes() {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedScheme, setExpandedScheme] = useState(null);

  const toggleCategory = (index) => {
    if (expandedCategory === index) {
      setExpandedCategory(null);
      setExpandedScheme(null);
    } else {
      setExpandedCategory(index);
      setExpandedScheme(null);
    }
  };

  const toggleScheme = (schemeIndex) => {
    if (expandedScheme === schemeIndex) {
      setExpandedScheme(null);
    } else {
      setExpandedScheme(schemeIndex);
    }
  };

  return (
    <section id="schemes" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Schemes under BIDA
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Explore our diverse range of residential, commercial, and industrial development schemes managed by the Bhadohi Industrial Development Authority
          </p>
        </div>

        <div className="grid gap-6">
          {schemeCategories.map((category, index) => (
            <div 
              key={index}
              className={`bg-gradient-to-r ${category.color} rounded-xl overflow-hidden shadow-md transition-all duration-300 ease-in-out`}
            >
              <button 
                onClick={() => toggleCategory(index)}
                className="w-full"
              >
                <div className="p-6 flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-3 rounded-full shadow-sm">
                      <div className="text-blue-900">{category.icon}</div>
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
                  expandedCategory === index ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 space-y-4">
                  {category.schemes.map((scheme, schemeIndex) => (
                    <div key={schemeIndex} className="overflow-hidden">
                      <button
                        onClick={() => toggleScheme(schemeIndex)}
                        className="w-full bg-white backdrop-blur-lg bg-opacity-90 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-left flex justify-between items-center"
                      >
                        <span className="font-medium">{scheme.name}</span>
                        <ChevronDown 
                          className={`h-5 w-5 text-gray-600 transition-transform duration-300 ${
                            expandedScheme === schemeIndex ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      
                      <div 
                        className={`transition-all duration-300 ease-in-out overflow-hidden bg-white bg-opacity-70 rounded-lg mx-2 ${
                          expandedScheme === schemeIndex ? 'max-h-screen opacity-100 mt-2 shadow-inner' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="p-4 space-y-2">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p><span className="font-semibold">Sanctioned Year:</span> {scheme.year}</p>
                              <p><span className="font-semibold">Land Area:</span> {scheme.area}</p>
                              <p><span className="font-semibold">Construction Cost:</span> {scheme.cost}</p>
                            </div>
                            <div className="space-y-1">
                              <p><span className="font-semibold">Total Properties:</span> {scheme.properties}</p>
                              <p><span className="font-semibold">Allotted Properties:</span> {scheme.allotted}</p>
                              <p><span className="font-semibold">Available Properties:</span> {scheme.available}</p>
                            </div>
                          </div>
                          {scheme.available !== "0" && (
                            <div className="mt-4">
                              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300">
                                Check Available Properties
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
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