"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast, Toaster } from 'react-hot-toast';

interface EditBookingProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number;
  onUpdate: () => void;
}

const EditBooking: React.FC<EditBookingProps> = ({ isOpen, onClose, bookingId, onUpdate }) => {
  const [guesthouses, setGuesthouses] = useState([]);
  const [booking, setBooking] = useState({
    guesthouse: '',
    start_date: '',
    end_date: '',
    total_cost: '',
    status: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [guesthousesResponse, bookingResponse] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/guesthouses/'),
          axios.get(`http://127.0.0.1:8000/api/bookings/${bookingId}/`)
        ]);
        setGuesthouses(guesthousesResponse.data);
        setBooking(bookingResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error fetching booking data');
      }
    };
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, bookingId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBooking(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (new Date(booking.end_date) <= new Date(booking.start_date)) {
        toast.error('End date should be greater than start date.');
        return;
      }

      await axios.put(`http://127.0.0.1:8000/api/bookings/${bookingId}/`, {
        ...booking,
        total_cost: parseFloat(booking.total_cost as string),
      });
      onUpdate();
      toast.success('Booking updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Error updating booking. Please try again.');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <Toaster/>
      <SheetContent
        className={cn(
          'z-50 w-full md:w-[500px] rounded-md border bg-white p-4 md:p-6 text-gray-900 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
        )}
      >
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold mb-4">Edit Booking</SheetTitle>

          <SheetDescription>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Guest House</label>
                <select
                  name="guesthouse"
                  value={booking.guesthouse}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select a guest house</option>
                  {guesthouses.map((house: any) => (
                    <option key={house.id} value={house.id}>
                      {house.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <Input type="date" name="start_date" value={booking.start_date} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <Input type="date" name="end_date" value={booking.end_date} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Cost</label>
                <Input type="number" name="total_cost" value={booking.total_cost} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={booking.status}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="confirmed">Confirmed</option>
                </select>
              </div>
            </form>
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col md:flex-row justify-center gap-3 mt-10 md:mt-20">
          <Button variant="outline" size="lg" onClick={onClose} className="w-full md:w-auto">
            Cancel
          </Button>
          <Button variant="default" size="lg" onClick={handleSubmit} className="w-full md:w-auto bg-blue-900">
            Save
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditBooking;