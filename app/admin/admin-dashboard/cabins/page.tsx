"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaImages, FaTrash, FaCheck, FaTimesCircle } from 'react-icons/fa';
import { ScrollArea } from "@/components/ui/scroll-area";
import MenuBar from '../components/MenuBar';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

interface Cabin {
  name: string;
  description: string;
  location: string;
  price_per_day: string;
  availability_status: boolean;
  rooms: number;
}

export default function CabinsPage() {
  const [cabin, setCabin] = useState<Cabin>({
    name: '',
    description: '',
    location: '',
    price_per_day: '',
    availability_status: true,
    rooms: 1,
  });
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCabin({ ...cabin, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImagePreviews = Array.from(files).map((file) => URL.createObjectURL(file));
      setImagePreview((prev) => [...prev, ...newImagePreviews]);
      setNewImages((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const resetForm = () => {
    setCabin({
      name: '',
      description: '',
      location: '',
      price_per_day: '',
      availability_status: true,
      rooms: 1,
    });
    setNewImages([]);
    setImagePreview([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:8000/api/guesthouses/', cabin);
      const guesthouseId = response.data.id;

      if (newImages.length > 0) {
        const formData = new FormData();
        formData.append('guesthouse', guesthouseId.toString());
        newImages.forEach((file) => {
          formData.append('images', file);
        });

        await axios.post('http://localhost:8000/api/images/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      resetForm();
      setSuccess(true);
      setError('');
      toast.success("Cabin created successfully", { duration: 5000 });
    } catch (err) {
      console.error('Error creating cabin:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(`Error creating cabin: ${err.response.data.message || 'Please try again.'}`);
      } else {
        setError('Error creating cabin. Please try again.');
      }
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('adminSession');
    router.push('/admin');
  };
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('/admin/admin-dashboard');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  if (success) {
    return (
      <div className="flex min-h-screen">
        <MenuBar onLogout={handleLogout} />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-green-500 text-2xl">
            Cabin created successfully! Redirecting...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
     <MenuBar onLogout={handleLogout} />
      <div className="flex-grow flex flex-col">
        <Toaster position="top-center" reverseOrder={false} />
        
        <div className="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 md:p-8 w-full max-w-4xl mt-16 sm:mt-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-semibold">Create Cabin</h2>
            </div>

            {isSubmitting ? (
              <div className="text-center">Submitting...</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={cabin.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={cabin.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={cabin.location}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="price_per_day" className="block text-gray-700 font-medium mb-2">
                  Price per Day
                </label>
                <input
                  type="text"
                  id="price_per_day"
                  name="price_per_day"
                  value={cabin.price_per_day}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="availability_status" className="block text-gray-700 font-medium mb-2">
                  Availability Status
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="availability_status"
                    name="availability_status"
                    checked={cabin.availability_status}
                    onChange={(e) => setCabin({ ...cabin, availability_status: e.target.checked })}
                    className="mr-2 text-blue-500 focus:ring-blue-500"
                  />
                  <span>Available</span>
                </div>
              </div>
              <div>
                <label htmlFor="rooms" className="block text-gray-700 font-medium mb-2">
                  Rooms
                </label>
                <input
                  type="number"
                  id="rooms"
                  name="rooms"
                  value={cabin.rooms}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="images" className="block text-gray-700 font-medium mb-2">
                Images
              </label>
              <div className="flex items-center">
                <label htmlFor="images" className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
                  <FaImages className="mr-2 inline" />
                  Upload Images
                </label>
                <input
                    type="file"
                    id="images"
                    name="images"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                />
              </div>

              <ScrollArea className="h-[200px] w-full mt-4 rounded-md border p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {imagePreview.map((image, index) => (
                    <div key={index} className="relative">
                      <img src={image} alt={`Image ${index}`} className="w-full h-32 object-cover rounded" />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        onClick={() => {
                          setNewImages(newImages.filter((_, i) => i !== index));
                          setImagePreview(imagePreview.filter((_, i) => i !== index));
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    type="button"
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    onClick={resetForm}
                  >
                    <FaTimesCircle className="mr-2 inline" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    <FaCheck className="mr-2 inline" />
                    Submit
                  </button>
                </div>

                {error && (
                  <div className="text-red-500 mt-4">
                    {error}
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
