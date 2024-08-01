import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const useCategoryNavigation = (category, setCategory) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (category === 'Equipment') {
      navigate('/items/create/equipment', { state: { category: 'Equipment' } });
    } else if (category === 'Consumables') {
      navigate('/items/create/consumables', { state: { category: 'Consumables' } });
    } else if (category === 'Services') {
      navigate('/items/create/services', { state: { category: 'Services' } });
    }
  }, [category, navigate]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  return {
    category: location.state?.category || category,
    handleCategoryChange
  };
};

export default useCategoryNavigation;
