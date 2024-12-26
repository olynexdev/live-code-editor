export const getMonacoLanguage = (fileName: string | undefined) => {
    if (!fileName) return "plaintext"; // Default fallback
    if (fileName.endsWith(".js") || fileName.endsWith(".jsx"))
      return "javascript";
    if (fileName.endsWith(".ts") || fileName.endsWith(".tsx"))
      return "typescript";
    if (fileName.endsWith(".css")) return "css";
    if (fileName.endsWith(".html")) return "html";
    if (fileName.endsWith(".json")) return "json";
    return "plaintext"; // Default for unsupported extensions
  };