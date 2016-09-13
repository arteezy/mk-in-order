function curried(fn, ...args) {
  return (...nArgs) => fn.apply(this, [...args, ...nArgs]);
}

function replaceAll(str, map) {
  const re = new RegExp(Object.keys(map).join('|'), 'gi');
  return str.replace(re, matched => map[matched]);
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

function observeNode(nodeId, performSorting) {
  let latestURI;
  $(nodeId).observe('childlist added', (record) => {
    if (record.addedNodes.length > 0) {
      if (latestURI !== record.addedNodes[0].baseURI) performSorting();
      latestURI = record.addedNodes[0].baseURI;
    }
  });
}

function sortJobList(nodeId, childClass, dateClass, parser) {
  const node = $(nodeId);
  const childList = node.children(childClass);

  childList.sort((a, b) => {
    const an = parser($(a).find(dateClass).html());
    const bn = parser($(b).find(dateClass).html());

    if (an > bn) return -1;
    if (an < bn) return 1;
    return 0;
  });

  childList.detach().appendTo(node);
}

$(document).ready(() => {
  let nodeId;
  let performSorting;

  if (location.host === 'moikrug.ru') {
    nodeId = '#jobs_list';
    performSorting = curried(sortJobList, nodeId, '.job', 'span.date', parseRusMonth);
    $('#vacancies_search_suggest_form_q').observe({ attributes: true, attributeFilter: ['class'] }, performSorting);
  }

  if (location.host === 'freelansim.ru') {
    nodeId = '#tasks_list';
    performSorting = curried(sortJobList, nodeId, '.content-list__item', 'span.params__published-at', parseRusDate);
  }

  performSorting();
  observeNode(nodeId, performSorting);
});
