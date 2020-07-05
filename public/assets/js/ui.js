/* ----- 20200702, ini const buat logo sm card nasional *rh ----- */
const header = document.getElementById("root");
const logo = document.createElement("img");
const cont = document.createElement("div");

/* ----- 20200702, ini const buat tabel nasional *rh ----- */
const tableNas = document.getElementById("tnas");
const rowNas = document.createElement("tr");

/* ----- 20200702, ini const buat tabel per prov *rh ----- */
const tableProv = document.getElementById("tprov");
const perProv =
  "https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/COVID19_Indonesia_per_Provinsi/FeatureServer/0/query?where=FID%20%3E%3D%201%20AND%20FID%20%3C%3D%2034&outFields=Provinsi,Kasus_Posi,Kasus_Semb,Kasus_Meni,FID&returnGeometry=false&returnDistinctValues=true&orderByFields=FID&outSR=4326&f=json";
const kumHarian =
  "https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/Statistik_Perkembangan_COVID19_Indonesia/FeatureServer/0/query?where=1%3D1&outFields=Jumlah_Kasus_Kumulatif,Jumlah_Pasien_Sembuh,Jumlah_Pasien_Meninggal,Jumlah_pasien_dalam_perawatan,Tanggal,Jumlah_Kasus_Baru_per_Hari&returnGeometry=false&orderByFields=Tanggal&outSR=4326&f=json";

/* ----- 20200702, ini mulai logo sm card nasional *rh ----- */
logo.src = "assets/images/logo.png";
logo.setAttribute("alt", "");
cont.setAttribute("class", "container");
header.appendChild(logo);
header.appendChild(cont);

let globalVar;

fetch(kumHarian)
  .then(resp => resp.json())
  .then(covid => {
    let rh1 = covid.features;
    let nodes = rh1; // data is your json
    let maxProp = "Jumlah_Kasus_Kumulatif",
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
    globalVar = nodes[maxInd];

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
    small.innerHTML = `Data per ${getShortDate(
      nodes[maxInd].attributes.Tanggal
    )}, Sumber: bnpb-inacovid19`;
    cont.appendChild(small);

    /* ----- 20200702, ini mulai tabel nasional *rh ----- */
    tableNas.appendChild(rowNas);
    let div1 = document.createElement("td"),
      div2 = document.createElement("td"),
      div3 = document.createElement("td"),
      div4 = document.createElement("td");

    div1.innerHTML = `Indonesia (Nasional)`;
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
  .then(covGraph => {
    /* ----- 20200702, ini mulai graph *rh ----- */
    fetch(kumHarian)
      .then(resp => resp.json())
      .then(covid => {
        let rh5 = covid.features;
        var totalPosi = rh5.filter(
          rh5 =>
            rh5.attributes.Tanggal < new Date(Date.now()).getTime() &&
            rh5.attributes.Jumlah_Kasus_Baru_per_Hari !== null
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
            axis: "y",
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
  })
  .then(covProv => {
    /* ----- 20200702, ini mulai tabel per prov *rh ----- */
    fetch(perProv)
      .then(resp => resp.json())
      .then(function(covid) {
        let rh3 = covid.features;
        // ambil total positif berdasarkan akumulasi per provinsi
        var totalPosi = rh3.reduce(function(totalPos, rh) {
          return totalPos + rh.attributes.Kasus_Posi;
        }, 0);
        console.log(totalPosi);

        console.log(globalVar.attributes.Jumlah_Kasus_Kumulatif); // array with maximal nodeId
        // bandingin akumulasi provinsi sama total nasional
        if (totalPosi < globalVar.attributes.Jumlah_Kasus_Kumulatif) {
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

        return rh3.map(function(corona) {
          let container = document.createElement("tr"),
            tdprov = document.createElement("td"),
            tdposi = document.createElement("td"),
            tdsemb = document.createElement("td"),
            tdmeni = document.createElement("td");

          tdprov.innerHTML = `${corona.attributes.Provinsi}`;
          tdposi.innerHTML = `${corona.attributes.Kasus_Posi}`;
          tdsemb.innerHTML = `${corona.attributes.Kasus_Semb}`;
          tdmeni.innerHTML = `${corona.attributes.Kasus_Meni}`;

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
  })
  .catch(function(error) {
    console.log(error);
  });

/* ----- 20200702, ini function get short date ----- */
function getShortDate(timestamp) {
  var a = new Date(timestamp);
  var year = a.getFullYear();
  var month = (a.getMonth() + 1).toString().padStart(2, "0");
  var date = a
    .getDate()
    .toString()
    .padStart(2, "0");
  var time = date + "/" + month + "/" + year;
  return time;
}
