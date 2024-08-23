import { UsersIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

interface Cabin {
  id: string;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  image: string;
  status: 'available' | 'not available';
}

export default function CabinCard({ cabin }: { cabin: Cabin }) {
  const { id, name, maxCapacity, regularPrice, discount, image, status } = cabin;

  return (
    <div className="flex border-primary-800 border">
      <div className="flex-1 relative">
        <Image
          className="flex-1 border-r border-primary-800 object-cover"
          src={image}
          alt={`Cabin ${name}`}
          fill={true}
        />
      </div>

      <div className="flex-grow">
        <div className="pt-5 pb-4 px-7 bg-primary-950">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-accent-500 font-semibold text-2xl">
              Cabin {name}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              status === 'available' ? 'bg-green-500 text-green-100' : 'bg-red-500 text-red-100'
            }`}>
              {status}
            </span>
          </div>

          <div className="flex gap-3 items-center mb-2">
            <UsersIcon className="h-5 w-5 text-primary-600" />
            <p className="text-lg text-primary-200">
              For up to{" "}
              <span className="font-bold">{maxCapacity}</span>{" "}
              guests
            </p>
          </div>

          <p className="flex gap-3 justify-end items-baseline">
            {discount > 0 ? (
              <Fragment>
                <span className="text-3xl font-[350]">
                  ${regularPrice - discount}
                </span>
                <span className="line-through font-semibold text-primary-600">
                  ${regularPrice}
                </span>
              </Fragment>
            ) : (
              <span className="text-3xl font-[350]">
                ${regularPrice}
              </span>
            )}
            <span className="text-primary-200">/ night</span>
          </p>
        </div>

        <div className="bg-primary-950 border-t border-t-primary-800 text-right">
          {status === 'available' ? (
            <Link
              href={`/cabins/${id}`}
              className="border-l border-primary-800 py-4 px-6 inline-block hover:bg-accent-600 transition-all hover:text-primary-900"
            >
              Details & reservation &rarr;
            </Link>
          ) : (
            <span className="border-l border-primary-800 py-4 px-6 inline-block text-primary-600 cursor-not-allowed">
              Not available
            </span>
          )}
        </div>
      </div>
    </div>
  );
}