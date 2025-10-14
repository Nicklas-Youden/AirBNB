import DestinationCard from "../components/DestinationCard";
import Paging from "../components/Paging";
import { useApi } from "../../lib";
import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab, Box } from "@mui/material";

interface Listing {
  _id: string;
  bookingId: string; // The actual booking ID for cancellation
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
  const [paging, setPaging] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    stayEnded: false,
  });
  const [currentBookings, setCurrentBookings] = useState<Listing[]>([]);
  const [previousBookings, setPreviousBookings] = useState<Listing[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  const removeDuplicateDestinations = (bookings: Listing[]): Listing[] => {
    const seen = new Set<string>();
    return bookings.filter(
      (booking) => !seen.has(booking._id) && seen.add(booking._id)
    );
  };

  const fetchCapaBnbs = useCallback(
    async (pageNumber: number = 1, bookingType?: "current" | "past") => {
      try {
        setLoading(true);

        const params: Record<string, string | number | boolean> = {
          pageNumber,
          pageSize: paging.pageSize,
        };

        if (bookingType) {
          params.bookingType = bookingType;
        }

        const response = (await api.getBookings(params)) as PaginatedResponse;

        const allBookings = response.bookings ?? [];

        const processBookings = (bookings: Listing[], type?: string) => {
          const filtered = removeDuplicateDestinations(bookings);
          if (response.paging) {
            const totalPages = Math.max(
              1,
              Math.ceil(filtered.length / response.paging.pageSize)
            );
            setPaging({
              ...response.paging,
              totalCount: filtered.length,
              totalPages,
              stayEnded: type === "past",
            });
          }
          return filtered;
        };

        if (bookingType === "current") {
          setCurrentBookings(processBookings(allBookings, "current"));
          setPreviousBookings([]);
        } else if (bookingType === "past") {
          setPreviousBookings(processBookings(allBookings, "past"));
          setCurrentBookings([]);
        } else {
          const current = processBookings(
            allBookings.filter((b) => !b.stayEnded),
            "current"
          );
          const previous = processBookings(
            allBookings.filter((b) => b.stayEnded),
            "past"
          );
          setCurrentBookings(current);
          setPreviousBookings(previous);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    },
    [api, paging.pageSize]
  );

  useEffect(() => {
    fetchCapaBnbs(1);
  }, [fetchCapaBnbs]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    fetchCapaBnbs(pageNumber, activeTab === 0 ? "current" : "past");
  };

  const handleCardClick = (id: string | number) => {
    navigate(`/destinations/${id}`);
  };

  const handleCancel = async (bookingId: string | number) => {
    try {
      await api.cancelBooking(bookingId.toString());
      fetchCapaBnbs(currentPage, activeTab === 0 ? "current" : "past");
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setCurrentPage(1);
    fetchCapaBnbs(1, newValue === 0 ? "current" : "past");
  };

  return (
    <div className="pb-8">
      <Box className="mb-4">
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab className="normal-case text-lg" label={"Current Bookings "} />
          <Tab className="normal-case text-lg" label={"Previous Bookings"} />
        </Tabs>
      </Box>
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      )}

      {!loading && (
        <>
          {activeTab === 0 && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                {currentBookings.map((listing) => (
                  <DestinationCard
                    key={listing._id}
                    listing={listing}
                    onClick={handleCardClick}
                    onCancel={handleCancel}
                    Options={{ cancelButton: true }}
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
            totalPages={paging.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};
export default Bookings;
