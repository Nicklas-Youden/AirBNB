import { useState, useEffect, useCallback } from "react";
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

// Type for paginated response
interface PaginatedResponse {
  destinations?: Listing[];
  paging?: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

const Home = () => {
  const api = useApi();

  const [airBnbs, setAirBnbs] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [paging, setPaging] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });

  const fetchAirBnbs = useCallback(
    async (pageNumber: number = currentPage) => {
      try {
        setLoading(true);

        const response = (await api.getAirBNBs({
          pageNumber,
          pageSize: paging.pageSize,
        })) as PaginatedResponse;
        setAirBnbs(response.destinations ?? []);
        if (response.paging) {
          setPaging(response.paging);
        }
      } catch (err) {
        console.error("Error fetching airBnbs:", err);
      } finally {
        setLoading(false);
      }
    },
    [api, currentPage, paging.pageSize]
  );

  useEffect(() => {
    fetchAirBnbs();
  }, [fetchAirBnbs]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    fetchAirBnbs(pageNumber);
  };

  const getPaginationPages = (
    currentPage: number,
    totalPages: number,
    maxPages: number = 10
  ): number[] => {
    if (totalPages <= maxPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    let start = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let end = start + maxPages - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxPages + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

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
                    <Icon
                      type="accountOutline"
                      size="medium"
                      className="inline-block mr-1"
                    />
                    {listing.maxGuests} · {listing.roomType}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center items-center space-x-2">
            <div className="flex space-x-1">
              {getPaginationPages(currentPage, paging.totalPages).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 border rounded-md ${
                      pageNum === currentPage
                        ? "bg-gray-100 border-gray-300"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
