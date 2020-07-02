const urle =
  "https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/Statistik_Perkembangan_COVID19_Indonesia/FeatureServer/0/query?where=1%3D1&outFields=Tanggal,Jumlah_Kasus_Baru_per_Hari&returnGeometry=false&orderByFields=Tanggal&outSR=4326&f=json";
fetch(urle)
  .then(resp => resp.json())
  .then(function(covid) {
    let authors = covid.features;
    var totalPosi = authors.filter(
      authors =>
        authors.attributes.Tanggal < new Date(Date.now()).getTime() &&
        authors.attributes.Jumlah_Kasus_Baru_per_Hari != null
    );
    //console.log(totalPosi);

    var labels = totalPosi.map(function(e) {
      return getDate(e.attributes.Tanggal);
    });
    //console.log(labels);

    var data = totalPosi.map(function(e) {
      return e.attributes.Jumlah_Kasus_Baru_per_Hari;
    });
    //console.log(data);

    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels, //["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "Penambahan Kasus",
            data: data, //[1200, 919, 873, 923, 625, 398],
            backgroundColor: "rgb(235, 247, 245)",
            borderColor: "rgb(0, 124, 145)",
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: 'Grafik Penambahan Konfirmasi Kasus Positif per Hari'
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  })
  .catch(function(error) {
    console.log(error);
  });

function getDate(timestamp) {
  var a = new Date(timestamp);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des"
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = date + " " + month + " " + year;
  return time;
}
