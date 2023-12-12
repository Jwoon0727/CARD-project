var mapContainer = document.getElementById('map'),
    mapOption = {
        center: new kakao.maps.LatLng(36.832365, 127.148021),
        level: 4
    };

var map = new kakao.maps.Map(mapContainer, mapOption);

var geocoder = new kakao.maps.services.Geocoder();

var marker = new kakao.maps.Marker(),
    infowindow = new kakao.maps.InfoWindow({ zindex: 1 });

searchAddrFromCoords(map.getCenter(), displayCenterInfo);

kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
    searchDetailAddrFromCoords(mouseEvent.latLng, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
            // 건물이 있는 경우에만 인포윈도우를 생성
            if (result[0].road_address || result[0].address) {
                var detailAddr = '';

                if (result[0].road_address) {
                    detailAddr = '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>';
                    detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';

                    var content = '<div class="bAddr">' +
                        '<span class="title">주소정보</span>' +
                        detailAddr +
                        '</div>' +
                        '<div class="closeBtn" onclick="closeOverlay()">닫기</div>';
                        marker.setPosition(mouseEvent.latLng);
                        marker.setMap(map);
        
                        infowindow.setContent(content);
                        infowindow.open(map, marker); 
                }

               
                
            }
        }
    });
});

// 인포윈도우 닫기 함수
function closeOverlay() {
    infowindow.close();
    marker.setMap(null);
}

kakao.maps.event.addListener(map, 'idle', function () {
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
        var infoDiv = document.getElementById('centerAddr');

        for (var i = 0; i < result.length; i++) {
            if (result[i].region_type === 'H') {
                infoDiv.innerHTML = result[i].address_name;
                break;
            }
        }
    }
}
