import { useState, useRef, useEffect } from 'react'
import { User, Upload, Trash2, Send } from "lucide-react";
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../contexts/shared/Auth';
import handleFileUpload from '../../utils/upload';
import Spinear from '../../components/loaders/Spinear';
import useAxios from '../../utils/useAxios';
import { SIGNIN_API } from '../../apis/api';
import { useZodValidation, userRegistrationSchema } from '../../constants/user_vldation';
import { cn } from '../../utils/util';

const SignUp = () => {
  const axiosInstance = useAxios();
  const [selectedImage, setSelectedImage] = useState(null);
  const fileUploadRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { validate } = useZodValidation(userRegistrationSchema);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userBirthDate, setUserBirthDate] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Response state
  const [errorMessage, setErrorMessage] = useState("");
  const [responseData, setResponseData] = useState("");

  const triggerFileUpload = () => {
    fileUploadRef.current.click();
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
      setSelectedImage(file);
    }
  }

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreviewUrl(null);
    // Clean up the object URL to prevent memory leaks
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
  }

  const handleImageButtonClick = () => {
    selectedImage ? removeSelectedImage() : triggerFileUpload();
  }

  const validateForm = () => {
    const formData = {
      userName,
      userEmail,
      userPassword,
      userBirthDate
    };

    return validate(formData, setErrorMessage);
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      // Prepare form data
      formData.append("name", userName.trim());
      formData.append("email", userEmail.trim());
      formData.append("password", userPassword.trim());
      formData.append("birth_day", new Date(userBirthDate).toISOString());

      // Upload image if selected
      if (selectedImage) {
        const uploadResponse = await handleFileUpload(selectedImage);
        formData.append("image", uploadResponse.url);
      }

      const response = await axiosInstance.post(SIGNIN_API, formData);
      login(response.data.data)

      const targetPath = response.data.data.role === "admin" ? '/admin' : '/';
      if (response.status >= 200 && response.status < 300) {
        navigate(targetPath, { replace: true });
      }

    } catch (error) {
      // console.error('Registration failed:', error.response?.data.message || error.message);
      setResponseData(error.response?.data || { message: "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  return (
    <div className='p-5 lg:p-7 bg-white rounded-xl shadow-200 w-2xl'>
      {isLoading && (
        <div className="size-full absolute top-0 left-0 bg-black/40 z-40 center">
          <Spinear />
        </div>
      )}

      <div className="w-full border-b pb-4 border-ligh-50">
        <h1 className='text-2xl main-gradient special w-fit'>Create an Account</h1>
        <p className='text-ligh-200 text-sm font-karla'>{"< "}Join us today by entering your details below{" />"}</p>
      </div>

      <form className="mt-4" onSubmit={handleFormSubmit}>
        <div className="w-full">
          <div className="mx-auto w-fit">
            {!selectedImage ? (
              <div
                className="size-12 center bg-primary-100/20 rounded-full text-primary-100 relative cursor-pointer active:bg-primary-100/30 duration-200"
                onClick={handleImageButtonClick}
              >
                <User size={19} />
                <button
                  type="button"
                  className="absolute text-white -right-1 -bottom-0 size-5 center bg-primary-300 rounded-full cursor-pointer"
                >
                  <Upload size={11} />
                </button>
              </div>
            ) : (
              <div className="size-12 ring-primary-200 ring-2 rounded-full relative">
                <img
                  src={imagePreviewUrl}
                  alt="Profile preview"
                  className="size-full rounded-full object-cover cursor-pointer"
                  onClick={triggerFileUpload}
                />
                <button
                  type="button"
                  className="absolute text-white -right-1 -bottom-0.5 size-5 center bg-red-200 rounded-full cursor-pointer"
                  onClick={removeSelectedImage}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
            <input
              type="file"
              name="image"
              id="image"
              hidden
              ref={fileUploadRef}
              onChange={handleImageUpload}
              accept="image/*"
            />
          </div>

          <div className="my-4 grid sm:grid-cols-2 gap-2">
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
              title="password"
              placeholder="Enter your password"
              type='password'
              value={userPassword}
              onchange={(val) => setUserPassword(val)}
            />
            <InputField
              title="birth-day"
              placeholder="Enter your birth date"
              type='date'
              value={userBirthDate}
              onchange={(val) => setUserBirthDate(val)}
            />
          </div>

          {errorMessage && (
            <p className="text-red-200 text-xs bg-red-200/30 p-1.5 font-recursive text-center  my-2 duration-2 rounded-md">
              {errorMessage}
            </p>
          )}

          <div className="w-full">
            <Button
              title="Sign Up"
              type="submit"
              leftIcon={<Send size={17} />}
              classContainer="flex-center gap-2 center w-full bg-primary-200 rounded-lg text-white hover:bg-primary-100 py-3"
            />

            {responseData && (
              <p className={cn("text-pink-500 text-xs p-1.5 font-recursive font-semibold text-center my-1 duration-2 bg-pink-200 rounded-md", responseData.state === "faild" ? "bg-red-300/80 text-red-700" : "")}>
                {responseData.message || "connection error or check internet"}
              </p>
            )}

            <p className="font-karla mt-2.5 px-1 text-dark-200 font-semibold text-sm">
              Already have an account?
              <Link to="/auth/login" className='text-primary-100 ml-1 hover:underline'>
                Login
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SignUp