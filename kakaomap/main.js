//main.js
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

// 인포윈도우 클릭 이벤트
kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
    searchDetailAddrFromCoords(mouseEvent.latLng, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
            if (result[0].road_address) {
                var detailAddr = '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>';
                detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';

                var jibunAddress = result[0].address.address_name;

                var content = '<div class="bAddr">' +
                    '<a href="#" class="title" id="addressInfoLink">주소정보</a>' +
                    detailAddr +
                    '</div>' +
                    '<div class="closeBtn" onclick="closeOverlay()">닫기</div>';
                marker.setPosition(mouseEvent.latLng);
                marker.setMap(map);

                infowindow.setContent(content);
                infowindow.open(map, marker);

                // 주소정보 링크에 클릭 이벤트 추가
                document.getElementById('addressInfoLink').addEventListener('click', function () {
                    openModal(result[0].address.address_name);
                });
            }
        }
    });
});

// 모달 열기 함수
function openModal(jibunAddress) {
    // 새로운 div 요소를 생성하여 모달을 나타냄
    var modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';

    // 모달 내용 추가
    modalContainer.innerHTML = `
        <div class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal()">&times;</span>
                <h2 class="main2">${jibunAddress}</h2>
                <div class="additional-info">로드되는 데이터를 여기에 표시하세요.</div>
                <!-- 추가: 지번 주소 표시 -->
                <div class="jibun-info">지번 주소: ${jibunAddress}</div>
            </div>
        </div>
    `;

    // body에 모달 요소 추가
    document.body.appendChild(modalContainer);

    // 모달 스타일 추가
    modalContainer.querySelector('.modal').style.display = 'block';
}

// 모달 닫기 함수
function closeModal() {
    var modalContainer = document.querySelector('.modal-container');
    if (modalContainer) {
        modalContainer.parentNode.removeChild(modalContainer);
    }
}



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