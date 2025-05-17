import { create } from 'zustand'

const useGlobalStore = create((set) => ({

  factories: [],
  poNumbers: [],

  fetchFactoryName: async () => {
    try {
      const response = await fetch("/api/handleFactory", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data, "data from factory name");
      if (data.factories && Array.isArray(data.factories)) {
        set({ factories: data.factories.map((factory) => factory.name) });
      } else {
        set({ factories: [] });
      }
    } catch (error) {
      console.error("Error fetching factory names:", error);
      set({ factories: [] });
    }
  },

  fetchPONumber: async () => {
    try {
      const response = await fetch("/api/handlePO", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) throw new Error("Failed to fetch PO numbers");
  
      const data = await response.json();
      const poNames = data.pos.map((po) => po.name);
    
      set({ poNumbers: poNames });
    } catch (error) {
      console.error("Error fetching PO numbers:", error);
      set({ poNumbers: [] });
    }
  }
  
  

}));

export default useGlobalStore;
