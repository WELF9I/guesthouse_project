import Image from "next/image";
import image1 from "@/public/about-1.jpg";
import image2 from "@/public/about-2.jpg";

export const metadata = {
  title: "About",
};

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16 bg-slate-100 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 lg:gap-24 text-base md:text-lg items-center">
        <div className="col-span-1 lg:col-span-3 space-y-6 md:space-y-8">
          <h1 className="text-3xl md:text-4xl mb-6 mt-[55px] md:mb-10 text-accent-400 font-medium">
            Welcome to VillaAcapella
          </h1>
          <div className="space-y-4 md:space-y-8">
            <p>
            Discover a serene escape at VillaAcapella, where modern comfort meets the charm of Sousse, Tunisia. Nestled in a picturesque location, our villa offers a tranquil retreat with stunning views of the Mediterranean coast. Here, you can unwind in our elegantly designed accommodations, which blend contemporary style with traditional touches to create a warm and inviting atmosphere.
            While our villa provides a luxurious and cozy base, the true essence of VillaAcapella lies in its beautiful surroundings. Explore the nearby beaches, soak in the vibrant local culture, and enjoy leisurely strolls through charming streets. Relax by the pool, savor delicious local cuisine, or simply enjoy the peaceful ambiance from your private terrace.
            VillaAcapella is more than just a place to stay; it's a gateway to creating unforgettable memories with family and friends. Embrace the relaxed pace of life, enjoy the natural beauty of Sousse, and experience the joy of being together in a truly special setting.
            </p>
            <p>
              This is where memorable moments are made, surrounded by
              nature&apos;s splendor. It&apos;s a place to slow down,
              relax, and feel the joy of being together in a beautiful
              setting.
            </p>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2 mt-8 md:mt-0">
          <Image
            src={image1}
            alt="Family sitting around a fire pit in front of cabin"
            placeholder="blur"
            className="rounded-lg shadow-lg mt-10"
          />
        </div>

        <div className="col-span-1 lg:col-span-2 mt-8 md:mt-0">
          <Image
            src={image2}
            alt="Family that manages The Wild Oasis"
            placeholder="blur"
            className="rounded-lg shadow-lg"
          />
        </div>

        <div className="col-span-1 lg:col-span-3 space-y-6 md:space-y-8 mt-8 md:mt-0">
          <h1 className="text-3xl md:text-4xl mb-6 md:mb-10 text-accent-400 font-medium">
            Booking Now for our fantastic days
          </h1>
          <div className="space-y-4 md:space-y-8">
            <p>
            <span className="text-yellow-600 font-bold">Accommodations:</span> Our villa features a range of beautifully appointed rooms and suites, 
            each designed with your comfort in mind. Enjoy modern amenities, including air conditioning, 
            high-speed internet, and plush bedding. Each room offers breathtaking views, ensuring you wake up to the beauty of Sousse every day.
            </p>
            <p>
            <span className="text-yellow-600 font-bold">Location:</span> Conveniently located near the heart of Sousse, VillaAcapella provides easy access to local attractions such as the Medina of Sousse
            </p>
            <p>
            <span className="text-yellow-600 font-bold">Dining:</span> Experience the flavors of Tunisia with our gourmet dining options. We offer a selection of local and international cuisine, prepared with fresh, locally sourced ingredients. Enjoy your meals in our elegant dining area or on the terrace with stunning views.
            </p>
          </div>
        </div>
      </div>
      <div>
      </div>
    </div>
  );
}

export default About;