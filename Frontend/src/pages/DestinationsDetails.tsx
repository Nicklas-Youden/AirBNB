import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  formatPeriodWithWeekday,
  LoginDialog,
  useApi,
  useAuthContext,
} from "../../lib";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import Icon from "../../lib/icon/icon";

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
  occupied: boolean;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
}

const DestinationDetail = () => {
  const { destinationId } = useParams<{ destinationId: string }>();
  const navigate = useNavigate();
  const api = useApi();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllImages, setShowAllImages] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState({
    open: false,
    error: false,
  });
  const { isAuthenticated } = useAuthContext();

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const guests = formData.get("guests") as string;

    try {
      await api.createBooking({
        destinationId,
        userId: user?.id,
        email,
        guests: parseInt(guests),
      });
      await fetchDestination();
      setOpenBookingDialog(false);
      setOpenConfirmationDialog({ open: true, error: false });
    } catch (error) {
      console.error("Booking error:", error);
      setOpenConfirmationDialog({ open: true, error: true });
    }
  };

  const fetchDestination = useCallback(async () => {
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
  }, [destinationId, api]);

  useEffect(() => {
    fetchDestination();
  }, [fetchDestination]);

  const renderImages = () => {
    if (!destination?.images || destination.images.length === 0) {
      return (
        <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center mb-8">
          <Icon type="imageOffOutline" size="96" className="fill-gray-400" />
        </div>
      );
    }

    const images = destination.images;

    if (images.length === 1) {
      return (
        <div className="w-full h-96 rounded-lg overflow-hidden mb-8">
          <img
            src={images[0]}
            alt={destination.title}
            className="w-full h-full object-cover "
          />
        </div>
      );
    }

    if (images.length === 2) {
      return (
        <div className="grid gap-2 h-96 rounded-lg overflow-hidden mb-8 grid-cols-2 grid-rows-1">
          <img
            src={images[0]}
            alt={destination.title}
            className="w-full h-full object-cover"
          />

          <img
            src={images[1]}
            alt={destination.title}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    if (images.length >= 3) {
      return (
        <div className="grid gap-2 h-96 rounded-lg overflow-hidden mb-8 grid-cols-3 grid-rows-2">
          <div className="col-start-1 col-end-3 row-start-1 row-end-3">
            <img
              src={images[0]}
              alt={destination.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="col-start-3 col-end-4 row-start-1 row-end-2">
            <img
              src={images[1]}
              alt={destination.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="col-start-3 col-end-4 row-start-2 row-end-3 relative overflow-hidden">
            <img
              src={images[2]}
              alt={destination.title}
              className="w-full h-full object-cover"
            />
            <Button
              variant="contained"
              color="info"
              size="small"
              onClick={() => setShowAllImages(true)}
              sx={{
                position: "absolute",
                bottom: "8px",
                right: "8px",
                zIndex: 10,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                color: "#000",
                fontSize: "12px",
                fontWeight: 500,
                padding: "4px 8px",
                minWidth: "auto",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 1)",
                },
              }}
            >
              Show all pictures
            </Button>
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated) {
        return;
      }

      try {
        const response = (await api.getUserProfile()) as UserProfile;
        setUser(response);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, api]);

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
    <>
      {/* Images Section */}
      {renderImages()}

      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
        <div className="md:col-span-1 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-3xl font-bold text-gray-800">
              {destination.title}
            </h1>
            <div className="flex items-center">
              <Icon type="star" size="medium" className="mr-1" />
              <span className="text-lg font-medium">{destination.rating}</span>
            </div>
          </div>

          <div className="border-b pb-2 border-b-gray-300">
            <div className="flex flex-wrap gap-4 text-gray-800">
              <span className="flex self-center gap-1">
                {destination.maxGuests}{" "}
                <Icon
                  type="accountOutline"
                  size="medium"
                  className="inline-block"
                />
              </span>
              •
              <span className="flex self-center gap-1">
                {destination.bedRooms}{" "}
                <Icon
                  type="homeOutline"
                  size="medium"
                  className="inline-block"
                />
              </span>
              •
              <span className="flex self-center gap-1">
                {destination.beds}{" "}
                <Icon
                  type="bedDoubleOutline"
                  size="medium"
                  className="inline-block"
                />
              </span>
              •
              <span className="flex self-center gap-1">
                {destination.bathRooms}{" "}
                <Icon type="toilet" size="medium" className="inline-block" />
              </span>
            </div>
          </div>

          <div className="border-b pb-2 border-b-gray-300">
            <h3 className="text-xl font-semibold mb-2">Location</h3>
            <p className="text-gray-800">
              {destination.address}, {destination.city}, {destination.country}
            </p>
          </div>
        </div>

        <div className="md:col-span-1 md:row-span-2">
          <div className="sticky top-24 border rounded-lg p-6 shadow-lg">
            <div className="mb-4 text-2xl font-bold">${destination.price}</div>

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
                <span className="font-medium">{destination.roomType}</span> for
                up to{" "}
                <span className="font-medium">
                  {destination.maxGuests} guests
                </span>
              </p>
            </div>

            {destination.occupied ? (
              <Button
                size="large"
                variant="contained"
                disabled
                className="w-full max-w-56"
              >
                Occupied
              </Button>
            ) : isAuthenticated ? (
              <Button
                size="large"
                variant="contained"
                className="w-full max-w-56"
                onClick={() => setOpenBookingDialog(true)}
              >
                Reserve
              </Button>
            ) : (
              <Button
                size="large"
                variant="contained"
                className="w-full max-w-56"
                onClick={() => setOpenLoginDialog(true)}
              >
                Login to Reserve
              </Button>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 border-t pt-4 border-t-gray-300 md:border-t-0 md:pt-0 ">
          <h3 className="text-xl font-semibold mb-2">About this place</h3>
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

      <LoginDialog
        open={openLoginDialog}
        onClose={() => setOpenLoginDialog(false)}
      />

      <Dialog
        fullWidth
        maxWidth="lg"
        open={showAllImages}
        onClose={() => setShowAllImages(false)}
      >
        <DialogTitle>All Images</DialogTitle>
        <DialogContent>
          <div className="columns-2 lg:columns-3 gap-4 space-y-4">
            {destination.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full h-auto rounded-lg break-inside-avoid mb-4"
              />
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAllImages(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openBookingDialog}
        onClose={() => setOpenBookingDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <span className="font-bold text-lg">{destination.title}</span>
          </DialogContentText>

          <DialogContentText>Price: ${destination.price}</DialogContentText>
          <DialogContentText>
            Availability:{" "}
            {formatPeriodWithWeekday(
              destination.available.from,
              destination.available.to
            )}
          </DialogContentText>
          <DialogContentText>Address: {destination.address}</DialogContentText>

          <form onSubmit={handleBooking} id="booking-form">
            <div className="flex gap-4 pt-4">
              <TextField
                name="email"
                id="email"
                label="Email"
                variant="outlined"
                defaultValue={user?.email || ""}
                fullWidth
                required
              />
              <TextField
                type="number"
                name="guests"
                id="guests"
                label="Number of Guests"
                variant="outlined"
                defaultValue={1}
                fullWidth
                required
                inputProps={{
                  min: 1,
                  max: destination.maxGuests,
                }}
              />
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            form="booking-form"
          >
            Book
          </Button>
          <Button onClick={() => setOpenBookingDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        maxWidth="sm"
        fullWidth
        open={openConfirmationDialog.open}
        onClose={() => setOpenConfirmationDialog({ open: false, error: false })}
      >
        <div className="flex justify-center flex-col items-center p-8">
          <DialogTitle>Booking Confirmation</DialogTitle>
          <Icon
            type={
              openConfirmationDialog.error
                ? "alertCircleOutline"
                : "checkCircleOutline"
            }
            size="96"
            className={` ${
              openConfirmationDialog.error ? "fill-red-500" : "fill-green-500"
            }`}
          />
          <DialogContent>
            <p className="text-center text-lg">
              {openConfirmationDialog.error
                ? "There was an error processing your booking. Please try again."
                : "Your booking was successful!"}
            </p>
          </DialogContent>
          <Button
            variant="outlined"
            onClick={() =>
              setOpenConfirmationDialog({ open: false, error: false })
            }
          >
            Close
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default DestinationDetail;
