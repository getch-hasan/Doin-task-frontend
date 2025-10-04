import React, { useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaEye } from "react-icons/fa";
import { RiEditFill } from "react-icons/ri";
import { networkErrorHandeller } from "../../utils/helpers";
import { NetworkServices } from "../../network";
import { Toastify } from "../../components/toastify";
import { Link, useLocation } from "react-router-dom";
import { TableSkeleton } from "../../components/Skeleton/Skeleton";
import DeleteTaskModal from "../../components/modal/taskDelete";

const TaskTable = () => {
  const [TaskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status"); // Pending / Completed / In Progress / null

  // pagination handlers
  const handlePageChange = (page) => {
    if (!loading) setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  // fetch tasks
  const fetchTask = useCallback(async () => {
    try {
      setLoading(true);

      const response = await NetworkServices.Task.index({
        page: currentPage,
        per_page: perPage,
        status: status || undefined,
      });

      if (response?.status === 200) {
        setTaskList(response?.data?.tasks || []);
        setTotalRows(response?.data?.total || 0); // backend must return total count
      }
    } catch (error) {
      networkErrorHandeller(error);
    }
    setLoading(false);
  }, [currentPage, perPage, status]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleDelete = async (id) => {
    const response = await NetworkServices.Task.show(id);
    setSelectedTask(response?.data?.task);
    setIsOpen(true);
  };

  const handleDeleteClick = async (id) => {
    setDeleteLoading(true);
    try {
      const response = await NetworkServices.Task.destroy(id);
      if (response?.status === 200) {
        Toastify.Success(response?.data?.message || "Task deleted successfully");
        fetchTask();
      }
    } catch (error) {
      networkErrorHandeller(error);
    }
    setIsOpen(false);
    setDeleteLoading(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setSelectedTask(null);
  };

  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      width: "20%",
      cell: (row) => (
        <div className="text-left font-medium text-black text-base">
          {row.title}
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      center: true,
      cell: (row) => (
        <div className="font-medium text-gray-800 text-base">
          {row.status}
        </div>
      ),
    },
    {
      name: "Description",
      selector: (row) => row.description,
      center: true,
      cell: (row) => (
        <div className="text-base font-medium text-gray-900">
          {row.description}
        </div>
      ),
    },
    {
      name: "Assigned Users",
      selector: (row) => row.assignedUser,
      center: true,
      cell: (row) => (
        <div className="text-base font-medium text-gray-900">
          {row.assignedUser?.map((user) => (
            <p key={user?._id}>{user?.name}</p>
          ))}
        </div>
      ),
    },
    {
      name: "DueDate",
      selector: (row) => row.dueDate,
      center: true,
      cell: (row) => (
        <div className="text-base font-medium text-gray-900">
         {row.dueDate
                ? new Date(row.dueDate).toLocaleDateString()
                : "No date set"}
        </div>
      ),
    },
    {
      name: "Action",
      button: true,
      cell: (row) => (
        <div className="flex justify-center items-center gap-3 text-lg">
          <Link
            to={`/dashboard/task-edit/${row?._id}`}
            className="text-black hover:text-blue-600"
          >
            <RiEditFill />
          </Link>
          <Link
            to={`/dashboard/task-details/${row._id}`}
            title="Show Details"
            className="text-blue-600 text-xl"
          >
            <FaEye />
          </Link>
          <button
            onClick={() => handleDelete(row?._id)}
            className="text-red-600 hover:text-red-800"
          >
            <svg
              className="w-5 h-6 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22m-5 0V4a1 1 0 00-1-1H7a1 1 0 00-1 1v3"
              />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontWeight: "600",
        fontSize: "14px",
        color: "#8B8B8B",
      },
    },
    rows: {
      style: {
        minHeight: "100px",
        borderBottom: "1px solid #E5E7EB",
      },
    },
    cells: {
      style: {
        paddingTop: "16px",
        paddingBottom: "16px",
      },
    },
  };

  useEffect(() => {
    document.title = "User | Task";
  }, []);

  return (
    <div className="w-full font-poppins relative">
      {loading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={TaskList}
          customStyles={customStyles}
          highlightOnHover
          pagination
          responsive
          paginationServer
          paginationTotalRows={totalRows}
          paginationPerPage={perPage}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          paginationDefaultPage={currentPage}
        />
      )}
      {isOpen && selectedTask && (
        <DeleteTaskModal
          task={selectedTask}
          onDelete={() => handleDeleteClick(selectedTask?._id)}
          onCancel={handleCancel}
          deleteLoading={deleteLoading}
        />
      )}
    </div>
  );
};

export default TaskTable;
