function replaceAll(str, map) {
  const re = new RegExp(Object.keys(map).join('|'), 'gi');
  return str.replace(re, matched => map[matched]);
}

function parseRusDate(str) {
  const num = str.match(/\d+/)[0];
  const mod = str.match(/(мин|час|дн|ден|мес|год)/)[0];
  const calendar = {
    мин: 60,
    час: 60 * 60,
    дн: 60 * 60 * 24,
    ден: 60 * 60 * 24,
    мес: 60 * 60 * 24 * 30, // I know, I know, sorry
    год: 60 * 60 * 24 * 365,
  };
  const millis = num * calendar[mod] * 1000;
  return new Date(Date.now() - millis);
}

function parseRusMonth(str) {
  const months = {
    января: 'jan',
    февраля: 'feb',
    марта: 'mar',
    апреля: 'apr',
    мая: 'may',
    июня: 'jun',
    июля: 'jul',
    августа: 'aug',
    сентября: 'sep',
    октября: 'oct',
    ноября: 'nov',
    декабря: 'dec',
  };
  return Date.parse(replaceAll(str, months));
}

function sortJobs() {
  const jobsNode = $('#jobs_list');
  const jobsList = jobsNode.children('.job');

  jobsList.sort((a, b) => {
    const an = parseRusMonth($(a).find('span.date').html());
    const bn = parseRusMonth($(b).find('span.date').html());

    if (an > bn) return -1;
    if (an < bn) return 1;
    return 0;
  });

  jobsList.detach().appendTo(jobsNode);
}

function sortTasks() {
  const tasksNode = $('#tasks_list');
  const tasksList = tasksNode.children('.content-list__item');

  tasksList.sort((a, b) => {
    const an = parseRusDate($(a).find('span.params__published-at').html());
    const bn = parseRusDate($(b).find('span.params__published-at').html());

    if (an > bn) return -1;
    if (an < bn) return 1;
    return 0;
  });

  tasksList.detach().appendTo(tasksNode);
}

$(document).ready(() => {
  if (location.host === 'moikrug.ru') {
    sortJobs();
    let latestURI;
    $('#jobs_list').observe('childlist added', (record) => {
      if (record.addedNodes.length > 0) {
        if (latestURI !== record.addedNodes[0].baseURI) sortJobs();
        latestURI = record.addedNodes[0].baseURI;
      }
    });
    $('#vacancies_search_suggest_form_q')
      .observe({ attributes: true, attributeFilter: ['class'] }, sortJobs);
  }

  if (location.host === 'freelansim.ru') {
    sortTasks();
    let latestURI;
    $('#tasks_list').observe('childlist added', (record) => {
      if (record.addedNodes.length > 0) {
        if (latestURI !== record.addedNodes[0].baseURI) sortTasks();
        latestURI = record.addedNodes[0].baseURI;
      }
    });
  }
});
