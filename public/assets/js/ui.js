/* ----- ini mulai logo sm card nasional ----- */
const header = document.getElementById("root");
const logo = document.createElement("img");
const cont = document.createElement("div");
// const kumHarian2 =
//  "https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/Statistik_Perkembangan_COVID19_Indonesia/FeatureServer/0/query?where=1%3D1&outFields=Jumlah_Kasus_Kumulatif,Jumlah_Pasien_Sembuh,Jumlah_Pasien_Meninggal,Jumlah_pasien_dalam_perawatan,Tanggal&outSR=4326&f=json";

/* ----- ini mulai graph ----- */
const nasHarian =
  "https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/Statistik_Perkembangan_COVID19_Indonesia/FeatureServer/0/query?where=1%3D1&outFields=Tanggal,Jumlah_Kasus_Baru_per_Hari&returnGeometry=false&orderByFields=Tanggal&outSR=4326&f=json";

/* ----- ini mulai tabel nasional ----- */
const tableNas = document.getElementById("tnas");
const rowNas = document.createElement("tr");
// const kumHarian3 =
//  "https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/Statistik_Perkembangan_COVID19_Indonesia/FeatureServer/0/query?where=1%3D1&outFields=Jumlah_Kasus_Kumulatif,Jumlah_Pasien_Sembuh,Jumlah_Pasien_Meninggal,Jumlah_pasien_dalam_perawatan,Tanggal&outSR=4326&f=json";

/* ----- ini mulai tabel per prov ----- */
const tableProv = document.getElementById("tprov");
const perProv =
  "https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/COVID19_Indonesia_per_Provinsi/FeatureServer/0/query?where=FID%20%3E%3D%201%20AND%20FID%20%3C%3D%2034&outFields=Provinsi,Kasus_Posi,Kasus_Semb,Kasus_Meni,FID&returnGeometry=false&returnDistinctValues=true&orderByFields=FID&outSR=4326&f=json";
const kumHarian =
  "https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/Statistik_Perkembangan_COVID19_Indonesia/FeatureServer/0/query?where=1%3D1&outFields=Jumlah_Kasus_Kumulatif,Jumlah_Pasien_Sembuh,Jumlah_Pasien_Meninggal,Jumlah_pasien_dalam_perawatan,Tanggal&outSR=4326&f=json";

/* ----- ini mulai logo sm card nasional ----- */
logo.src = "assets/images/logo.png";
logo.setAttribute("alt", "");
cont.setAttribute("class", "container");
header.appendChild(logo);
header.appendChild(cont);

fetch(kumHarian)
  .then(resp => resp.json())
  .then(function(covid) {
    let covid19 = covid.features;

    var nodes = covid19, // data is your json
      maxProp = "Jumlah_Kasus_Kumulatif",
      attr = "attributes",
      maxVal = 0,
      maxInd = 0;

    for (var i = 0; i < nodes.length; i++) {
      var value = parseInt(nodes[i][attr][maxProp], 10);
      // console.log(value);
      if (value > maxVal) {
        maxVal = value;
        maxInd = i;
      }
    }
    // console.log(nodes[maxInd]);

    let card = document.createElement("div"),
      h1 = document.createElement("h1"),
      p1 = document.createElement("p");

    card.setAttribute("class", "card card1");
    h1.innerHTML = `${nodes[maxInd].attributes.Jumlah_Kasus_Kumulatif}`;
    p1.innerHTML = `Konfirmasi Positif`;
    cont.appendChild(card);
    card.appendChild(h1);
    card.appendChild(p1);

    let card2 = document.createElement("div"),
      h2 = document.createElement("h1"),
      p2 = document.createElement("p");

    card2.setAttribute("class", "card card2");
    h2.innerHTML = `${nodes[maxInd].attributes.Jumlah_Pasien_Meninggal}`;
    p2.innerHTML = `Pasien Meninggal`;
    cont.appendChild(card2);
    card2.appendChild(h2);
    card2.appendChild(p2);

    let card3 = document.createElement("div"),
      h3 = document.createElement("h1"),
      p3 = document.createElement("p");

    card3.setAttribute("class", "card card3");
    h3.innerHTML = `${nodes[maxInd].attributes.Jumlah_Pasien_Sembuh}`;
    p3.innerHTML = `Pasien Sembuh`;
    cont.appendChild(card3);
    card3.appendChild(h3);
    card3.appendChild(p3);

    let card4 = document.createElement("div"),
      h4 = document.createElement("h1"),
      p4 = document.createElement("p");

    card4.setAttribute("class", "card card4");
    h4.innerHTML = `${nodes[maxInd].attributes.Jumlah_pasien_dalam_perawatan}`;
    p4.innerHTML = `Kasus Aktif`;
    cont.appendChild(card4);
    card4.appendChild(h4);
    card4.appendChild(p4);

    let small = document.createElement("small");
    small.innerHTML = `Data per ${getDate(
      nodes[maxInd].attributes.Tanggal
    )}, Sumber: bnpb-inacovid19`;
    cont.appendChild(small);
  })
  .catch(function(error) {
    console.log(error);
  });

