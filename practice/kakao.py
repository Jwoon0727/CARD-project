import csv
from selenium import webdriver
import pandas as pd

# CSV 파일 작성
f = open('sample.csv', 'w', encoding='utf-8', newline='')
wr = csv.writer(f)
headers = ["업체명", "주소"]
wr.writerow(headers)

# Selenium을 사용한 웹 스크래핑
driver = webdriver.Chrome()

# 검색어 입력 및 검색
keyword = '서울 종로구 어학원'
kakao_map_search_url = f"https://map.kakao.com/?q={keyword}"

driver.get(kakao_map_search_url)
driver.get(kakao_map_search_url)

ind = 1
no = 1
page = 1

while 1:
    try:
        title = driver.find_element(by='xpath', value=f'//*[@id="info.search.place.list"]/li[{ind}]/div[3]/strong/a[2]').text
        addr = driver.find_element(by='xpath', value=f'//*[@id="info.search.place.list"]/li[{ind}]/div[5]/div[2]/p[1]').text

        # 리스트에 추가
        row = [title, addr]
        wr.writerow(row)

        ind += 1

    except:
        if driver.find_element(by='xpath', value=f'//*[@id="info.search.place.more"]').is_displayed():
            driver.find_element(by='xpath', value=f'//*[@id="info.search.place.more"]').click()
            no += 1
            ind = 1
            page += 1
            continue

        elif no >= 5:
            driver.find_element(by='xpath', value=f'//*[@id="info.search.page.next"]').click()
            no = 1
            ind = 1
            page += 1
            continue

        elif driver.find_element(by='xpath', value=f'//*[@id="info.search.page.no{no+1}"]').is_displayed():
            no += 1
            driver.find_element(by='xpath', value=f'//*[@id="info.search.page.no{no}"]').click()
            ind = 1
            page += 1
            continue

# CSV 파일 닫기
f.close()