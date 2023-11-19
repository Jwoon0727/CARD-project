// polygon.js 파일

// 전역으로 사용할 지도 객체
let globalMap;

function addPolygon(map, coordinates, overlayContent) {
    // 다각형 생성
    const polygon = new kakao.maps.Polygon({
        map: map,
        path: coordinates,
        strokeWeight: 3,
        strokeColor: "red",
        strokeOpacity: 1,
        fillColor: 'none',
        fillOpacity: 0.5,
        
    });

    // 마커 생성
    const marker = new kakao.maps.Marker({
        position: coordinates[0], // 첫 번째 좌표를 마커의 위치로 설정
        map: map,
        className: 'wrap' 
    });

    // 커스텀 오버레이에 표시할 내용
    const content = overlayContent;

    // 커스텀 오버레이 생성
    const overlay = new kakao.maps.CustomOverlay({
        content: content,
        map: null, // 초기에는 지도에 표시하지 않음
        position: marker.getPosition(),
        yAnchor: 1
    });

    // 마커 클릭 이벤트 처리
    kakao.maps.event.addListener(marker, 'click', function() {
        overlay.setMap(map);
    });

    // 오버레이 닫기 이벤트 처리
    function closeOverlay() {
        overlay.setMap(null);
    }

    // 커스텀 오버레이 닫기 버튼 클릭 이벤트 처리
    const closeBtn = overlayContent.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeOverlay);
    }
}

// 카카오맵 API 로드 완료 후 실행될 콜백 함수
kakao.maps.load(() => {
    const container = document.getElementById('map');
    const options = {
        center: new kakao.maps.LatLng(36.8394233, 127.1426544),
        level: 5
    };
    // 전역으로 사용할 지도 객체에 할당
    globalMap = new kakao.maps.Map(container, options);

    // 다각형1 생성 및 지도에 추가
    addPolygon(globalMap, [
        new kakao.maps.LatLng(36.8393801, 127.1429119),
        new kakao.maps.LatLng(36.8395513, 127.1429237),
        new kakao.maps.LatLng(36.8395776, 127.1426876),
        new kakao.maps.LatLng(36.8396713, 127.1426792),
        new kakao.maps.LatLng(36.8396734, 127.1424610),
        new kakao.maps.LatLng(36.8393855, 127.1424345),
    ], createOverlayContent('다각형1 정보'));

    // 다각형2 생성 및 지도에 추가
    addPolygon(globalMap, [
        new kakao.maps.LatLng(36.8325678, 127.1473493),
        new kakao.maps.LatLng(36.8322943, 127.1472997),
        new kakao.maps.LatLng(36.8321899, 127.1485654),
        new kakao.maps.LatLng(36.8323080, 127.1485778),
        new kakao.maps.LatLng(36.8325369, 127.1486056),
        new kakao.maps.LatLng(36.8325862, 127.1483129),
        new kakao.maps.LatLng(36.8324712, 127.1482857),
    ], createOverlayContent('다각형2 정보'));

    //다각형3 생성 및 지도에 추가
    addPolygon(globalMap, [
        new kakao.maps.LatLng(36.8267494, 127.1229627),
        new kakao.maps.LatLng(36.8266042, 127.1272713),
        new kakao.maps.LatLng(36.8274440, 127.1272810),
        new kakao.maps.LatLng(36.8274284, 127.1266839),
        new kakao.maps.LatLng(36.8282982, 127.1266872),
        new kakao.maps.LatLng(36.8287799, 127.1261672),
        new kakao.maps.LatLng(36.8289683, 127.1261092),
        new kakao.maps.LatLng(36.8290627, 127.1235641),
        new kakao.maps.LatLng(36.8290625, 127.1229151),
    ], createOverlayContent('다각형3 정보'));
});

// 커스텀 오버레이에 표시할 내용 생성 함수
function createOverlayContent(info) {
    // 내용을 담은 HTML 요소를 생성
    const content = document.createElement('div');
    content.innerHTML = `
        <div class="wrap">
            <div class="info">
                <div class="title">${info}
                    <div class="close" title="닫기"></div>
                </div>
                <div class="body">
                    <div class="img">
                        <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/thumnail.png" width="73" height="70">
                    </div>
                    <div class="desc">
                        <div class="ellipsis">제주특별자치도 제주시 첨단로 242</div>
                        <div class="jibun ellipsis">(우) 63309 (지번) 영평동 2181</div>
                        <div><a href="https://www.kakaocorp.com/main" target="_blank" class="link">홈페이지</a></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // close 버튼 클릭 시 닫기 처리
    const closeBtn = content.querySelector('.close');
    closeBtn.addEventListener('click', function () {
        content.parentNode.removeChild(content);
    });

    return content;
}
