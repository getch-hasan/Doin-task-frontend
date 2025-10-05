import React, { useCallback, useEffect, useState } from "react";
import { NetworkServices } from './../../network/index';
import { networkErrorHandeller } from "../../utils/helpers";
import { Link } from "react-router-dom";


const Card = () => {
  const [data,setData]=useState()
 const fetchDashboardData = useCallback(async () => {
    try {


      const response = await NetworkServices.Dashboard.index();

      if (response?.status === 200) {
        setData(response?.data?.summary)
      }
    } catch (error) {
      networkErrorHandeller(error);
    }
    // setLoading(false);
  }, []);
useEffect(()=>{
  fetchDashboardData()
},[])

  const cart = [
    {
      title: "New Task",
      value: data?.pending || 0,
      color: "bg-gradient-to-r from-[#D623FE] to-[#A530F2]",
      img: "/image/dash/lock.svg",
      status:'pending'
    },
    {
      title: "In Prograss",
      value: data?.inProgress || 0,
      color: "bg-gradient-to-r from-[#FA6464] to-[#DC2626]",
      img: "/image/dash/lock.svg",
      status:'In Progress'
    },
    {
      title: "Complete Task",
      value: data?.completed || 0,
      color: "bg-gradient-to-r from-[#6BAAFC] to-[#305FEC]",
      img: "/image/dash/track.svg",
      status:'Completed'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
      {cart.map((d, i) => (
        <Link to={`task?status=${d?.status}`}
          key={i}
          className={`${d.color} text-white rounded-lg p-6 shadow-md`}
        >
          <p className="text-lg font-semibold">{d.title}</p>

          <div className="flex justify-between">
            <img src={d?.img} alt="" />{" "}
            <p className="text-5xl font-bold mt-2">{d.value}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Card;
