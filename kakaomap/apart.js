
  // 이미지 마커 아이콘 설정
  var markerImage = new kakao.maps.MarkerImage(
    '../아파트.jpg', // 이미지 파일 경로
    new kakao.maps.Size(20, 20), // 이미지 크기
    { offset: new kakao.maps.Point(1, 1) } // 이미지 중심에서의 오프셋
  );

// 아파트 동수를 나타내는 정보 배열
var aptInfos = [
    { name: '천안백석3차아이파크', lat: 36.832365, lng:  127.148021, address: '101동' },
    { name: '102', lat: 37.4567, lng: 126.7890, address: '동수2 지번 주소' },
    // 다른 동수들의 정보도 추가할 수 있음
  ];
  
  
  // 각 동수에 대한 마커 및 이미지 마커 생성
  aptInfos.forEach(function(info) {
    var marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(info.lat, info.lng),
        map: map,
        title: info.name,
        image: markerImage // 이미지 마커 아이콘 설정
    });
  
    // 클릭 이벤트 핸들러 등록
    kakao.maps.event.addListener(marker, 'click', function() {
        // 인포윈도우 생성
        var infowindow = new kakao.maps.InfoWindow({
            content: '<div onclick="openModal(\'' + info.address + '\', \'' + info.name + '\')"> ' + info.name + ' ' + info.address ,
            removable: true
        });
  
        // 인포윈도우 지도에 표시
        infowindow.open(map, marker);
    });
  });
  
  //================================================================
  function addHosuEventListeners(data) {
    var hosuElements = document.querySelectorAll("[class^='Hosu']");
  
    hosuElements.forEach(hosuElement => {
      hosuElement.addEventListener("click", function () {
        var hosuIndex = hosuElement.getAttribute("data-hosu-index");
        var jibunAddress = document.querySelector(".main2").textContent.trim();
        var hosuId = "Hosu" + hosuIndex;
  
        showDetail(jibunAddress, hosuId, data);
      });
    });
  }
  
  
  // 모달 열기 함수
  async function openModal(jibunAddress, dongName) {
    // 이미 모달이 열려있는 경우 더 이상 실행하지 않음
    if (document.querySelector(".modal-container")) {
        return;
    }
  
    // 새로운 div 요소를 생성하여 모달을 나타냄
    var modalContainer = document.createElement("div");
    modalContainer.className = "modal-container";
  
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
  
                    ${createHosuContainers()}
  
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
    var csvFilePath = "../test_information.csv";
  
    try {
        // CSV 파일 읽기 비동기 함수 호출
        var data = await readCSV(csvFilePath);
  
        // 모달 열기 후 데이터 표시
        var modal = modalContainer.querySelector(".modal");
        modal.style.display = "block";
  
        var matchingRows = findRowsByJibun(data, jibunAddress);
  
        if (matchingRows.length > 0) {
            console.log(jibunAddress + "에 대한 상세 정보:");
  
            // Name01에 값 추가 (한 번만 출력)
            if (matchingRows.length > 0) {
                modalContainer.querySelector(".Name01").innerHTML =
                    " " + matchingRows[0][2] + "<br>";
  
                // Hosu 추가
                for (var i = 0; i < matchingRows.length; i++) {
                    var hosuContainer = modalContainer.querySelector(`.Hosu${i}`);
                    if (matchingRows[i][3]) {
                        // Hosu 값이 존재하면 표시
                        hosuContainer.innerHTML = `Hosu: ${matchingRows[i][3]}<br>`;
                    } else {
                        // Hosu 값이 없으면 숨김
                        hosuContainer.parentNode.style.display = "none";
                    }
                }
            }
  
            // Detail01에 값 추가
            for (var i = 0; i < matchingRows.length; i++) {
                console.log("Detail:", matchingRows[i][1]);
  
                var checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = "checkbox" + i;
                checkbox.value = matchingRows[i][1];
  
                var label = document.createElement("label");
                label.htmlFor = "checkbox" + i;
                label.appendChild(document.createTextNode(" " + matchingRows[i][1]));
  
                var dateElement = document.createElement("span");
                dateElement.style.marginLeft = "10px";
  
                var br = document.createElement("br");
  
                modalContainer.querySelector(".Detail01").appendChild(checkbox);
                modalContainer.querySelector(".Detail01").appendChild(label);
                modalContainer.querySelector(".Detail01").appendChild(dateElement);
                modalContainer.querySelector(".Detail01").appendChild(br);
  
                // 체크박스 클릭 이벤트 처리
                checkbox.addEventListener("change", function (event) {
                    var currentCheckbox = event.target;
                    var currentCheckboxIndex = parseInt(
                        currentCheckbox.id.replace("checkbox", ""),
                        10
                    );
                    var currentCheckboxDateElement =
                        currentCheckbox.nextElementSibling.nextElementSibling; // 현재 체크박스 다음에 위치한 span 요소
  
                    if (currentCheckbox.checked) {
                        var currentDate = new Date();
                        var dateString = currentDate.toLocaleDateString();
                        currentCheckboxDateElement.textContent = dateString;
                    } else {
                        currentCheckboxDateElement.textContent = "";
                    }
                });
            }
        } else {
            console.log("해당 Jibun에 대한 데이터를 찾을 수 없습니다.");
        }
    } catch (error) {
        console.error("CSV 파일을 읽어오는 중 오류가 발생했습니다:", error);
    }
  }
  
  // CSV 파일 읽기 함수 Promise 기반으로 수정
  function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", filePath, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var csvData = xhr.responseText;
                    var parsedData = parseCSV(csvData);
                    resolve(parsedData);
                } else {
                    reject(new Error("Failed to fetch CSV file"));
                }
            }
        };
        xhr.send();
    });
  }
  
  // parseCSV 함수 정의
  function parseCSV(csv) {
    var rows = csv.split("\n");
    var data = [];
  
    for (var i = 0; i < rows.length; i++) {
        var columns = rows[i].split(",");
        data.push(columns);
    }
  
    return data;
  }
  
  // findRowsByJibun 함수 정의
  function findRowsByJibun(data, jibun) {
    var matchingRows = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i][0] === jibun) {
            // 0은 Jibun 열의 인덱스
            matchingRows.push(data[i]);
        }
    }
    return matchingRows;
  }
  
  // 모달 닫기 함수
  function closeModal() {
    var modalContainer = document.querySelector(".modal-container");
    if (modalContainer) {
        modalContainer.parentNode.removeChild(modalContainer);
    }
  }
  
  // Hosu Containers 생성 함수
  function createHosuContainers() {
    var containersHTML = "";
    for (var i = 0; i < 3; i++) {
        containersHTML += `
            <div class="rac${i}">
                <div class="Hosu${i}"></div>
            </div>
        `;
    }
    return containersHTML;
  }
  
  
    
    
  // readCSV 함수 Promise 기반으로 수정
  function readCSV(filePath) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", filePath, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var csvData = xhr.responseText;
            var parsedData = parseCSV(csvData);
            resolve(parsedData);
          } else {
            reject(new Error("Failed to fetch CSV file"));
          }
        }
      };
      xhr.send();
    });
  }
  
  // parseCSV 함수 정의
  function parseCSV(csv) {
    var rows = csv.split("\n");
    var data = [];
  
    for (var i = 0; i < rows.length; i++) {
      var columns = rows[i].split(",");
      data.push(columns);
    }
  
    return data;
  }
  
  // findRowsByJibun 함수 정의
  function findRowsByJibun(data, jibun) {
    var matchingRows = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i][0] === jibun) {
        // 0은 Jibun 열의 인덱스
        matchingRows.push(data[i]);
      }
    }
    return matchingRows;
  }
  
  // 모달 닫기 함수
  function closeModal() {
    var modalContainer = document.querySelector(".modal-container");
    if (modalContainer) {
      modalContainer.parentNode.removeChild(modalContainer);
    }
  }
  //================================================================
  
  