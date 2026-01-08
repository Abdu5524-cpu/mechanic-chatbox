
'use client'
import About from '../components/About'
import QuoteForm from '../components/QuoteForm'




export default function Home() {
  return (
    <main className="flex flex-col gap-20 px-4 py-10 max-w-4xl mx-auto text-gray-800">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Awais Auto Repair & Tire Shop</h1>
        <p className="text-lg">Auto repair shop providing services such as oil changes and tire repairs, plus bodywork.</p>
      </section>

      {/* Analyze Quote Summary */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Analyze Your Quote</h2>
        <p className="text-gray-700">
          Drop in a repair quote or describe the vehicle, damage, and location.
          We will return a structured summary so you can understand the scope and total at a glance.
        </p>
      </section>

      {/* Quote analysis chat UI */}
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
