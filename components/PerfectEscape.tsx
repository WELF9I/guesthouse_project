import { AirVent, Caravan, ChefHat, Coffee, PackageOpen, Pizza, TreePalm, UtensilsCrossed } from 'lucide-react';
import React from 'react';

const Perfect = [
  {
      id:1,
      icon: <ChefHat className="w-8 h-8 text-orange-500 mb-4" />,
      label: "Modern Kitchen Appliances",
      description: "Upgrade your kitchen with the latest appliances designed for efficiency and style."
  },
  {
    id:2,
      icon: <Caravan className="w-8 h-8 text-orange-500 mb-4" />,
      label: "Outdoor Paths",
      description: "Enhance your outdoor spaces with well-designed paths that combine functionality and aesthetics."
  },
  {
    id:3,
      icon: <Coffee className="w-8 h-8 text-orange-500 mb-4" />,
      label: "Coffee Maker",
      description: "Brew the perfect cup of coffee with advanced coffee makers that bring café-quality brews to your home."
  },
  {
    id:4,
      icon: <TreePalm className="w-8 h-8 text-orange-500 mb-4" />,
      label: "Natural Scenery",
      description: "Create a serene environment with natural elements that bring a touch of the outdoors inside."
  },
  {
    id:5,
      icon: <AirVent className="w-8 h-8 text-orange-500 mb-4" />,
      label: "Air Conditioner",
      description: "Stay comfortable year-round with energy-efficient air conditioning solutions tailored to your needs."
  },
  {
    id:6,
      icon: <PackageOpen className="w-8 h-8 text-orange-500 mb-4" />,
      label: "Storage Solutions",
      description: "Maximize your space with innovative storage solutions designed to keep your home organized."
  },
  {
    id:7,
      icon: <UtensilsCrossed className="w-8 h-8 text-orange-500 mb-4" />,
      label: "Cutlery Selection",
      description: "Choose from a diverse range of high-quality cutlery that enhances your dining experience."
  },
  {
    id:8,
      icon: <Pizza className="w-8 h-8 text-orange-500 mb-4" />,
      label: "Take-away Options",
      description: "Enjoy convenient and delicious take-away options with packaging designed for freshness and quality."
  }
];

const PerfectEscape = () => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="w-full max-w-8xl mx-auto p-6 md:p-12 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-900">
          The perfect escape.
        </h2>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed text-center mt-4">
        Our guest house is the ideal place for a weekend getaway, offering tranquility and comfort. 
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {Perfect.map((item) => (
        <div key={item.id} className="flex flex-col items-center text-center">
          {item.icon}
          <h3 className="text-lg font-semibold text-gray-800">{item.label}</h3>
          <p className="text-gray-600 mt-2">{item.description}</p>
        </div>
      ))}

        </div>
       
      </div>
    </div>
  );
};

export default PerfectEscape;
