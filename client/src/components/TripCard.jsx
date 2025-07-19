import React from 'react'
import { CircleFadingPlus, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router'
import Button from './Button';
import { Navigation } from 'lucide-react';
import { useAuth } from '../contexts/shared/Auth';

const TripCard = ({ country, city, groupType, image, title, price, interest, style, id, bookFunc }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const showTrip = (tripId) => {
        user?.role === "admin" ? navigate(`/admin/trips/${tripId}`) : navigate(`/travels/${tripId}`)
    }

    const shotAuthTrip = () => {
        user ? showTrip(id) : navigate("/auth/login")
    }

    return (
        <div
            className='rounded-lg overflow-hidden shadow-400 flex flex-col w-full duration-2 hover:shadow-100'
        >
            <div className="w-full max-h-48 h-full rounded-t-lg relative">
                <img
                    src={image}
                    alt={`${country}-${interest}`}
                    className="h-full max-w-full w-full object-cover rounded-t-lg"
                    loading='lazy'
                />
                <span className="absolute top-2 right-5 px-3 py-1 bg-white rounded-full text-sm font-semibold text-primary-400 font-karla">
                    {price} $
                </span>
            </div>
            <div className="mt-2 py-3">
                <div className="px-3">
                    <h2 className="text-dark-200 text-lg md:text-xl font-bold font-karla overflow-ellipsis line-clamp-2">
                        {title}
                    </h2>
                    <div className="flex-center mt-1 text-ligh-200 overflow-ellipsis line-clamp-1">
                        <MapPin size={18} />
                        <p className="flex-center gap-1 text-xs ml-2">
                            <span className='overflow-ellipsis line-clamp-1'>{country} ,{" "}{city}</span>
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 px-3 mt-3">
                    <span className="bg-primary-50 text-primary-400 font-semibold font-recursive px-3 py-1 rounded-full text-sm truncate max-w-full duration-2 hover:text-white hover:bg-primary-400 cursor-pointer">
                        {groupType}
                    </span>

                    <span className="bg-pink-50 text-pink-500 px-3 py-1 rounded-full font-semibold text-sm truncate max-w-full duration-2 hover:text-white hover:bg-pink-500 cursor-pointer">
                        {style}
                    </span>
                </div>

            </div>

            <div className="w-full px-3 mb-3 mt-1">
                <Button
                    title="show trip details"
                    leftIcon={<Navigation size={19} />}
                    classContainer={"w-full py-3 bg-primary-200 flex-center gap-1.5 text-white rounded-md hover:bg-primary-400 active:bg-primary-300 duration-2 justify-center"}
                    func={() => shotAuthTrip()}
                />
                {user && (
                    <Button
                        title="book trip"
                        leftIcon={<CircleFadingPlus size={19} />}
                        classContainer={"w-full py-3 bg-dark-100 flex-center gap-1.5 text-white rounded-md hover:bg-dark-300 active:bg-dark-200 duration-2 justify-center mt-1.5"}
                        func={() => bookFunc()}
                    />
                )}
            </div>

        </div>
    )
}

export default TripCard
