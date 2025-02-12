export default function Footer() {
    return (
      <footer className="bg-gray-100 text-center p-6 mt-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600">&copy; {new Date().getFullYear()} FlyEase. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="text-gray-500 hover:text-gray-700">About Us</a>
            <a href="#" className="text-gray-500 hover:text-gray-700">Careers</a>
            <a href="#" className="text-gray-500 hover:text-gray-700">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-700">Contact</a>
          </div>
        </div>
      </footer>
    );
  }
  