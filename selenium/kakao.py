import csv
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException, NoSuchWindowException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# CSV 파일 작성
csv_file_path = 'sample.csv'
with open(csv_file_path, 'w', encoding='utf-8', newline='') as csvfile:
    wr = csv.writer(csvfile)
    headers = ["업체명", "주소"]
    wr.writerow(headers)

    # Selenium을 사용한 웹 스크래핑
    driver = webdriver.Chrome()

    # 검색어 입력 및 검색
    keyword = '센트하임프라자'
    kakao_map_search_url = f"https://map.kakao.com/?q={keyword}"

    driver.get(kakao_map_search_url)
    driver.get(kakao_map_search_url)

    ind = 1
    no = 1
    page = 1

    while 1:
        try:
            element_present = EC.presence_of_element_located((By.XPATH, f'//*[@id="info.search.place.list"]/li[{ind}]/div[3]/strong/a[2]'))
            WebDriverWait(driver, 10).until(element_present)

            title = driver.find_element(by='xpath', value=f'//*[@id="info.search.place.list"]/li[{ind}]/div[3]/strong/a[2]').text
            addr = driver.find_element(by='xpath', value=f'//*[@id="info.search.place.list"]/li[{ind}]/div[5]/div[2]/p[1]').text

            # 리스트에 추가
            row = [title, addr]
            wr.writerow(row)

            ind += 1

        except NoSuchElementException:
            if no >= 5:
                driver.find_element(by='xpath', value=f'//*[@id="info.search.page.next"]').click()
                no = 1
                ind = 1
                page += 1
                continue
            else:
                no += 1
                element_present = EC.presence_of_element_located((By.XPATH, f'//*[@id="info.search.page.no{no}"]'))
                WebDriverWait(driver, 10).until(element_present)
                driver.find_element(by='xpath', value=f'//*[@id="info.search.page.no{no}"]').click()
                ind = 1
                page += 1
                continue

        except NoSuchWindowException:
            print("브라우저 창이 닫혔습니다.")
            break

# CSV 파일 닫기
driver.quit()