function drawChartX(a) {
  Highcharts.chart(a.id, {
    chart: { type: 'bar' },
    title: { text:null },
    xAxis: {
      categories: a.chartLabels,
      title: { text: null },
      labels: { style: { color: '#007ab1', fontSize:'17px' } },
    },
    yAxis: {
      title: { enabled:false, text: 'Population (millions)', align: 'high' },
      labels: {enabled:false, overflow: 'justify' }
    },
    tooltip: {
      style: { fontSize: '25px'},
      formatter: function () {
            return this.x +' <br><b>  ' + this.y + '</b>';
        }
      },
    plotOptions: { series: { dataLabels: { enabled: true, inside: true, } } },
    legend: {
      enabled: false,
    },
    credits: { enabled: false },
    series: [{
        dataLabels: [ { enabled: true, align: 'left', style: { fontSize: '20px'}, format: a.chartFormat}, ],
        data: a.chartData ,
    }],

  });


}



async function fetchData(a) {
  var res = await fetch(a.url, { method: a.type, body: a.data })
  return res.json()
}
