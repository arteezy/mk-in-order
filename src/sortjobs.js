const sortJobList = (nodeId, childClass, dateClass, titleClass, dateParser, addedRecords) => {
  if (!addedRecords) return;

  const added = Array.from(addedRecords.addedNodes).filter(
    (el) => $(el).hasClass(childClass)
  );
  const sorted = _.orderBy(
    added,
    [
      (el) => dateParser($(el).find(dateClass).html()),
      (el) => $(el).find(titleClass).attr('title')
    ],
    'desc'
  );

  if (isEqualArrayOfNodes(added, sorted)) return;

  $(nodeId).empty();
  $(sorted).appendTo(nodeId);
}

const parseRusMonth = (str) => {
  const rusMonths = [
    'января',  'февраля', 'марта',
    'апреля',  'мая',     'июня',
    'июля',    'августа', 'сентября',
    'октября', 'ноября',  'декабря'
  ];
  const engMonths = [
    'jan', 'feb', 'mar',
    'apr', 'may', 'jun',
    'jul', 'aug', 'sep',
    'oct', 'nov', 'dec'
  ];
  const months = _.zipObject(rusMonths, engMonths);
  return Date.parse(
    _.replace(
      str,
      new RegExp(rusMonths.join('|'), 'gi'),
      (match) => months[match]
    )
  );
}

const parseRusDate = (str) => {
  const num = str.match(/\d+/)[0];
  const mod = str.match(/(мин|час|дн|ден|мес|год)/)[0];
  const calendar = {
    мин: 60,
    час: 60 * 60,
    дн:  60 * 60 * 24,
    ден: 60 * 60 * 24,
    мес: 60 * 60 * 24 * 30, // Variable month length doesn't really matter here
    год: 60 * 60 * 24 * 365,
  };
  const millis = num * calendar[mod] * 1000;
  return new Date(Date.now() - millis);
}

const isEqualArrayOfNodes = (right, left) => {
  if (right.length !== left.length) return false;
  for (let i = 0; i < right.length; i++) {
    if (!right[i].isEqualNode(left[i])) {
      return false;
    }
  }
  return true;
}

$(document).ready(() => {
  let nodeId;
  let performSorting;

  if (location.host === 'moikrug.ru') {
    nodeId = '#jobs_list';
    performSorting = _.partial(
      sortJobList,
      nodeId,
      'job',
      'span.date',
      '.title',
      parseRusMonth
    );
  }

  if (location.host === 'freelansim.ru') {
    nodeId = '#tasks_list';
    performSorting = _.partial(
      sortJobList,
      nodeId,
      'content-list__item',
      'span.params__published-at',
      '.task__title',
      parseRusDate
    );
  }

  // Initial sorting
  performSorting({
    addedNodes: $(nodeId).children()
  });
  // Sorting after AJAX
  $(nodeId).observe(
    'added',
    (record) => performSorting(record)
  );
});
