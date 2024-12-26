import React, { useEffect, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { nightOwl } from "@codesandbox/sandpack-themes";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { Tree, Folder, File } from "./FileTree";
import { FileDiff, FolderPlus, Trash, Edit } from "lucide-react";

const buildFileTree = (files: Record<string, { code: string }>) => {
  const root: Record<string, any> = {};

  Object.keys(files).forEach((filePath) => {
    const parts = filePath.split("/").filter(Boolean);
    let current = root;

    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = {
          children: {},
          isFile: index === parts.length - 1,
          path: filePath,
        };
      }
      current = current[part].children;
    });
  });

  return root;
};

const isValidFileFormat = (fileName: string) => {
  const validExtensions = [".html", ".css", ".jsx", ".js", ".tsx", ".ts"];
  return validExtensions.some((ext) => fileName.endsWith(ext));
};

const renderTree = (
  node: any,
  key: string,
  onSelectFile: (path: string) => void,
  onCreate: (type: "file" | "folder", parentPath: string) => void,
  onDelete: (path: string) => void,
  onRename: (path: string) => void,
  editingNode: { type: "file" | "folder"; parentPath: string } | null,
  setEditingNode: React.Dispatch<
    React.SetStateAction<{ type: "file" | "folder"; parentPath: string } | null>
  >
) => {
  if (node.isFile) {
    return (
      <File key={key} value={node.path} onClick={() => onSelectFile(node.path)}>
        <div className="flex items-center justify-between">
          {key}
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRename(node.path);
              }}
            >
              <Edit size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node.path);
              }}
            >
              <Trash size={14} />
            </button>
          </div>
        </div>
      </File>
    );
  }

  return (
    <Folder key={key} value={key} element={key}>
      <div className="flex items-center justify-between">
        {key}
        <div className="flex gap-2">
          <button
            onClick={() =>
              setEditingNode({ type: "file", parentPath: node.path })
            }
          >
            <FileDiff size={14} />
          </button>
          <button
            onClick={() =>
              setEditingNode({ type: "folder", parentPath: node.path })
            }
          >
            <FolderPlus size={14} />
          </button>
        </div>
      </div>
      {editingNode?.parentPath === node.path && (
        <div className="pl-5">
          <input
            type="text"
            autoFocus
            placeholder={`Enter ${editingNode.type} name`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEditingNode(null);
              }
            }}
            onBlur={() => setEditingNode(null)}
            className="bg-gray-800 text-white p-2 rounded"
          />
        </div>
      )}
      {Object.entries(node.children).map(([childKey, childNode]) =>
        renderTree(
          childNode,
          childKey,
          onSelectFile,
          onCreate,
          onDelete,
          onRename,
          editingNode,
          setEditingNode
        )
      )}
    </Folder>
  );
};

const LiveEditor = () => {
  return (
    <SandpackProvider
      template="react"
      options={{
        externalResources: ["https://cdn.tailwindcss.com"],
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
  console.log(sandpack);
  const [fileTree, setFileTree] = useState<any>({});
  const [editingNode, setEditingNode] = useState<{
    type: "file" | "folder";
    parentPath: string;
  } | null>(null);

  useEffect(() => {
    const tree = buildFileTree(sandpack.files);
    setFileTree(tree);
  }, [sandpack.files]);

  const handleSelectFile = (filePath: string) => {
    sandpack.openFile(filePath);
  };

 // Function to clean the path and remove the file extension (if any)
const cleanPath = (path: string): string => {
  let updatePath = path.split("/");
  const lastSegment = updatePath[updatePath.length - 1];

  // Check if the last segment has an extension and remove it
  if (/\.(html|css|js)$/i.test(lastSegment)) {
    updatePath.pop(); // Remove the last segment (e.g., index.html)
  }

  return updatePath.join("/");
};

// Function to validate the file format
const isValidFileFormat = (fileName: string): boolean => {
  // Regular expression to match valid file extensions
  const validExtensions = /\.(html|css|jsx|js|tsx|ts)$/i;
  return validExtensions.test(fileName);
};

// Function to handle file creation
const createFile = (path: string, newName: string) => {
  if (!isValidFileFormat(newName)) {
    alert("Invalid file format. Supported formats: .html, .css, .jsx, .js, .tsx, .ts");
    return;
  }

  const finalPath = cleanPath(path);
  sandpack.addFile(`${finalPath}/${newName}`, "// New file");
};

// Function to handle folder creation
const createFolder = (path: string) => {
  const finalPath = cleanPath(path);
  sandpack.addFile(`${finalPath}/.gitkeep`, ""); // Simulate folder with .gitkeep
};

// Main handler function to create file or folder
const handleCreate = (type: "file" | "folder", parentPath: string) => {
  const newName = prompt(`Enter ${type} name:`) || "";

  if (!newName) {
    return; // Exit if no name is provided
  }

  if (type === "file") {
    createFile(parentPath, newName);
  } else if (type === "folder") {
    createFolder(parentPath);
  }
};


  const handleDelete = (path: string) => {
    const confirmDelete = confirm(`Are you sure you want to delete ${path}?`);
    if (confirmDelete) {
      sandpack.deleteFile(path);
    }
  };

  const handleRename = (path: string) => {
    const newFileName = prompt("Enter the new file/folder name:");
    if (!newFileName) return;

    const parts = path.split("/");
    parts[parts.length - 1] = newFileName;
    const newPath = parts.join("/");
    sandpack.addFile(newPath, sandpack.files[path]?.code || "// Renamed file");
    sandpack.deleteFile(path);
  };

  const getMonacoLanguage = (fileName: string | undefined) => {
    if (!fileName) return "plaintext";
    if (fileName.endsWith(".js") || fileName.endsWith(".jsx"))
      return "javascript";
    if (fileName.endsWith(".ts") || fileName.endsWith(".tsx"))
      return "typescript";
    if (fileName.endsWith(".css")) return "css";
    if (fileName.endsWith(".html")) return "html";
    if (fileName.endsWith(".json")) return "json";
    return "plaintext";
  };

  return (
    <SandpackLayout>
      <div className="w-[250px] file-explorer h-full bg-[#011627] font-outfit overflow-y-auto">
        <Tree>
          {Object.entries(fileTree).map(([key, node]) =>
            renderTree(
              node,
              key,
              handleSelectFile,
              handleCreate,
              handleDelete,
              handleRename,
              editingNode,
              setEditingNode
            )
          )}
        </Tree>
      </div>
      <div className="flex-1">
        <MonacoEditor
          height="100%"
          language={getMonacoLanguage(sandpack.activeFile)}
          theme={"vs-dark"}
          value={sandpack.files[sandpack.activeFile]?.code || ""}
          onChange={(newValue) => {
            if (sandpack.activeFile && newValue !== undefined) {
              sandpack.updateFile(sandpack.activeFile, newValue);
            }
          }}
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
      <SandpackPreview />
    </SandpackLayout>
  );
};

export default LiveEditor;
