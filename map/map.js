// Inisialisasi peta
var map = L.map('map').setView([-6.200000, 106.816666], 10);

// Tambahkan basemap (OpenStreetMap)
const basemaps = {
    osm: L.tileLayer.provider('OpenStreetMap.Mapnik'),
    satellite: L.tileLayer.provider('Esri.WorldImagery'),
    topo: L.tileLayer.provider('OpenTopoMap'),
    outdoors: L.tileLayer.provider('Thunderforest.Outdoors')
};

// Tambahkan basemap default
basemaps.satellite.addTo(map);

// Event listener untuk pemilihan basemap
document.getElementById('basemap-select').addEventListener('change', function (event) {
    const selectedBasemap = event.target.value;

    // Hapus semua layer tile
    map.eachLayer(function (layer) {
        if (layer instanceof L.TileLayer) {
            map.removeLayer(layer);
        }
    });

    // Tambahkan basemap yang dipilih
    basemaps[selectedBasemap].addTo(map);
});

// Buat grup layer
var pointsLayer = L.layerGroup().addTo(map);
var polygonsLayer = L.layerGroup().addTo(map);
var polygonsLayer2 = L.layerGroup().addTo(map);

// // Path ke file GeoJSON lokal
var titikGeoJSON = 'asset/data/Point Genangan.geojson';
var kabupatenGeoJSON = 'asset/data/Data Perkelurahan.geojson';
var kabupatenGeoJSON2 = 'asset/data/DKI.geojson';

// Fungsi untuk menambahkan marker
// Definisikan basePath di luar fungsi
var basePath = "file:///D:/MY%20Data/kerjaan/2024/pelatihan/MODUL/PELATIHAN%20WEBGIS/Bahan/WEBSITE/Gis/images/"; // Ganti dengan path yang sesuai

// Definisikan basePath dengan format yang sesuai
var basePath = "file:///D:/MY%20Data/kerjaan/2024/pelatihan/MODUL/PELATIHAN%20WEBGIS/Bahan/WEBSITE/Gis/images/";

function addMarkers() {
  fetch(titikGeoJSON)
    .then(response => response.json())
    .then(data => {
      console.log('GeoJSON Point Data:', data);  // Debug untuk memeriksa struktur data

      var geojsonLayer = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
          console.log('Feature properties:', feature.properties);  // Debug untuk memeriksa properti fitur

          // Ambil ID foto dan buat path lengkap
          var fotoId = feature.properties['Foto'];
          var fotoPath = fotoId !== null ? basePath + fotoId + '.jpeg' : null;

          // Buat konten popup
          var popupContent = '<table>\
                              <tr>\
                                  <th scope="row">Name</th>\
                                  <td>' + (feature.properties['name'] !== null ? feature.properties['name'] : 'Data tidak tersedia') + '</td>\
                              </tr>\
                              <tr>\
                                  <th scope="row">Ruas Jalan</th>\
                                  <td>' + (feature.properties['Ruas Jalan'] !== null ? feature.properties['Ruas Jalan'] : 'Data tidak tersedia') + '</td>\
                              </tr>\
                              <tr>\
                                  <th scope="row">RT</th>\
                                  <td>' + (feature.properties['Ruas Jal_1'] !== null && feature.properties['Ruas Jal_1'] !== '-' ? feature.properties['Ruas Jal_1'] : 'Tidak ada') + '</td>\
                              </tr>\
                              <tr>\
                                  <th scope="row">Kabupaten</th>\
                                  <td>' + (feature.properties['Ruas Jal_2'] !== null && feature.properties['Ruas Jal_2'] !== '-' ? feature.properties['Ruas Jal_2'] : 'Tidak ada') + '</td>\
                              </tr>\
                              <tr>\
                                  <th scope="row">Tinggi Genangan</th>\
                                  <td>' + (feature.properties['Ruas Jal_3'] !== null && feature.properties['Ruas Jal_3'] !== '-' ? feature.properties['Ruas Jal_3'] : 'Tidak ada') + '</td>\
                              </tr>\
                              <tr>\
                                  <th scope="row">Foto</th>\
                                  <td>' + (fotoPath !== null ? '<img src="' + fotoPath + '" style="width:100px; height:auto;">' : 'Foto tidak tersedia') + '</td>\
                              </tr>\
                              <tr>\
                                  <th scope="row">Kategori</th>\
                                  <td>' + (feature.properties['Kategori'] !== null ? feature.properties['Kategori'] : 'Data tidak tersedia') + '</td>\
                              </tr>\
                          </table>';

          // Tambahkan marker dengan popup
          var marker = L.marker(latlng);
          marker.bindPopup(popupContent);
          return marker;
        }
      });

      // Tambahkan layer geojson ke pointsLayer
      pointsLayer.addLayer(geojsonLayer);
    })
    .catch(error => console.error('Error fetching point GeoJSON:', error));
}




