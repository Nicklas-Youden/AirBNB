import DestinationCard from "../components/DestinationCard";
import Paging from "../components/paging";
import { useApi } from "../../lib";
import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab, Box } from "@mui/material";

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
  stayEnded: boolean;
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
  const [currentPaging, setCurrentPaging] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });
  const [currentBookings, setCurrentBookings] = useState<Listing[]>([]);
  const [previousBookings, setPreviousBookings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  const fetchCapaBnbs = useCallback(
    async (pageNumber: number = currentPage) => {
      try {
        setLoading(true);

        const response = (await api.getBookings({
          pageNumber,
          pageSize: currentPaging.pageSize,
        })) as PaginatedResponse;

        const allBookings = response.bookings ?? [];
        setCurrentBookings(allBookings.filter((booking) => !booking.stayEnded));
        setPreviousBookings(allBookings.filter((booking) => booking.stayEnded));

        if (response.paging) {
          setCurrentPaging(response.paging);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    },
    [api, currentPage, currentPaging.pageSize]
  );

  useEffect(() => {
    fetchCapaBnbs();
  }, [fetchCapaBnbs]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    fetchCapaBnbs(pageNumber);
  };

  const handleCardClick = (id: string | number) => {
    navigate(`/destinations/${id}`);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <div className="pb-8">
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      )}

      {!loading && (
        <>
          <Box className="mb-4">
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label={`Current Bookings (${currentBookings.length})`} />
              <Tab label={`Previous Bookings (${previousBookings.length})`} />
            </Tabs>
          </Box>
          {activeTab === 0 && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                {currentBookings.map((listing) => (
                  <DestinationCard
                    key={listing._id}
                    listing={listing}
                    onClick={handleCardClick}
                  />
                ))}
              </div>
              {currentBookings.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No current bookings found.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 1 && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                {previousBookings.map((listing) => (
                  <DestinationCard
                    key={listing._id}
                    listing={listing}
                    onClick={handleCardClick}
                  />
                ))}
              </div>
              {previousBookings.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No previous bookings found.</p>
                </div>
              )}
            </div>
          )}

          <Paging
            currentPage={currentPage}
            totalPages={currentPaging.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};
export default Bookings;
