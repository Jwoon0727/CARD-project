// 이미지 마커 아이콘 설정
var markerImage = new kakao.maps.MarkerImage(
  "../아파트.jpg",
  new kakao.maps.Size(20, 20),
  { offset: new kakao.maps.Point(1, 1) }
);

var aptInfos = [
  {
    name: "천안백석3차아이파크",
    lat: 36.8286524,
    lng: 127.1252861,
    address: "101동",
  },
  { name: "102", lat: 37.4567, lng: 126.789, address: "동수2 지번 주소" },
];
var selectedJibun = null;

var modalContainer;
aptInfos.forEach(function (info) {
  var marker = new kakao.maps.Marker({
    position: new kakao.maps.LatLng(info.lat, info.lng),
    map: map,
    title: info.name,
    image: markerImage,
  });

  kakao.maps.event.addListener(marker, "click", function () {
    selectedJibun = info.address;

    var infowindow = new kakao.maps.InfoWindow({
      content:
        "<div onclick=\"openModal('" +
        info.address +
        "', '" +
        info.name +
        "')\"> " +
        info.name +
        " " +
        info.address,
      removable: true,
    });

    infowindow.open(map, marker);
    openModal(info.address, info.name);
  });
});

//================================================================================================================

async function openModal(jibunAddress, hosuDetails) {
  if (document.querySelector(".modal-container")) {
    return;
  }

  modalContainer = document.createElement("div");
  modalContainer.className = "modal-container";

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
          "건물명 : " + matchingRows[0][2] + "<br>";

        var hosuGroups = groupByHosu(matchingRows);
        var clickCount = 0;
        var lastClickedCheckbox = null;

        for (var i = 0; i < hosuGroups.length; i++) {
          var currentHosu = hosuGroups[i][0][3];

          var detailContainer = modalContainer.querySelector(
            `.Detail0${i + 1}`
          );
          detailContainer.innerHTML = "";

          if (currentHosu) {
            detailContainer.setAttribute("data-hosu", currentHosu);
          }

          
      // 체크박스와 라벨 생성
      for (var j = 0; j < hosuGroups[i].length; j++) {
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `checkbox${i}_${j}`;
        checkbox.value = hosuGroups[i][j][1];

        var label = document.createElement("label");
        label.htmlFor = `checkbox${i}_${j}`;
        label.appendChild(
          document.createTextNode(" " + hosuGroups[i][j][1])
        );

     
        document.body.appendChild(checkbox);
        document.body.appendChild(label);

        var dateElement = document.createElement("span");
        dateElement.style.marginLeft = "10px";

        var br = document.createElement("br");

        detailContainer.appendChild(checkbox);
        detailContainer.appendChild(label);
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
    if (!modalContainer.querySelector(".Detail02").textContent.trim()) {
      modalContainer.querySelector(".box4").style.display = "none";
    }

    if (!modalContainer.querySelector(".Detail03").textContent.trim()) {
      modalContainer.querySelector(".box5").style.display = "none";
    }
  } catch (error) {
    console.error("CSV 파일을 읽어오는 중 오류가 발생했습니다:", error);
  }
}

function groupByHosu(rows) {
  var groups = {};
  for (var i = 0; i < rows.length; i++) {
    var hosu = rows[i][3];
    if (!groups[hosu]) {
      groups[hosu] = [];
    }
    groups[hosu].push(rows[i]);
  }

  return Object.values(groups);
}
//================================================================================================

function closeModal() {
  var modalContainer = document.querySelector(".modal-container");
  if (modalContainer) {
    modalContainer.parentNode.removeChild(modalContainer);
    selectedJibun = null;
  }
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
    selectedJibun = null;
  }
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
