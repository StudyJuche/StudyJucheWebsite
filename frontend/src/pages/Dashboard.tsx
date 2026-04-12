export const Dashboard = () => (
  <div className="p-8 flex flex-col items-center justify-center max-w-6xl mx-auto bg-white rounded-lg shadow-md">
    <h1 className="text-2xl font-bold mb-4">Dashboard (Protected)</h1>
    <p className="text-gray-600">You can only see this if you are authenticated!</p>
  </div>
);
