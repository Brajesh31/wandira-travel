import React, { useState, useEffect } from 'react'
import Button from './Button'
import InputField from './InputField'
import useAxios from '../utils/useAxios';
import { Upload, Trash2, ShieldCheck } from 'lucide-react';
import { USERS_API } from '../apis/api';


const UserModel = ({ name, email, img, role, id, deleteUser ,setUpdate }) => {
    const axiosInstance = useAxios();
    const [userName, setUserName] = useState(name);
    const [userEmail, setUserEmail] = useState(email);
    const [userRole, setUserRole] = useState(role)
    const roles = ["admin", "user"];
    const [state, setState] = useState({})
    const [updating, setUpdating] = useState(false);

    const update = async (e) => {
        e.preventDefault();
        if (!roles.includes(userRole)) {
            return
        };
        setState(false);
        setUpdate(false);
        try {
            setUpdating(true)
            const response = await axiosInstance.patch(`${USERS_API}/${id}`, JSON.stringify({
                name: userName,
                email: userEmail,
                role: userRole
            }));
            setState({ code: response.data.stateCode, message: response.data.message })
            setUpdate(true);
        } catch (error) {
            console.error(error)
            setState({ message: error.message })
        } finally {
            setUpdating(false)
        }
    }

    const delUser = () => {
        deleteUser(id)
    };

    const makeAdmin = () => {
        setUserRole((prevRole) => (prevRole === "admin" ? "user" : "admin"));
    }

    return (
        <div className="p-5 lg:p-7 bg-white rounded-xl shadow-200 w-full duration-2 relative">
            {
                updating && (
                    <Loader />
                )
            }
            {
                state && (
                    <p className="text-center text-primary-100 font-recursive mb-3"> {state.message}</p>
                )
            }
            <div className="">
                <form
                    className="mt-4"
                    onSubmit={update}
                >
                    <div className="w-full">
                        <div className="mx-auto w-fit">
                            <div className="size-24 rounded-lg relative">
                                <img
                                    src={img || "/assets/images/dummy.jpg"}
                                    alt="Profile preview"
                                    className="size-full rounded-lg object-cover cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="my-4 grid gap-2">
                            <InputField
                                title="User id"
                                placeholder="User id"
                                value={id}
                            />
                            <InputField
                                title="name"
                                placeholder="Enter your name"
                                value={userName}
                                onchange={(val) => setUserName(val)}
                            />
                            <InputField
                                title="email"
                                placeholder="Enter your email"
                                type='email'
                                value={userEmail}
                                onchange={(val) => setUserEmail(val)}
                            />
                            <InputField
                                title="role"
                                placeholder="(admin / user)"
                                value={userRole}
                                onchange={(val) => setUserRole(val)}
                            />
                        </div>

                        <div className="w-full grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                            <Button
                                title="update user"
                                type="submit"
                                leftIcon={<Upload size={17} />}
                                classContainer="flex-center gap-2 center w-full bg-primary-200 rounded-lg text-white hover:bg-primary-100 py-3"

                            />
                            <Button
                                title={role === "admin" ? "delete admin" : "delete user"}
                                leftIcon={<Trash2 size={17} />}
                                classContainer="flex-center gap-2 center w-full bg-red-200 rounded-lg text-white hover:bg-red-100 py-3"
                                func={() => delUser()}
                            />
                            <Button
                                title={userRole === "admin" ? "make user" : "make admin"}
                                leftIcon={<ShieldCheck size={18} />}
                                classContainer="flex-center gap-2 center w-full bg-green-600 rounded-lg text-white hover:bg-green-500 py-3 col-span-2"
                                func={() => makeAdmin()}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserModel

const Loader = () => {
    return (
        <div className="absolute bg-black/60 z-[9999] size-full top-0 left-0">
            <div className="w-xs sm:w-sm h-40 bg-white absolute-center z-30 rounded-lg shadow-100">
                <div className="size-full flex-center justify-center gap-3 flex-col">
                    <svg aria-hidden="true" class="w-8 h-8 text-ligh-50 animate-spin fill-primary-100" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>

                    <p className="text-primary-300 special main-gradient select-none text-xl mt-2">Updating...</p>
                </div>
            </div>
        </div>
    )
}