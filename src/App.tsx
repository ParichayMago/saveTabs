import { useEffect, useState } from "react";
import DndList from "./components/DragAndDrop";
import { MantineProvider } from "@mantine/core";
import Container from "./components/Container";
import "@mantine/core/styles.css";

export interface Itabs {
  _id?: string;
  client_id: number;
  groupId: number;
  url: string;
  title: string;
  index: number;
  image: string;
}

export interface Icontainer {
  _id?: string;
  groupId?: number;
  tag: string;
  date: string;
  index: number;
  tabData: Itabs[];
}

const ListData = ({
  containerData,
  updateContainerData,
}: {
  containerData: Icontainer[];
  updateContainerData: (groupId: number) => void;
}) => {
  return containerData.length > 0 ? (
    <ul>
      {containerData.map((data) => (
        <div className="mt-1 text-sm" key={data._id}>
          {data.tabData.length > 0 && (
            <li>
              <Container
                tag={data.tag}
                groupId={data.groupId!}
                tabData={data.tabData}
                deleteContainer={updateContainerData}
              >
                <DndList initialData={data.tabData} />
              </Container>
            </li>
          )}
        </div>
      ))}
    </ul>
  ) : (
    <div className="bg-red p-2 m-2 text-red-600">Save tabs to continue</div>
  );
};
function App() {
  const [containerData, setContainerData] = useState<Icontainer[] | null>(null);

  const updateContainerData = async (groupId: number) => {
    const newContainerData = containerData!.filter(
      (data) => data.groupId !== groupId
    );
    await chrome.storage.local.remove("grpArr");
    await chrome.storage.local.set({ grpArr: newContainerData });
    setContainerData(newContainerData);
  };

  useEffect(() => {
    const fetchContainerData = async () => {
      const result = await chrome.storage.local.get("grpArr");
      setContainerData(result.grpArr || []);
    };
    fetchContainerData();
  }, []);

  return (
    <>
      {containerData ? (
        <div className="static">
          <MantineProvider>
            <div className="bg-black border-0 p-0 overflow-hidden text-sm">
              <ListData
                containerData={containerData}
                updateContainerData={updateContainerData}
              />
            </div>
          </MantineProvider>
        </div>
      ) : (
        <div className="bg-black">No data to be shown</div>
      )}
    </>
  );
}

export default App;
