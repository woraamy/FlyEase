import { Calendar, Users, ChevronDown } from "lucide-react";

const SearchForm = () => {
  return (
    <div className="max-w-4xl mx-auto -mt-20 relative z-20 px-6">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center text-brand-text">
          Book Your Flight
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Date</label>
            <div className="flex items-center border rounded-md p-3 hover:border-brand-primary transition-colors">
              <Calendar className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Select Date"
                className="outline-none w-full text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Passengers</label>
            <div className="flex items-center border rounded-md p-3 hover:border-brand-primary transition-colors">
              <Users className="w-5 h-5 text-gray-400 mr-2" />
              <select className="outline-none w-full text-sm bg-transparent">
                <option>1 Adult</option>
                <option>2 Adults</option>
                <option>3 Adults</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Class</label>
            <div className="flex items-center border rounded-md p-3 hover:border-brand-primary transition-colors">
              <ChevronDown className="w-5 h-5 text-gray-400 mr-2" />
              <select className="outline-none w-full text-sm bg-transparent">
                <option>Economy</option>
                <option>Business</option>
                <option>First Class</option>
              </select>
            </div>
          </div>

          <button className="bg-brand-primary text-white rounded-md py-3 px-6 hover:bg-opacity-90 transition-colors mt-6 md:mt-8">
            Search Flights
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default SearchForm;