/* ----- ini mulai graph ----- */
fetch(nasHarian)
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
      return getShortDate(e.attributes.Tanggal);
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
        labels: labels,
        datasets: [
          {
            label: "Penambahan Kasus",
            data: data,
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
          text: "Grafik Penambahan Konfirmasi Kasus Positif per Hari"
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

/* ----- ini mulai tabel nasional ----- */
tableNas.appendChild(rowNas);

fetch(kumHarian)
  .then(resp => resp.json())
  .then(function(covid) {
    let covid19 = covid.features;
    var nodes = covid19, // data is your json
      maxProp = "Jumlah_Kasus_Kumulatif",
      attr = "attributes",
      maxVal = 0,
      maxInd = 0;

    for (var i = 0; i < nodes.length; i++) {
      var value = parseInt(nodes[i][attr][maxProp], 10);
      // console.log(value);
      if (value > maxVal) {
        maxVal = value;
        maxInd = i;
      }
    }
    // console.log(nodes[maxInd]);

    let div1 = document.createElement("td"),
      div2 = document.createElement("td"),
      div3 = document.createElement("td"),
      div4 = document.createElement("td");

    div1.innerHTML = `Indonesia`;
    div2.innerHTML = `${nodes[maxInd].attributes.Jumlah_Kasus_Kumulatif}`;
    div3.innerHTML = `${nodes[maxInd].attributes.Jumlah_Pasien_Sembuh}`;
    div4.innerHTML = `${nodes[maxInd].attributes.Jumlah_Pasien_Meninggal}`;

    div1.setAttribute("class", "prov");
    div2.setAttribute("class", "num");
    div3.setAttribute("class", "num");
    div4.setAttribute("class", "num");

    rowNas.appendChild(div1);
    rowNas.appendChild(div2);
    rowNas.appendChild(div3);
    rowNas.appendChild(div4);
  })
  .catch(function(error) {
    console.log(error);
  });

/* ----- ini mulai tabel per prov ----- */
fetch(perProv)
  .then(resp => resp.json())
  .then(function(covid) {
    let covid19 = covid.features;

    return covid19.map(function(author) {
      let container = document.createElement("tr"),
        tdprov = document.createElement("td"),
        tdposi = document.createElement("td"),
        tdsemb = document.createElement("td"),
        tdmeni = document.createElement("td");

      tdprov.innerHTML = `${author.attributes.Provinsi}`;
      tdposi.innerHTML = `${author.attributes.Kasus_Posi}`;
      tdsemb.innerHTML = `${author.attributes.Kasus_Semb}`;
      tdmeni.innerHTML = `${author.attributes.Kasus_Meni}`;

      tdprov.setAttribute("class", "prov");
      tdposi.setAttribute("class", "num");
      tdsemb.setAttribute("class", "num");
      tdmeni.setAttribute("class", "num");

      tableProv.appendChild(container);
      container.appendChild(tdprov);
      container.appendChild(tdposi);
      container.appendChild(tdsemb);
      container.appendChild(tdmeni);
    });
  })
  .catch(function(error) {
    console.log(error);
  });

fetch(perProv)
  .then(resp => resp.json())
  .then(function(covid) {
    let covid19 = covid.features;

    // ambil total positif berdasarkan akumulasi per provinsi
    var totalPosi = covid19.reduce(function(totalPos, author) {
      return totalPos + author.attributes.Kasus_Posi;
    }, 0);
    console.log(totalPosi);

    // ambil total positif dari data harian (nasional)
    fetch(kumHarian)
      .then(response => response.json())
      .then(function(corona) {
        let cek = corona.features;

        var nodes = cek, // data is your json
          maxProp = "Jumlah_Kasus_Kumulatif",
          attr = "attributes",
          maxVal = 0,
          maxInd = 0;

        for (var i = 0; i < nodes.length; i++) {
          var value = parseInt(nodes[i][attr][maxProp], 10);
          // console.log(value);
          if (value > maxVal) {
            maxVal = value;
            maxInd = i;
          }
        }

        console.log(nodes[maxInd].attributes.Jumlah_Kasus_Kumulatif); // array with maximal nodeId

        // bandingin akumulasi provinsi sama total nasional
        if (totalPosi < nodes[maxInd].attributes.Jumlah_Kasus_Kumulatif) {
          let small = document.createElement("small");
          small.innerHTML = `Data per Wilayah belum update. Terdapat perbedaan antara akumulasi data per wilayah dengan nasional.`;
          const foot = document.getElementById("foot");
          foot.appendChild(small);
        } else {
          let small = document.createElement("small");
          small.innerHTML = `Data Nasional belum update. Terdapat perbedaan antara akumulasi data per wilayah dengan nasional.`;
          const foot = document.getElementById("foot");
          foot.appendChild(small);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  })
  .catch(function(error) {
    console.log(error);
  });

/* ----- ini function longdate ----- */
function getDate(timestamp) {
  var a = new Date(timestamp);
  var months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = date + " " + month + " " + year;
  return time;
}

/* ----- ini function short date ----- */
function getShortDate(timestamp) {
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
