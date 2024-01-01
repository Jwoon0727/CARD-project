// 이미지 마커 아이콘 설정
var markerImage = new kakao.maps.MarkerImage(
  '../아파트.jpg', // 이미지 파일 경로
  new kakao.maps.Size(20, 20), // 이미지 크기
  { offset: new kakao.maps.Point(1, 1) } // 이미지 중심에서의 오프셋
);

// 아파트 동수를 나타내는 정보 배열
var aptInfos = [
  { name: '천안백석3차아이파크', lat: 36.832365, lng: 127.148021, address: '101동' },
  { name: '102', lat: 37.4567, lng: 126.7890, address: '동수2 지번 주소' },
  // 다른 동수들의 정보도 추가할 수 있음
];

// 선택된 지번을 저장하는 전역 변수 추가
var selectedJibun = null;

// 모달 컨테이너 전역 변수로 선언
var modalContainer;

// 각 동수에 대한 마커 및 이미지 마커 생성
aptInfos.forEach(function (info) {
  var marker = new kakao.maps.Marker({
    position: new kakao.maps.LatLng(info.lat, info.lng),
    map: map,
    title: info.name,
    image: markerImage // 이미지 마커 아이콘 설정
  });

  // 클릭 이벤트 핸들러 등록
  kakao.maps.event.addListener(marker, 'click', function () {
    // 선택된 지번 설정
    selectedJibun = info.address;

    // 인포윈도우 생성
    var infowindow = new kakao.maps.InfoWindow({
      content: '<div onclick="openModal(\'' + info.address + '\', \'' + info.name + '\')"> ' + info.name + ' ' + info.address,
      removable: true
    });

    // 인포윈도우 지도에 표시
    infowindow.open(map, marker);

    // 추가된 부분: 모달 생성 시 CSV에서 정보 확인
    openModal(info.address, info.name);
  });
});

//================================================================================================================

async function openModal(jibunAddress, hosuDetails) {
  // 이미 모달이 열려있는 경우 더 이상 실행하지 않음
  if (document.querySelector(".modal-container")) {
    return;
  }

  // 새로운 div 요소를 생성하여 모달을 나타냄
  modalContainer = document.createElement("div");
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

                  <div class="box3">
                      <div class="Detail01"></div>
                  </div>

                  <div class="box4">
                    <div class="Detail02"></div>
                   </div>

                  <div class="box5">
                     <div class="Detail03"></div>
                 </div>

              </div>
          </div>
      </div>
  `;

  // body에 모달 요소 추가
  document.body.appendChild(modalContainer);

  var csvFilePath = "../test_information.csv";

  try {
    var data = await readCSV(csvFilePath);

    var modal = modalContainer.querySelector(".modal");
    modal.style.display = "block";

    var matchingRows = findRowsByJibun(data, jibunAddress);

    if (matchingRows.length > 0) {
      console.log(jibunAddress + "에 대한 상세 정보:");

      if (matchingRows.length > 0) {
        modalContainer.querySelector(".Name01").innerHTML =
          " " + matchingRows[0][2] + "<br>";

        // 추가된 부분: 같은 Hosu 값에 대한 그룹화
        var hosuGroups = groupByHosu(matchingRows);

        // Detail01, Detail02, Detail03에 똑같이 체크박스, 날짜, Hosu 정보 추가
        for (var i = 0; i < hosuGroups.length; i++) {
          var detailContainer = modalContainer.querySelector(`.Detail0${i + 1}`);

          // 추가된 부분: 그룹별로 Detail 값 추가
          for (var j = 0; j < hosuGroups[i].length; j++) {
            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `checkbox${i}_${j}`;
            checkbox.value = hosuGroups[i][j][1];

            var label = document.createElement("label");
            label.htmlFor = `checkbox${i}_${j}`;
            label.appendChild(document.createTextNode(" " + hosuGroups[i][j][1]));

            // 추가된 부분: Hosu 정보 추가
            var hosuElement = document.createElement("span");
            hosuElement.style.marginLeft = "10px";
            hosuElement.appendChild(document.createTextNode("Hosu: " + hosuGroups[i][j][3]));

            var dateElement = document.createElement("span");
            dateElement.style.marginLeft = "10px";

            var br = document.createElement("br");

            detailContainer.appendChild(checkbox);
            detailContainer.appendChild(label);
            detailContainer.appendChild(hosuElement);
            detailContainer.appendChild(dateElement);
            detailContainer.appendChild(br);

            checkbox.addEventListener("change", function (event) {
              var currentCheckbox = event.target;
              var currentCheckboxIndex = parseInt(
                currentCheckbox.id.split("_")[1],
                10
              );
              var currentCheckboxDateElement =
                currentCheckbox.nextElementSibling.nextElementSibling;

              if (currentCheckbox.checked) {
                var currentDate = new Date();
                var dateString = currentDate.toLocaleDateString();
                currentCheckboxDateElement.textContent = dateString;
              } else {
                currentCheckboxDateElement.textContent = "";
              }
            });
          }
          
        }
      }
    } else {
      console.log("해당 Jibun에 대한 데이터를 찾을 수 없습니다.");
    }
    
    // 추가된 부분: box4와 box5에 비어있는 박스가 있는 경우 숨김 처리
    if (!modalContainer.querySelector('.Detail02').textContent.trim()) {
      modalContainer.querySelector('.box4').style.display = 'none';
    }

    if (!modalContainer.querySelector('.Detail03').textContent.trim()) {
      modalContainer.querySelector('.box5').style.display = 'none';
    }
  } catch (error) {
    console.error("CSV 파일을 읽어오는 중 오류가 발생했습니다:", error);
  }
}

// 추가된 부분: Hosu 값을 기준으로 그룹화하는 함수
function groupByHosu(rows) {
  var groups = {};
  for (var i = 0; i < rows.length; i++) {
    var hosu = rows[i][3];
    if (!groups[hosu]) {
      groups[hosu] = [];
    }
    groups[hosu].push(rows[i]);
  }

  // Object.values를 사용하여 그룹들의 배열을 반환
  return Object.values(groups);
}
//================================================================================================


function closeModal() {
  var modalContainer = document.querySelector(".modal-container");
  if (modalContainer) {
    modalContainer.parentNode.removeChild(modalContainer);
    selectedJibun = null; // 모달이 닫힐 때 선택된 지번 재설정
  }
}

// readCSV 함수 Promise
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

function parseCSV(csv) {
  var rows = csv.split("\n");
  var data = [];

  for (var i = 0; i < rows.length; i++) {
    var columns = rows[i].split(",");
    data.push(columns);
  }

  return data;
}

function findRowsByJibun(data, jibun) {
  var matchingRows = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === jibun) {
      matchingRows.push(data[i]);
    }
  }
  return matchingRows;
}


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

function parseCSV(csv) {
  var rows = csv.split("\n");
  var data = [];

  for (var i = 0; i < rows.length; i++) {
    var columns = rows[i].split(",");
    data.push(columns);
  }

  return data;
}

function findRowsByJibun(data, jibun) {
  var matchingRows = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === jibun) {
      matchingRows.push(data[i]);
    }
  }
  return matchingRows;
}

function closeModal() {
  var modalContainer = document.querySelector(".modal-container");
  if (modalContainer) {
    modalContainer.parentNode.removeChild(modalContainer);
    selectedJibun = null; // 모달이 닫힐 때 선택된 지번 재설정
  }
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
