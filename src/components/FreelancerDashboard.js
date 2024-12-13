
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const FreelancerDashboard = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState(""); // State for user-entered skills
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchAllWorks();
  }, []);

  const fetchAllWorks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/freelancers/works", {
        withCredentials: true,
      });
      setWorks(response.data);
    } catch (error) {
      console.error("Error fetching works:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorksBasedOnSkills = async () => {
    try {
      setLoading(true);
      const query = skills.split(",").map((skill) => skill.trim()).join(",");
      const response = await axios.get(
        `http://localhost:3000/freelancers/skills?skills=${encodeURIComponent(query)}`,
        { withCredentials: true }
      );
      setWorks(response.data); // Update works based on skills
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.response?.data || error.message;
      console.error("Error fetching works based on skills:", errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptWork = async (workId, counter = null) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/freelancers/${workId}/accept/`,
        {
          accepted: counter ? "counter" : "yes",
          counter,
        },
        { withCredentials: true }
      );
      alert(response.data); // Display the response message
      fetchAllWorks(); // Refresh the works list after the action
    } catch (error) {
      console.error("Error handling work acceptance:", error.response?.data || error.message);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-gray-100">
      <div className="bg-gradient-to-b from-blue-700 to-indigo-900 text-white shadow-lg">
        {/* Navbar */}
        <nav className="p-4 flex justify-between items-center container mx-auto">
          {/* FreelancerHub Logo with Redirect */}
          <button
            className="text-3xl font-bold hover:text-yellow-300 focus:outline-none"
            onClick={() => navigate("/freelancer-dashboard")} // Navigate to freelancer dashboard
          >
            FreelancerHub
          </button>
          <div className="flex items-center gap-4">
            <input
              type="text"
              className="py-2 px-4 rounded-md text-black bg-gray-100"
              placeholder="Enter skills (e.g., React, Node)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded-md"
              onClick={fetchWorksBasedOnSkills}
            >
              Search by Skills
            </button>
          </div>
        </nav>
      </div>

      {/* Welcome Message */}
      <div className="py-8 bg-blue-100 shadow-md text-center">
        <h1 className="text-4xl font-semibold text-gray-800">
          Welcome to Your Freelancer Dashboard
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Discover the latest projects that match your skills and start your next freelance journey.
        </p>
      </div>

      {/* Dashboard Content */}
      <div className="p-6 max-w-screen-xl mx-auto">
        {loading ? (
          <p className="text-lg text-gray-600">Loading works...</p>
        ) : works.length > 0 ? (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {works.map((work) => (
    <div
      key={work.id}
      className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transform transition duration-300 ease-in-out hover:scale-105 border-t-4 border-indigo-600"
    >
      <h3 className="text-xl font-semibold text-blue-700 mb-2">{work.title}</h3>
      <p className="text-gray-700 mb-4">{work.description}</p>
      <div className="mb-4">
        <span className="font-bold text-gray-800">Company:</span> {work.workBy}
      </div>
      <div className="mb-4">
        <span className="font-bold text-gray-800">Skills Required:</span> {work.requirements.join(", ")}
      </div>
      <div className="mb-4">
        <span className="font-bold text-gray-800">Price:</span> ₹{work.budget} {/* Display price here */}
      </div>
      <div className="mb-4">
        <span className="font-bold text-gray-800">Status:</span> {work.isAccepted ? "Accepted" : "Available"}
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
          disabled={work.isAccepted}
          onClick={() => handleAcceptWork(work.id)}
        >
          Accept
        </button>
        {work.isNegotiable && !work.isAccepted && (
          <button
            className="bg-yellow-500 text-black py-2 px-4 rounded-md hover:bg-yellow-600 transition"
            onClick={() =>
              handleAcceptWork(work.id, prompt("Enter your counter offer:"))
            }
          >
            Counter Offer
          </button>
        )}
      </div>
    </div>
  ))}
</div>

        ) : (
          <p className="text-lg text-gray-600 text-center">No works available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default FreelancerDashboard;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
// import Chatbot from "./Chatbot"; // Import Chatbot component

// const FreelancerDashboard = () => {
//   const [works, setWorks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [skills, setSkills] = useState(""); // State for user-entered skills
//   const navigate = useNavigate(); // Initialize useNavigate

//   useEffect(() => {
//     fetchAllWorks();
//   }, []);

//   const fetchAllWorks = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get("http://localhost:3000/freelancers/works", {
//         withCredentials: true,
//       });
//       console.log('Received works from backend:', response.data);
//       setWorks(response.data);
//     } catch (error) {
//       console.error("Error fetching works:", error.response?.data || error.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     console.log("Works state:", works); // Log works to ensure state is updating correctly
//   }, [works]);

//   const fetchWorksBasedOnSkills = async () => {
//     try {
//       setLoading(true);
//       const query = skills.split(",").map((skill) => skill.trim()).join(",");
//       const response = await axios.get(
//         `http://localhost:3000/freelancers/skills?skills=${encodeURIComponent(query)}`,
//         { withCredentials: true }
//       );
      
//       setWorks(response.data); // Update works based on skills
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message || error.response?.data || error.message;
//       console.error("Error fetching works based on skills:", errorMessage);
//       alert(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAcceptWork = async (workId, counter = null) => {
//     try {
//       const response = await axios.post(
//         `http://localhost:3000/freelancers/${workId}/accept/`,
//         {
//           accepted: counter ? "counter" : "yes",
//           counter,
//         },
//         { withCredentials: true }
//       );
//       alert(response.data); // Display the response message
//       fetchAllWorks(); // Refresh the works list after the action
//     } catch (error) {
//       console.error("Error handling work acceptance:", error.response?.data || error.message);
//       alert("An error occurred. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-cover bg-gray-100">
//       <div className="bg-gradient-to-b from-blue-700 to-indigo-900 text-white shadow-lg">
//         {/* Navbar */}
//         <nav className="p-4 flex justify-between items-center container mx-auto">
//           {/* FreelancerHub Logo with Redirect */}
//           <button
//             className="text-3xl font-bold hover:text-yellow-300 focus:outline-none"
//             onClick={() => navigate("/freelancer-dashboard")} // Navigate to freelancer dashboard
//           >
//             FreelancerHub
//           </button>
//           <div className="flex items-center gap-4">
//             <input
//               type="text"
//               className="py-2 px-4 rounded-md text-black bg-gray-100"
//               placeholder="Enter skills (e.g., React, Node)"
//               value={skills}
//               onChange={(e) => setSkills(e.target.value)}
//             />
//             <button
//               className="bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded-md"
//               onClick={fetchWorksBasedOnSkills}
//             >
//               Search by Skills
//             </button>
//           </div>
//         </nav>
//       </div>

//       {/* Welcome Message */}
//       <div className="py-8 bg-blue-100 shadow-md text-center">
//         <h1 className="text-4xl font-semibold text-gray-800">
//           Welcome to Your Freelancer Dashboard
//         </h1>
//         <p className="text-lg text-gray-600 mt-2">
//           Discover the latest projects that match your skills and start your next freelance journey.
//         </p>
//       </div>

//       {/* Dashboard Content */}
//       <div className="p-6 max-w-screen-xl mx-auto">
//         {loading ? (
//           <p className="text-lg text-gray-600">Loading works...</p>
//         ) : works.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {works.map((work) => (
//               <div
//                 key={work.id}
//                 className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transform transition duration-300 ease-in-out hover:scale-105 border-t-4 border-indigo-600"
//               >
              
//                 <h3 className="text-xl font-semibold text-blue-700 mb-2">{work.title}</h3>
//                 <p className="text-gray-700 mb-4">{work.description}</p>
//                 <div className="mb-4">
//                   <span className="font-bold text-gray-800">Company:</span> {work.workBy}
//                 </div>
//                 <div className="mb-4">
//                   <span className="font-bold text-gray-800">Skills Required:</span> {work.requirements.join(", ")}
//                 </div>
//                 <div className="mb-4">
//                   <span className="font-bold text-gray-800">Price:</span> ${work.budget}
//                 </div>
//                 <div className="mb-4">
//                   <span className="font-bold text-gray-800">Status:</span> {work.isAccepted ? "Accepted" : "Available"}
//                 </div>
//                 <div className="flex justify-between items-center mt-4">
//                   <button
//                     className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
//                     disabled={work.isAccepted}
//                     onClick={() => handleAcceptWork(work.id)}
//                   >
//                     Accept
//                   </button>
//                   {work.isNegotiable && !work.isAccepted && (
//                     <button
//                       className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition"
//                       onClick={() => handleAcceptWork(work.id, "counter")}
//                     >
//                       Counter Offer
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-lg text-gray-600">No works available at the moment.</p>
//         )}
//       </div>

//       {/* Chatbot */}
//       <Chatbot />
//     </div>
//   );
// };

// export default FreelancerDashboard;
