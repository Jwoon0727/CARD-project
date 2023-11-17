import requests
import csv

# 카카오 개발자 포털에서 발급받은 API 키를 입력하세요.
kakao_api_key = '07143ce4b1f0455f37c8685c50a101f0'

# 좌표 지정 (위도, 경도)
latitude = '127.1231326'
longitude = '36.8281967'  

# API 호출
url = f'https://dapi.kakao.com/v2/local/search/category.json?category_group_code=PO3&x={longitude}&y={latitude}&radius=500'
headers = {'Authorization': f'KakaoAK {kakao_api_key}'}
response = requests.get(url, headers=headers)

# 응답 확인
print(f'Status Code: {response.status_code}')

if response.status_code == 200:
    result = response.json()
    places = result.get('documents', [])

    for place in places:
        name = place.get('place_name', '')
        address = place.get('address_name', '')
        print(f'업체명: {name}, 주소: {address}')

    # CSV 파일 작성
    with open('places_data.csv', 'w', encoding='utf-8', newline='') as csvfile:
        fieldnames = ['업체명', '주소']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()

        for place in places:
            name = place.get('place_name', '')
            address = place.get('address_name', '')
            writer.writerow({'업체명': name, '주소': address})

    print('데이터를 places_data.csv 파일에 저장했습니다.')
else:
    print(f'Error: {response.status_code}')
    
   
   
# 이코드는 좌표를 지정해 좌표안에 있는 원하는 모든 데이터들을 추출하는 프로그램이다. 아웃풋은 csv파일임