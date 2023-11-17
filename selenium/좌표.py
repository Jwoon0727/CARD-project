import csv
import requests

# CSV 파일 작성
csv_file_path = 'kakao_map_results.csv'
with open(csv_file_path, 'w', encoding='utf-8', newline='') as csvfile:
    wr = csv.writer(csvfile)
    headers = ["업체명", "주소"]
    wr.writerow(headers)

    # 카카오맵 API 키
    kakao_maps_api_key = '07143ce4b1f0455f37c8685c50a101f0'

    # 좌표 설정 (예시: 강남역 좌표)
    latitude, longitude = 36.8286803, 127.1233254

    # 검색 반경 설정 (예시: 1000미터 반경)
    radius = 10000

    # 카카오맵 API 엔드포인트 (장소 검색)
    kakao_maps_api_endpoint = 'https://dapi.kakao.com/v2/local/search/keyword.json'

    # API 호출 및 응답 처리
    response = requests.get(
        kakao_maps_api_endpoint,
        params={'x': longitude, 'y': latitude, 'radius': radius},
        headers={'Authorization': f'KakaoAK {kakao_maps_api_key}'}
    )
    
    # 응답 출력
    print(response.json())

    places = response.json().get('documents', [])

    # 장소 데이터를 CSV에 작성
    for place in places:
        title = place.get('place_name', '')
        addr = place.get('road_address_name', '')

        # 리스트에 추가
        row = [title, addr]
        wr.writerow(row)

print(f"결과가 {csv_file_path}에 저장되었습니다.")