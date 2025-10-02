import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Toastify } from "../../components/toastify";
import { publicRequest } from "../../config/axios.config";
import { PassworInput, TextInput } from "../../components/input"; 
import { networkErrorHandeller } from "../../utils/helpers";
import { LuLockKeyhole } from "react-icons/lu";

const Register = () => {
  const { handleSubmit, control, formState: { errors }, trigger } = useForm({ mode: "onChange" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await publicRequest.post("users/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      Toastify.Success("Registration successful!");
      navigate("/login"); // redirect after register
    } catch (error) {
      networkErrorHandeller(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-20 mx-auto py-10 flex justify-center">
      <div className="flex flex-col items-center text-gray-700">
        <span className="font-semibold text-xl sm:text-2xl text-center leading-4">
          Vendor Registration
        </span>

        <div className="w-full bg-[#8B70D1] my-5 sm:w-[600px] p-6 sm:p-10 rounded-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-white">
            
            <TextInput
              name="name"
              className="rounded-lg"
              control={control}
              type="text"
              label="Full Name"
              placeholder="Enter your name"
              rules={{ required: "Name is required" }}
              trigger={trigger}
              error={errors?.name?.message}
            />

            <TextInput
              name="email"
              className="rounded-lg"
              control={control}
              type="email"
              label="Email"
              placeholder="Enter email"
              rules={{ required: "Email is required" }}
              trigger={trigger}
              error={errors?.email?.message}
            />

            <PassworInput
              className="rounded-lg"
              name="password"
              control={control}
              label={
                <div className="flex gap-2 pb-2 pl-3.5 text-white">
                  <LuLockKeyhole className="h-5 w-5" />
                  Password
                </div>
              }
              rules={{
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              }}
              error={errors?.password?.message}
              placeholder="Enter your password"
              trigger={trigger}
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-white text-primary font-bold w-full py-3 rounded-md hover:bg-gray-100 mt-4"
            >
              {loading ? "Submitting..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
