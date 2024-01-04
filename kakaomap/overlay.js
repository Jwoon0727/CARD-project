
// overlay.js
var locations = [
    { 
        number: 222, 
        lat: 36.8278461, 
        lng: 127.1243682, 
        polygonPath: [
            new kakao.maps.LatLng(36.8290402, 127.1228792),
            new kakao.maps.LatLng(36.8267373, 127.1229472),
            new kakao.maps.LatLng(36.8265951, 127.1272716),
            new kakao.maps.LatLng(36.8274807, 127.1272790),
            new kakao.maps.LatLng(36.8274571, 127.1266849),
            new kakao.maps.LatLng(36.8283151, 127.1266551),
            new kakao.maps.LatLng(36.8287501, 127.1261833),
            new kakao.maps.LatLng(36.8289688, 127.1260737),
            new kakao.maps.LatLng(36.8290402, 127.1228792)
        ]
    },
    { 
        number: 223, 
        lat: 36.8250447, 
        lng: 127.1214670, 
        polygonPath: [
            new kakao.maps.LatLng(36.8268363, 127.1208356),
            new kakao.maps.LatLng(36.8265659, 127.1201084),
            new kakao.maps.LatLng(36.8263251, 127.1197524),
            new kakao.maps.LatLng(36.8261136, 127.1196652),
            new kakao.maps.LatLng(36.8259234, 127.1190198),
            new kakao.maps.LatLng(36.8239221, 127.1185705),
            new kakao.maps.LatLng(36.8229100, 127.1182483),
            new kakao.maps.LatLng(36.8235911, 127.1238766),
            new kakao.maps.LatLng(36.8244845, 127.1237908),
            new kakao.maps.LatLng(36.8267719, 127.1236938),
            new kakao.maps.LatLng(36.8267419, 127.1211079),
            new kakao.maps.LatLng(36.8268363, 127.1208356)
            // 다른 폴리곤 좌표 추가
        ]
    },
    // 필요한 만큼 더 많은 위치를 추가하세요
];

// 초기화할 때 지도에 표시할 폴리곤 객체 배열
var polygons = [];


function searchLocation() {
    var keyword = document.getElementById('searchInput').value;
    var foundLocation = locations.find(location => location.number.toString() === String(keyword));

    if (foundLocation) {
        // 이동할 좌표 설정
        var moveLatLng = new kakao.maps.LatLng(foundLocation.lat, foundLocation.lng);

        // 검색된 좌표로 지도 이동
        map.panTo(moveLatLng);

        // 마커 표시
        marker.setPosition(moveLatLng);
        marker.setMap(map);

        // 인포윈도우 닫기
        infowindow.close();

        // 폴리곤 표시
        displayPolygons(foundLocation);
    } else {
        // 다른 검색 기능을 추가하거나 사용자에게 메시지 표시
        alert('입력한 번호에 대한 결과를 찾을 수 없습니다.');

        // 폴리곤 지우기
        clearPolygons();
    }
}

function displayPolygons(location) {
    // 기존 폴리곤 지우기
    clearPolygons();

    // 현재 위치에 대한 폴리곤 표시
    var polygon = new kakao.maps.Polygon({
        path: location.polygonPath,
        strokeWeight: 3,
        strokeColor: 'red',
        strokeOpacity: 0.8,
      
    });

    // 폴리곤 지도에 추가
    polygon.setMap(map);

    // 배열에 추가하여 추후에 제거할 때 활용
    polygons.push(polygon);
}

function clearPolygons() {
    // 배열에 저장된 모든 폴리곤 지도에서 제거
    polygons.forEach(polygon => polygon.setMap(null));
    
    // 배열 비우기
    polygons = [];
}

function closeOverlay() {
    infowindow.close();
    marker.setMap(null);

    // 폴리곤 지우기
    clearPolygons();
}
function closeOverlay() {
    infowindow.close();
    marker.setMap(null);
    // 폴리곤을 지도에서 제거하지 않음 (유지)
    // clearPolygons();
}

// overlay.js


//================================================================================================================================

var mapContainer = document.getElementById('map');



// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption); 

// 도형 스타일을 변수로 설정합니다
var strokeColor = '#39f',
	fillColor = '#cce6ff',
	fillOpacity = 0.5,
	hintStrokeStyle = 'dash';

var options = { // Drawing Manager를 생성할 때 사용할 옵션입니다
    map: map, 
    drawingMode: [
        kakao.maps.drawing.OverlayType.MARKER,
        kakao.maps.drawing.OverlayType.ARROW,
        kakao.maps.drawing.OverlayType.POLYLINE,
        kakao.maps.drawing.OverlayType.RECTANGLE,
        kakao.maps.drawing.OverlayType.CIRCLE,
        kakao.maps.drawing.OverlayType.ELLIPSE,
        kakao.maps.drawing.OverlayType.POLYGON
    ],
    // 사용자에게 제공할 그리기 가이드 툴팁입니다
    // 사용자에게 도형을 그릴때, 드래그할때, 수정할때 가이드 툴팁을 표시하도록 설정합니다
    guideTooltip: ['draw', 'drag', 'edit'], 
    markerOptions: {
        draggable: true,
        removable: true
    },
    arrowOptions: {
        draggable: true,
        removable: true,
        strokeColor: strokeColor,
        hintStrokeStyle: hintStrokeStyle
    },
    polylineOptions: {
        draggable: true,
        removable: true,
        strokeColor: strokeColor,
        hintStrokeStyle: hintStrokeStyle
    },
    rectangleOptions: {
        draggable: true,
        removable: true,
        strokeColor: strokeColor,
        fillColor: fillColor,
        fillOpacity: fillOpacity
    },
    circleOptions: {
        draggable: true,
        removable: true,
        strokeColor: strokeColor,
        fillColor: fillColor,
        fillOpacity: fillOpacity
    },
    ellipseOptions: {
        draggable: true,
        removable: true,
        strokeColor: strokeColor,
        fillColor: fillColor,
        fillOpacity: fillOpacity
    },
    polygonOptions: {
        draggable: true,
        removable: true,
        strokeColor: strokeColor,
        fillColor: fillColor,
        fillOpacity: fillOpacity
    }
};
var manager = new kakao.maps.drawing.DrawingManager(options);

var toolbox = new kakao.maps.drawing.Toolbox({ drawingManager: manager });

map.addControl(toolbox.getElement(), kakao.maps.ControlPosition.TOP);



