export interface Strand {
  name: string;
  value: string | string[];
}

const STRANDS_KEY = "course_strands";

// Helper function to update global dynamo state
function updateDynamoState(strands: Strand[]) {
  if (typeof window !== "undefined") {
    window.dynamo.state.strands = strands.reduce(
      (acc, strand) => ({
        ...acc,
        [strand.name]: strand.value,
      }),
      {},
    );

    // Update vars to mirror strands
    window.dynamo.state.vars = {
      ...window.dynamo.state.vars,
      ...window.dynamo.state.strands,
    };
  }
}

const StrandingService = {
  // Get all strands
  getStrands(): Strand[] {
    try {
      const strands = localStorage.getItem(STRANDS_KEY);
      const parsedStrands = strands ? JSON.parse(strands) : [];
      updateDynamoState(parsedStrands);
      return parsedStrands;
    } catch (error) {
      console.error("Error getting strands:", error);
      return [];
    }
  },

  // Get a specific strand by name
  getStrand(name: string): Strand | undefined {
    const strands = this.getStrands();
    return strands.find((strand) => strand.name === name);
  },

  // Set a single strand
  setStrand(name: string, value: string | string[]) {
    try {
      const strands = this.getStrands();
      const existingIndex = strands.findIndex((strand) => strand.name === name);

      if (existingIndex >= 0) {
        strands[existingIndex] = { name, value };
      } else {
        strands.push({ name, value });
      }

      localStorage.setItem(STRANDS_KEY, JSON.stringify(strands));
      updateDynamoState(strands);
      return true;
    } catch (error) {
      console.error("Error setting strand:", error);
      return false;
    }
  },

  // Set multiple strands at once
  setStrands(newStrands: Strand[]) {
    try {
      const strands = this.getStrands();

      newStrands.forEach((newStrand) => {
        const existingIndex = strands.findIndex(
          (strand) => strand.name === newStrand.name,
        );
        if (existingIndex >= 0) {
          strands[existingIndex] = newStrand;
        } else {
          strands.push(newStrand);
        }
      });

      localStorage.setItem(STRANDS_KEY, JSON.stringify(strands));
      updateDynamoState(strands);
      return true;
    } catch (error) {
      console.error("Error setting strands:", error);
      return false;
    }
  },

  // Clear all strands
  clearStrands() {
    try {
      localStorage.removeItem(STRANDS_KEY);
      updateDynamoState([]);
      return true;
    } catch (error) {
      console.error("Error clearing strands:", error);
      return false;
    }
  },

  // Remove a specific strand
  removeStrand(name: string) {
    try {
      const strands = this.getStrands();
      const filteredStrands = strands.filter((strand) => strand.name !== name);
      localStorage.setItem(STRANDS_KEY, JSON.stringify(filteredStrands));
      updateDynamoState(filteredStrands);
      return true;
    } catch (error) {
      console.error("Error removing strand:", error);
      return false;
    }
  },
};

// Initialize global dynamo object if it doesn't exist
if (typeof window !== "undefined") {
  window.dynamo = window.dynamo || {};
  window.dynamo.state = window.dynamo.state || {};
  window.dynamo.state.strands = {};
  window.dynamo.state.vars = {};
  // Add StrandingService to global dynamo object
  window.dynamo.state = StrandingService;
}

export { StrandingService };
