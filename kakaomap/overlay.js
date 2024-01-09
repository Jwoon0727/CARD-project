
// overlay.js
var locations = [
    { 
        number: 222, 
        lat: 36.8278461, 
        lng: 127.1243682, 
        polygonPath: [
            new kakao.maps.LatLng(36.8290402, 127.1228792),
            new kakao.maps.LatLng(36.8267373, 127.1229472),
            new kakao.maps.LatLng(36.8265951, 127.1272716),
            new kakao.maps.LatLng(36.8274807, 127.1272790),
            new kakao.maps.LatLng(36.8274571, 127.1266849),
            new kakao.maps.LatLng(36.8283151, 127.1266551),
            new kakao.maps.LatLng(36.8287501, 127.1261833),
            new kakao.maps.LatLng(36.8289688, 127.1260737),
            new kakao.maps.LatLng(36.8290402, 127.1228792)
        ]
    },
    { 
        number: 223, 
        lat: 36.8250447, 
        lng: 127.1214670, 
        polygonPath: [
            new kakao.maps.LatLng(36.8268363, 127.1208356),
            new kakao.maps.LatLng(36.8265659, 127.1201084),
            new kakao.maps.LatLng(36.8263251, 127.1197524),
            new kakao.maps.LatLng(36.8261136, 127.1196652),
            new kakao.maps.LatLng(36.8259234, 127.1190198),
            new kakao.maps.LatLng(36.8239221, 127.1185705),
            new kakao.maps.LatLng(36.8229100, 127.1182483),
            new kakao.maps.LatLng(36.8235911, 127.1238766),
            new kakao.maps.LatLng(36.8244845, 127.1237908),
            new kakao.maps.LatLng(36.8267719, 127.1236938),
            new kakao.maps.LatLng(36.8267419, 127.1211079),
            new kakao.maps.LatLng(36.8268363, 127.1208356)
           
        ]
    },
   
];


var polygons = [];
var marker;


function searchLocation() {
    var searchValue = document.getElementById("searchInput").value;

    // CSV 파일 경로
    var csvFilePath = "../number.csv"; // 이 부분을 실제 파일 경로로 수정

    // CSV 파일 비동기적으로 읽기
    Papa.parse(csvFilePath, {
        download: true,
        header: true,
        complete: function (results) {
            // CSV 데이터를 검색하여 일치하는 구역번호의 Jibus 값을 가져오기
            var matchedData = results.data.filter(function (item) {
                // 문자열로 비교
                return item.Number.trim() === searchValue.trim();
            });

            console.log('matchedData:', matchedData);

            if (matchedData.length > 0) {
                // 일치하는 데이터가 있을 경우 sub1과 sub2에 값을 추가
                var sub1HTML = " ";
                matchedData.forEach(function (item, index) {
                    // Jibun 값을 클릭 이벤트로 처리
                    sub1HTML += "<div class='box' onclick='handleJibunClick(\"" + item.Jibun + "\")'> " + (index + 1) + ": " + (item.Jibun || 'N/A') + "</div>";
                });
                document.querySelector(".sub1").innerHTML = sub1HTML;

                document.querySelector(".sub2").innerHTML = "구역번호 : " + searchValue;

                // 폴리곤 표시
                var foundLocation = locations.find(location => location.number.toString() === searchValue.trim());
                if (foundLocation) {
                    var moveLatLng = new kakao.maps.LatLng(foundLocation.lat, foundLocation.lng);
                    map.panTo(moveLatLng);
                    marker.setPosition(moveLatLng);
                    marker.setMap(map);
                    infowindow.close();
                    displayPolygons(foundLocation);
                }
            } else {
                // 일치하는 데이터가 없을 경우 메시지 추가 또는 다른 처리 수행
                document.querySelector(".sub1").innerHTML = "일치하는 데이터가 없습니다.";
                document.querySelector(".sub2").innerHTML = "";

                // 폴리곤 초기화
                clearPolygons();
            }
        }
    });
}

var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });


function handleJibunClick(clickedJibun) {
    var csvFilePath = "../number.csv"; // 이 부분을 실제 파일 경로로 수정

    // CSV 파일 비동기적으로 읽기
    Papa.parse(csvFilePath, {
        download: true,
        header: true,
        complete: function (results) {
            // 클릭된 Jibun에 해당하는 데이터 찾기
            var clickedData = results.data.find(function (item) {
                return item.Jibun.trim() === clickedJibun.trim();
            });

            if (clickedData) {
                // Latitude와 Longitude 가져오기
                var latitude = parseFloat(clickedData.Latitude);
                var longitude = parseFloat(clickedData.Longitude);

                // 기존 마커 및 인포윈도우 숨기기
                marker.setMap(null);
                infowindow.close();

                // 새로운 마커 생성 및 지도에 표시
                var newLatLng = new kakao.maps.LatLng(latitude, longitude);
                marker = new kakao.maps.Marker({
                    position: newLatLng,
                    map: map
                });

                // 지도 이동
                map.panTo(newLatLng);

                // 인포윈도우 업데이트
                searchDetailAddrFromCoords(newLatLng, function (result, status) {
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
                            marker.setPosition(newLatLng);
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
            }
        }
    });
}





function displayPolygons(location) {
  
    clearPolygons();

    var polygon = new kakao.maps.Polygon({
        path: location.polygonPath,
        strokeWeight: 3,
        strokeColor: 'red',
        strokeOpacity: 0.8,
    });

    polygon.setMap(map);
    polygons.push(polygon);
}

function clearPolygons() {
    polygons.forEach(polygon => polygon.setMap(null));
    polygons = [];
}

function closeOverlay() {
    infowindow.close();
    marker.setMap(null);
    clearPolygons();
}
function closeOverlay() {
    infowindow.close();
    marker.setMap(null);

}

// overlay.js


//================================================================================================================================
