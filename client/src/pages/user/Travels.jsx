import React, { useEffect, useState } from 'react'
import Loader2 from '../../components/loaders/Loader2'
import { cn } from '../../utils/util'
import useAxios from '../../utils/useAxios'
import { TRIP_API, BOOKING_API } from '../../apis/api'
import TripCard from '../../components/TripCard'
import { useAuth } from '../../contexts/shared/Auth'
import Popup from '../../components/Popup'
import Loader from '../../components/loaders/Loader'

const Travels = () => {
  const [isloading, setIsloading] = useState(false);
  const [errorMess, setErrorMess] = useState("");
  const axiosInstance = useAxios();
  const [trips, setTrips] = useState([]);
  const [booking, setbooking] = useState(false);
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(false)
  const { user } = useAuth();

  useEffect(() => {
    const fetchTrips = async () => {
      setIsloading(true);
      try {
        const response = await axiosInstance.get(TRIP_API);
        setTrips(response.data.data);
      } catch (error) {
        setErrorMess(error.message);
        setTrips([]);
      } finally {
        setIsloading(false)
      }
    };

    fetchTrips();
  }, [])

  const bookTrip = async (tripId) => {
    setbooking(false);
    setLoading(true);
    try {
      const response = await axiosInstance.post(BOOKING_API, JSON.stringify({
        user_id: user._id,
        trip_id: tripId
      }));
      setStatus({
        code: response.data.stateCode,
        message: response.data.message
      });
    } catch (error) {
      setStatus({
        message: error.response.data.message
      });
    } finally {
      setbooking(true)
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setbooking(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [booking])

  return (
    <div className='h-full pt-10 relative'>
      {booking && (
        <Popup
          message={status.message}
          code={status.code}
        />
      )}
      {loading && (
        <div className="fixed top-0 left-0 bg-black/30 w-full h-full z-30">
          <Loader text="Booking" />
        </div>
      )}
      <div className="mx-auto container px-5 pt-5">
        <div className='my-3'>
          <h2 className="font-recursive text-xl capitalize font-semibold text-dark-200">your adventure await</h2>
          <p className="text-sm text-ligh-200 font-karla">
            All yours trips, right where you need them. check out your travel plans, relive memories, or get ready for something new!
          </p>
        </div>

        <div className={cn("mt-5 min-h-[60vh] h-full py-3", (isloading || errorMess) && "flex flex-col items-center justify-center")}>
          {isloading && (
            <Loader2 />
          )}
          {errorMess && (
            <p className="text-center text-red-200 font-semibold text-lg">
              {errorMess}
            </p>
          )}

          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 ">
            {trips.map((trip) => (
              <TripCard
                key={trip._id}
                id={trip._id}
                country={trip.country}
                city={trip.location.city}
                groupType={trip.groupTypes}
                image={trip.images[0]}
                title={trip.title}
                price={trip.price}
                interest={trip.interests}
                style={trip.travelStyles}
                bookFunc={() => bookTrip(trip._id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Travels