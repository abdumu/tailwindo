const App = () => (
  <div className="flex justify-center text-left">
    <span className={`inline-block py-1 px-2 text-xs font-bold leading-none text-center whitespace-nowrap align-baseline rounded bg-red-600 p-2 ${active ? 'd-inline' : 'd-none'}`}>Alert</span>
  </div>
);
