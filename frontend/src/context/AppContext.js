// frontend/src/context/AppContext.js
import { createContext, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  // Global modal states
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [interestedProperties, setInterestedProperties] = useState([]);

  // Property list states
  const [properties, setProperties] = useState([]);
  const [originalProperties, setOriginalProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const API_BASE = process.env.REACT_APP_BACKEND_URL;

  // Property detail states
  const [propertyDetail, setPropertyDetail] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  const fetchPropertyDetail = async (id, tokenHeader) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/properties/${id}`, {
        headers: tokenHeader,
      });
      setPropertyDetail({
        ...res.data.property,
        interestedCount: res.data.interestedCount,
        userInterested: res.data.userInterested,
      });
      setAmenities(res.data.amenities || []);
      const testimonialRes = await axios.get(
        `${API_BASE}/api/properties/${id}/testimonials`
      );
      setTestimonials(testimonialRes.data.testimonials || []);
    } catch (err) {
      console.error("Error fetching property detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async (cityName, token) => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE}/api/properties?city=${cityName}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // ✅ Always make sure we have an array
      const data = Array.isArray(res.data.properties)
        ? res.data.properties
        : [];

      // ✅ Clear old properties when city is invalid or returns empty
      if (!data.length) {
        setProperties([]);
        setOriginalProperties([]);
      } else {
        setProperties(data);
        setOriginalProperties(data);
      }
    } catch (err) {
      console.error("Error fetching properties:", err);

      // ✅ Ensure stale data doesn’t persist on error
      setProperties([]);
      setOriginalProperties([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        isSidebarOpen,
        setSidebarOpen,
        theme,
        setTheme,
        showLogin,
        setShowLogin,
        showSignup,
        setShowSignup,
        properties,
        setProperties,
        originalProperties,
        setOriginalProperties,
        loading,
        setLoading,
        showFilterModal,
        setShowFilterModal,
        activeFilter,
        setActiveFilter,
        fetchProperties,
        propertyDetail,
        setPropertyDetail,
        amenities,
        setAmenities,
        testimonials,
        setTestimonials,
        fetchPropertyDetail,
        interestedProperties,
        setInterestedProperties,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
