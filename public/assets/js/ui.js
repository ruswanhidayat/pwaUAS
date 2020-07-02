const app1 = document.getElementById("root");
const logo = document.createElement("img");
logo.src = "assets/images/logo.png";
logo.setAttribute("alt", "");

const cont = document.createElement("div");
cont.setAttribute("class", "container");

app1.appendChild(logo);
app1.appendChild(cont);

const kumulatif =
  "https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/Statistik_Perkembangan_COVID19_Indonesia/FeatureServer/0/query?where=1%3D1&outFields=Jumlah_Kasus_Kumulatif,Jumlah_Pasien_Sembuh,Jumlah_Pasien_Meninggal,Jumlah_pasien_dalam_perawatan,Tanggal&outSR=4326&f=json";
fetch(kumulatif)
  .then(resp => resp.json())
  .then(function(covid) {
    let datakumulatif = covid.features;
    // dapetin data paling update
    var semuaData = datakumulatif.filter(
      datakumulatif => datakumulatif.attributes.Jumlah_Kasus_Kumulatif != null
    );
    //console.log(totalPosi);

    var filterData = semuaData.filter(
      allData =>
        (allData.attributes.Jumlah_Kasus_Kumulatif = sortByAttr(
          semuaData,
          "Jumlah_Kasus_Kumulatif"
        ))
    );

    console.log(filterData);

    /*
  if (totalPosi.length == 0) {
      totalPosi = datakumulatif.filter(
        authors =>
          authors.attributes.Tanggal >
            new Date(Date.now() - 1728e5).getTime() &&
          authors.attributes.Jumlah_Kasus_Kumulatif != null
      );
      //console.log(totalPosi);
    }
    */

    return filterData.map(function(author) {
      let card = document.createElement("div"),
        h1 = document.createElement("h1"),
        p1 = document.createElement("p");

      card.setAttribute("class", "card card1");
      h1.innerHTML = `${author.attributes.Jumlah_Kasus_Kumulatif}`;
      p1.innerHTML = `Konfirmasi Positif`;
      cont.appendChild(card);
      card.appendChild(h1);
      card.appendChild(p1);

      let card2 = document.createElement("div"),
        h2 = document.createElement("h1"),
        p2 = document.createElement("p");

      card2.setAttribute("class", "card card2");
      h2.innerHTML = `${author.attributes.Jumlah_Pasien_Meninggal}`;
      p2.innerHTML = `Pasien Meninggal`;
      cont.appendChild(card2);
      card2.appendChild(h2);
      card2.appendChild(p2);

      let card3 = document.createElement("div"),
        h3 = document.createElement("h1"),
        p3 = document.createElement("p");

      card3.setAttribute("class", "card card3");
      h3.innerHTML = `${author.attributes.Jumlah_Pasien_Sembuh}`;
      p3.innerHTML = `Pasien Sembuh`;
      cont.appendChild(card3);
      card3.appendChild(h3);
      card3.appendChild(p3);

      let card4 = document.createElement("div"),
        h4 = document.createElement("h1"),
        p4 = document.createElement("p");

      card4.setAttribute("class", "card card4");
      h4.innerHTML = `${author.attributes.Jumlah_pasien_dalam_perawatan}`;
      p4.innerHTML = `Kasus Aktif`;
      cont.appendChild(card4);
      card4.appendChild(h4);
      card4.appendChild(p4);

      let small = document.createElement("small");
      small.innerHTML = `Data per ${getDate(
        author.attributes.Tanggal
      )}, Sumber: bnpb-inacovid19`;
      cont.appendChild(small);
    });
  })
  .catch(function(error) {
    console.log(error);
  });

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

function sortByAttr(rus, attribute) {
  return rus.sort(function(r, h) {
    return r[attribute] < h[attribute];
  });
}
