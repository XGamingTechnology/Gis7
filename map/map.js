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

// Path ke file GeoJSON lokal
var titikGeoJSON = 'asset/data/Point Genangan.geojson';
var kabupatenGeoJSON = 'asset/data/Data Perkelurahan.geojson';
var kabupatenGeoJSON2 = 'asset/data/DKI.geojson';

// Definisikan basePath
var basePath = "file:///D:/MY%20Data/kerjaan/2024/pelatihan/MODUL/PELATIHAN%20WEBGIS/Bahan/WEBSITE/Gis/images/";

// Fungsi untuk menambahkan marker
function addMarkers() {
    fetch(titikGeoJSON)
        .then(response => response.json())
        .then(data => {
            var geojsonLayer = L.geoJSON(data, {
                pointToLayer: function (feature, latlng) {
                    var fotoId = feature.properties['Foto'];
                    var fotoPath = fotoId !== null ? basePath + fotoId + '.jpeg' : null;

                    // Buat konten popup
                    var popupContent = '<table>';
                    var properties = feature.properties;

                    if (properties) {
                        popupContent += `
                            <tr><th scope="row">Name</th><td>${properties['name'] || 'Data tidak tersedia'}</td></tr>
                            <tr><th scope="row">Ruas Jalan</th><td>${properties['Ruas Jalan'] || 'Data tidak tersedia'}</td></tr>
                            <tr><th scope="row">RT</th><td>${properties['Ruas Jal_1'] !== '-' ? properties['Ruas Jal_1'] : 'Tidak ada'}</td></tr>
                            <tr><th scope="row">Kabupaten</th><td>${properties['Ruas Jal_2'] !== '-' ? properties['Ruas Jal_2'] : 'Tidak ada'}</td></tr>
                            <tr><th scope="row">Tinggi Genangan</th><td>${properties['Ruas Jal_3'] !== '-' ? properties['Ruas Jal_3'] : 'Tidak ada'}</td></tr>
                            <tr><th scope="row">Foto</th><td>${fotoPath ? '<img src="' + fotoPath + '" style="width:100px; height:auto;">' : 'Foto tidak tersedia'}</td></tr>
                            <tr><th scope="row">Kategori</th><td>${properties['Kategori'] || 'Data tidak tersedia'}</td></tr>
                        `;
                    }
                    popupContent += '</table>';

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

// Fungsi untuk menambahkan polygon Data Perkelurahan
function addKabupatenPolygons() {
    fetch(kabupatenGeoJSON)
        .then(response => response.json())
        .then(data => {
            var geojsonLayer = L.geoJSON(data, {
                style: function (feature) {
                    return { color: 'blue', weight: 2 };
                },
                onEachFeature: function (feature, layer) {
                    var props = feature.properties;
                    var popupContent = '<table>';
                    if (props) {
                        popupContent += `
                            <tr><th scope="row">KELURAHAN</th><td>${props.NAMOBJ || 'Data tidak tersedia'}</td></tr>
                            <tr><th scope="row">Luas</th><td>${props.area ? props.area + ' km²' : 'Data tidak tersedia'}</td></tr>
                            <tr><th scope="row">Populasi</th><td>${props.population || 'Data tidak tersedia'}</td></tr>
                            <tr><th scope="row">Ibu Kota</th><td>${props.capital || 'Data tidak tersedia'}</td></tr>
                            <tr><th scope="row">Jumlah RT</th><td>${props["Jumlah RT"] || 'Data tidak tersedia'}</td></tr>
                            <tr><th scope="row">Ketinggian</th><td>${props.Ketinggian || 'Data tidak tersedia'}</td></tr>
                            <tr><th scope="row">Penyebab</th><td>${props.Penyebab || 'Data tidak tersedia'}</td></tr>
                            <tr><th scope="row">Kategori</th><td>${props.Kategori || 'Data tidak tersedia'}</td></tr>
                            <tr><th scope="row">Lokasi</th><td>${props.Lokasi || 'Data tidak tersedia'}</td></tr>
                        `;
                    }
                    popupContent += '</table>';
                    layer.bindPopup(popupContent);
                }
            });

            // Tambahkan layer poligon ke map
            polygonsLayer.addLayer(geojsonLayer);
        })
        .catch(error => console.error('Error fetching polygon GeoJSON:', error));
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

// Call the function on window resize
window.addEventListener('resize', checkScreenWidth);
checkScreenWidth(); // Initial check

// Toggle sidebar
sidebarToggle.addEventListener('click', function () {
    sidebar.classList.toggle('visible');
    mapContainer.classList.toggle('shifted');
    sidebarToggle.innerHTML = sidebar.classList.contains('visible') ?
        `<i class="fas fa-chevron-left"></i>` :
        `<i class="fas fa-chevron-right"></i>`;
});
