
// 마커를 추가하는 함수
function addMarker(map, position) {
    // 마커 생성
    const marker = new kakao.maps.Marker({
        position: position,
        map: map,
        title: '마커 제목'
    });
}

// 폴리곤 파일의 전역 변수인 globalMap을 사용하여 마커를 추가
// 여기서는 폴리곤 파일의 globalMap을 사용하기 위해 폴리곤 파일이 먼저 로드되어야 함
kakao.maps.load(() => {
    // 폴리곤 파일에서 생성한 전역 지도 객체(globalMap)를 사용하여 마커 추가
    addMarker(globalMap, new kakao.maps.LatLng(36.135234234, 127.1413435));
    addMarker(globalMap, new kakao.maps.LatLng(36.828, 127.125));
    // 원하는 만큼 마커를 추가할 수 있음
});
