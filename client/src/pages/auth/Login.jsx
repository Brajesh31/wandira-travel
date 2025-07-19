import { useState } from 'react'
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { Link, replace, useNavigate } from 'react-router'
import { Send } from "lucide-react";
import Spinear from '../../components/loaders/Spinear';
import { useAuth } from '../../contexts/shared/Auth';
import useAxios from '../../utils/useAxios';
import { LOGIN_API } from '../../apis/api';
import { useZodValidation, userLoginSchema } from '../../constants/user_vldation';
import { cn } from '../../utils/util';

const Login = () => {
  const axiosInstance = useAxios();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const navgate = useNavigate();
  const { validate } = useZodValidation(userLoginSchema);

  // Response data
  const [resData, setresData] = useState("");
  const { login } = useAuth();

  const validateForm = () => {
    const formData = {
      email,
      password,
    };

    return validate(formData, seterrorMessage);
  }

  const handleForm = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setloading(true)
    const formData = new FormData();
    formData.append("email", email.trim());
    formData.append("password", password.trim());
    seterrorMessage("")
    setresData("");

    const postData = async () => {
      try {
        const response = await axiosInstance.post(LOGIN_API, formData);
        login(response.data.data)

        const targetPath = response.data.data.role === "admin" ? '/admin/dashboard' : '/';
        if (response.status >= 200 && response.status < 300) {
          navgate(targetPath, { replace: true });
        }

      } catch (err) {
        // console.error('Registration failed:', err.response?.data.message || err.message);
        setresData(err.response?.data.message || {message: "Login failed. Please try again."})
      } finally {
        setloading(false);
      }
    }
    postData();
  }

  return (
    <div className='p-5 lg:p-7 bg-white rounded-xl shadow-200 w-2xl'>
      {loading && (
        <div className="size-full absolute top-0 left-0 bg-black/40 z-40 center">
          <Spinear />
        </div>
      )}

      <div className="w-full border-b pb-4 border-ligh-50">
        <h1 className='text-2xl main-gradient special w-fit'>Welcome back </h1>
        <p className='text-ligh-200 text-sm font-karla'> {"< "}Please enter your details to login {" />"}</p>
      </div>

      <form
        className='mt-3'
        onSubmit={handleForm}
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <InputField title="email address" placeholder="enter your email" type='email' value={email} onchange={(val) => setemail(val)} />
          <InputField title="password" placeholder="enter your password" type='password' value={password} onchange={(val) => setpassword(val)} />
        </div>
        {errorMessage && (
          <p className="text-red-200 text-xs bg-red-200/30 p-1.5 font-recursive text-center my-1 mt-2 duration-2 rounded-md">
            {errorMessage}
          </p>
        )}

        <div className="w-full mt-3">
          <Button
            title="log in"
            type="submit"
            leftIcon={<Send size={17} />}
            classContainer="flex-center gap-2 center w-full bg-primary-200 rounded-lg text-white hover:bg-primary-100 py-3"
          />

          {resData && (
            <p className={cn("text-pink-500 text-xs p-1.5 font-recursive font-semibold text-center my-1 duration-2 bg-pink-200 rounded-md", resData.state === "faild" ? "bg-red-300/80 text-red-700" : "")}>
              {resData.message || "connection error or check internet"}
            </p>
          )}

          <p className="font-karla mt-2.5 px-1 text-dark-200 font-semibold text-sm">
            Don't have an account ?
            <Link to="/auth/sign-in" className='text-primary-100 ml-1 hover:underline'>Sign Up</Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Login