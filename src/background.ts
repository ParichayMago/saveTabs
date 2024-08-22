import { Icontainer, Itabs } from "./App";

let grpArr: Icontainer[] = [];

chrome.runtime.onStartup.addListener(()=> {
  openExtension();
})

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "saveTabs") {
    saveTabs();
  } else {
    saveSession();
  }
  return true;
});

function createGrp(tabData: Itabs[], groupId: number): Icontainer {
  const grp: Icontainer = {
    tag: formatDate(),
    date: formatDate(),
    index: grpArr.length,
    groupId,
    tabData
  };
  return grp;
}


async function saveTabs() {
  let groupId = Math.floor(Math.random() * 100000); // Use a larger range for groupId

  chrome.tabs.query({ currentWindow: true, lastFocusedWindow: true }, async (tabs) => {
    const tabArray = tabs.map((tab) => ({
      url: tab.url!,
      client_id: tab.id!,
      groupId,
      title: tab.title!,
      image: tab.favIconUrl || "https://img.icons8.com/?size=256w&id=53372&format=png",
      index: tab.index,
    }));
    try {
      openExtension();
      closeTabs(tabArray);
      const grp = createGrp(tabArray, groupId);
      const result = await chrome.storage.local.get("grpArr");
      const updatedGrpArr = [...(result.grpArr || []), grp];
      await chrome.storage.local.set({ grpArr: updatedGrpArr });
    } catch (error) {
      console.log("Error saving tabs:", error);
    }
  });
}

// async function localStorageFunction(newGrpArr: Icontainer[]) {
//   await chrome.storage.local.set({ grpArr: newGrpArr });
//   console.log("the background ", grpArr);
// }

function closeTabs(tabs: Itabs[]) {
  const tabsToClose = tabs.filter((tab) => tab.url && !tab.url.startsWith("http://localhost:5173"));
  tabsToClose.forEach((tab) => chrome.tabs.remove(tab.client_id));
}

function openExtension(): void {
  chrome.tabs.create({ url: chrome.runtime.getURL("index.html"), active: true, pinned: true });
}

async function saveSession() {
  let allWindows = await chrome.windows.getAll({populate: true})
  let allGroups:Icontainer[] = []
  
  for (let window of allWindows) {
    if(window.tabs) {
      let groupId = Math.floor(Math.random() * 100000);
      const tabArray = window.tabs.map((tab) => ({
        url: tab.url!,
        client_id: tab.id!,
        groupId,
        title: tab.title!,
        image: tab.favIconUrl || "https://img.icons8.com/?size=256w&id=53372&format=png",
        index: tab.index,
      }));
      
      const grp = createGrp(tabArray, groupId);
      allGroups.push(grp);
      
      for (let tab of window.tabs) {
        if(tab.id && !tab.url?.startsWith("chrome://")) await chrome.tabs.remove(tab.id);
      }
    }
  }
  try{
    openExtension();
    const result = await chrome.storage.local.get("grpArr");
    const updatedGrpArr = [...(result.grpArr || []), ...allGroups];
    await chrome.storage.local.set({grpArr: updatedGrpArr});
  } catch(e){
    console.log(e)
    return;
  }
}

const options: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'long',
  year: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true
};

function formatDate(): string {
  const date = new Date();
  return date.toLocaleDateString("en-US", options);
}