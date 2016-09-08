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

function replaceAll(str, map) {
  const re = new RegExp(Object.keys(map).join('|'), 'gi');
  return str.replace(re, matched => map[matched]);
}

function parseDate(token) {
  return Date.parse(replaceAll($(token).find('span.date').html(), months));
}

function sortJobs() {
  const jobsNode = $('#jobs_list');
  const jobsList = jobsNode.children('.job');

  jobsList.sort((a, b) => {
    const an = parseDate(a);
    const bn = parseDate(b);

    if (an > bn) return -1;
    if (an < bn) return 1;
    return 0;
  });

  jobsList.detach().appendTo(jobsNode);
}

$(document).ready(() => {
  sortJobs();
  $('#vacancies_search_suggest_form_q')
    .observe({ attributes: true, attributeFilter: ['class'] }, sortJobs);
});
