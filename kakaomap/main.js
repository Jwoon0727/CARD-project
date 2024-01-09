var mapContainer = document.getElementById("map"),
  mapOption = {
    center: new kakao.maps.LatLng(36.832365, 127.148021),
    
    level: 4,
  };

var map = new kakao.maps.Map(mapContainer, mapOption);

var geocoder = new kakao.maps.services.Geocoder();

var marker = new kakao.maps.Marker(),
  infowindow = new kakao.maps.InfoWindow({ zindex: 1 });

searchAddrFromCoords(map.getCenter(), displayCenterInfo);

function loadKakaoMapScript() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.async = true;
  script.defer = true;
  script.src =
    "//dapi.kakao.com/v2/maps/sdk.js?appkey=d748997195923dbf828740f15b568099&libraries=services";
  script.onload = function () {
   
    kakao.maps.event.addListener(map, "click", function (mouseEvent) {
      searchDetailAddrFromCoords(mouseEvent.latLng, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          if (result[0].road_address) {
            var detailAddr =
              '<div class="doro"> ' +
              result[0].road_address.address_name +
              
              "</div>";
            detailAddr +=
              '<div class="jibun-address">(지번) ' + result[0].address.address_name + "</div>";

            var jibunAddress = result[0].address.address_name;

            var content =
              '<div class="bAddr">' +
              '<a href="#" class="title" id="addressInfoLink">주소정보</a>' +
              '<img src="../표시.png" alt="주소 이미지" class="02img">' +
              detailAddr +
              "</div>" +
              '<div class="closeBtn" onclick="closeOverlay()">닫기</div>';
            marker.setPosition(mouseEvent.latLng);
            marker.setMap(map);

            infowindow.setContent(content);
            infowindow.open(map, marker);

            document
              .getElementById("addressInfoLink")
              .addEventListener("click", function () {
                openModal(result[0].address.address_name);
              });
          }
        }
      });
    });

    
  };
  document.head.appendChild(script);
}


window.onload = function () {
  loadKakaoMapScript();
};



function closeOverlay() {
  infowindow.close();
  marker.setMap(null);
}

kakao.maps.event.addListener(map, "idle", function () {
  searchAddrFromCoords(map.getCenter(), displayCenterInfo);
});

function searchAddrFromCoords(coords, callback) {
  geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
}

function searchDetailAddrFromCoords(coords, callback) {
  geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}

function displayCenterInfo(result, status) {
  if (status === kakao.maps.services.Status.OK) {
    var infoDiv = document.getElementById("centerAddr");

    for (var i = 0; i < result.length; i++) {
      if (result[i].region_type === "H") {
        infoDiv.innerHTML = result[i].address_name;
        break;
      }
    }
  }
}

//================================================================================================================================

