// overlay.js

// 전역 변수로 선언된 customOverlay
var customOverlay;

// Custom overlay를 생성하고 설정하는 함수
function createCustomOverlay(info, position) {
    // 기존 오버레이가 존재하는 경우 제거
    if (customOverlay) {
        customOverlay.setMap(null);
    }

    customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: '<div class="wrap">' +
            '    <div class="info">' +
            '        <div class="title">' +
            '            ' + info.title +
            '         <div class="close" onclick="closeOverlay()" title="닫기">닫기</div>' +
            '        </div>' +
            '        <div class="body">' +
            '            <div class="desc">' +
            '                <div class="ellipsis">' + info.address + '</div>' +
            '                <div class="jibun ellipsis">' + info.postalCode + '</div>' +
            '                <div><a href="' + info.homepage + '" target="_blank" class="link">홈페이지</a></div>' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '</div>',
        xAnchor: 0.5,
        yAnchor: 1,
    });

    // Custom overlay를 지도에 표시합니다
    customOverlay.setMap(map);
}

// 오버레이를 닫는 함수
function closeOverlay() {
    if (customOverlay) {
        customOverlay.setMap(null); // 지도에서 오버레이를 제거합니다
    }
}
