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

// Kakao 지도 API 비동기 로드
function loadKakaoMapScript() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.async = true;
  script.defer = true;
  script.src =
    "//dapi.kakao.com/v2/maps/sdk.js?appkey=d748997195923dbf828740f15b568099&libraries=services";
  script.onload = function () {
    // Kakao 지도 API 로드가 완료된 후 실행할 코드
    // 이 부분에 기존의 Kakao 지도 API 관련 코드를 넣으면 됩니다.

    // 인포윈도우 클릭 이벤트 + 모달 창
    kakao.maps.event.addListener(map, "click", function (mouseEvent) {
      searchDetailAddrFromCoords(mouseEvent.latLng, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          if (result[0].road_address) {
            var detailAddr =
              "<div>도로명주소 : " +
              result[0].road_address.address_name +
              "</div>";
            detailAddr +=
              "<div>지번 주소 : " + result[0].address.address_name + "</div>";

            var jibunAddress = result[0].address.address_name;

            var content =
              '<div class="bAddr">' +
              '<a href="#" class="title" id="addressInfoLink">주소정보</a>' +
              detailAddr +
              "</div>" +
              '<div class="closeBtn" onclick="closeOverlay()">닫기</div>';
            marker.setPosition(mouseEvent.latLng);
            marker.setMap(map);

            infowindow.setContent(content);
            infowindow.open(map, marker);

            // 주소정보 링크에 클릭 이벤트 추가
            document
              .getElementById("addressInfoLink")
              .addEventListener("click", function () {
                openModal(result[0].address.address_name);
              });
          }
        }
      });
    });

    // 여기에 추가적인 Kakao 지도 API 관련 코드를 작성할 수 있습니다.
  };
  document.head.appendChild(script);
}

// 페이지 로드 후 Kakao 지도 API 로딩 시작
window.onload = function () {
  loadKakaoMapScript();
};



// 모달 열기 함수 --------------------------------



// 여기까지 모달 창 --------------------------------



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
