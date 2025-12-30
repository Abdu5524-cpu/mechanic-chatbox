
'use client'
import { useEffect } from 'react'
import { useState } from 'react'
import About from '../components/About'
import QuoteForm from '../components/QuoteForm'




export default function Home() {
  useEffect(() => {
    console.log("Component mounted"); // Step 6 log

    fetch('http://localhost:3000/api/ping')

      .then(res => res.json())
      .then(data => {console.log('API response:', data); //step 6 log
      }) // Step 6 log
      .catch(err => {
        console.error('Error fetching API:', err); // Step 7 log
    });
  }, []);


  const [formData, setFormData] = useState({ name: '', car: '', issue: '' })

  return (
    <main className="flex flex-col gap-20 px-4 py-10 max-w-4xl mx-auto text-gray-800">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Awais Auto Repair & Tire Shop</h1>
        <p className="text-lg">Auto repair shop providing services such as oil changes and tire repairs, plus bodywork.</p>
      </section>

      {/* Services */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Our Services</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <li className="bg-gray-100 p-4 rounded-xl shadow">Oil Changes</li>
          <li className="bg-gray-100 p-4 rounded-xl shadow">Brake Repair</li>
          <li className="bg-gray-100 p-4 rounded-xl shadow">Engine Diagnostics</li>
          <li className="bg-gray-100 p-4 rounded-xl shadow">Body Work</li>
        </ul>
      </section>

      {/* Quote Form */}
      <QuoteForm />

      {/* About Section */}
      <About />

      {/* Testimonials 
      <section>
        <h2 className="text-2xl font-semibold mb-4">What Customers Say</h2>
        <p className="text-gray-600 italic">Testimonials coming soon...</p>
      </section> */}

      
    </main>
  )
  
  
  
}


