/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import MonacoEditor from "@monaco-editor/react";
import {
  SandpackLayout,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { getMonacoLanguage } from "../utils/getMonacoLanguage";
import { useState, useEffect } from "react";
//@ts-ignore
import { SandpackFileExplorer } from "sandpack-file-explorer";
import Sidebar from "./Sideber";
import { MdClose } from "react-icons/md";

const MonacoSandpackIntegration = ({
  dependency,
  setDependency,
  handleAddDependency,
  loading,
  error,
}: any) => {
  const { sandpack } = useSandpack();
  const [isOpenFiles, setIsOpenFiles] = useState(true);

  // Manage active tabs (file names)
  const [tabs, setTabs] = useState<string[]>([
    sandpack.activeFile || "index.html",
  ]);
  const [activeTab, setActiveTab] = useState<string>(sandpack.activeFile);

  useEffect(() => {
    setActiveTab(sandpack.activeFile);
  }, [sandpack.activeFile]);

  // Track active file and update the tab when the active file changes
  useEffect(() => {
    if (sandpack.activeFile && !tabs.includes(sandpack.activeFile)) {
      setTabs((prevTabs) => [...prevTabs, sandpack.activeFile]);
    }
  }, [sandpack.activeFile, tabs]);

  // Handle file content change in the Monaco editor
  const handleEditorChange = (newValue?: string) => {
    if (sandpack.activeFile) {
      sandpack.updateFile(sandpack.activeFile, newValue);
    }
  };

  // Switch to the tab clicked
  const handleTabClick = (fileName: string) => {
    setActiveTab(fileName);
  };

  // Close a specific tab
  const handleTabClose = (fileName: string) => {
    // Remove the tab
    setTabs((prevTabs) => prevTabs.filter((tab) => tab !== fileName));

    // If the closed tab was the active tab, switch to the first available tab
    if (fileName === activeTab) {
      setActiveTab(tabs[0] || "");
    }
  };

  // Open a new file from the file explorer (new file is passed here as `fileName`)
  const handleNewFile = (fileName: string) => {
    if (!tabs.includes(fileName)) {
      setTabs((prevTabs) => [...prevTabs, fileName]);
      setActiveTab(fileName);
    }
  };

  return (
    <SandpackLayout>
      {/* Sidebar for File Management */}
      <Sidebar isOpenFiles={isOpenFiles} setIsOpenFiles={setIsOpenFiles} />

      {isOpenFiles && (
        <div className="w-[250px]  flex flex-col justify-between h-full bg-[#011627] font-outfit ">
          <div className="file-explorer">
            <SandpackFileExplorer onFileOpen={handleNewFile} />
          </div>

          {/* Dependency Manager */}
          <div className="p-3 pb-5">
            <hr />
            <div className="flex items-center gap-2 mt-5">
              <input
                type="text"
                value={dependency}
                onChange={(e) => setDependency(e.target.value)}
                placeholder="Add Dependency"
                className="flex-1 px-3 py-2 border rounded-md w-[100px]"
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
        </div>
      )}

      {/* Monaco Editor and Tabs */}
      <div className="flex-1 font-outfit">
        <div className="flex space-x-2 p-2 bg-[#011627] overflow-x-auto">
          {tabs.map((tab, i) => (
            <div
              key={i}
              className={`px-3 flex items-center py-1 rounded font-outfit ${
                activeTab === tab
                  ? "bg-[#2f4b5d] text-white"
                  : "bg-[#3a4e5e] text-gray-300"
              }`}
            >
              <button onClick={() => handleTabClick(tab)}>
                {tab.split("/").pop()}
              </button>
              <button
                onClick={() => handleTabClose(tab)}
                className="ml-2 text-red-500 text-lg"
              >
                <MdClose />
              </button>
            </div>
          ))}
        </div>

        {/* Monaco Editor */}
        <div  className="overflow-hidden h-[96vh]">
          <MonacoEditor
            height="100%"
            width="100%"
            language={getMonacoLanguage(sandpack.activeFile || "")} // getMonacoLanguage(sandpack.activeFile || "") 
            theme="vs-dark"
            value={sandpack.files[activeTab]?.code || ""}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: true },
              scrollBeyondLastLine: true,
              wordWrap: "on",
              fontSize: 18,
              lineNumbers: "on",
              cursorBlinking: "expand",
              fontFamily: "Fira code",
              fontWeight: "500",
              autoClosingQuotes: "always",
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              parameterHints: { enabled: true },
              acceptSuggestionOnCommitCharacter: true,
              inlineSuggest: { enabled: true },
            }}
          />
        </div>
      </div>

      {/* Preview */}
      <SandpackPreview />
    </SandpackLayout>
  );
};

export default MonacoSandpackIntegration;
