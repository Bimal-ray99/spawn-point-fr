import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumb = ({ title, breadCrumb }) => {
  return (
    <div
      className="relative flex flex-col items-center bg-cover py-32"
      style={{
        backgroundImage: "url(https://www.ragebite.com/assets/study-bg.jpg)",
      }}
    >
      <h1 className="md:text-fluid-6xl text-fluid-xl font-DurkItalic uppercase tracking-wider text-white">
        {title || "Not Found"}
      </h1>
      <div className="mt-4">
        <ol className="flex items-center space-x-2 text-lg text-white">
          <li>
            <Home className="h-4 w-4 text-gray-400" />
          </li>
          <li>
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-secondary"
            >
              Home
            </Link>
          </li>
          <li>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </li>
          <li className="text-gray-300">{breadCrumb || "Error"}</li>
        </ol>
      </div>
    </div>
  );
};

export default Breadcrumb;
