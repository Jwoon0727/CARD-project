// inner_marker.js

// 지도에 사용자 정의 오버레이를 추가하는 함수
function addOverlay(map, marker, content) {
    const overlay = new kakao.maps.CustomOverlay({
        content: content,
        map: map,
        position: marker.getPosition(),
    });

    overlay.setMap(null);

    // 마커를 클릭했을 때 오버레이를 표시 또는 숨기는 이벤트 추가
    kakao.maps.event.addListener(marker, 'click', function() {
        if (overlay.getMap()) {
            overlay.setMap(null); // 이미 보이는 경우 숨김
        } else {
            overlay.setMap(map); // 보이지 않는 경우 표시
        }
    });

   
    
}



// 커스텀 오버레이에 표시할 컨텐츠
var content = '<div class="wrap">' +
    '    <div class="info">' +
    '        <div class="title">' +
    '            카카오 스페이스닷원' +
    '        </div>' +
    '        <div class="body">' +
    '            <div class="img">' +
    '                <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/thumnail.png" width="73" height="70">' +
    '           </div>' +
    '            <div class="desc">' +
    '                <div class="ellipsis">제주특별자치도 제주시 첨단로 242</div>' +
    '                <div class="jibun ellipsis">(우) 63309 (지번) 영평동 2181</div>' +
    '                <div><a href="sub.html" class="link" onclick="window.location.href=\'sub.html\';">정보</a></div>' +
    '            </div>' +
    '        </div>' +
    '    </div>' +
    '</div>';


// 지도에 사용자 정의 오버레이가 있는 마커를 추가하는 함수
function addMarker(map, position, content) {
    // 마커 생성
    const marker = new kakao.maps.Marker({
        position: position,
        map: map,
        title: '마커 제목'
    });

    // 오버레이 추가 함수 호출 시 마커와 표시할 내용(content) 전달
    addOverlay(map, marker, content);
}

// 폴리곤 파일의 전역 변수인 globalMap을 사용하여 마커를 추가
kakao.maps.load(() => {
    // addMarker 함수 호출 시 globalMap을 전달 및 마커에 표시할 내용(content) 전달
    addMarker(globalMap, new kakao.maps.LatLng(36.832408, 127.147905), content);
    addMarker(globalMap, new kakao.maps.LatLng(36.828, 127.125), content);
    // 원하는 만큼 마커를 추가할 수 있음
});
