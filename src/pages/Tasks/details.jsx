import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NetworkServices } from "../../network";
import { networkErrorHandeller } from "../../utils/helpers";
import DetailsSkeleton from "../../components/Skeleton/DetailsSkeleton";
import { Toastify } from "../../components/toastify";

const TaskDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [task, setTask] = useState(null);
  const [status, setStatus] = useState("");

  // Fetch Task
  const fetchTask = async () => {
    setLoading(true);
    try {
      const response = await NetworkServices.Task.show(id);
      if (response?.status === 200) {
        setTask(response?.data?.task);
        setStatus(response?.data?.task?.status || "");
      }
    } catch (error) {
      networkErrorHandeller(error);
    }
    setLoading(false);
  };

  // Update Status
  const handleStatusUpdate = async () => {
    if (!status) return;
    setUpdating(true);
    try {
      const response = await NetworkServices.Task.update(id, { status });
      if (response?.status === 200) {
        Toastify.Success("Status updated successfully!");
        setTask((prev) => ({ ...prev, status }));
      }
    } catch (error) {
      networkErrorHandeller(error);
    }
    setUpdating(false);
  };

  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id]);

  if (loading || !task) {
    return <DetailsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-10 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl">
        {/* Header */}
        <div className="border-b pb-4 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Task ID: <span className="text-gray-700">{task._id}</span>
            </p>
          </div>
        </div>

        {/* Task Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Update */}
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <div className="flex gap-3 mt-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={updating}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {updating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <p className="text-sm text-gray-500">Due Date</p>
            <p className="text-base font-medium text-gray-800 mt-1">
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "No date set"}
            </p>
          </div>

          {/* Assigned Users */}
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Assigned Users</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {task?.assignedUser?.length > 0 ? (
                task?.assignedUser?.map((user) => (
                  <span
                    key={user?._id}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full"
                  >
                    {user?.name}
                  </span>
                ))
              ) : (
                <span className="text-gray-600">No users assigned</span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <p className="text-sm text-gray-500">Description</p>
          <p className="text-base text-gray-800 mt-2 whitespace-pre-line">
            {task.description || "No description provided."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
