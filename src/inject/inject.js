const months = {
  'января'   : 'jan',
  'февраля'  : 'feb',
  'марта'    : 'mar',
  'апреля'   : 'apr',
  'мая'      : 'may',
  'июня'     : 'jun',
  'июля'     : 'jul',
  'августа'  : 'aug',
  'сентября' : 'sep',
  'октября'  : 'oct',
  'ноября'   : 'nov',
  'декабря'  : 'dec'
}

function replaceAll(str, map) {
  var re = new RegExp(Object.keys(map).join('|'), 'gi')
  return str.replace(re, function(matched) {
    return map[matched]
  })
}

function parseDate(token) {
  return Date.parse(replaceAll($(token).find('span.date').html(), months))
}

function sortJobs() {
  var jobs = $('#jobs_list')
  var jobs_array = jobs.children('.job')

  jobs_array.sort(function(a, b) {
    var an = parseDate(a)
    var bn = parseDate(b)

    if (an > bn) {
      return -1
    }
    if (an < bn) {
      return 1
    }
    return 0
  })

  jobs_array.detach().appendTo(jobs)
}

$(document).ready(function() {
  sortJobs()

  $('#vacancies_search_suggest_form_q').observe({ attributes: true, attributeFilter: ['class'] }, function() {
    sortJobs()
  })
})
