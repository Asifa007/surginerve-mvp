import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Activity } from "lucide-react";

const Navbar = () => {
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-semibold text-foreground">SurgiNerve</h1>
      </div>
      <div className="flex items-center gap-3">
        {role && (
          <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-primary">
            {role}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
