"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaImages, FaTrash, FaCheck, FaTimesCircle } from 'react-icons/fa';
import { ScrollArea } from "@/components/ui/scroll-area";
import toast, { Toaster } from 'react-hot-toast';

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

interface EditCabinPageProps {
  isOpen: boolean;
  onClose: () => void;
  cabinId: number;
  onUpdate: () => void;
}

export default function EditCabinPage({ isOpen, onClose, cabinId, onUpdate }: EditCabinPageProps) {
  const [cabin, setCabin] = useState<Cabin>({
    id: 0,
    name: '',
    description: '',
    location: '',
    price_per_day: '',
    availability_status: true,
    rooms: 1,
  });
  const [images, setImages] = useState<Image[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCabinData();
    }
  }, [isOpen, cabinId]);

  const fetchCabinData = async () => {
    try {
      const cabinResponse = await axios.get(`http://localhost:8000/api/guesthouses/${cabinId}/`);
      setCabin(cabinResponse.data);
      
      const imagesResponse = await axios.get(`http://localhost:8000/api/images/?guesthouse=${cabinId}`);
      setImages(imagesResponse.data);
      setImagePreview(imagesResponse.data.map((img: Image) => `data:image/jpeg;base64,${img.image_base64}`));
    } catch (err) {
      setError('Error fetching cabin data. Please try again.');
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/guesthouses/${cabinId}/`, cabin);

      if (newImages.length > 0) {
        const formData = new FormData();
        formData.append('guesthouse', cabinId.toString());
        newImages.forEach((file) => {
          formData.append('images', file);
        });

        await axios.post('http://localhost:8000/api/images/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setSuccess(true);
      setError('');
      toast.success('Cabin edited successfully');
      onUpdate();
      onClose();
    } catch (err) {
      setError('Error updating cabin. Please try again.');
      setSuccess(false);
    }
  };

  const handleDeleteImage = async (index: number) => {
    try {
      if (index < images.length) {
        // Existing image
        await axios.delete(`http://localhost:8000/api/images/${images[index].id}/`);
        setImages(images.filter((_, i) => i !== index));
      } else {
        // New image
        const newIndex = index - images.length;
        setNewImages(newImages.filter((_, i) => i !== newIndex));
      }
      setImagePreview(imagePreview.filter((_, i) => i !== index));
    } catch (err) {
      setError('Error deleting image. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <Toaster position="top-center" reverseOrder={false}/>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Edit Cabin</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimesCircle size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <FaImages className="mr-2" />
                Upload New Images
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
              <div className="grid grid-cols-3 gap-4">
                {imagePreview.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image} alt={`Image ${index}`} className="w-full h-32 object-cover rounded" />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      onClick={() => handleDeleteImage(index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              onClick={onClose}
            >
              <FaTimesCircle className="mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <FaCheck className="mr-2" />
              Update
            </button>
          </div>

          {success && (
            <div className="text-green-500 mt-4">
              Cabin updated successfully!
            </div>
          )}
          {error && (
            <div className="text-red-500 mt-4">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}