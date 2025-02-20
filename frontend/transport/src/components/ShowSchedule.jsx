import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 

const ShowSchedule = () => { 
  const [schedules, setSchedules] = useState([]); 
  const [error, setError] = useState(''); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [filterType, setFilterType] = useState('All'); 

  const navigate = useNavigate(); 

  useEffect(() => { 
    const fetchSchedules = async () => { 
      try { 
        const response = await fetch('http://147.93.107.88:5000/api/admin/bus-schedules'); 
        const result = await response.json(); 

        if (response.ok) { 
          setSchedules(result.schedules); 
        } else { 
          setError(result.error || 'Failed to fetch schedules'); 
        } 
      } catch (error) { 
        console.error('Error fetching schedules:', error); 
        setError('Error fetching schedules. Please try again later.'); 
      } 
    }; 

    fetchSchedules(); 
  }, []); 

  // Apply filtering based on searchTerm & filterType
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.scheduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          schedule.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          schedule.startPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          schedule.endPoint.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === "All" || schedule.scheduleType === filterType;

    return matchesSearch && matchesFilter;
  });

  return ( 
    <div className="container mx-auto p-6"> 
      <h2 className="text-3xl font-semibold text-center mb-6">Assigned Buses</h2> 

      <div className="flex justify-between items-center mb-4"> 
        {/* Search Bar */} 
        <input 
          type="text" 
          placeholder="Search by Name, Route, Start or End Point" 
          className="border px-4 py-2 rounded w-1/3" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        /> 

        {/* Filter Dropdown */} 
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)} 
          className="border px-4 py-2 rounded" 
        > 
          <option value="All">All Types</option> 
          <option value="Regular Schedule">Regular Schedule</option> 
          <option value="Friday Schedule">Friday Schedule</option> 
          <option value="Exam Schedule">Exam Schedule</option> 
          <option value="Library Schedule">Library Schedule</option> 
          <option value="Residential Schedule">Residential Schedule</option> 
          <option value="Special Schedule">Special Schedule</option> 
        </select> 

        {/* Assign New Bus */} 
        <button 
          onClick={() => navigate('')} 
          className="bg-red-500 hover:bg-green-600 text-white px-4 py-2 rounded" 
        > 
          Active/Inactive Schedule 
        </button> 
        <button 
          onClick={() => navigate('/addSchedule')} 
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded" 
        > 
          Add New Schedule 
        </button> 
      </div> 

      {error && <p className="text-center text-red-500">{error}</p>} 
      {!error && filteredSchedules.length === 0 && ( 
        <p className="text-center text-gray-500">No matching schedules found.</p> 
      )} 

      {filteredSchedules.length > 0 && ( 
        <div className="overflow-x-auto"> 
          <table className="min-w-full bg-white shadow-md rounded"> 
            <thead> 
              <tr> 
                <th className="py-3 px-6 bg-gray-200 font-semibold text-gray-600 text-sm uppercase text-left"> 
                  Slot Name 
                </th> 
                <th className="py-3 px-6 bg-gray-200 font-semibold text-gray-600 text-sm uppercase text-left"> 
                  Road
                </th> 
                <th className="py-3 px-6 bg-gray-200 font-semibold text-gray-600 text-sm uppercase text-left"> 
                  Start Point 
                </th> 
                <th className="py-3 px-6 bg-gray-200 font-semibold text-gray-600 text-sm uppercase text-left"> 
                  End Point 
                </th> 
                <th className="py-3 px-6 bg-gray-200 font-semibold text-gray-600 text-sm uppercase text-left"> 
                  Time 
                </th> 
                <th className="py-3 px-6 bg-gray-200 font-semibold text-gray-600 text-sm uppercase text-left"> 
                  Schedule Type 
                </th> 
                <th className="py-3 px-6 bg-gray-200 font-semibold text-gray-600 text-sm uppercase text-left"> 
                  Action
                </th> 
              </tr> 
            </thead> 
            <tbody> 
              {filteredSchedules.map((schedule) => ( 
                <tr key={schedule._id} className="border-t"> 
                  <td className="py-3 px-6">{schedule.scheduleName}</td> 
                  <td className="py-3 px-6">{schedule.route}</td> 
                  <td className="py-3 px-6">{schedule.startPoint}</td> 
                  <td className="py-3 px-6">{schedule.endPoint}</td> 
                  <td className="py-3 px-6">{schedule.time}</td> 
                  <td className="py-3 px-6">{schedule.scheduleType}</td> 
                </tr> 
              ))} 
            </tbody> 
          </table> 
        </div> 
      )} 
    </div> 
  ); 
}; 

export default ShowSchedule;
