const App = () => (
  <div className="d-flex justify-content-center text-left">
    <span className={`badge bg-danger p-2 ${active ? 'd-inline' : 'd-none'}`}>Alert</span>
  </div>
);
