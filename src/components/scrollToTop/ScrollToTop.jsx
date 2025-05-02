import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // ⬅️ makes it nice and smooth
    });
  }, [pathname]); // Run every time URL changes

  return null; // no visual component
};

export default ScrollToTop;
