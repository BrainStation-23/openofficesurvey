
import { Button } from "@/components/ui/button";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-xl font-bold">
                Open Office Survey
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  to="/features"
                  className={`text-sm ${
                    isActive("/features")
                      ? "text-primary font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Features
                </Link>
                <Link
                  to="/why-us"
                  className={`text-sm ${
                    isActive("/why-us")
                      ? "text-primary font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Why Us?
                </Link>
                <Link
                  to="/tech-stack"
                  className={`text-sm ${
                    isActive("/tech-stack")
                      ? "text-primary font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Tech Stack
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/login")}>Get Started</Button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 Open Office Survey. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
