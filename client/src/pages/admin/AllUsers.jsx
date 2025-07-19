import { useEffect, useState, useRef } from 'react'
import Header from '../../components/Header'
import useAxios from '../../utils/useAxios'
import Spinear from '../../components/loaders/Spinear'
import { USERS_API } from '../../apis/api'
import { cn } from '../../utils/util'
import Popup from '../../components/Popup'
import Loader from '../../components/loaders/Loader'
import UserModel from '../../components/UserModel'

const AllUsers = () => {
  const axiosInstance = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMess, setErrorMess] = useState("")
  const [users, setUsers] = useState([]);
  const [state, setstate] = useState({})
  const [delLoading, setDelLoading] = useState(false);
  const [popupMess, setPopupMess] = useState(false);
  const [updateUser, setUpdateUser] = useState(false)
  const [userData, setUserData] = useState(null);
  const [updating, setupdating] = useState(false);
  const modelRef = useRef(null);

  useEffect(() => {
    const handleClickOutModel = (e) => {
      if (updateUser && modelRef.current && !modelRef.current.contains(e.target)) {
        setUpdateUser(false)
      }
    };

    document.addEventListener("mousedown", handleClickOutModel)
    return () => {
      document.removeEventListener("mousedown", handleClickOutModel)
    }
  }, [updateUser])

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(USERS_API);
      setUsers(response.data.data);
    } catch (error) {
      setErrorMess(error.message);
      setUsers([]);
    } finally {
      setIsLoading(false)
    }
  };

  const delUser = async (id) => {
    setDelLoading(true);
    setPopupMess(false)
    try {
      const response = await axiosInstance.delete(`${USERS_API}/${id}`);
      setstate({ code: response.data.stateCode, message: response.data.message })
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id))
    } catch (error) {
      setstate({ message: error.message });
    } finally {
      setDelLoading(false)
      setPopupMess(true)
      setUpdateUser(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // update user if user is updated
  useEffect(() => {
    fetchUsers();    
  }, [updating])
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setPopupMess(false)
    }, 1500);

    return () => { clearTimeout(timer) }
  }, [state])

  const tableHead = ["ID" ,"User", "Email", "Role", "Bookings", "Joined At"]

  const editUser = (user) => {
    setUpdateUser(true);
    setUserData(user);
  }

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
    <div className='relative min-h-dvh'>
      {delLoading && (
        <Loader
          text={"Deleting"}
        />
      )}
      {popupMess && (
        <Popup
          code={state.code}
          message={state.message}
        />
      )}

      {updateUser && (
        <div
          ref={modelRef}
          className="absolute-center max-w-xl w-full px-5"
        >
          <UserModel
            name={userData.name}
            email={userData.email}
            img={userData.image}
            role={userData.role}
            id={userData._id}
            deleteUser={delUser}
            setUpdate={setupdating}
          />
        </div>
      )}

      <div className="flex-between w-full flex-col sm:flex-row px-5 pr-9">
        <Header
          title={`users managment`}
          description={"you have all access on users ,manage ,add ,delete ,sort ,filter etc..."}
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

      {users && (
        <div className="mt-5 px-5 w-full">
          <div className="w-full bg-white p-3 rounded-lg shadow-100 overflow-x-auto">
            <table className='w-full table-auto border-separate border-spacing-y-1.5'>
              <thead className='bg-dark-100 text-white'>
                <tr className='text-white'>
                  {tableHead.map((items, idx) => (
                    <th
                      key={idx}
                      className="px-3 py-2.5 font-semibold font-karla text-left first:rounded-l-md last:rounded-r-md"
                      scope='row'
                    >
                      {items}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="duration-2 hover:bg-ligh-50 w-full font-karla text-sm md:text-base text-gray-600 cursor-pointer even:bg-slate-50"
                    onClick={() => editUser(user)}
                  >
                    <td className="py-1 px-3 rounded-l-lg">
                      {(user._id).slice(0 ,6)}...
                    </td>
                    <td className='py-1 px-3'>
                      <div className="flex-center gap-1.5">
                        <img
                          src={user.image || "/assets/images/dummy.jpg"}
                          alt={user.name}
                          className='size-8 rounded-full object-cover aspect-square'
                          loading="lazy"
                        />
                        <span className="capitalize font-semibold">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-1 px-3">
                      {user.email}
                    </td>
                    <td className='py-1 px-3'>
                      <span className={cn("py-1 px-3 w-fit rounded-full text-white", user.role === "admin" ? "bg-green-500" : "bg-pink-500")}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-1 px-3">
                      <span className={cn("py-1 px-3 text-white  rounded-full", user.bookings.length <= 5 ? "bg-rose-500" : "bg-primary-100")}>
                        {user.bookings.length}
                      </span>
                    </td>
                    <td className="py-1 px-3 text-sm font-semibold whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllUsers