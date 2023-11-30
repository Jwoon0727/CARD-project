// inner_marker.js

// 오버레이를 추가하는 함수
function addOverlay(map, marker, info) {
    // 커스텀 오버레이를 생성하고 설정
    const content = '<div class="wrap">' +
        '    <div class="info">' +
        '        <div class="title">' +
        '            ' + info.title +
        '            <div class="close" onclick="closeOverlay(\'' + info.title + '\')" title="' + info.closeTitle + '"></div>' +
        '        </div>' +
        '        <div class="body">' +
        '            <div class="img">' +
        '                <img src="' + info.imgSrc + '" width="73" height="70">' +
        '           </div>' +
        '            <div class="desc">' +
        '                <div class="ellipsis">' + info.address + '</div>' +
        '                <div class="jibun ellipsis">' + info.postalCode + '</div>' +
        '                 <div><a href="sub.html" class="link">정보</a></div>' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '</div>';

    const overlay = new kakao.maps.CustomOverlay({
        content: content,
        map: map,
        position: marker.getPosition(),
        clickable: false
    });

    // 처음에는 오버레이를 숨기기
    overlay.setMap(null);

  
//    // 마커를 클릭하면 커스텀 오버레이를 표시 또는 숨기기
kakao.maps.event.addListener(marker, 'click', function () {
    if (overlay.getMap()) {
        overlay.setMap(null); // 이미 표시된 경우 숨기기
    } else {
        overlay.setMap(map); // 표시되지 않은 경우 표시
    }
});

// 닫기 버튼 클릭 이벤트 처리
const closeBtn = content.querySelector('.close');
if (closeBtn) {
    closeBtn.addEventListener('click', function () {
        overlay.setMap(null); // 오버레이 숨기기
    });
}


}

// 마커를 추가하는 함수
function addMarker(map, position, info) {
    const marker = new kakao.maps.Marker({
        position: position,
        map: map,
        // title: info.title
    });

    // 오버레이 추가 함수 호출 시 마커와 정보(info)를 전달
    addOverlay(map, marker, info);
}

kakao.maps.load(() => {
    // 폴리곤 파일에서 생성한 전역 지도 객체(globalMap)를 가져와서 사용하여 마커 추가
    // const globalMap = new kakao.maps.Map(/* 지도 초기화 옵션 */);

    const info1 = {
        title: '카카오 스페이스닷원',
        closeTitle: '닫기',
        imgSrc: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/thumnail.png',
        address: '제주특별자치도 제주시 첨단로 242',
        postalCode: '(우) 63309 (지번) 영평동 2181',
    };

    const info2 = {
        title: '다른 장소',
        closeTitle: '닫기',
        imgSrc: 'https://example.com/another-image.png',
        address: '다른 주소',
        postalCode: '(우) 12345',
    };
    addMarker(globalMap, new kakao.maps.LatLng(36.833408, 127.14800), info1);
    addMarker(globalMap, new kakao.maps.LatLng(36.828, 127.125), info2);

    // 페이지 이동을 처리하는 함수
    function navigateToSubPage() {
        window.location.href = 'sub.html';
    }

    // 링크에 이벤트 리스너 추가
    document.querySelectorAll('.link').forEach(function (link) {
        link.addEventListener('click', navigateToSubPage);
    });
});
