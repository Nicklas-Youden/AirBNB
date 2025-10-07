import Icon from "../../lib/icon/icon";
import { formatPeriod } from "../../lib";

interface Listing {
  _id: string;
  images: string[];
  title: string;
  rating: number;
  city: string;
  country: string;
  price: number;
  roomType: string;
  maxGuests: number;
  available: {
    from: string;
    to: string;
  };
}

interface DestinationCardProps {
  listing: Listing;
  onClick: (id: string | number) => void;
}

const DestinationCard = ({ listing, onClick }: DestinationCardProps) => {
  return (
    <div
      key={listing._id}
      onClick={() => onClick(listing._id)}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {listing.images.length > 0 ? (
          <img
            src={listing.images[0]}
            alt={listing.title + " Image"}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon type="imageOffOutline" size="96" className="fill-gray-400" />
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{listing.title}</h3>
          <div className="flex items-center">
            <Icon type="star" size="small" className="inline-block" />
            {listing.rating}
          </div>
        </div>
        <p className="text-gray-500">
          {listing.city}, {listing.country}
        </p>
        <div className="flex gap-1 items-center">
          <p className="text-gray-800">
            ${listing.price} <span className="text-gray-500">·</span>
          </p>
          <p className="text-gray-500 text-sm">
            {formatPeriod(listing.available.from, listing.available.to, true)}
          </p>
        </div>
        <p className="text-gray-500 text-sm flex items-center">
          <span className="text-gray-800 text-base">{listing.maxGuests}</span>
          <Icon type="accountOutline" size="medium" className="mr-1 center" />·{" "}
          {listing.roomType}
        </p>
      </div>
    </div>
  );
};

export default DestinationCard;
