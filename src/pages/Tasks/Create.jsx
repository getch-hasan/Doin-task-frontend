import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  DateInput,
  TextAreaInput,
  TextInput,
} from "../../components/input";
import { NetworkServices } from "../../network";
import Select from "react-select";
import { Toastify } from "../../components/toastify";
import { useNavigate } from "react-router-dom";
import Spinner from "../../utils/loading/spinner";
import { networkErrorHandeller } from "../../utils/helpers";

const TaskCreate = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch users and format for react-select
  const fetchUsers = async () => {
    try {
      const response = await NetworkServices.User.index();
      if (response?.data) {
        const formatted = response.data.map((u) => ({
          value: u._id,
          label: u.name,
        }));
        setUserOptions(formatted);
      }
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onSubmit = async (data) => {
    console.log("formData", data);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", data?.title || "");
      formData.append("status", data?.status || "Pending");

      // ✅ store multiple users
      (data?.assignedUser || []).forEach((id) => {
  formData.append("assignedUser[]", id); // <-- backend must accept arrays like this
});

      formData.append("description", data?.description || "");
      formData.append("dueDate", data?.dueDate || "");

      const response = await NetworkServices.Task.store(formData);
      console.log(response)

      if (response && response.status === 201) {
        Toastify.Success("Task created successfully");
        navigate("/dashboard/task");
      }
    } catch (error) {
      networkErrorHandeller(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Create Task";
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded-2xl p-8 w-full max-w-2xl space-y-4"
      >
        {/* Title */}
        <TextInput
          name="title"
          label="Task Title"
          placeholder="Enter task title"
          control={control}
          rules={{ required: "Title is required" }}
          error={errors.title?.message}
        />

        {/* Assign Users */}
        <div>
          <label className="block text-sm text-gray-500 mb-2">Assign To</label>
          <Controller
            name="assignedUser"
            control={control}
            rules={{ required: "Please select at least one user" }}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={userOptions}
                placeholder="Select users..."
                classNamePrefix="select"
                value={userOptions.filter((opt) =>
                  field.value?.includes(opt.value)
                )} // ✅ keep selected values visible
                onChange={(selected) =>
                  field.onChange(selected ? selected.map((s) => s.value) : [])
                }
                styles={{
                  control: (provided) => ({
                    ...provided,
                    minHeight: "42px",
                    borderRadius: "8px",
                    borderColor: errors.assignedUsers ? "red" : "#d1d5db",
                    "&:hover": { borderColor: "#6366f1" },
                  }),
                }}
              />
            )}
          />
          {errors.assignedUsers && (
            <p className="text-xs text-red-500 mt-1">
              {errors.assignedUsers.message}
            </p>
          )}
        </div>

        {/* Due Date */}
        <DateInput
          name="dueDate"
          label="Due Date"
          placeholder="Select a date"
          control={control}
          rules={{ required: "Due date is required" }}
          error={errors.dueDate?.message}
        />

        {/* Description */}
        <TextAreaInput
          name="description"
          placeholder="Enter description"
          label="Description"
          control={control}
          error={errors.description?.message}
        />

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-6 h-10 py-2 rounded-full transition"
          >
            {loading ? <Spinner name={"creating"} /> : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskCreate;
