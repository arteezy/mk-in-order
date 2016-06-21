chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval)

      function sortJobs() {
        var jobs = $('#jobs_list')
        var jobs_array = jobs.children('.job')

        jobs_array.sort(function(a, b) {
          var an = Date.parse(replaceAll($(a).find('span.date').html(), months))
          var bn = Date.parse(replaceAll($(b).find('span.date').html(), months))

          if (an > bn) {
            return -1
          }
          if (an < bn) {
            return 1
          }
          return 0
        })
      }
    }
  }, 10)
})
