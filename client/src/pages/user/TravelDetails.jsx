import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useAxios from '../../utils/useAxios';
import { TRIP_API } from '../../apis/api';
import Spinear from '../../components/loaders/Spinear';
import { CalendarRange, MapPin } from 'lucide-react';
import { cn } from '../../utils/util';
import LeafletMap from '../../components/LeafletMap';

const TravelDetails = () => {
    const { travelId } = useParams();
    const [trip, setTrip] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const axiosInstance = useAxios();

    useEffect(() => {
        const getTripById = async () => {
            try {
                setIsLoading(true);
                const tripData = await axiosInstance.get(`${TRIP_API}/${travelId}`);
                setTrip(tripData.data.data);
                console.log(tripData.data.data)
            } catch (error) {
                console.error('Error fetching trip:', error);
            } finally {
                setIsLoading(false);
            }
        }

        getTripById()
    }, [travelId])

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
        <div className='min-h-screen relative py-10'>
            <div className="pt-5">
                {trip && (
                    <div className="w-full mt-5">
                        <div className="mx-auto container px-5">
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-dark-300 font-karla">
                                    {trip.title}
                                </h1>

                                <div className="flex-center mt-1">
                                    <p className="flex-center gap-1.5 text-dark-400">
                                        <CalendarRange size={18} />
                                        <span className="text-ligh-200">
                                            {trip.duration} days plan
                                        </span>
                                    </p>

                                    <p className="flex-center gap-1.5 ml-9 text-dark-400">
                                        <MapPin size={18} />
                                        <span className="text-ligh-200">
                                            {trip.country} ,
                                            {trip.location.city}
                                        </span>
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-2 mt-3">
                                    {trip.images.map((url, idx) => (
                                        <img
                                            key={idx}
                                            src={url}
                                            loading='lazy'
                                            alt="trip img"
                                            className={cn('w-full object-cover rounded-lg', idx === 1 ? 'md:col-span-2 md:row-span-2 h-[330px]'
                                                : 'md:row-span-1 h-[160px]')}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="my-4 flex-center gap-2">
                                <div className="px-4 py-1.5 rounded-full bg-navy-50 text-navy-500 text-sm md:text-base font-recursive font-semibold duration-2 hover:bg-navy-500 hover:text-navy-50">
                                    {trip.interests}
                                </div>
                                <div className="px-4 py-1.5 rounded-full bg-primary-50 text-primary-400 text-sm md:text-base font-recursive font-semibold duration-2 hover:bg-primary-400 hover:text-primary-50">
                                    {trip.groupTypes}
                                </div>
                                <div className="px-4 py-1.5 rounded-full bg-pink-50 text-pink-500 text-sm md:text-base font-recursive font-semibold hover:bg-pink-500 hover:text-pink-50 duration-2">
                                    {trip.travelStyles}
                                </div>
                            </div>

                            <div className="my-4">
                                <h3 className="text-lg md:text-xl font-bold font-recursive capitalize main-gradient">
                                    Spend {trip.duration} days in {trip.country}, exploring {trip.interests} with a {trip.travelStyles} style – perfect for {trip.groupTypes} travelers.

                                </h3>

                                <p className="my-5 text-base font-karla text-ligh-200">
                                    {trip.description}
                                </p>
                            </div>

                            <div className="mt-3">
                                <p className="text-xl font-semibold capitalize text-dark-300 font-recursive">
                                    Explore {trip.country} in {trip.duration}-Days with {trip.travelStyles} style.
                                </p>
                                <div className="mt-1">
                                    {trip.itinerary.map((item, idx) => (
                                        <div
                                            className="not-first:border-t py-2 border-t-ligh-50"
                                            key={idx}
                                        >
                                            <p className="text-lg text-dark-200 main-gradient special">
                                                Day {item.day}: {item.location}
                                            </p>
                                            {item.activities.map((active, i) => (
                                                <ul
                                                    className="pl-4.5"
                                                    key={i}
                                                >
                                                    <p className="font-semibold text-lg capitalize text-primary-100">- {active.time}</p>
                                                    <li className="list-disc list-inside ml-1 text-sm text-ligh-200">{active.description}</li>
                                                </ul>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-5">
                                <p className="text-xl font-semibold capitalize text-dark-300 font-recursive">
                                    Best Time to Visit:
                                </p>

                                <ul className="mt-1">
                                    {trip.bestTimeToVisit.map((time, i) => (
                                        <li
                                            key={i}
                                            className="pl-2 list-inside list-disc text-base text-ligh-200"
                                        >
                                            {time}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="w-full my-5">
                                <LeafletMap
                                    coordinates={trip.location.coordinates}
                                    zoom={4}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TravelDetails