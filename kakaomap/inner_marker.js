// inner_marker.js

// 오버레이를 추가하는 함수
function addOverlay(map, marker, content) {
    // 인포윈도우 생성
    const infowindow = new kakao.maps.InfoWindow({
        content: content,
        removable: true
    });

    // 마커 클릭 이벤트 리스너 등록
    kakao.maps.event.addListener(marker, 'click', function() {
        // 인포윈도우를 마커 위에 표시
        infowindow.open(map, marker);
    });
}

// 마커를 추가하는 함수
function addMarker(map, position, content) {
    // 마커 생성
    const marker = new kakao.maps.Marker({
        position: position,
        map: map,
        title: '마커 제목'
    });

    // 오버레이 추가 함수 호출 시 마커와 인포윈도우에 표시할 내용(content) 전달
    addOverlay(map, marker, content);
}

// 폴리곤 파일의 전역 변수인 globalMap을 사용하여 마커를 추가
kakao.maps.load(() => {
    // addMarker 함수 호출 시 globalMap을 전달 및 마커에 표시할 내용(content) 전달
    addMarker(globalMap, new kakao.maps.LatLng(36.832408, 127.147905), '마커 1의 내용');
    addMarker(globalMap, new kakao.maps.LatLng(36.828, 127.125), '마커 2의 내용');
    // 원하는 만큼 마커를 추가할 수 있음
});
