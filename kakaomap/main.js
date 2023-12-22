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

// Kakao 지도 API 비동기 로드
function loadKakaoMapScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=d748997195923dbf828740f15b568099&libraries=services';
    script.onload = function () {
        // Kakao 지도 API 로드가 완료된 후 실행할 코드
        // 이 부분에 기존의 Kakao 지도 API 관련 코드를 넣으면 됩니다.

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
        });

        // 여기에 추가적인 Kakao 지도 API 관련 코드를 작성할 수 있습니다.
    };
    document.head.appendChild(script);
}

// 페이지 로드 후 Kakao 지도 API 로딩 시작
window.onload = function () {
    loadKakaoMapScript();
};



// 모달 열기 함수 --------------------------------
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
    <div class="wrap">
        <div class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal()">&times;</span>

               <div class="box1">
                <h2 class="main2">${jibunAddress}</h2>
               </div>

               <div class="box2">
               <div class="Name01"></div>
               </div>

               <div class="box3">
               <div class="Detail01"></div>
              
               </div>

            
            </div>
        </div>
    </div>
    `;

    // body에 모달 요소 추가
    document.body.appendChild(modalContainer);

    // CSV 파일 경로 (예시 경로, 실제 경로로 변경해야 함)
    var csvFilePath = '../test_information.csv';

    try {
        // CSV 파일 읽기 비동기 함수 호출
        var data = await readCSV(csvFilePath);

        // 모달 열기 후 데이터 표시
        var modal = modalContainer.querySelector('.modal');
        modal.style.display = 'block';

        var matchingRows = findRowsByJibun(data, jibunAddress);

        if (matchingRows.length > 0) {
            console.log(jibunAddress + '에 대한 상세 정보:');
            
          // Detail01에 값 추가
for (var i = 0; i < matchingRows.length; i++) {
    console.log('Detail:', matchingRows[i][1]);

    // Name01에 값 추가 (한 번만 출력)
    if (i === 0) {
        modalContainer.querySelector('.Name01').innerHTML = ' ' + matchingRows[i][2] + '<br>';
    }

      // Detail01에 값 추가
for (var i = 0; i < matchingRows.length; i++) {
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'checkbox' + i;
    checkbox.value = matchingRows[i][1];
  
    var label = document.createElement('label');
    label.htmlFor = 'checkbox' + i;
    label.appendChild(document.createTextNode(' ' + matchingRows[i][1]));
  
    var dateElement = document.createElement('span');
    dateElement.style.marginLeft = '10px';
  
    var br = document.createElement('br');
  
    modalContainer.querySelector('.Detail01').appendChild(checkbox);
    modalContainer.querySelector('.Detail01').appendChild(label);
    modalContainer.querySelector('.Detail01').appendChild(dateElement);
    modalContainer.querySelector('.Detail01').appendChild(br);
  
    // 체크박스 클릭 이벤트 처리
    checkbox.addEventListener('change', function(event) {
      var currentCheckbox = event.target;
      var currentCheckboxIndex = parseInt(currentCheckbox.id.replace('checkbox', ''), 10);
      var currentCheckboxDateElement = currentCheckbox.nextElementSibling.nextElementSibling; // 현재 체크박스 다음에 위치한 span 요소
  
      if (currentCheckbox.checked) {
        var currentDate = new Date();
        var dateString = currentDate.toLocaleDateString();
        currentCheckboxDateElement.textContent = dateString;
      } else {
        currentCheckboxDateElement.textContent = '';
      }
    });
  }
  

             
        }
        } else {
            console.log('해당 Jibun에 대한 데이터를 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('CSV 파일을 읽어오는 중 오류가 발생했습니다:', error);
    }
}


// readCSV 함수 Promise 기반으로 수정
function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', filePath, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var csvData = xhr.responseText;
                    var parsedData = parseCSV(csvData);
                    resolve(parsedData);
                } else {
                    reject(new Error('Failed to fetch CSV file'));
                }
            }
        };
        xhr.send();
    });
}

// parseCSV 함수 정의
function parseCSV(csv) {
    var rows = csv.split('\n');
    var data = [];

    for (var i = 0; i < rows.length; i++) {
        var columns = rows[i].split(',');
        data.push(columns);
    }

    return data;
}

// findRowsByJibun 함수 정의
function findRowsByJibun(data, jibun) {
    var matchingRows = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i][0] === jibun) { // 0은 Jibun 열의 인덱스
            matchingRows.push(data[i]);
        }
    }
    return matchingRows;
}

// 모달 닫기 함수
function closeModal() {
    var modalContainer = document.querySelector('.modal-container');
    if (modalContainer) {
        modalContainer.parentNode.removeChild(modalContainer);
    }
}

// 여기까지 모달 창 --------------------------------

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

