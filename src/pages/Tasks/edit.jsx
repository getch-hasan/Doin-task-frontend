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
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../utils/loading/spinner";
import { networkErrorHandeller } from "../../utils/helpers";

const TaskEdit = () => {
  const { id } = useParams();
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const [task, setTask] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch users
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

  // ✅ Fetch single task
  const fetchTask = async () => {
    try {
      const res = await NetworkServices.Task.show(id);
      console.log(res)
      if (res?.data) {
        const data = res.data;
        setTask(data);

        // Pre-fill fields
        setValue("title", data?.task?.title || "");
        setValue("description", data?.task?.description || "");
        setValue("dueDate", data?.task?.dueDate || "");
        setValue("assignedUser", data?.task?.assignedUser || []);
      }
    } catch (err) {
      console.error("Error fetching task", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTask();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", data?.title || "");
      formData.append("status", data?.status || "Pending");

      (data?.assignedUser || []).forEach((id) => {
        formData.append("assignedUser[]", id);
      });

      formData.append("description", data?.description || "");
      formData.append("dueDate", data?.dueDate || "");
      

      const res = await NetworkServices.Task.update(id, formData);
      if (res?.status === 200) {
        Toastify.Success("Task updated successfully");
        navigate("/dashboard/task");
      }
    } catch (error) {
      networkErrorHandeller(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Edit Task";
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
                )}
                onChange={(selected) =>
                  field.onChange(selected ? selected.map((s) => s.value) : [])
                }
                styles={{
                  control: (provided) => ({
                    ...provided,
                    minHeight: "42px",
                    borderRadius: "8px",
                    borderColor: errors.assignedUser ? "red" : "#d1d5db",
                    "&:hover": { borderColor: "#6366f1" },
                  }),
                }}
              />
            )}
          />
          {errors.assignedUser && (
            <p className="text-xs text-red-500 mt-1">
              {errors.assignedUser.message}
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-10 py-2 rounded-full transition"
          >
            {loading ? <Spinner name={"updating"} /> : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskEdit;
