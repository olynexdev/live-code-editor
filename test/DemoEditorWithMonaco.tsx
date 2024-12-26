
import MonacoEditor from "@monaco-editor/react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { SandpackFileExplorer } from "sandpack-file-explorer";
import { nightOwl } from "@codesandbox/sandpack-themes";

const LiveEditor = () => {
  return (
    <SandpackProvider
      template="react"
      options={{
        externalResources: ["https://cdn.tailwindcss.com"]
      }}
      theme={nightOwl}
      customSetup={{
        dependencies: {
          "react-markdown": "latest",
        },
      }}
    >
      <MonacoSandpackIntegration />
    </SandpackProvider>
  );
};

const MonacoSandpackIntegration = () => {
  const { sandpack } = useSandpack();
  

  // Determine the language for Monaco Editor based on file extension
  const getMonacoLanguage = (fileName: string | undefined) => {
    if (!fileName) return "plaintext"; // Default fallback
    if (fileName.endsWith(".js") || fileName.endsWith(".jsx")) return "javascript";
    if (fileName.endsWith(".ts") || fileName.endsWith(".tsx")) return "typescript";
    if (fileName.endsWith(".css")) return "css";
    if (fileName.endsWith(".html")) return "html";
    if (fileName.endsWith(".json")) return "json";
    return "plaintext"; // Default for unsupported extensions
  };

  const handleEditorChange = (newValue?: string) => {
    if (sandpack.activeFile && newValue !== undefined) {
      sandpack.updateFile(sandpack.activeFile, newValue);
    }
  };


  return (
    <SandpackLayout >
      {/* Sidebar for File Management */}
      <div className="w-[250px] file-explorer h-full bg-[#011627]">
        <SandpackFileExplorer />
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <MonacoEditor
          height="100%"
          language={getMonacoLanguage(sandpack.activeFile)}
          theme={"hc-black"}
          value={sandpack.files[sandpack.activeFile]?.code || ""}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            fontSize: 18,
            lineNumbers: "on",
            cursorBlinking: "expand",
            fontFamily: "Fira code",
            fontWeight: "500",
          }}
        />
      </div>

      {/* Preview */}
      <SandpackPreview />
    </SandpackLayout>
  );
};

export default LiveEditor;
