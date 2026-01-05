import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTopSelective = () => {
  const { pathname } = useLocation();

  // Routes where scroll should reset
  const scrollRoutes = ["/", "/courses", "/FAQ", "/interviews", "/privacy-policy"];

  useEffect(() => {
    if (scrollRoutes.includes(pathname)) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth", // or "auto"
      });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTopSelective;
