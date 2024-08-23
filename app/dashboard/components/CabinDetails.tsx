"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Modal from 'react-modal';
import { Building2, CreditCard, Mail, Phone, User, Calendar } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { FaBed } from 'react-icons/fa';
import axios from 'axios';
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';


type CabinDetailsProps = {
  cabinId: string;
};

type Cabin = {
  id: number;
  name: string;
  description: string;
  location: string;
  price_per_day: string;
  availability_status: boolean;
  rooms: number;
};

type CabinImage = {
  id: number;
  guesthouse: number;
  image_base64: string;
};

type FormData = {
  username: string;
  email: string;
  phoneNumber: string;
  paymentMethod: string;
  checkinDate: string;
  checkoutDate: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
  };
  creditCardDetails: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
};

  const CabinDetails: React.FC<CabinDetailsProps> = ({ cabinId }) => {
  const router = useRouter();
  const { user } = useUser();
  const [cabin, setCabin] = useState<Cabin | null>(null);
  const [cabinImages, setCabinImages] = useState<CabinImage[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    phoneNumber: '',
    paymentMethod: '',
    checkinDate: '',
    checkoutDate: '',
    bankDetails: {
      bankName: '',
      accountNumber: ''
    },
    creditCardDetails: {
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    }
  });
  useEffect(() => {
    if (user) {
      createOrGetUser();
    }
  }, [user]);

  const createOrGetUser = async () => {
    if (!user) return;

    const clerkName = user.fullName || '';
    const clerkEmail = user.primaryEmailAddress?.emailAddress || '';
    const clerkPhone = user.primaryPhoneNumber?.phoneNumber || '';
    
    const nameToInsert = formData.username !== clerkName && formData.username !== '' ? formData.username : clerkName;
    const emailToInsert = formData.email !== clerkEmail && formData.email !== '' ? formData.email : clerkEmail;
    const phoneToInsert = formData.phoneNumber !== clerkPhone && formData.phoneNumber !== '' ? formData.phoneNumber : clerkPhone;

    try {
        const response = await axios.post('http://localhost:8000/api/create-or-get-user/', {
            clerk_id: user.id,
            name: nameToInsert,
            email: emailToInsert,
            phone: phoneToInsert
        });
        console.log('User created or retrieved:', response.data);
    } catch (error) {
        console.error('Error creating or getting user:', error);
        toast.error('Failed to create or retrieve user. Please try again.');
    }
};


  useEffect(() => {
    fetchCabinData();
    fetchCabinImages();
    Modal.setAppElement('body');

    if (user) {
      setFormData(prevState => ({
        ...prevState,
        username: user.fullName || '',
        email: user.primaryEmailAddress?.emailAddress || '',
        phoneNumber: user.phoneNumbers[0]?.phoneNumber || ''
      }));
    }
  }, [cabinId, user]);

  const fetchCabinData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/guesthouses/${cabinId}/`);
      setCabin(response.data);
    } catch (error) {
      console.error('Error fetching cabin data:', error);
    }
  };

  const fetchCabinImages = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/images/?guesthouse=${cabinId}`);
      setCabinImages(response.data);
    } catch (error) {
      console.error('Error fetching cabin images:', error);
    }
  };


  const validateUsername = (username: string) => /^[a-zA-Z]+ [a-zA-Z]+$/.test(username);
  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const validatePhoneNumber = (phoneNumber: string) => /^\d{8}$/.test(phoneNumber);
  const validateCardNumber = (cardNumber: string) => /^\d{16}$/.test(cardNumber);
  const validateExpiryDate = (expiryDate: string) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate);
  const validateCVV = (cvv: string) => /^\d{3,4}$/.test(cvv);
  const validateDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date);
  const isCheckoutAfterCheckin = (checkinDate: string, checkoutDate: string) => new Date(checkoutDate) > new Date(checkinDate);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleBankDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      bankDetails: {
        ...prevState.bankDetails,
        [name]: value
      }
    }));
  };

  const handleCreditCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      creditCardDetails: {
        ...prevState.creditCardDetails,
        [name]: value
      }
    }));
  };

  const openModal = () => {
    setModalIsOpen(true);
    document.querySelector('.carousel')?.classList.add('hidden');
  };

  const closeModal = () => {
    setModalIsOpen(false);
    document.querySelector('.carousel')?.classList.remove('hidden');
  };

  const nextStep = () => setStep(prevStep => prevStep + 1);
  const prevStep = () => setStep(prevStep => prevStep - 1);

  const handleNextStep = async () => {
    if (!user) {
      toast.error('You must be logged in to make a reservation.');
      return;
    }
    try {
      await createOrGetUser();
      const bookingResponse = await axios.post('http://localhost:8000/api/bookings/', {
        guesthouse: cabin?.id,
        clerk_id: user.id,
        start_date: formData.checkinDate,
        end_date: formData.checkoutDate,
        total_cost: calculateTotalCost(),
        status: "pending"
      });
      
      setBookingId(bookingResponse.data.id);
      nextStep();
    } catch (error) {
      console.error('Error creating pending booking:', error);
      toast.error('Failed to create booking. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!bookingId) {
      toast.error('Booking information is missing. Please try again.');
      return;
    }

    setIsDialogOpen(true);
  };

  const confirmPayment = async () => {
    try {
      await axios.post('http://localhost:8000/api/payments/', {
        booking: bookingId,
        amount: calculateTotalCost(),
        status: "Completed"
      });

      setIsDialogOpen(false);
      closeModal();
      toast.success('Reservation and payment successful!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error('Failed to confirm payment. Please try again.', {
        duration: 2000,
      });
    }
  };

  const cancelPayment = () => {
    setIsDialogOpen(false);
  };

  const calculateTotalCost = () => {
    if (cabin && formData.checkinDate && formData.checkoutDate) {
      const start = new Date(formData.checkinDate);
      const end = new Date(formData.checkoutDate);
      const nights = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
      return parseFloat(cabin.price_per_day) * nights;
    }
    return 0;
  };

  if (!cabin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-900 text-white p-4 md:p-8 mt-16 min-h-screen">
      <Toaster />
      <div className="flex flex-col md:flex-row bg-gray-800 rounded-lg overflow-hidden">
        <div className="w-full md:w-1/2">
          <Carousel>
            {cabinImages.map((image, index) => (
              <div key={index}>
                <Image src={`data:image/jpeg;base64,${image.image_base64}`} alt={cabin.name} width={500} height={300} className="w-full h-64 md:h-full object-cover" />
              </div>
            ))}
          </Carousel>
        </div>
        <div className="w-full md:w-1/2 p-4 md:p-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{cabin.name}</h2>
          <p className="text-blue-400 mb-4">{cabin.description} <span className="text-gray-500">Show more</span></p>
          <p className="mb-2 flex items-center">
            <FaBed className="mr-2" /> {cabin.rooms} Rooms
          </p>
          <p className="mb-2 flex items-center">
            <span className="mr-2">📍</span>
            {cabin.location}
          </p>
          <p className="mb-4 flex items-center">
            <span className="mr-2">💲</span>
            {cabin.price_per_day} TND / night
          </p>
          <button onClick={openModal} className="bg-yellow-500 text-black px-4 py-2 rounded" disabled={!cabin.availability_status}>
            {cabin.availability_status ? 'Reserve Here' : 'Not Available'}
          </button>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="bg-gray-900 text-white p-8 rounded-lg max-w-lg mx-auto mt-16"
        overlayClassName="bg-black bg-opacity-50 fixed inset-0 z-50"
      >
        <h2 className="text-2xl mb-4">Reservation Form</h2>
        {step === 1 && (
          <>
            <div className="mb-4">
              <label className="block mb-2">Username</label>
              <div className="flex items-center bg-gray-800 p-2 rounded">
                <User className="text-white mr-2" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                  className="bg-gray-800 text-white p-2 w-full rounded"
                  required
                />
              </div>
              {!validateUsername(formData.username) && formData.username && (
                <p className="text-red-500 mt-2">Username must be in 'FirstName LastName' format.</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2">Email</label>
              <div className="flex items-center bg-gray-800 p-2 rounded">
                <Mail className="text-white mr-2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="bg-gray-800 text-white p-2 w-full rounded"
                  required
                />
              </div>
              {!validateEmail(formData.email) && formData.email && (
                <p className="text-red-500 mt-2">Please enter a valid email address.</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2">Phone Number</label>
              <div className="flex items-center bg-gray-800 p-2 rounded">
                <Phone className="text-white mr-2" />
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="bg-gray-800 text-white p-2 w-full rounded"
                  required
                />
              </div>
              {!validatePhoneNumber(formData.phoneNumber) && formData.phoneNumber && (
                <p className="text-red-500 mt-2">Phone number must be exactly 8 digits.</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2">Check-in Date</label>
              <div className="flex items-center bg-gray-800 p-2 rounded">
                <Calendar className="text-white mr-2" />
                <input
                  type="date"
                  name="checkinDate"
                  value={formData.checkinDate}
                  onChange={handleInputChange}
                  className="bg-gray-800 text-white p-2 w-full rounded"
                  required
                />
              </div>
              {!validateDate(formData.checkinDate) && formData.checkinDate && (
                <p className="text-red-500 mt-2">Please enter a valid check-in date.</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2">Check-out Date</label>
              <div className="flex items-center bg-gray-800 p-2 rounded">
                <Calendar className="text-white mr-2" />
                <input
                  type="date"
                  name="checkoutDate"
                  value={formData.checkoutDate}
                  onChange={handleInputChange}
                  className="bg-gray-800 text-white p-2 w-full rounded"
                  required
                />
              </div>
              {!validateDate(formData.checkoutDate) && formData.checkoutDate && (
                <p className="text-red-500 mt-2">Please enter a valid check-out date.</p>
              )}
              {!isCheckoutAfterCheckin(formData.checkinDate, formData.checkoutDate) && (
                <p className="text-red-500 mt-2">Check-out date must be after the check-in date.</p>
              )}
            </div>
            <button onClick={handleNextStep} className="bg-yellow-500 text-black px-4 py-2 rounded">Next</button>
            </>
        )}
        
        {step === 2 && (
          <>
            <div className="mb-4">
              <label className="block mb-2">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="bg-gray-800 text-white p-2 w-full rounded"
                required
              >
                <option value="" disabled>Select Payment Method</option>
                <option value="bankTransfer">Bank Transfer</option>
                <option value="creditCard">Credit Card</option>
              </select>
            </div>

            {formData.paymentMethod === 'bankTransfer' && (
              <>
                <div className="mb-4">
                  <label className="block mb-2">Bank Name</label>
                  <div className="flex items-center bg-gray-800 p-2 rounded">
                    <Building2 className="text-white mr-2" />
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankDetails.bankName}
                      onChange={handleBankDetailsChange}
                      placeholder="Bank Name"
                      className="bg-gray-800 text-white p-2 w-full rounded"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block mb-2">Account Number</label>
                  <div className="flex items-center bg-gray-800 p-2 rounded">
                    <CreditCard className="text-white mr-2" />
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.bankDetails.accountNumber}
                      onChange={handleBankDetailsChange}
                      placeholder="Account Number"
                      className="bg-gray-800 text-white p-2 w-full rounded"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {formData.paymentMethod === 'creditCard' && (
              <>
                <div className="mb-4">
                  <label className="block mb-2">Card Number</label>
                  <div className="flex items-center bg-gray-800 p-2 rounded">
                    <CreditCard className="text-white mr-2" />
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.creditCardDetails.cardNumber}
                      onChange={handleCreditCardDetailsChange}
                      placeholder="Card Number"
                      className="bg-gray-800 text-white p-2 w-full rounded"
                      required
                    />
                  </div>
                  {!validateCardNumber(formData.creditCardDetails.cardNumber) && formData.creditCardDetails.cardNumber && (
                    <p className="text-red-500 mt-2">Card number must be exactly 16 digits.</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-2">Expiry Date</label>
                  <div className="flex items-center bg-gray-800 p-2 rounded">
                    <CreditCard className="text-white mr-2" />
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.creditCardDetails.expiryDate}
                      onChange={handleCreditCardDetailsChange}
                      placeholder="MM/YY"
                      className="bg-gray-800 text-white p-2 w-full rounded"
                      required
                    />
                  </div>
                  {!validateExpiryDate(formData.creditCardDetails.expiryDate) && formData.creditCardDetails.expiryDate && (
                    <p className="text-red-500 mt-2">Expiry date must be in 'MM/YY' format.</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-2">CVV</label>
                  <div className="flex items-center bg-gray-800 p-2 rounded">
                    <CreditCard className="text-white mr-2" />
                    <input
                      type="text"
                      name="cvv"
                      value={formData.creditCardDetails.cvv}
                      onChange={handleCreditCardDetailsChange}
                      placeholder="CVV"
                      className="bg-gray-800 text-white p-2 w-full rounded"
                      required
                    />
                  </div>
                  {!validateCVV(formData.creditCardDetails.cvv) && formData.creditCardDetails.cvv && (
                    <p className="text-red-500 mt-2">CVV must be 3 or 4 digits.</p>
                  )}
                </div>
              </>
            )}
            <button onClick={prevStep} className="bg-yellow-500 text-black px-4 py-2 rounded mr-2">Back</button>
            <button onClick={handleSubmit} className="bg-yellow-500 text-black px-4 py-2 rounded">Submit</button>
          </>
        )}
      </Modal>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to complete the payment for this reservation?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelPayment}>Cancel</Button>
            <Button onClick={confirmPayment}>Yes, Complete Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default CabinDetails;