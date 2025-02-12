import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
      <img
        src="/lovable-uploads/477b8ff2-5983-4ba6-aa0e-cf7db1f23e70.png"
        alt="Tropical beach"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      
      <div className="relative text-center text-white z-10 max-w-4xl px-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-up">
          Discover the World with Ease
        </h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-up opacity-90">
          Your journey begins with a single click
        </p>
      </div>
    </div>
  );
};

export default Hero;