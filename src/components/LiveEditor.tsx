/* eslint-disable @typescript-eslint/ban-ts-comment */
import { SandpackProvider } from "@codesandbox/sandpack-react";
import { nightOwl } from "@codesandbox/sandpack-themes";
import MonacoSandpackIntegration from "./MonacoSandPackIntegration";
import { useState } from "react";
import { validateDependency } from "../utils/validateDependencies";

const LiveEditor = () => {
  const [dependencies, setDependencies] = useState({
    "react-markdown": "latest",
  });
  const [dependency, setDependency] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddDependency = async () => {
    if (!dependency) return;

    setLoading(true);
    setError(null);

    const isValid = await validateDependency(dependency);
    if (isValid) {
      // Update dependencies state with the new dependency
      setDependencies((prev) => ({
        ...prev,
        [dependency]: "latest", // Add dependency with "latest" version
      }));
      setDependency(""); // Clear input field
    } else {
      setError(`Invalid dependency: ${dependency}`);
    }
    setLoading(false);
  };

  return (
    <SandpackProvider
      template="react"
      options={{
        externalResources: ["https://cdn.tailwindcss.com"],
      }}
      theme={nightOwl}
      customSetup={{
        dependencies,
      }}
    >
      <MonacoSandpackIntegration
        dependency={dependency}
        error={error}
        loading={loading}
        handleAddDependency={handleAddDependency}
        setDependency={setDependency}
        setDependencies={setDependencies} // Pass setDependencies for updates
      />
    </SandpackProvider>
  );
};

export default LiveEditor;
