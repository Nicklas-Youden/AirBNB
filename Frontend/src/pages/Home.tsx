import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../lib";
import DestinationCard from "../components/DestinationCard";
import Paging from "../components/paging";

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
  const navigate = useNavigate();

  const [airBnbs, setAirBnbs] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [paging, setPaging] = useState({
    pageNumber: 1,
    pageSize: 50,
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

  const handleCardClick = (id: string | number) => {
    navigate(`/destinations/${id}`);
  };

  return (
    <div className="container mx-auto">
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading CapaBNBs...</p>
        </div>
      )}

      {!loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {airBnbs.map((listing) => (
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
    </div>
  );
};

export default Home;
