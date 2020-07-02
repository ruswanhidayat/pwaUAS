const app3 = document.getElementById("tnas");
const container = document.createElement("tr");
app3.appendChild(container);

const urlo =
  "https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/Statistik_Perkembangan_COVID19_Indonesia/FeatureServer/0/query?where=1%3D1&outFields=Jumlah_Kasus_Kumulatif,Jumlah_Pasien_Sembuh,Jumlah_Pasien_Meninggal,Jumlah_pasien_dalam_perawatan,Tanggal&outSR=4326&f=json";
fetch(urlo)
  .then(resp => resp.json())
  .then(function(covid) {
    let authors = covid.features;
    var totalPosi = authors.filter(
      authors =>
        authors.attributes.Tanggal > ((new Date(Date.now() - 864e5)).getTime()) &&
        authors.attributes.Jumlah_Kasus_Kumulatif != null
    );
    //console.log(totalPosi);

    if (totalPosi.length == 0) {
      totalPosi = authors.filter(
        authors =>
          authors.attributes.Tanggal > ((new Date(Date.now() - 1728e5)).getTime()) &&
          authors.attributes.Jumlah_Kasus_Kumulatif != null
      );
      //console.log(totalPosi);
    }

    return totalPosi.map(function(author) {
      let div1 = document.createElement("td"),
        div2 = document.createElement("td"),
        div3 = document.createElement("td"),
        div4 = document.createElement("td");

      div1.innerHTML = `Indonesia`;
      div2.innerHTML = `${author.attributes.Jumlah_Kasus_Kumulatif}`;
      div3.innerHTML = `${author.attributes.Jumlah_Pasien_Sembuh}`;
      div4.innerHTML = `${author.attributes.Jumlah_Pasien_Meninggal}`;

      div2.setAttribute("class", "num");
      div3.setAttribute("class", "num");
      div4.setAttribute("class", "num");

      container.appendChild(div1);
      container.appendChild(div2);
      container.appendChild(div3);
      container.appendChild(div4);
    });
  })
  .catch(function(error) {
    console.log(error);
  });
