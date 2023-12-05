// overlay.js

// Custom overlay를 생성하고 설정하는 함수
function createCustomOverlay(info, position) {
    var customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: '<div class="wrap">' +
            '    <div class="info">' +
            '        <div class="title">' +
            '            ' + info.title +
            '            <div class="close" onclick="closeOverlay()" title="' + info.closeTitle + '"></div>' +
            '        </div>' +
            '        <div class="body">' +
            '            <div class="img">' +
            '                <img src="' + info.imgSrc + '" width="73" height="70">' +
            '           </div>' +
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

    // 처음에는 오버레이를 숨기기
    overlay.setMap(null);

    // 마커를 클릭하면 커스텀 오버레이를 표시
    kakao.maps.event.addListener(marker, 'click', function() {
        overlay.setMap(map);
    });

    // 지도를 클릭하면 커스텀 오버레이를 닫음
    kakao.maps.event.addListener(map, 'click', function() {
        overlay.setMap(null);
    });

    // 커스텀 오버레이를 닫기 위해 호출되는 함수
    window.closeOverlay = function() {
        overlay.setMap(null);
    };
}
