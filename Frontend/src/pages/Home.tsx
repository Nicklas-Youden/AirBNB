import { useState, useEffect } from "react";
import Icon from "../../lib/icon/icon";
import { useApi } from "../../lib";

interface Listing {
  id: string | number;
  images: string[];
  title: string;
  rating: number;
  city: string;
  country: string;
  price: number;
  roomType: string;
  maxGuests: number;
}

const Home = () => {
  const api = useApi();

  const [airBnbs, setAirBnbs] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAirBnbs = async () => {
      try {
        setLoading(true);
        const data = await api.getAirBNBs();
        if (isMounted && Array.isArray(data)) {
          setAirBnbs(data as Listing[]);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching airBnbs:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAirBnbs();

    return () => {
      isMounted = false;
    };
  }, [api]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Property AirBNBs
      </h1>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading AirBNBs...</p>
        </div>
      )}

      {!loading && (
        <>
          <p className="text-gray-600 mb-6">Showing {airBnbs.length} AirBNBs</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {airBnbs.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {listing.images.length > 0 ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title + " Image"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon
                      type="imageOffOutline"
                      size="96"
                      className="fill-gray-400"
                    />
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
                  <p className="text-gray-600">
                    {listing.city}, {listing.country}
                  </p>
                  <p className="text-gray-600">${listing.price} per night</p>
                  <p className="text-gray-500 text-sm">
                    {listing.roomType} ·
                    <Icon
                      type="accountOutline"
                      size="medium"
                      className="inline-block mr-1"
                    />
                    {listing.maxGuests}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
