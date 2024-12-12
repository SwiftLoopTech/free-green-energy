const Footer: React.FC = () => {
  return (
    <footer
      className="relative text-white p-4 mt-8 h-[587px] bg-cover bg-center"
      style={{
        background:
          "linear-gradient(to left, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3)), url('/images/solar-bg.jpg') lightgray 50% / cover no-repeat",
      }}
    >
      <div className="relative w-10/12 h-full mx-auto flex items-center justify-end">
        <div className="text-left w-1/2">
          <h2 className="text-6xl font-medium mb-7">Start Saving Today</h2>
          <p className="text-lg font-medium ">
            Whether you’d like to be carbon neutral, want to reduce sky-high
            electricity bills, or need to fulfill building mandates, Enphase and
            our solar installation partners can design a system that will meet
            the unique demands of your property and business.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
