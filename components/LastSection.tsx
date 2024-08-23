import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Wifi, User, Utensils } from 'lucide-react'
import Link from 'next/link';

const info = [
  {
    icon: <Wifi className="size-14 text-orange-500 mr-3" />,
    label: "High-Speed Internet",
    description: "Enjoy fast and reliable Wi-Fi throughout the property, ensuring you stay connected whether you're working or streaming your favorite content."
  },
  {
    icon: <User className="size-14 text-orange-500 mr-3" />,
    label: "Personalized Service",
    description: "Experience exceptional service with our attentive staff dedicated to making your stay comfortable and enjoyable, attending to your needs with a personal touch."
  },
  {
    icon: <Utensils className="size-14 text-orange-500 mr-3" />,
    label: "Gourmet Dining",
    description: "Indulge in a range of delicious dining options, including gourmet meals prepared with fresh, high-quality ingredients, available both on-site and through room service."
  }
];

const LastSection = () => {
  return (
    <div className="container mx-auto px-4 py-16 ">
      <div className="mb-16">
        <Image
          src="/house_img.jpeg"
          alt="Modern interior with white cabinet"
          width={1000}
          height={600}
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 flex items-center">
          <span className="w-8 h-1 bg-orange-500 mr-3"></span>
          Come together.
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl">
        Join us for an unforgettable experience where community and comfort blend seamlessly. Our venue offers a warm and inviting atmosphere designed to bring people together. Whether you're looking to enjoy a casual gathering or a more formal event, we provide an elegant setting with top-notch amenities.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {info.map((item)=>{
            return(
              <div className="flex items-start">
                  {item.icon}
                  <div>
                    <h3 className="font-semibold mb-2">{item.label}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
            );
          })}

        </div>
      </div>

      <div className="text-center py-16 bg-gray-100 rounded-lg">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
          <span className="w-8 h-1 bg-orange-500 mr-3"></span>
          We're already booked up for the spring — hurry up & secure your stay for the summer.
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
        Due to high demand, our spring availability is fully booked. Don’t miss out on the opportunity to experience our top-rated accommodations during the summer season. Reserve your spot now to enjoy a perfect summer getaway, filled with relaxation and exclusive amenities. 
        Book early to ensure you secure your preferred dates and make the most of your stay with us.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/contact">
            <Button variant="outline">Contact</Button>
          </Link>
          <Link href='/dashboard'>
            <Button>Book now</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LastSection