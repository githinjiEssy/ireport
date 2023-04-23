import React, { useState, useEffect, useRef}from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2';

function AdminReportDetails({ match }) {
  const { reportId }  = useParams()

  const [report, setReport] = useState({});
  
  const[reportStatus, setReportStatus] = useState([])
  const[reportType, setReportType] = useState([])
  const[user, SetUser] = useState([])

  const shouldLog = useRef(true)
  useEffect(() => {    
    if(shouldLog.current) {
      shouldLog.current = false
      fetch(`/reports/${reportId}`)
      .then(r => r.json())
      .then((data) => { setReport(data); setReportStatus(data.report_status); setReportType(data.report_type); SetUser(data.user) })
    }
  }, [reportId])

  // Success Message function
  const showMessage = (msg = '', type = 'success') => {
    const toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        // customClass: { container: 'toast' },
    });
    toast.fire({
        icon: type,
        title: msg,
        padding: '10px 20px',
    });
  };

  const [updateFormData, setUpdateFormData] = useState({});  

  function handleUpdateChange(e) {
    setUpdateFormData({
      ...updateFormData,
      [e.target.name]: e.target.value,
    });
  }

  console.log(updateFormData)
  const [reportStatuses, setReportStatuses] = useState([])
  
  // fetch all Report Statuses
  useEffect(() => {
    if(reportStatus && reportStatus.id && typeof reportStatus.id === 'number') {
    fetch('/report_statuses')
    .then(r => r.json())
    .then((data) => {
      const filteredData = data.filter((name) => name.id > reportStatus.id);
      setReportStatuses(filteredData);
    })
  }
    
  }, [reportStatus])
  

  // UPDATE functionality
  function handleSubmitUpdate(e) {
    fetch(`/reports/${reportId}`, {
      method: "PATCH",
      headers: {
          "content-type": "application/json",
          "accept": "application/json"
      },
      body: JSON.stringify(updateFormData)
    })
    .then(resp => {
      if (resp.ok) {
        resp.json()
        .then((data) => {
          setReportStatus(data.report_status)
          showMessage('Report has been updated successfully.');
          
        })
      }
      else {
        resp.json()
        .then(errors => showMessage(errors.message, 'error'))

      }
  })
    showMessage('Report has been updated successfully.');
   
  }

    // Add a check to see if report exists
    if (!reportStatus) {
      return <div>Loading.....</div>;
    }

  return (
    <>
    <div className="min-h-full bg-gray-100 py-6">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-lg bg-white shadow">
        
        <div className="bg-white p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:space-x-5">
              
              <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                <p className="text-sm font-medium text-gray-600">Report No: {report.id}</p>
                <p className="text-xl font-bold text-gray-900 sm:text-2xl">{reportType.name}</p>
                <p className="text-sm font-medium text-gray-600">{report.title}</p>
              </div>
            </div>
            <div className="mt-5 flex justify-center sm:mt-0">
              <a
                href="/admindashboard"
                className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                BACK
              </a>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 divide-y divide-gray-200 border-t border-gray-200 bg-gray-50 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
          
            <div  className="px-6 py-5 text-center text-sm font-medium">
              <span className="text-gray-900">Date Created: </span> <span className="text-gray-600">{report.created_at}</span>
            </div>
            <div  className="px-6 py-5 text-center text-sm font-medium">
              <span className="text-gray-900">Last Updated: </span> <span className="text-gray-600">{report.updated_at}</span>
            </div>
            <div  className="px-6 py-5 text-center text-sm font-medium">
              <span className="text-gray-900">Report Status: </span> <span className="text-gray-600">{reportStatus.name}</span>
            </div>
         
        </div>
      </div>
      {/* 2-Column Section */}
      <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2 lg:col-start-1">
              {/* Description list*/}
              <section aria-labelledby="applicant-information-title">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h2 id="applicant-information-title" className="text-lg font-medium leading-6 text-gray-900">
                      {report.title}
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{report.location_name}</p>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      

                      {/* Image/Video Section */}
                      <div className="sm:col-span-2">                    
                          <img
                            src={report.image}
                            alt="Phone Camera"
                            className=" rounded-lg shadow ring-1 ring-gray-900/10"                            
                          />                          
                      </div>                      
                      
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Description</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {report.description}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Reported By</dt>
                        <dd className="mt-1 text-sm text-gray-900">{user.first_name} {user.surname}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Email address</dt>
                        <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                      </div>
                      
                    </dl>
                  </div>
                  
                </div>
              </section>

              {/* GPS Map Card Section*/}
              <section aria-labelledby="gps-map-section">
                <div className="bg-white shadow sm:overflow-hidden sm:rounded-lg">
                  <div className="divide-y divide-gray-200">
                    <div className="px-4 py-5 sm:px-6">
                      <h2 id="notes-title" className="text-lg font-medium text-gray-900">
                        GPS Map
                      </h2>
                      
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">{report.gps_coordinates}</p>
                    </div>
                    <div className=" py-3 sm:px-3">

                      {/* MAP IMAGE WITH MARKER GOES HERE!!! */}
                                         
                          <img
                            src="https://i.stack.imgur.com/t1Rfo.jpg"
                            alt="Phone Camera"
                            className=" rounded-lg "                            
                          />                          
                      

                    </div>
                  </div>
                  
                </div>
              </section>
            </div>

              {/*ADMIN USER ACTION SECTION  */}
            <section aria-labelledby="user-actions" className="lg:col-span-1 lg:col-start-3">
              <form>
              <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
                <h2 id="timeline-title" className="text-lg font-medium text-gray-900">
                  Update Status:
                </h2>

                {/* Buttons for Editing and Delete */}
                <div className="mt-6 flow-root">
                <div className="sm:col-span-3">
              
              <label htmlFor="report-status" className="block text-sm font-medium text-gray-700">
                Report Status
              </label>
              <div className="mt-1">
                <select
                  id="report_status_id"
                  name="report_status_id"                  
                  autoComplete="status-name"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-main2 focus:ring-main2 sm:text-sm"
                  onChange={handleUpdateChange}
                  // defaultValue={reportStatuses.id}
                >
                  <option>Select Status Update</option>
                  {reportStatuses.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
            </div>
                </div>
                
                <div className="justify-stretch mt-3 flex flex-col">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-success px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-success-300 focus:outline-none focus:ring-2 focus:ring-success focus:ring-offset-2"
                    onClick={handleSubmitUpdate}
                  >
                    Save
                  </button>
                </div>
              </div>
              </form>
            </section>
          </div>

    </div>
    </div>
    </>
  )
}

export default AdminReportDetails