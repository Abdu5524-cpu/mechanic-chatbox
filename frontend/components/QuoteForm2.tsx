'use client'

import { useState } from 'react'

export default function QuoteForm() {

    const [formData, setFormData] = useState({ car: '', part: '', damage: '' })
    const [response, setResponse] = useState('');

      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
      }
    
      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({formData: formData})
        });
      const data = await res.json();
      setResponse(data.reply);
      }
      
    return (

        <section className=" px-4 py-10 bg-gray-50">
            <div className=" max-w-[30rem] mx-auto bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-gray-800">
                    Need Some Bodywork Done? Get a Quick Quote!
                </h2>

                <form onSubmit={handleSubmit} className=" space-y-5">

                    {/* Service Type
                    <div className="mx-auto">
                        <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-3 py-[0.5rem]">
                        Name
                        </label>
                        <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        className="w-full rounded-lg p-[0.5rem] text-sm border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div> */}

                    {/* Issue
                    <div className="mx-auto max-w-md">
                        <label htmlFor="issue" className="py-[0.5rem] block text-sm font-medium text-gray-700 mb-1">
                        Issue Description
                        </label>
                        <textarea
                        name="issue"
                        id="issue"
                        value={formData.issue}
                        onChange={handleChange}
                        placeholder="Describe issue"
                        rows={4}
                        className="w-full p-[0.5rem] text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div> */}

                    {/* Car Info */}
                    <div className="mx-auto">
                        <label htmlFor="car" className="py-[0.5rem] block text-sm font-medium text-gray-700 mb-1">
                        Car Make, Model & Year
                        </label>
                        <input
                        type="text"
                        name="car"
                        id="car"
                        value={formData.car}
                        onChange={handleChange}
                        placeholder="e.g. Toyota Camry 2020"
                        className="w-full p-[0.5rem] text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Affected Part */}
                    <div className="mx-auto">
                        <label htmlFor="part" className="py-[0.5rem] block text-sm font-medium text-gray-700 mb-1">
                        Affected Part
                        </label>
                        <input
                        type="text"
                        name="car"
                        id="car"
                        value={formData.part}
                        onChange={handleChange}
                        placeholder="e.g. bumper, door, fender"
                        className="w-full p-[0.5rem] text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Damage */}
                    <div className="mx-auto">
                        <label htmlFor="damage" className="py-[0.5rem] block text-sm font-medium text-gray-700 mb-1">
                        Describe the Damage
                        </label>
                        <input
                        type="text"
                        name="damage"
                        id="damage"
                        value={formData.damage}
                        onChange={handleChange}
                        placeholder="e.g. dent, scratch, cracked panel"
                        className="w-full p-[0.5rem] text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>


                    {/* Submit Button */}
                    <div className="py-[0.5rem] mx-auto max-w-sm">
                        <button
                        type="submit"
                        className="block mx-auto bg-green-200 text-black font-semibold p-[0.25rem] rounded-md hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        >
                        Get a Quote
                        </button>
                    </div>
                </form>
            </div>
        </section>


        
)
    
}

