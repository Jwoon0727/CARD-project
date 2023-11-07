from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

url = "https://naver.com"

options = Options()
options.add_argument("--start-maximized")
options.add_experimental_option("detach", True)

driver = webdriver.Chrome(options=options)

driver.get(url)

time.sleep(2)