function addKabupatenPolygons() {
  fetch(kabupatenGeoJSON)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          // Debug: Log GeoJSON data yang diterima
          console.log("GeoJSON Data:", data);
          
          // Pastikan GeoJSON memiliki properti 'features'
          if (!data.features || data.features.length === 0) {
              console.error("No features found in GeoJSON data");
              return;
          }

          var geojsonLayer = L.geoJSON(data, {
              style: function (feature) {
                  return { color: 'blue', weight: 2 };
              },
              onEachFeature: function (feature, layer) {
                  // Debug: Lihat properti dari tiap fitur
                  console.log("Feature properties:", feature.properties);

                  // Membuat popup content dari properti yang ada
                  var props = feature.properties;
                  var popupContent = '<table>\
                      <tr>\
                          <th scope="row">KELURAHAN</th>\
                          <td>' + (props.NAMOBJ !== null ? props.NAMOBJ : 'Data tidak tersedia') + '</td>\
                      </tr>\
                      <tr>\
                          <th scope="row">Luas</th>\
                          <td>' + (props.area !== null ? props.area + ' km²' : 'Data tidak tersedia') + '</td>\
                      </tr>\
                      <tr>\
                          <th scope="row">Populasi</th>\
                          <td>' + (props.population !== null ? props.population : 'Data tidak tersedia') + '</td>\
                      </tr>\
                      <tr>\
                          <th scope="row">Ibu Kota</th>\
                          <td>' + (props.capital !== null ? props.capital : 'Data tidak tersedia') + '</td>\
                      </tr>\
                      <tr>\
                          <th scope="row">Jumlah RT</th>\
                          <td>' + (props["Jumlah RT"] !== null ? props["Jumlah RT"] : 'Data tidak tersedia') + '</td>\
                      </tr>\
                      <tr>\
                          <th scope="row">Ketinggian</th>\
                          <td>' + (props.Ketinggian !== null ? props.Ketinggian : 'Data tidak tersedia') + '</td>\
                      </tr>\
                      <tr>\
                          <th scope="row">Penyebab</th>\
                          <td>' + (props.Penyebab !== null ? props.Penyebab : 'Data tidak tersedia') + '</td>\
                      </tr>\
                      <tr>\
                          <th scope="row">Kategori</th>\
                          <td>' + (props.Kategori !== null ? props.Kategori : 'Data tidak tersedia') + '</td>\
                      </tr>\
                      <tr>\
                          <th scope="row">Lokasi</th>\
                          <td>' + (props.Lokasi !== null ? props.Lokasi : 'Data tidak tersedia') + '</td>\
                      </tr>\
                  </table>';


                  // Mengikat popup ke layer
                  layer.bindPopup(popupContent);
              }
          });

          // Tambahkan layer poligon ke map
          polygonsLayer.addLayer(geojsonLayer);
      })
      .catch(error => console.error('Error fetching polygon GeoJSON:', error));
}


