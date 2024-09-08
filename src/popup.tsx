import { Button, MantineProvider } from "@mantine/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function runXtention(action: string) {
  chrome.runtime.sendMessage({
    action: action === "saveTabs" ? "saveTabs" : "saveSeasson",
  });
}

const Popup = () => {
  return (
    <>
      <div className="p-2 space-y-2">
        <Button
          className="bg-blue-500 text-white font-bold py-1 px-1 my-1 rounded-lg hover:bg-blue-600 shadow-md transition duration-300 ease-in-out"
          onClick={() => runXtention("saveTabs")}
        >
          Save Tabs
        </Button>
        <Button
          className="bg-green-500 text-white font-bold py-1 px-1 my-1 rounded-lg hover:bg-green-600 shadow-md transition duration-300 ease-in-out"
          onClick={() => runXtention("saveSeasson")}
        >
          Save Seasson
        </Button>
      </div>
    </>
  );
};

const rootElement = document.getElementById("popup-root");
const root = createRoot(rootElement!);

root.render(
  <StrictMode>
    <MantineProvider>
      <Popup />
    </MantineProvider>
  </StrictMode>
);
