import { Link } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="container mx-auto">
      <nav className="flex justify-between items-center border rounded border-slate-300 px-4 py-2 my-4">
        <Link to="/" className="text-xl font-bold text-blue-500">
          BeFriend Social Network
        </Link>
        <div>
          <Link to="/login" className="text-slate-900 mx-2">
            Login
          </Link>
          <Link to="/register" className="text-slate-900 mx-2">
            Register
          </Link>
        </div>
      </nav>
      <div className="border rounded border-slate-300 px-4 py-2 my-4 ">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome to the BeFriend Social Network
        </h1>
        <p className="text-slate-700 my-4">
          Please use the login and register links above to get started with the BeFriend Social Network. 
        </p>
      </div>
    </div>
  );
}
