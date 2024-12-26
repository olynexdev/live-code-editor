export const validateDependency = async (dependency: string): Promise<boolean> => {
    try {
      const response = await fetch(`https://registry.npmjs.org/${dependency}`);
      if (response.ok) {
        return true; // Dependency exists
      }
    } catch (err) {
      console.error("Error validating dependency:", err);
    }
    return false; // Dependency does not exist
  };