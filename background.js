const CLIST_USERNAME = 'clist_username';
const CLIST_API_KEY = 'get_ur_api_from_clist';

const API_URL = `https://clist.by/api/v4/contest/?username=${CLIST_USERNAME}&api_key=${CLIST_API_KEY}&host__iregex=codeforces.com|codechef.com|leetcode.com&upcoming=true&order_by=start`;

async function fetchContests() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    console.log("Fetched new contest data.");

    chrome.storage.local.set({ contests: data.objects });

    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/icon128.png',
        title: 'Contests Updated!',
        message: `Found ${data.objects.length} upcoming contests. Click the icon to see them.`
    });

  } catch (error) {
    console.error("Failed to fetch contests:", error);
  }
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("Contest Notifier installed.");
  fetchContests();
  chrome.alarms.create("fetchContestAlarm", {
    periodInMinutes: 60
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "fetchContestAlarm") {
    fetchContests();
  }
});