// Fungsi untuk menambahkan polygon Data Perkelurahan
function addDataPerkelurahanPolygons() {
    fetch(kabupatenGeoJSON)
        .then(response => response.json())
        .then(json_DataPerkelurahan_1 => {
            var layer_DataPerkelurahan_1 = L.geoJson(json_DataPerkelurahan_1, {
                attribution: '',
                interactive: true,
                onEachFeature: pop_DataPerkelurahan_1,
                style: style_DataPerkelurahan_1
            });
            polygonsLayer.addLayer(layer_DataPerkelurahan_1);
        })
        .catch(error => console.error('Error fetching polygon Data Perkelurahan GeoJSON:', error));
}

// Fungsi untuk popups Data Perkelurahan
function pop_DataPerkelurahan_1(feature, layer) {
    if (feature.properties && feature.properties.name) {
        layer.bindPopup("<b>Perkelurahan: </b>" + feature.properties.name);
    }
}

// Function to define styles for Data Perkelurahan polygons
function style_DataPerkelurahan_1(feature) {
    return {
        color: 'blue', 
        weight: 2,     
        fillColor: 'green', 
        fillOpacity: 0.5 
    };
}

// Fungsi untuk menambahkan polygon (kabupaten) kedua
function addKabupaten2Polygons() {
    fetch(kabupatenGeoJSON2)
        .then(response => response.json())
        .then(data => {
            var geojsonLayer = L.geoJSON(data, {
                style: function (feature) {
                    return {
                        opacity: 1,
                        color: 'rgba(255,238,3,1.0)',
                        weight: 4,
                        fillOpacity: 0,
                        interactive: true,
                    };
                },
                onEachFeature: function (feature, layer) {
                    layer.bindPopup("<b>Kabupaten: </b>" + feature.properties.name);
                }
            });
            polygonsLayer2.addLayer(geojsonLayer);
        })
        .catch(error => console.error('Error fetching polygon GeoJSON:', error));
}

// Panggil fungsi untuk menambahkan semua data
addMarkers();
addKabupatenPolygons();
addDataPerkelurahanPolygons();
addKabupaten2Polygons();

// Event listener untuk checkbox
document.getElementById('show-points').addEventListener('change', function () {
    if (this.checked) {
        map.addLayer(pointsLayer);
    } else {
        map.removeLayer(pointsLayer);
    }
});

document.getElementById('show-polygons').addEventListener('change', function () {
    if (this.checked) {
        map.addLayer(polygonsLayer);
    } else {
        map.removeLayer(polygonsLayer);
    }
});

document.getElementById('show-polygons2').addEventListener('change', function () {
    if (this.checked) {
        map.addLayer(polygonsLayer2);
    } else {
        map.removeLayer(polygonsLayer2);
    }
});

// Sidebar functionality
const sidebar = document.querySelector('.sidebar');
const mapContainer = document.querySelector('.map-container');
const sidebarToggle = document.getElementById('sidebar-toggle');

function checkScreenWidth() {
    if (window.innerWidth <= 576) {
        sidebar.classList.remove('visible');
        mapContainer.classList.remove('shifted');
        sidebarToggle.innerHTML = `<i class="fas fa-chevron-right"></i>`;
    } else {
        sidebar.classList.add('visible');
        mapContainer.classList.add('shifted');
        sidebarToggle.innerHTML = `<i class="fas fa-chevron-left"></i>`;
    }
}

checkScreenWidth();
window.addEventListener('resize', checkScreenWidth);

sidebarToggle.addEventListener('click', function () {
    sidebar.classList.toggle('visible');
    mapContainer.classList.toggle('shifted');
    sidebarToggle.innerHTML = sidebar.classList.contains('visible') ? `<i class="fas fa-chevron-left"></i>` : `<i class="fas fa-chevron-right"></i>`;
});
