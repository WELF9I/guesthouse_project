import { BathIcon, BedDouble, BedIcon } from 'lucide-react';
import React from 'react';

const InfoIcons=[
    {
        id:1,
        icon:<BedIcon className='text-black'/>,
        label:"Beds",
        description:"The cabin is equipped with 12 beds, 4 of which are in bunk.The rent includes linens for all beds."
    },
    {
      id:2,
        icon:<BedDouble className='text-black'/>,
        label:"Bedrooms",
        description:"Spread out over two floors, the cabin offers 4 bedrooms. Ranging from 2 to 4 beds per room."
    },
    {
      id:3,
        icon:<BathIcon className='text-black'/>,
        label:"Bathrooms",
        description:"The cabin has three bathrooms, all equipped with showers and one with a bath tub."
    }
]

const SleepingArrangements = () => {
  return (
    <div className="bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-8xl mx-auto shadow-lg">
        <img
          src="/kitchen_cabin.jpg"
          alt="Kitchen"
          className="w-full h-auto"
        />
        <div className="bg-white p-6 md:p-12 mt-6 rounded-lg">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-900">
            Sleeping arrangements.
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed text-center mt-4">
          Our guest house offers a variety of comfortable sleeping arrangements to suit your needs. With cozy beds, soft linens, and a peaceful environment, you are guaranteed a restful night's sleep.
          </p>
          <div className="flex flex-col md:flex-row justify-between items-center mt-8">         
          {InfoIcons.map((item) => (
          <div key={item.id}>
            <div className="flex flex-col items-center mb-6 md:mb-0">
              <div className="bg-yellow-200 p-4 rounded-full mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{item.label}</h3>
              <p className="text-gray-600 text-center mt-2 text-md justify-between">
                {item.description}
              </p>
            </div>
          </div>
        ))}

                </div>
            </div>
        </div>
      </div>
    
  );
};

export default SleepingArrangements;
