// // overlay_content.js

// // 오버레이 내용을 생성하는 함수
// function createOverlayContent(markerInfo) {
//     return `
//         <div class="wrap">
//             <div class="info">
//                 <div class="">
//                     ${markerInfo.title}
//                     <div class="close" onclick="closeOverlay()" title="${markerInfo.closeTitle}"></div>
//                 </div>
//                 <div class="body">
//                     <div class="img">
//                         <img src="${markerInfo.imgSrc}" width="73" height="70">
//                     </div>
//                     <div class="desc">
//                         <div class="ellipsis">${markerInfo.address}</div>
//                         <div class="jibun ellipsis">${markerInfo.postalCode}</div>
                        
//                     </div>
//                 </div>
//             </div>
//         </div>`;
// }

// // inner_marker.js

// // 마커를 추가하는 함수
// function addMarker(map, position, markerName, additionalInfo) {
//    // 오버레이 내용을 생성
//     const markerInfo = {
//         title: markerName,
//         closeTitle: '닫기',
//         imgSrc: additionalInfo.imgSrc,
//         address: additionalInfo.address,
//         postalCode: additionalInfo.postalCode,
//         homepage: additionalInfo.homepage
//     };
//     const content = createOverlayContent(markerInfo);

//     // 마커 생성
//     const marker = new kakao.maps.Marker({
//         position: position,
//         map: map,
//         title: markerName
//     });

//     // 오버레이 추가 함수 호출 시 마커와 인포윈도우에 표시할 내용(content) 전달
//     addOverlay(map, marker, content);
// }

// // 폴리곤 파일의 전역 변수인 globalMap을 사용하여 마커를 추가
// kakao.maps.load(() => {
//     // addMarker 함수 호출 시 globalMap을 전달 및 마커에 표시할 내용(content) 전달
//     addMarker(globalMap, new kakao.maps.LatLng(36.832408, 127.147905), '구역번호', {
//         imgSrc: '이미지_경로_1',
//         address: '주소_1',
//         postalCode: '우편번호_1',
//         homepage: '홈페이지_주소_1'
//     });
//     addMarker(globalMap, new kakao.maps.LatLng(36.828, 127.125), '구역번호', {
//         imgSrc: '이미지_경로_2',
//         address: '주소_2',
//         postalCode: '우편번호_2',
//         homepage: '홈페이지_주소_2'
//     });
//     // 원하는 만큼 마커를 추가할 수 있음
// });
