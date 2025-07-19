import React, { useEffect, useRef, useState } from 'react'
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from '../../contexts/shared/Auth';
import Button from '../../components/Button';
import useAxios from '../../utils/useAxios';
import { BOOKING_API, TRIP_API } from '../../apis/api';
import TripCard from '../../components/TripCard';
import Popup from '../../components/Popup';
import Loader from '../../components/loaders/Loader';
import { cn } from '../../utils/util';
import Loading from '../../components/loaders/Loading';


const Home = () => {
  const { user } = useAuth();
  const [features, setFeatures] = useState([]);
  const [trips, seTtrips] = useState([]);
  const axiosInstance = useAxios();
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [booking, setbooking] = useState(false);
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(false)
  const [isloading, setIsloading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleScroll = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    const fetchTrips = async () => {
      setIsloading(true);
      try {
        const response = await axiosInstance.get(TRIP_API);
        setFeatures(response.data.data.slice(0, 6))
        seTtrips(response.data.data.reverse().slice(0, 8))
      } catch (error) {
        console.error(error.message);
        setErrorMessage(error.response.statusText)
      } finally {
        setIsloading(false);
      }
    }

    fetchTrips()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setbooking(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [booking])

  return (
    <div className="w-full relative">
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
      {isloading && (
        <div className="fixed top-0 left-0 bg-white w-full h-full z-30">
          <Loading />
        </div>
      )}
      {/*    topic   partition  */}

      <div className="w-full h-dvh bg-cover bg-center inset-0 backdrop-blur-sm land"
      >
        <div class="flex flex-col justify-center h-full container mx-auto px-5">
          <h1 class="text-5xl md:text-6xl font-bold main-gradient bg-clip-text text-transparent mb-4">
            Plan Your Trip <br /> with Ease
          </h1>
          <p class="text-dark-200 text-base mb-6 font-recursive">
            Customize your travel itinerary in minutes—pick your <br /> destination, set your preferences, and explore with confidence.
          </p>
          <Button
            title="Start Discovering"
            classContainer="w-fit bg-gradient-to-r from-dark-200 to-primary-200 text-white rounded-lg duration-2"
            func={() => handleScroll()}
          />
        </div>
      </div>

      {/*                 middel     partition          */}

      <div ref={scrollRef} className="w-full overflow-x-hidden px-5 mt-30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-blue-950 text-left mb-2">
            Featured Travel Destinations
          </h2>
          <p className="text-gray-500 text-left mb-8 mt-1">
            Check out some of the best places you can visit around the world.
          </p>

          {errorMessage && (
            <p className="text-red-100 text-center font-recursive">
              {errorMessage}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, index) => (
              <div
                key={index}
                className="relative h-64 rounded-xl overflow-hidden shadow-md group"
              >
                <img
                  src={feat.images[0]}
                  alt={feat.country}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading='lazy'
                />

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent text-white p-4 flex flex-col items-left">
                  <p className="text-base font-semibold font-recursive">
                    {feat.duration}days {feat.travelStyles} in {feat.country}
                  </p>
                  <p className="text-sm text-ligh-50">{feat.interests} Interests</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/*            Thrid  partition                */}

      <div className=" min-h-screen my-6 px-6 mt-30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-blue-950 mb-2">Handpicked Trips</h2>
          <p className="text-gray-500 text-lg mb-10">
            Browse well-planned trips designed for different travel styles and interests
          </p>

          {errorMessage && (
            <p className="text-red-100 text-center font-recursive">
              {errorMessage}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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


        {/* Pagination */}


        <div className="flex flex-col items-center gap-6 my-7">
          <div className="w-full container mx-auto flex-center px-4 justify-center">
            <button
              className={cn("px-7 py-2.5 rounded-lg shadow-400 text-white font-semibold bg-primary-200 hover:bg-primary-400 flex-center gap-1 duration-2 cursor-pointer", errorMessage && "opacity-50 pointer-events-none cursor-none")}
              onClick={() => navigate("/travels")}
            >
              View All <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>

    </div>

  )
}

export default Home
