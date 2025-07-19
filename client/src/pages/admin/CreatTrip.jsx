import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { Map, Telescope } from 'lucide-react';
import ComboBoxField from '../../components/ComboBoxField';
import {
  travelStyles,
  interests,
  groupTypes,
  countries,
  tripDurations
} from '../../constants/trip';
import { TRIP_API } from '../../apis/api';
import useAxios from '../../utils/useAxios';
import Popup from '../../components/Popup';
import { useNavigate } from "react-router"
import Loader from '../../components/loaders/Loader';

const CreatTrip = () => {
  const [country, setCountry] = useState("");
  const [groupType, setGroupType] = useState("")
  const [interest, setInterest] = useState("")
  const [duration, setDuration] = useState("")
  const [style, setStyle] = useState("");
  const [genrating, setGenrating] = useState(false);
  const axiosInstance = useAxios();
  const [status, setStatus] = useState({});
  const [popupMess, setPopupMess] = useState(false);
  const navgiate = useNavigate();

  const genrateTrip = async () => {
    setGenrating(true);
    setPopupMess(false);
    try {
      const response = await axiosInstance.post(TRIP_API,
        JSON.stringify({
          country,
          groupType,
          interest,
          duration,
          style,
        })
      );
      setStatus({
        message: response.data.message,
        code: response.data.stateCode,
      })
    } catch (error) {
      console.log(error)
      setStatus({
        message: error.message,
      })
    } finally {
      setGenrating(false);
      setPopupMess(true);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setPopupMess(false);
      status.code === 201 ? navgiate("/admin/trips") : ""
    }, 2000);

    return () => clearTimeout(timer);
  }, [status])

  return (
    <div className='relative px-5'>
      {genrating && (
        <Loader 
          text={"Generating"}
        />
      )}
      {popupMess && (
        <Popup
          code={status.code}
          message={status.message}
        />
      )}
      <div className="flex-between w-full flex-col sm:flex-row">
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

      <div className="mt-5 max-w-4xl mx-auto p-5 rounded-lg shadow-100 bg-white">
        <form
          className='space-y-1.5'
          onSubmit={genrateTrip}
        >
          <ComboBoxField
            label="country"
            placeholder="select a country..."
            options={countries}
            onchange={(val) => setCountry(val)}
          />
          <ComboBoxField
            label="travel style"
            placeholder="Select your travel style"
            options={travelStyles}
            onchange={(val) => setStyle(val)}
          />
          <ComboBoxField
            label="duration"
            placeholder="select a duration time..."
            options={tripDurations}
            onchange={(val) => setDuration(val)}
          />
          <ComboBoxField
            label="interests"
            placeholder="Select your travel style"
            options={interests}
            onchange={(val) => setInterest(val)}
          />
          <ComboBoxField
            label="group types"
            placeholder="Select a group type"
            options={groupTypes}
            onchange={(val) => setGroupType(val)}
          />
        </form>

        <div className="mt-5 mx-7">
          <Button
            title="Genrate trip"
            classContainer="bg-primary-100 text-white rounded-lg flex-center justify-center gap-2 py-4 hover:bg-primary-400"
            leftIcon={<Telescope size={19} />}
            func={genrateTrip}
            type='submit'
          />
        </div>
      </div>
    </div>

  )
}

export default CreatTrip