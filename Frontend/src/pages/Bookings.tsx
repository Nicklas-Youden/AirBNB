import DestinationCard from "../components/DestinationCard";
import Paging from "../components/paging";
import { useApi } from "../../lib";
import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

// Type for paginated response
interface PaginatedResponse {
  bookings?: Listing[];
  paging?: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

const Bookings = () => {
  const api = useApi();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [paging, setPaging] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });
  const [currentBookings, setCurrentBookings] = useState<Listing[]>([]);

  const fetchAirBnbs = useCallback(
    async (pageNumber: number = currentPage) => {
      try {
        setLoading(true);

        const response = (await api.getBookings({
          pageNumber,
          pageSize: paging.pageSize,
        })) as PaginatedResponse;
        setCurrentBookings(response.bookings ?? []);
        if (response.paging) {
          setPaging(response.paging);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
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

  const handleCardClick = (id: string | number) => {
    navigate(`/destinations/${id}`);
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold">Current Bookings</h2>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      )}

      {!loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {currentBookings.map((listing) => (
              <DestinationCard
                key={listing._id}
                listing={listing}
                onClick={handleCardClick}
              />
            ))}
          </div>

          <Paging
            currentPage={currentPage}
            totalPages={paging.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* <h2 className="text-2xl font-bold mt-8">Previous Bookings</h2> */}
    </div>
  );
};
export default Bookings;
