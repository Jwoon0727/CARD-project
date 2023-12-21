//main.js
var mapContainer = document.getElementById('map'),
    mapOption = {
        center: new kakao.maps.LatLng(36.832365, 127.148021),
        level: 4
    };

var map = new kakao.maps.Map(mapContainer, mapOption);

var geocoder = new kakao.maps.services.Geocoder();

var marker = new kakao.maps.Marker(),
    infowindow = new kakao.maps.InfoWindow({ zindex: 1 });

searchAddrFromCoords(map.getCenter(), displayCenterInfo);

// 인포윈도우 클릭 이벤트 + 모달 창
kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
    searchDetailAddrFromCoords(mouseEvent.latLng, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
            if (result[0].road_address) {
                var detailAddr = '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>';
                detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';

                var jibunAddress = result[0].address.address_name;

                var content = '<div class="bAddr">' +
                    '<a href="#" class="title" id="addressInfoLink">주소정보</a>' +
                    detailAddr +
                    '</div>' +
                    '<div class="closeBtn" onclick="closeOverlay()">닫기</div>';
                marker.setPosition(mouseEvent.latLng);
                marker.setMap(map);

                infowindow.setContent(content);
                infowindow.open(map, marker);

                // 주소정보 링크에 클릭 이벤트 추가
                document.getElementById('addressInfoLink').addEventListener('click', function () {
                    openModal(result[0].address.address_name);
                });
            }
        }
    });
});// 모달 열기 함수
async function openModal(jibunAddress) {
    // 이미 모달이 열려있는 경우 더 이상 실행하지 않음
    if (document.querySelector('.modal-container')) {
        return;
    }

    // 새로운 div 요소를 생성하여 모달을 나타냄
    var modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';

    // 모달 내용 추가
    modalContainer.innerHTML = `
        <div class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal()">&times;</span>
                <h2 class="main2">${jibunAddress}</h2>
                <div class="jibun-info">지번 주소: ${jibunAddress}</div>
                <div class="additional-info">로드되는 데이터를 여기에 표시하세요.</div>
                
                <div class="Detail"></div>
                <div class="Name"></div>
            </div>
        </div>
    `;

    // body에 모달 요소 추가
    document.body.appendChild(modalContainer);

    // 모달 스타일 추가
    modalContainer.querySelector('.modal').style.display = 'block';

    // CSV 파일 경로 (예시 경로, 실제 경로로 변경해야 함)
    var csvFilePath = '../test_information.csv';

    try {
        // CSV 파일 읽어오기
        var matchingData = await readCSVFile(csvFilePath, jibunAddress);

        // 찾은 데이터가 있다면 모달에 추가 정보 표시
        if (matchingData) {
            document.querySelector('.Detail').innerHTML = `Detail: ${matchingData['Detail']}`;
            document.querySelector('.Name').innerHTML = `Name: ${matchingData['Name']}`;
        } else {
            document.querySelector('.Detail').innerHTML = '일치하는 데이터가 없습니다.';
            document.querySelector('.Name').innerHTML = '';
        }
    } catch (error) {
        console.error("Error reading CSV file:", error);
    }
}

// CSV 파일 읽어오기 함수
function readCSVFile(filePath, jibunAddress) {
    return new Promise(function (resolve, reject) {
        // CSV 파일을 읽어오는 로직을 구현해야 함
        // 이 예시에서는 jQuery의 AJAX를 사용하고, PapaParse 라이브러리를 이용합니다.
        $.ajax({
            type: "GET",
            url: filePath,
            dataType: "text",
            success: function (data) {
                // CSV 데이터를 파싱
                var csvData = Papa.parse(data, { header: true }).data;

                // Jibun 값과 일치하는 데이터 찾기
                var matchingData = csvData.find(function (row) {
                    return row['Jibun'] === jibunAddress;
                });

                resolve(matchingData);
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}

// 모달 닫기 함수
function closeModal() {
    var modalContainer = document.querySelector('.modal-container');
    if (modalContainer) {
        modalContainer.parentNode.removeChild(modalContainer);
    }
}

//여기까지 모달 창


function closeOverlay() {
    infowindow.close();
    marker.setMap(null);
}

kakao.maps.event.addListener(map, 'idle', function () {
    searchAddrFromCoords(map.getCenter(), displayCenterInfo);
});

function searchAddrFromCoords(coords, callback) {
    geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
}

function searchDetailAddrFromCoords(coords, callback) {
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}

function displayCenterInfo(result, status) {
    if (status === kakao.maps.services.Status.OK) {
        var infoDiv = document.getElementById('centerAddr');

        for (var i = 0; i < result.length; i++) {
            if (result[i].region_type === 'H') {
                infoDiv.innerHTML = result[i].address_name;
                break;
            }
        }
    }
}