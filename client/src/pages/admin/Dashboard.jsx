import React, { useEffect, useState, useCallback } from 'react';
import Header from '../../components/Header';
import { useAuth } from '../../contexts/shared/Auth';
import { Plus, User, Map, BookCheck } from "lucide-react"
import Button from '../../components/Button'
import { useNavigate } from 'react-router';
import StaticBox from '../../components/StaticBox';
import { DASHBOARD_API, BOOKING_API } from "../../apis/api";
import useAxios from '../../utils/useAxios';
import Loader from "../../components/loaders/Loader"
import BarChart from '../../components/BarChart';
import { cn } from '../../utils/util';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleBtnClick = () => {
    navigate("/admin/create-trip")
  }
  const axiosInstance = useAxios();
  const [totalNums, setTotalNums] = useState({});
  const [bookingSummary, setBookingSummary] = useState({})
  const [tripsSummary, setTripsSummary] = useState({})
  const [usersSummary, setUsersSummary] = useState({})
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [latestUsers, setLatestUsers] = useState([])
  const [latestTrips, setLatestTrips] = useState([])
  const [latestBookings, setLatestBookings] = useState([])

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await Promise.all([
        axiosInstance.get(DASHBOARD_API),
        axiosInstance.get(BOOKING_API),
      ]);
      setBookings(response[1].data.data)
      setTotalNums(response[0].data.total);
      setUsersSummary(response[0].data.data.users);
      setTripsSummary(response[0].data.data.trips);
      setBookingSummary(response[0].data.data.booking);
      setLatestUsers(response[0].data.latest.users);
      setLatestTrips(response[0].data.latest.trips);
      setLatestBookings(response[0].data.latest.bookings);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const bookingTable = ["ID", "User Id", "Trip Id", "Destination", "Status", "Booking Date", "Last Update"]


  if (isLoading) {
    return (
      <div className="min-h-screen w-full relative">
        <Loader
          text={"Loading"}
        />
      </div>
    )
  }

  return (
    <div className='relative px-5 pr-7'>
      <div className="flex-between w-full flex-col sm:flex-row">
        <Header
          title={`welcom ${user?.name.split(" ")[0]} 👋`}
          description={"Track activity, trends, and popular destinations in real time"}
        />
        <Button
          title="Create a trip"
          classContainer="bg-primary-200 rounded-md text-white flex-center gap-1.5 hover:bg-primary-400 whitespace-nowrap justify-center"
          leftIcon={<Plus size={19} />}
          topClass={"sm:w-fit"}
          func={handleBtnClick}
        />
      </div>

      <div className="mt-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <StaticBox
            title="Total Users"
            count={totalNums.users}
            icon={<User size={18} />}
            currentMonth={usersSummary.usersMonthSummary.currentMonth}
            lastMonth={usersSummary.usersMonthSummary.lastMonth}
            iconStyle="bg-green-50 text-green-500"
          />

          <StaticBox
            title="Total Trips"
            count={totalNums.trips}
            icon={<Map size={18} />}
            currentMonth={tripsSummary.tripsMonthSummary.currentMonth}
            lastMonth={tripsSummary.tripsMonthSummary.lastMonth}
            iconStyle="bg-red-50 text-red-100"
          />

          <StaticBox
            title="Total Trips"
            count={totalNums.trips}
            icon={<BookCheck size={18} />}
            currentMonth={bookingSummary.bookingMonthSummary.currentMonth}
            lastMonth={bookingSummary.bookingMonthSummary.lastMonth}
            iconStyle="bg-blue-100 text-blue-700"
          />
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 ml-2">
          <h2 className="font-recursive font-bold text-lg text-dark-400">Week Activities</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-4">
          <div className="w-full rounded-lg shadow-100 border-ligh-50 border">
            <div className="p-2">
              <h3 className="font-bold text-base text-dark-200 ml-2 capitalize">
                Visual representation of user states
              </h3>
            </div>
            <BarChart
              dataPoints={usersSummary.usersWeekSummary}
            />
          </div>
          <div className="w-full rounded-lg shadow-100 border-ligh-50 border">
            <div className="p-2">
              <h3 className="font-bold text-base text-dark-200 ml-2 capitalize">
                Visual representation of trips states
              </h3>
            </div>
            <BarChart
              dataPoints={tripsSummary.tripsWeekSummary}
              color='#ff543d'
            />
          </div>
          <div className="w-full sm:col-span-2 md:col-span-1 rounded-lg shadow-100 border-ligh-50 border">
            <div className="p-2">
              <h3 className="font-bold text-base text-dark-200 ml-2 capitalize">
                Visual representation of bookings states
              </h3>
            </div>
            <BarChart
              dataPoints={bookingSummary.bookinWeekSummary}
              color='#027a48'
            />
          </div>
        </div>
      </div>

      <div className="my-7">
        <div className="ml-2">
          <h2 className="font-recursive font-bold text-lg text-dark-400">Users Bookings</h2>
        </div>
 
      </div>

      <div className="my-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-2 rounded-md shadow-100 duration-3 hover:shadow-200">
            <div className="mb-2 ml-2 border-b border-b-ligh-50 pb-1.5">
              <h2 className="font-bold text-lg main-gradient w-fit special">
                Latest Users :
              </h2>
            </div>

            <div>
              <div className="mt-2">
                <div>
                  {latestUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex-center gap-1.5 durations-2 hover:bg-ligh-50 px-3 py-1 rounded-lg"
                    >
                      <div className="size-9 rounded-full">
                        <img
                          src={user.image || "/assets/images/dummy.jpg"}
                          alt="user img"
                          className='w-full rounded-full object-cover aspect-square'
                        />
                      </div>
                      <div className="">
                        <p className="font-karla font-semibold text-dark-200">
                          {user.name}
                        </p>
                        <p className="text-xs text-ligh-200 -mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-2 rounded-md shadow-100 duration-3 hover:shadow-200">
            <div className="mb-2 ml-2 border-b border-b-ligh-50 pb-1.5">
              <h2 className="font-bold text-lg main-gradient w-fit special">
                Latest Trips :
              </h2>
            </div>
            <div className="mt-2">
              <div>
                {latestTrips.map((trip) => (
                  <div
                    key={trip._id}
                    className="px-3 py-1 duration-2 flex-between hover:bg-ligh-50 rounded-lg"
                  >
                    <div className="flex-center gap-2">
                      <img
                        src={trip.images[0]}
                        alt="trip"
                        className='size-10 rounded-full object-cover object-center'
                        loading='lazy'
                      />
                      <div>
                        <p className="font-semibold text-dark-200 font-karla">
                          {trip.country}
                        </p>
                        <p className="text-sm -mt-0.5">
                          <span className="underline text-primary-400 font-semibold">{trip.duration} days</span> - <span className="text-ligh-200">{trip.groupTypes}</span>
                        </p>
                      </div>
                    </div>
                    <p className="px-3 py-1 bg-primary-200 text-white rounded-full text-xs">
                      {trip.price}$
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Dashboard
