document.addEventListener('DOMContentLoaded', () => {
  const contestList = document.getElementById('contest-list');

  chrome.storage.local.get(['contests'], (result) => {
    contestList.innerHTML = '';

    if (result.contests && result.contests.length > 0) {
      const options = {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      };

      const formatter = new Intl.DateTimeFormat('en-IN', options);

      result.contests.forEach(contest => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');

        link.href = contest.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        const startTime = new Date(contest.start + 'Z');
        const formattedTime = formatter.format(startTime);

        link.innerHTML = `<b>${contest.event}</b><br><small>${contest.host} - ${formattedTime}</small>`;

        listItem.appendChild(link);
        contestList.appendChild(listItem);
      });
    } else {
      const listItem = document.createElement('li');
      listItem.textContent = 'No upcoming contests found.';
      contestList.appendChild(listItem);
    }
  });
});