// Sidebar.tsx
import { LuFolders } from "react-icons/lu";
import { LiaSearchSolid } from "react-icons/lia";
import { RxDashboard } from "react-icons/rx";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineSettings } from "react-icons/md";

const Sidebar = ({ isOpenFiles, setIsOpenFiles }: { isOpenFiles: boolean; setIsOpenFiles: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <div>
      <div className="w-[60px] h-screen bg-[#113655] flex flex-col justify-between items-center text-2xl py-5">
        <ul className="space-y-5">
          <li title="Folders" onClick={() => setIsOpenFiles(!isOpenFiles)} className="cursor-pointer">
            <LuFolders />
          </li>
          <li>
            <button>
              <LiaSearchSolid />
            </button>
          </li>
          <li>
            <button>
              <RxDashboard />
            </button>
          </li>
        </ul>
        <ul className="space-y-5">
          <li>
            <button>
              <FaRegUserCircle />
            </button>
          </li>
          <li>
            <button>
              <MdOutlineSettings />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
