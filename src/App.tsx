import { useEffect, useState } from "react";
import DndList from "./components/DragAndDrop";
import { MantineProvider } from "@mantine/core";
import Container from "./components/Container";
import "@mantine/core/styles.css";
import img from "../public/icon.png";

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
      <div className="static">
        <div className="absolute top-1 right-2 flex cursor-pointer text-[#0e7490] ">
          <div className="self-center hover:text-[#06b6d4] hover:scale-110 ease-in-out transition  duration-100 mx-3" onClick={() => window.open("https://github.com/ParichayMago/saveTabs")}>Source Code</div>
          <div
            className="Donate Div flex m-2 hover:text-[#06b6d4] hover:scale-110 ease-in-out transition duration-100"
            onClick={() => window.open("https://razorpay.me/@parichaymago")}
          >
            <div>donatate to devs</div>
            <img height="24px" width="24px" className="" src={img} />
          </div>
        </div>
      </div>
      {containerData ? (
        <div>
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
