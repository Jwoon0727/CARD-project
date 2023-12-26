// // apart.js

// // position 정보를 받아 마커를 생성하는 함수
// function createMarker(positionInfo) {
//     var marker = new kakao.maps.Marker({
//         position: positionInfo.latlng,
//         map: map
//     });

//     var infowindow = new kakao.maps.InfoWindow({
//         content: positionInfo.content
//     });

//     // 마커를 클릭하면 인포윈도우를 표시
//     kakao.maps.event.addListener(marker, 'click', function() {
//         infowindow.open(map, marker);
//     });
// }

// var positions = [
//     {
//         content: '<div>카카오</div>', 
//         latlng: new kakao.maps.LatLng(36.832365, 127.148021)
//     },
//     {
//         content: '<div>생태연못</div>', 
//         latlng: new kakao.maps.LatLng(33.450936, 126.569477)
//     },
//     {
//         content: '<div>텃밭</div>', 
//         latlng: new kakao.maps.LatLng(33.450879, 126.569940)
//     },
//     {
//         content: '<div>근린공원</div>',
//         latlng: new kakao.maps.LatLng(33.451393, 126.570738)
//     }
// ];
