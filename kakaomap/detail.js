// overlay_content.js

// 오버레이 내용을 생성하는 함수
function createOverlayContent(markerName, additionalInfo) {
    return `<div>
                <h3>${markerName}</h3>
                <p>${additionalInfo}</p>
            </div>`;
}
// inner_marker.js

// 마커를 추가하는 함수
function addMarker(map, position, markerName, additionalInfo) {
    // 오버레이 내용을 생성
    const content = createOverlayContent(markerName, additionalInfo);

    // 마커 생성
    const marker = new kakao.maps.Marker({
        position: position,
        map: map,
        title: markerName
    });

    // 오버레이 추가 함수 호출 시 마커와 인포윈도우에 표시할 내용(content) 전달
    addOverlay(map, marker, content);
}

// 폴리곤 파일의 전역 변수인 globalMap을 사용하여 마커를 추가
kakao.maps.load(() => {
    // addMarker 함수 호출 시 globalMap을 전달 및 마커에 표시할 내용(content) 전달
    addMarker(globalMap, new kakao.maps.LatLng(36.832408, 127.147905), '마커 1', '마커 1에 대한 추가 정보');
    addMarker(globalMap, new kakao.maps.LatLng(36.828, 127.125), '마커 2', '마커 2에 대한 추가 정보');
    // 원하는 만큼 마커를 추가할 수 있음
});
