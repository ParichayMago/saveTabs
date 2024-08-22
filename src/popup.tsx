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
      <div>
        <Button onClick={() => runXtention("saveTabs")}>Save Tabs</Button>
        <Button onClick={() => runXtention("saveSeasson")}>
          {" "}
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
