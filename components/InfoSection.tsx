import Link from 'next/link';
import { Button } from './ui/button';

const InfoSection = () => {
  return (
    <section className="bg-gray-100 py-16 w-full">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center w-full">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-3xl md:text-5xl font-bold text-center md:text-left">
            The Guest House is the perfect weekend getaway cabin.
          </h2>
        </div>
        <div className="md:w-1/2 space-y-6">
          <div className="bg-white p-8 rounded shadow-md">
            <p className="text-gray-700">
            The Guest House is the perfect weekend get-away housing. Located in Sousse, a renowned tourist governorate in Tunisia, it’s a great escape from the hustle and bustle of the city.
            Discover the rich history, beautiful beaches, and vibrant culture of Sousse. Our guest house offers a unique blend of modern comfort and traditional charm, making it the perfect place to unwind. Enjoy local cuisine, explore historic sites, and relax in our cozy accommodations.
            </p>
          </div>
          <div className="bg-white p-8 rounded shadow-md">
            <p className="text-gray-700">
            Below you’ll find information about the accommodation and what’s included in the price. Don’t hesitate to reach out to us via the contact page if you have any questions around your stay.
            </p>
            <Link href='/dashboard'>
              <Button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded">
                Book now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
