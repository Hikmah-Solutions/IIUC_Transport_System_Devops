import React, { useState, useEffect } from 'react';  
import axios from 'axios';  
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';  

const API_URL = 'https://iiuc-transport-system.onrender.com/api/admin/trip-info'; // Update with your backend URL  

const styles = StyleSheet.create({  
  page: { padding: 20 },  
  title: { fontSize: 20, textAlign: 'center', marginBottom: 10 },  
  table: { display: 'table', width: '100%', borderStyle: 'solid', borderWidth: 1, marginTop: 10 },  
  tableRow: { flexDirection: 'row' },  
  tableCellHeader: { margin: 5, fontSize: 12, fontWeight: 'bold', borderBottom: 1 },  
  tableCell: { margin: 5, fontSize: 10 },  
});  

const PdfDocument = ({ reportData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Trip Report</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellHeader}>Bus No</Text>
          <Text style={styles.tableCellHeader}>Start Point</Text>
          <Text style={styles.tableCellHeader}>Driver Name</Text>
          <Text style={styles.tableCellHeader}>Helper Name</Text>
          <Text style={styles.tableCellHeader}>No. of Students</Text>
          <Text style={styles.tableCellHeader}>Trip Date</Text>
        </View>
        {reportData?.map((trip, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCell}>{trip.busNo}</Text>
            <Text style={styles.tableCell}>{trip.startPoint}</Text>
            <Text style={styles.tableCell}>{trip.driverName}</Text>
            <Text style={styles.tableCell}>{trip.helperName}</Text>
            <Text style={styles.tableCell}>{trip.noOfStudents}</Text>
            <Text style={styles.tableCell}>{trip.tripDate}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);


const TripInfo = () => {  
  const [tripDate, setTripDate] = useState('');  
  const [busNo, setBusNo] = useState('');  
  const [startPoint, setStartPoint] = useState('');  
  const [noOfStudents, setNoOfStudents] = useState('');  
  const [subsDriverName, setSubsDriverName] = useState('');  
  const [subsHelperName, setSubsHelperName] = useState('');  
  const [message, setMessage] = useState('');  
  const [report, setReport] = useState([]);  

  useEffect(() => {  
    fetchTripReport();  
  }, []);  

  const generateTripInfo = async () => {  
    try {  
      const response = await axios.post(`${API_URL}/generate-trip-info`, { tripDate });  
      setMessage(response.data.message);  
      fetchTripReport();  
    } catch (error) {  
      setMessage(error.response?.data?.error || 'Error generating trips');  
    }  
  };  

  const logManualTrip = async () => {  
    try {  
      const response = await axios.post(`${API_URL}/manual-trip`, {  
        busNo,  
        startPoint,  
        noOfStudents,  
        subsDriverName,  
        subsHelperName  
      });  
      setMessage(response.data.message);  
      fetchTripReport();  
    } catch (error) {  
      setMessage(error.response?.data?.error || 'Error logging trip');  
    }  
  };  

  const fetchTripReport = async () => {  
    try {  
      const response = await axios.get(`${API_URL}/trip-report`, { params: { tripDate } });  
      setReport(response.data.report);  
    } catch (error) {  
      console.error('Error fetching trip report:', error);  
    }  
  };  

  return (  
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">  
      <h1 className="text-3xl text-center font-bold mb-6">Bus Trip Management</h1>  

      {/* <div className="mb-6">  
        <h2 className="text-xl font-semibold mb-2">Generate Trip Info</h2>  
        <input  
          type="date"  
          value={tripDate}  
          onChange={(e) => setTripDate(e.target.value)}  
          className="w-full p-2 border border-gray-300 rounded-md"  
        />  
        <button  
          onClick={generateTripInfo}  
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" 
        >  
          Generate Trips  
        </button>  
      </div>   */}

      <div className="mb-6">  
        <h2 className="text-xl font-semibold mb-2">Trip</h2>  
        <input  
          type="text"  
          placeholder="Bus Number"  
          value={busNo}  
          onChange={(e) => setBusNo(e.target.value)}  
          className="w-full p-2 border border-gray-300 rounded-md"  
        />  
        <input  
          type="text"  
          placeholder="Start Point"  
          value={startPoint}  
          onChange={(e) => setStartPoint(e.target.value)}  
          className="w-full p-2 border border-gray-300 rounded-md mt-2"  
        />  
        <input  
          type="number"  
          placeholder="Number of Students"  
          value={noOfStudents}  
          onChange={(e) => setNoOfStudents(e.target.value)}  
          className="w-full p-2 border border-gray-300 rounded-md mt-2"  
        />  
        <input  
          type="text"  
          placeholder="Substitute Driver Name"  
          value={subsDriverName}  
          onChange={(e) => setSubsDriverName(e.target.value)}  
          className="w-full p-2 border border-gray-300 rounded-md mt-2"  
        />  
        <input  
          type="text"  
          placeholder="Substitute Helper Name"  
          value={subsHelperName}  
          onChange={(e) => setSubsHelperName(e.target.value)}  
          className="w-full p-2 border border-gray-300 rounded-md mt-2"  
        />  
        <button  
          onClick={logManualTrip}  
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"  
        >  
          Confirm Trip  
        </button>  
      </div>  

      <div className="mb-6">  
        <h2 className="text-xl font-semibold mb-2">Trip Report</h2>  
        <input  
          type="date"  
          value={tripDate}  
          onChange={(e) => setTripDate(e.target.value)}  
          className="w-full p-2 border border-gray-300 rounded-md"  
        />  
        <button  
          onClick={fetchTripReport}  
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"  
        >  
          Fetch Report  
        </button>  
        <table className="w-full mt-4 table-auto border-collapse border border-gray-300">  
          <thead>  
            <tr className="bg-gray-200">  
              <th className="px-4 py-2 text-left">Bus No</th>  
              <th className="px-4 py-2 text-left">Start Point</th>  
              <th className="px-4 py-2 text-left">Driver Name</th>  
              <th className="px-4 py-2 text-left">Helper Name</th>  
              <th className="px-4 py-2 text-left">No. of Students</th>  
              <th className="px-4 py-2 text-left">Trip Date</th>  
            </tr>  
          </thead>  
          <tbody>  
            {report.map((trip, index) => (  
              <tr key={index} className="border-b">  
                <td className="py-2 px-4">{trip.busNo}</td>  
                <td className="py-2 px-4">{trip.startPoint}</td>  
                <td className="py-2 px-4">{trip.driverName}</td>  
                <td className="py-2 px-4">{trip.helperName}</td>  
                <td className="py-2 px-4">{trip.noOfStudents}</td>  
                <td className="py-2 px-4">{trip.tripDate}</td>  
              </tr>  
            ))}  
          </tbody>  
        </table>  
       <>
  <PDFDownloadLink
    document={<PdfDocument reportData={report} />}
    fileName="trip_report.pdf"
  >
    {({ loading }) =>
      loading ? "Generating PDF..." : (
        <button className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
          Download PDF
        </button>
      )
    }
  </PDFDownloadLink>
</>

      </div>  

      {message && <p className="text-center text-red-500 font-semibold">{message}</p>}  
    </div>  
  );  
};  

export default TripInfo;
