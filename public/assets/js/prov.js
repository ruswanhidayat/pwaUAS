const app2 = document.getElementById("tprov");

const url =
  "https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/COVID19_Indonesia_per_Provinsi/FeatureServer/0/query?where=FID%20%3E%3D%201%20AND%20FID%20%3C%3D%2034&outFields=Provinsi,Kasus_Posi,Kasus_Semb,Kasus_Meni,FID&returnGeometry=false&returnDistinctValues=true&orderByFields=FID&outSR=4326&f=json";
fetch(url)
  .then(resp => resp.json())
  .then(function(covid) {
    let authors = covid.features;
    return authors.map(function(author) {
      let container = document.createElement("tr"),
        tdprov = document.createElement("td"),
        tdposi = document.createElement("td"),
        tdsemb = document.createElement("td"),
        tdmeni = document.createElement("td");

      tdprov.innerHTML = `${author.attributes.Provinsi}`;
      tdposi.innerHTML = `${author.attributes.Kasus_Posi}`;
      tdsemb.innerHTML = `${author.attributes.Kasus_Semb}`;
      tdmeni.innerHTML = `${author.attributes.Kasus_Meni}`;

      tdposi.setAttribute("class", "num");
      tdsemb.setAttribute("class", "num");
      tdmeni.setAttribute("class", "num");

      app2.appendChild(container);
      container.appendChild(tdprov);
      container.appendChild(tdposi);
      container.appendChild(tdsemb);
      container.appendChild(tdmeni);
    });
  })
  .catch(function(error) {
    console.log(error);
  });

const urli =
  "https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/COVID19_Indonesia_per_Provinsi/FeatureServer/0/query?where=FID%20%3E%3D%201%20AND%20FID%20%3C%3D%2034&outFields=Provinsi,Kasus_Posi,Kasus_Semb,Kasus_Meni,FID&returnGeometry=false&returnDistinctValues=true&orderByFields=FID&outSR=4326&f=json";
fetch(urli)
  .then(resp => resp.json())
  .then(function(covid) {
    let authors = covid.features;

    var totalPosi = authors.reduce(function(totalPos, author) {
      return totalPos + author.attributes.Kasus_Posi;
    }, 0);
    console.log(totalPosi);

    const uri =
      "https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/Statistik_Perkembangan_COVID19_Indonesia/FeatureServer/0/query?where=1%3D1&outFields=Jumlah_Kasus_Kumulatif,Jumlah_Pasien_Sembuh,Jumlah_Pasien_Meninggal,Jumlah_pasien_dalam_perawatan,Tanggal&outSR=4326&f=json";
    fetch(uri)
      .then(response => response.json())
      .then(function(corona) {
        let cek = corona.features;
      let check = cek.attributes;
        var total = cek.filter(
          cek =>
            cek.attributes.Tanggal > new Date(Date.now() - 864e5).getTime() &&
            cek.attributes.Jumlah_Kasus_Kumulatif != null
        );
        // console.log(total);

        if (total.length == 0) {
          total = cek.filter(
            cek =>
              cek.attributes.Tanggal >
                new Date(Date.now() - 1728e5).getTime() &&
              cek.attributes.Jumlah_Kasus_Kumulatif != null
          );
          // console.log(total);
        }

        // dapetin data paling update
        var semuaData = cek.filter(
          cek =>
            cek.attributes.Jumlah_Kasus_Kumulatif != null &&
            cek.attributes.Jumlah_Kasus_Kumulatif ==
              Math.max(cek)
        );
        console.log(semuaData);
      console.log(cek);
      console.log(Math.max.apply(Math, cek.attributes.Jumlah_Kasus_Kumulatif));
/*
        var filterData = semuaData.filter(
          semuaData =>
            (semuaData.attributes.Jumlah_Kasus_Kumulatif = sortByAttr(
              semuaData,
              "Jumlah_Kasus_Kumulatif"
            ))
        );

        console.log(filterData);*/

        var positif = total.reduce(function(totalPos, tot) {
          return (totalPos = tot.attributes.Jumlah_Kasus_Kumulatif);
        }, 0);
        //console.log(positif);

        if (totalPosi < positif) {
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

function sortByAttr(rus, attribute) {
  var max = 0;
  var maxItem = null;
  for (var i=0; i < rus.length; i++) {
    var item = rus[i];
    if (item[attribute] > max) {
      max = item[attribute];
      maxItem = item;
    }
  }
  return maxItem;
}
