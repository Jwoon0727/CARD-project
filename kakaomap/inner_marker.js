



// poligon.js를 먼저 로드합니다.
var script = document.createElement('script');
script.src = 'polygon.js';
script.async = false;
document.head.appendChild(script);

// poligon.js 파일이 로드된 후에 실행되어야 하는 코드를 콜백 함수에 작성합니다.
script.onload = function () {

    function addMarker(map, coordinates, overlayContent) {
        // 마커 생성
        const marker = new kakao.maps.Marker({
            position: coordinates[0], // 첫 번째 좌표를 마커의 위치로 설정
            map: map,
        });

        // 커스텀 오버레이에 표시할 내용
        const content = overlayContent;

        // 커스텀 오버레이 생성
        const overlay = new kakao.maps.CustomOverlay({
            content: content,
            map: map, // 수정: globalMap 대신 map 사용
            position: marker.getPosition(),
            yAnchor: 1
        });

        // 마커 클릭 이벤트 처리
        kakao.maps.event.addListener(marker, 'click', function() {
            overlay.setMap(map); // 수정: globalMap 대신 map 사용
        });
    }

    // 마커 추가 함수 호출 예시
    addMarker(globalMap, [
        new kakao.maps.LatLng(36.8323728, 127.1429119),
        new kakao.maps.LatLng(36.8395513, 127.1429237),
        // 나머지 좌표들...
    ], createOverlayContent('마커 정보'));
}

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

