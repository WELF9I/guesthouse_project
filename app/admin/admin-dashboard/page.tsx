"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaHome, FaBed, FaCalendarAlt } from 'react-icons/fa';
import MenuBar from './components/MenuBar';
import DeleteItem from './components/DeleteItem';
import { Button } from '@/components/ui/button';
import EditCabinPage from './edit-cabin/[id]/page';
import EditBooking from './edit-booking/[id]/page';
interface Booking {
  id: number;
  guesthouse: number;
  clerk_id: string;
  start_date: string;
  end_date: string;
  total_cost: number;
  status: string;
}

interface GuestHouse {
  id: number;
  name: string;
  description: string;
  location: string;
  price_per_day: number;
  availability_status: boolean;
  rooms: number;
}

interface CustomUser {
  id: number;
  clerk_id: string;
  name: string;
  email: string;
  phone: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between mb-2">
      <div className="text-lg sm:text-xl font-semibold">{title}</div>
      <div className="text-gray-500">{icon}</div>
    </div>
    <div className="text-2xl sm:text-3xl font-bold mb-2">{value}</div>
    {change && <div className="text-sm text-gray-500">{change}</div>}
  </div>
);

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [guestHouses, setGuestHouses] = useState<GuestHouse[]>([]);
  const [users, setUsers] = useState<CustomUser[]>([]);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedCabinId, setSelectedCabinId] = useState<number | null>(null);
  const [isEditBookingOpen, setIsEditBookingOpen] = useState(false);
  const [editBookingId, setEditBookingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    occupancyRate: 0,
    totalRevenue: 0,
    upcomingBookings: 0,
  });
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        router.push('/admin');
        return;
      }

      try {
        await axios.get('http://localhost:8000/api/users/', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setIsLoading(false);
        fetchData();
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('adminSession');
        router.push('/admin');
      }
    };

    checkAuth();
  }, [router]);

  const fetchData = async () => {
    try {
      const [bookingsRes, guestHousesRes, usersRes] = await Promise.all([
        axios.get('http://localhost:8000/api/bookings/'),
        axios.get('http://localhost:8000/api/guesthouses/'),
        axios.get('http://localhost:8000/api/users/', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
      ]);

      setBookings(bookingsRes.data);
      setGuestHouses(guestHousesRes.data);
      setUsers(usersRes.data);

      const totalBookings = bookingsRes.data.length;
      const occupancyRate = calculateOccupancyRate(bookingsRes.data, guestHousesRes.data);
      const totalRevenue = calculateTotalRevenue(bookingsRes.data);
      const upcomingBookings = calculateUpcomingBookings(bookingsRes.data);

      setStats({
        totalBookings,
        occupancyRate,
        totalRevenue,
        upcomingBookings,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const calculateOccupancyRate = (bookings: Booking[], guestHouses: GuestHouse[]) => {
    const totalGuestHouses = guestHouses.length;
    if (totalGuestHouses === 0) return 0;

    const occupiedHouses = bookings.filter(booking => booking.status === 'confirmed').length;
    return (occupiedHouses / totalGuestHouses) * 100;
  };

  const calculateTotalRevenue = (bookings: Booking[]): number => {
    const totalRevenue = bookings.reduce((total, booking) => {
      // Convert total_cost to a number if it's a string
      const cost = typeof booking.total_cost === 'string' ? parseFloat(booking.total_cost) : booking.total_cost;
      return total + cost;
    }, 0);
  
    return parseFloat(totalRevenue.toFixed(2));
  };

  const handleEditBooking = (id: number) => {
    setEditBookingId(id);
    setIsEditBookingOpen(true);
  };
  
  const calculateUpcomingBookings = (bookings: Booking[]) => {
    const today = new Date();
    return bookings.filter(booking => new Date(booking.start_date) > today).length;
  };

  const handleDelete = async (id: number, type: 'booking' | 'guesthouse') => {
    try {
      await axios.delete(`http://localhost:8000/api/${type}s/${id}/`);
      fetchData();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const refreshCabinData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/guesthouses/');
      setGuestHouses(response.data);
    } catch (error) {
      console.error('Error refreshing cabin data:', error);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('adminSession');
    router.push('/admin');
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100">
      <MenuBar onLogout={handleLogout} />
      <div className="flex-1 p-4 sm:p-8 overflow-auto mt-16 sm:mt-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold">Dashboard</h1>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Bookings"
            value={`${stats.totalBookings}`}
            icon={<FaCalendarAlt className="text-blue-500" />}
          />
          <StatCard
            title="Occupancy Rate"
            value={`${stats.occupancyRate.toFixed(2)}%`}
            icon={<FaBed className="text-blue-500" />}
          />
          <StatCard
            title="Total Revenue"
            value={`${stats.totalRevenue.toFixed(2)} TND`} 
            icon={<FaHome className="text-blue-500" />}
          />
          <StatCard
            title="Upcoming Bookings"
            value={stats.upcomingBookings}
            icon={<FaCalendarAlt className="text-blue-500" />}
          />
        </div>

        {/* Bookings */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Recent Bookings</h2>
          </div>
          <table className="w-full min-w-[640px]">
            <thead>
              <tr>
                <th className="text-left pb-3">ID</th>
                <th className="text-left pb-3">Cabin</th>
                <th className="text-left pb-3">Start Date</th>
                <th className="text-left pb-3">End Date</th>
                <th className="text-left pb-3">Total Cost</th>
                <th className="text-left pb-3">Status</th>
                <th className="text-left pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((booking) => (
                <tr key={booking.id} className="border-t">
                  <td className="py-2">{booking.id}</td>
                  <td className="py-2">{booking.guesthouse}</td>
                  <td className="py-2">{booking.start_date}</td>
                  <td className="py-2">{booking.end_date}</td>
                  <td className="py-2">{booking.total_cost} TND</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        booking.status === 'completed'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-yellow-200 text-yellow-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-2">
                  <Button
                    className="bg-blue-500 text-white px-4 py-2 mr-4 rounded hover:bg-blue-600"
                    onClick={() => handleEditBooking(booking.id)}
                  >
                    Edit
                  </Button>
                    <DeleteItem id={booking.id} type="booking" fetchData={fetchData} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cabins*/}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Cabins</h2>
          </div>
          <table className="w-full min-w-[640px]">
            <thead>
              <tr>
                <th className="text-left pb-3">ID</th>
                <th className="text-left pb-3">Name</th>
                <th className="text-left pb-3">Location</th>
                <th className="text-left pb-3">Price Per Day</th>
                <th className="text-left pb-3">Rooms</th>
                <th className="text-left pb-3">Status</th>
                <th className="text-left pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {guestHouses.slice(0, 5).map((house) => (
                <tr key={house.id} className="border-t">
                  <td className="py-2">{house.id}</td>
                  <td className="py-2">{house.name}</td>
                  <td className="py-2">{house.location}</td>
                  <td className="py-2">{house.price_per_day} TND</td>
                  <td className="py-2">{house.rooms}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        house.availability_status
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {house.availability_status ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="py-2">
                  <Button
                    className="bg-blue-500 text-white px-4 py-2 mr-4 rounded hover:bg-blue-600"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedCabinId(house.id);
                      setIsEditPopupOpen(true);
                    }}
                  >
                  Edit
                </Button>
                  
                  <DeleteItem id={house.id} type="guesthouse" fetchData={fetchData} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Users */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Users</h2>
          </div>
          <table className="w-full min-w-[640px]">
            <thead>
              <tr>
                <th className="text-left pb-3">ID</th>
                <th className="text-left pb-3">Name</th>
                <th className="text-left pb-3">Email</th>
                <th className="text-left pb-3">Phone</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 5).map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="py-2">{user.id}</td>
                  <td className="py-2">{user.name}</td>
                  <td className="py-2">{user.email}</td>
                  <td className="py-2">{user.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isEditPopupOpen && selectedCabinId && (
                   <EditCabinPage
                     isOpen={isEditPopupOpen}
                     onClose={() => {
                       setIsEditPopupOpen(false);
                       setSelectedCabinId(null);
                     }}
                     cabinId={selectedCabinId}
                     onUpdate={refreshCabinData}
      />)}

      {/* EditBooking component */}
          {isEditBookingOpen && editBookingId && (
            <EditBooking
              isOpen={isEditBookingOpen}
              onClose={() => {
                setIsEditBookingOpen(false);
                setEditBookingId(null);
              }}
              bookingId={editBookingId}
              onUpdate={fetchData}
            />)}
      </div>
  );
}