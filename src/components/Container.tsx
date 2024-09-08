import React, { useState, useEffect, ReactElement } from "react";
import { Itabs } from "../App";

interface ContainerOfTabsProps {
  children: ReactElement<{ initialData: Itabs[] }>;
  tag: string;
  groupId: number;
  tabData: Itabs[];
  deleteContainer: (groupId: number) => void;
}

const ContainerOfTabs: React.FC<ContainerOfTabsProps> = ({
  children,
  tag,
  groupId,
  tabData,
  deleteContainer,
}) => {
  const [currentTabData, setCurrentTabData] = useState<Itabs[]>(tabData);

  useEffect(() => {
    setCurrentTabData(tabData);
  }, [tabData]);

  useEffect(() => {
    console.log("use Effect has been called")
    if (currentTabData.length == 0) {
      deleteContainer(groupId);
    }
  }, [currentTabData, deleteContainer, groupId]);

  async function retrieveAllTabs(groupId: number) {
    const result = await chrome.storage.local.get("grpArr");
    const grpArr = result.grpArr;

    if (Array.isArray(grpArr)) {
      const group = grpArr.find((group: any) => group.groupId === groupId);

      if (group) {
        const urls = [...new Set(group.tabData.map((tab: any) => tab.url))];
        const newWindow = await chrome.windows.create({ focused: true });
        const windowId = newWindow.id;
        for (const url of urls) {
          if (typeof url === "string") {
            await chrome.tabs.create({ windowId, url });
          }
        }
      }
    }
  }

  return (
    <>
      {currentTabData.length > 0 && (
        <div className="bg-gray-800 rounded-md text-sm pb-1 py-2 mb-2">
          <div className="flex items-center">
            <span className="ml-2 text-white font-medium">{tag}</span>
            <div>
              <button
                onClick={() => retrieveAllTabs(groupId)}
                className="text-blue-400 hover:text-blue-300 transition-colors mx-5"
              >
                Retrieve All Tabs
              </button>
              <button
                onClick={() => deleteContainer(groupId)}
                className="text-rose-400 hover:text-rose-600 transition-colors mx-5"
              >
                Delete All Tabs
              </button>
            </div>
          </div>
          <div className="text-sm width-full">
            {React.cloneElement(children, { initialData: currentTabData })}
          </div>
        </div>
      )}
    </>
  );
};

export default ContainerOfTabs;
