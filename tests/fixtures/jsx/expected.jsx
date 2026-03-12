const App = () => (
  <div className="flex justify-center text-left">
    <span className={`badge bg-red-600 p-2 ${active ? 'd-inline' : 'd-none'}`}>Alert</span>
  </div>
);
