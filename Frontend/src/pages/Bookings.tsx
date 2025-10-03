import DestinationCard from "../components/DestinationCard";
import { useApi } from "../../lib";

const Bookings = () => {
  const api = useApi();

  return (
    <div>
      <h2 className="text-2xl font-bold">Current Bookings</h2>
      <DestinationCard
        key={listing._id}
        listing={listing}
        onClick={handleCardClick}
      />
      <h2 className="text-2xl font-bold">Previous Bookings</h2>
    </div>
  );
};
export default Bookings;
