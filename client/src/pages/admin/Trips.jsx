import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Button from '../../components/Button'
import { Map } from 'lucide-react'
import useAxios from '../../utils/useAxios'
import { BOOKING_API, TRIP_API } from '../../apis/api';
import TripCard from '../../components/TripCard'
import Spinear from '../../components/loaders/Spinear'
import { useAuth } from '../../contexts/shared/Auth'
import Popup from '../../components/Popup';

const Trips = () => {
    const axiosInstance = useAxios();
    const [trips, setTrips] = useState([]);
    const [errorMess, setErrorMess] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const [booking, setbooking] = useState(false);
    const [status, setStatus] = useState({})

    const fetchTrips = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(TRIP_API);
            setTrips(response.data.data);
        } catch (error) {
            setErrorMess(error.message);
            setTrips([]);
        } finally {
            setIsLoading(false)
        }
    };

    const bookTrip = async (tripId) => {
        setbooking(false)
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
        }
    }

    useEffect(() => {
        fetchTrips();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setbooking(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [booking])

    if (isLoading) {
        return (
            <div className="h-dvh w-full">
                <div className="absolute-center">
                    <Spinear />
                </div>
            </div>
        )
    }

    return (
        <div className='w-full relative px-5 pr-9 min-h-lvh'>
            {booking && (
                <Popup
                    message={status.message}
                    code={status.code}
                />
            )}
            <div className="flex-between w-full flex-col sm:flex-row px-3">
                <Header
                    title={`add new trip`}
                    description={"View and generate AI travel plans"}
                />
                <Button
                    title="create a trip"
                    classContainer="bg-primary-200 rounded-md text-white flex-center gap-1.5 hover:bg-primary-400 whitespace-nowrap justify-center cursor-not-allowed"
                    leftIcon={<Map size={19} />}
                    topClass={"sm:w-fit shadow-100 rounded-lg selected-none opacity-40 pointer-events-none"}
                />
            </div>

            {errorMess && (
                <div className="w-full h-full overflow-hidden">
                    <div className="absolute-center">
                        <p className="text-red-200 font-bold text-xl font-recursive">
                            {errorMess}
                        </p>
                    </div>
                </div>
            )}

            <div className="mt-3 w-full overflow-x-hidden">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-2 overflow-y-auto h-full">
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
    )
}

export default Trips