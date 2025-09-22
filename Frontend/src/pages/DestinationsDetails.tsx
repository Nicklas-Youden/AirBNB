import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Icon from "../../lib/icon/icon";
import { formatPeriodWithWeekday, useApi } from "../../lib";
import { Button } from "@mui/material";

interface Destination {
  id: string | number;
  title: string;
  description: string;
  images: string[];
  rating: number;
  maxGuests: number;
  bedRooms: number;
  beds: number;
  bathRooms: number;
  address: string;
  city: string;
  country: string;
  price: number;
  roomType: string;
  amenities: string[];
  available: {
    from: string;
    to: string;
  };
}

const DestinationDetail = () => {
  const { destinationId } = useParams<{ destinationId: string }>();
  const navigate = useNavigate();
  const api = useApi();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestination = async () => {
      if (!destinationId) {
        setError("No destination ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = (await api.getSingleAirBNB(
          destinationId
        )) as Destination;
        setDestination(response);
      } catch (err) {
        console.error("Error fetching destination:", err);
        setError("Failed to load destination details");
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [destinationId, api]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-gray-600">Loading destination details...</p>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-red-600  font-bold">
            {error || "Destination not found"}
          </p>
          <div className="mt-4">
            <Button
              onClick={() => navigate("/")}
              variant="outlined"
              color="primary"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8">
      <div className="md:col-span-1 lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {destination.title}
          </h1>
          <div className="flex items-center">
            <Icon type="star" size="medium" className="mr-1" />
            <span className="text-lg font-medium">{destination.rating}</span>
          </div>
        </div>

        <div className="border-b pb-6 border-b-gray-300">
          <div className="flex flex-wrap gap-4 text-gray-800">
            <span>{destination.maxGuests} guests</span>
            <span>•</span>
            <span>{destination.bedRooms} bedrooms</span>
            <span>•</span>
            <span>{destination.beds} beds</span>
            <span>•</span>
            <span>{destination.bathRooms} bathrooms</span>
          </div>
        </div>

        <div className="border-b pb-6 border-b-gray-300">
          <h3 className="text-xl font-semibold mb-2">Location</h3>
          <p className="text-gray-800">
            {destination.address}, {destination.city}, {destination.country}
          </p>
        </div>
      </div>

      <div className="md:col-span-1 md:row-span-2">
        <div className="sticky top-8 border rounded-lg p-6 shadow-lg">
          <div className="mb-4">
            <span className="text-2xl font-bold">${destination.price}</span>
            <span className="text-gray-600"> / night</span>
          </div>

          <div className="mb-4">
            <h4 className="font-medium mb-2">Availability</h4>
            <p className="text-sm text-gray-600">
              {formatPeriodWithWeekday(
                destination.available.from,
                destination.available.to
              )}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">{destination.roomType}</span> for up
              to{" "}
              <span className="font-medium">
                {destination.maxGuests} guests
              </span>
            </p>
          </div>

          <Button size="large" variant="contained" className="w-full max-w-56">
            Reserve
          </Button>
        </div>
      </div>

      <div className="lg:col-span-2 border-t pt-6 border-t-gray-300 md:border-t-0 md:pt-0 ">
        <h3 className="text-xl font-semibold mb-4">About this place</h3>
        <p className=" leading-relaxed">{destination.description}</p>
      </div>

      <div className="lg:col-span-3 md:col-span-2 col-span-1 border-t pb-6 pt-4 border-t-gray-300">
        <h3 className="text-xl font-semibold mb-4">Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 pb-8 gap-4">
          {destination.amenities.map((amenity, index) => (
            <div key={index} className="flex items-center">
              <span className="mr-2 text-green-500">✓</span>
              <span className="text-gray-800">{amenity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
