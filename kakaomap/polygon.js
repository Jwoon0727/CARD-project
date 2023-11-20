
var globalMap; 

function addPolygon(map, coordinates, overlayContent) {
    
    // 다각형 생성
    const polygon = new kakao.maps.Polygon({
        map: globalMap,
        path: coordinates,
        strokeWeight: 3,
        strokeColor: "red",
        strokeOpacity: 1,
        fillColor: 'none',
        fillOpacity: 0.5,
    });

  
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

