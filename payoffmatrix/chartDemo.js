function drawChart(dataSeries) {
  console.log(dataSeries);
  Highcharts.chart('container', {
    credits: false ,
    chart: {
        borderColor: '#4572A7',
        plotBorderWidth: 1,
        plotBorderColor: '#CCCCCC',
        backgroundColor: '#fff2cc24',
        plotShadow: true,
        type: 'spline',
    },
    title: { text: 'Option Matrix Calculator' },
    xAxis: { categories: dataSeries.xAxis },
    plotOptions: {
    series: {

        lineWidth: 2,
        shadow: true,
        marker: {
            enabled: false,
            symbol: 'circle',
            states: {
                hover: {
                    enabled: true
                }
            }
        }
    }
},

    series: dataSeries.data,
    tooltip: {
        formatter: function () {
          var indx = this.point.index
          var k = ''
          this.series.chart.userOptions.series.forEach(x=>{
            k = k+x.rowName+' : '+x.data[indx][1]+'<br/>'
          })
          return '<b>' + this.x + "</b><br/>"+k+'</div>';
        },
        backgroundColor: 'rgba(0, 0, 0, .75)', borderWidth: 2,borderRadius: 5, style: { color: 'white' }
    },

});
}



function a() {
  var indx = this.point.index
  var k = ''
  this.series.chart.userOptions.series.forEach(x=>{
  	k = k+x.rowName+' : '+x.data[indx][1]+'<br/>'
  })

    return "<b>" + this.x + "</b><br/>"+k;
}
