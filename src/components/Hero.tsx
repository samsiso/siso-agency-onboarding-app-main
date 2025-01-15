export const Hero = () => {
  return (
    <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-siso-red/10 to-siso-orange/10" />
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-siso-text-bold mb-6">
          Empowering Agencies,
          <br />
          <span className="bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">
            Scaling Effortlessly
          </span>
        </h1>
        <p className="text-xl sm:text-2xl text-siso-text max-w-2xl mx-auto mb-8">
          Welcome to the Siso Resource Hub! Your gateway to innovation and success.
        </p>
        <button className="px-8 py-3 bg-gradient-to-r from-siso-red to-siso-orange text-white rounded-lg font-medium hover:opacity-90 transition-opacity animate-glow">
          Get Started
        </button>
      </div>
    </div>
  );
};