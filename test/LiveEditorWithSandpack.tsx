import {
    SandpackCodeEditor,
    SandpackLayout,
    SandpackPreview,
    SandpackProvider,
  } from "@codesandbox/sandpack-react";
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  import { SandpackFileExplorer } from "sandpack-file-explorer";
  import { useState } from "react";
  
  const themes = [
    { name: "Light", value: "light" },
    { name: "Dark", value: "dark" },
    { name: "Oceanic", value: "oceanic" },
    { name: "Monokai", value: "monokai" },
  ];
  
  const validateDependency = async (dependency: string): Promise<boolean> => {
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
  
  const LiveEditor = () => {
    const [theme, setTheme] = useState("light");
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
        setDependencies((prev) => ({
          ...prev,
          [dependency]: "latest",
        }));
        setDependency("");
      } else {
        setError(`Invalid dependency: ${dependency}`);
      }
      setLoading(false);
    };
  
    return (
      <div>
        <SandpackProvider
          template="react-ts"
          customSetup={{
            dependencies,
          }}
          theme={theme}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
          }}
        >
          <SandpackLayout>
            <div className="w-[250px]">
              {/* Theme Selector */}
              <div className="p-3 border-b">
                <select
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {themes.map((theme) => (
                    <option key={theme.value} value={theme.value}>
                      {theme.name}
                    </option>
                  ))}
                </select>
              </div>
  
              {/* Dependency Manager */}
              <div className="p-3 border-b">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={dependency}
                    onChange={(e) => setDependency(e.target.value)}
                    placeholder="Add Dependency (e.g., lodash)"
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                  <button
                    onClick={handleAddDependency}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Add"}
                  </button>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
  
              <SandpackFileExplorer />
            </div>
            <SandpackCodeEditor
            
              showTabs
              wrapContent
              closableTabs
              showInlineErrors
              showLineNumbers
              className="border"
            />
            <SandpackPreview />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    );
  };
  
  export default LiveEditor;
  