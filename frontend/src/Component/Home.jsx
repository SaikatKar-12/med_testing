import React from 'react'
import { useNavigate } from 'react-router-dom';
//import scanVerifyIcon from '../assets/Scan&Verify.png'; 

function Home() {
    const navigate = useNavigate(); // Initialize the navigate function

    const handleSignInClick = () => {
      navigate('/sign-in'); // Redirect to the Sign In page
    };
    return (
        <section className='p-8'>
        <div className="min-h-screen bg-gray-50">
          {/* Hero Section */}
          <section className="bg-white py-16 px-2 pl-8">
            <div className="container mx-auto flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 text-center md:text-left">
                <h2 className="text-4xl font-bold text-gray-600 mb-4 text-4xl font-bold animate-blink">
                Welcome to Medical Care
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                Ensure your medicines are safe, undamaged, and within expiry — instantly.
                Upload an image of your medicine to get started.
                </p>
                <button className="px-6 py-3 text-white rounded-full shadow  hover:text-black" onClick={handleSignInClick}>
                  Get Started
                </button>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="./src/assets/homeimage1.jpg" 
                  alt="Medicine Monitor Illustration" 
                  className="mx-auto rounded-lg shadow-2xl w-auto" 
                />
              </div>
            </div>
          </section>
    
          {/* Dashboard Summary */}
           <section className="container mx-auto py-12">
            <h3 className="text-5xl font-bold text-gray-800 mb-6 text-center">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> 
              {/* Card 1 */}
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <img src="./images/Scan&Verify.png" alt="Medicine Icon" className="mx-auto mb-4" />
                <h4 className="text-3xl font-semibold text-indigo-600 mb-2">Scan & Verify</h4>
                <p className="text-xl font-bold text-gray-900">Check Product Accuracy</p>
              </div> 
    
              {/* Card 2 */}
               <div className="bg-white p-6 rounded-lg shadow text-center">
                <img src="./images/damage.png" alt="Low Stock Icon" className="mx-auto mb-4" />
                <h4 className="text-3xl font-semibold text-indigo-600 mb-2">Damage Checker</h4>
                <p className="text-xl font-bold text-red-500">Keep track of damaged goods</p>
              </div> 
    
              {/* Card 3 */}
               <div className="bg-white p-6 rounded-lg shadow text-center">
                <img src="./images/auto-refill.png" alt="Upcoming Refills Icon" className="mx-auto mb-4" />
                <h4 className="text-3xl font-semibold text-indigo-600 mb-2">Auto Refilling</h4>
                <p className="text-xl font-bold text-gray-900">Ensure medicine availability</p>
              </div>
            </div>
          </section> 
    
          {/* Frequently Asked Questions */}
<section className="container mx-auto py-12">
  <h3 className="text-5xl font-bold text-gray-800 mb-6 text-center">
    Frequently Asked Questions
  </h3>
  <div className="bg-white p-6 rounded-lg shadow space-y-6">
    <div>
      <h4 className="text-xl font-semibold text-indigo-600 mb-2">
        What is the purpose of the automated quality testing module?
      </h4>
      <p className="text-gray-700">
        The module is designed to automatically test and monitor the quality of medicines and consumables received in hospitals, ensuring compliance with safety standards and rejecting low-quality or non-compliant items without manual intervention.
      </p>
    </div>
    <div>
      <h4 className="text-xl font-semibold text-indigo-600 mb-2">
        How does the module detect substandard supplies?
      </h4>
      <p className="text-gray-700">
        The system uses integrated GenAI packaging integrity, and expiration details. AI algorithms then verify compliance with predefined quality standards.
      </p>
    </div>
    <div>
      <h4 className="text-xl font-semibold text-indigo-600 mb-2">
        Can this system integrate with existing hospital inventory systems?
      </h4>
      <p className="text-gray-700">
        Yes, the module can be integrated with hospital inventory management systems to automate quality tracking, stock updates, and generate alerts for non-compliant batches.
      </p>
    </div>
    <div>
      <h4 className="text-xl font-semibold text-indigo-600 mb-2">
        Is manual supervision required at any stage?
      </h4>
      <p className="text-gray-700">
        No. The goal of the module is to operate autonomously. However, administrators can review flagged data and override decisions in rare cases through a secure dashboard.
      </p>
    </div>
    <div>
      <h4 className="text-xl font-semibold text-indigo-600 mb-2">
        What happens when a batch fails the quality test?
      </h4>
      <p className="text-gray-700">
        The system automatically marks the batch as rejected, notifies relevant departments, and generates a detailed report indicating the reasons for rejection.
      </p>
    </div>
  </div>
</section>
</div>
</section>

      );
}

export default Home
