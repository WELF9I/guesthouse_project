"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaBed } from 'react-icons/fa';
import axios from 'axios';

interface Cabin {
  id: number;
  name: string;
  description: string;
  location: string;
  price_per_day: string;
  availability_status: boolean;
  rooms: number;
}

interface Image {
  id: number;
  guesthouse: number;
  image_base64: string;
}

const CabinList = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [cabinImages, setCabinImages] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    fetchCabins();
  }, []);

  const fetchCabins = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/guesthouses/');
      setCabins(response.data);
      fetchCabinImages(response.data);
    } catch (error) {
      console.error('Error fetching cabins:', error);
    }
  };

  const fetchCabinImages = async (cabins: Cabin[]) => {
    const imagePromises = cabins.map(async (cabin) => {
      try {
        const response = await axios.get(`http://localhost:8000/api/images/?guesthouse=${cabin.id}`);
        if (response.data.length > 0) {
          return { id: cabin.id, image: `data:image/jpeg;base64,${response.data[0].image_base64}` };
        }
      } catch (error) {
        console.error(`Error fetching image for cabin ${cabin.id}:`, error);
      }
      return null;
    });

    const images = await Promise.all(imagePromises);
    const imageMap = images.reduce((acc, img) => {
      if (img) {
        acc[img.id] = img.image;
      }
      return acc;
    }, {} as { [key: number]: string });

    setCabinImages(imageMap);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const filteredCabins = cabins.filter((cabin) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Small (1-3 guests)') return cabin.rooms <= 3;
    if (selectedFilter === 'Medium (4-7 guests)') return cabin.rooms >= 4 && cabin.rooms <= 7;
    if (selectedFilter === 'Large (8-12 guests)') return cabin.rooms >= 8 && cabin.rooms <= 12;
    return false;
  });

  return (
    <div className="bg-gray-900 text-white p-4 md:p-8 min-h-screen">
      <div className="mb-8 mt-20">
        <h2 className="text-2xl mb-4">Filter cabins by size:</h2>
        <div className="flex flex-wrap space-x-2 md:space-x-4">
          {['All', 'Small (1-3 guests)', 'Medium (4-7 guests)', 'Large (8-12 guests)'].map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`px-4 py-2 my-2 rounded ${selectedFilter === filter ? 'bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      {filteredCabins.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCabins.map((cabin) => (
            <div key={cabin.id} className="bg-gray-800 rounded-lg overflow-hidden">
              {cabinImages[cabin.id] && (
                <Image src={cabinImages[cabin.id]} alt={cabin.name} width={500} height={300} className="w-full h-64 object-cover" />
              )}
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-2xl font-bold text-yellow-500">{cabin.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    cabin.availability_status ? 'bg-green-500 text-green-100' : 'bg-red-500 text-red-100'
                  }`}>
                    {cabin.availability_status ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <p className="text-blue-400 mb-4">
                  <FaBed className="inline-block mr-2" /> {cabin.rooms} Rooms
                </p>
                <p className="text-3xl font-bold mb-4">{cabin.price_per_day} TND <span className="text-sm font-normal">/ night</span></p>
                {cabin.availability_status ? (
                  <Link href={`/dashboard/${cabin.id}`} className="text-blue-400 hover:text-blue-800">
                    Details & reservation →
                  </Link>
                ) : (
                  <span className="text-gray-500 cursor-not-allowed">Not available</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xl text-center mt-8">Not Found</p>
      )}
    </div>
  );
};

export default CabinList;