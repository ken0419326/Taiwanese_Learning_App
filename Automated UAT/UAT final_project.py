#!/usr/bin/env python
# coding: utf-8

# In[121]:


#register/login
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")

driver = webdriver.Chrome(options=options)
driver.get("http://localhost:3001/register")

try:
    #註冊
    time.sleep(3)
    
    input_element = driver.find_element(By.NAME, "username")
    input_element.send_keys("usrname")
    input_element = driver.find_element(By.NAME, "email")
    input_element.send_keys("my_email")
    input_element = driver.find_element(By.NAME, "password")
    input_element.send_keys("my_pwd")
    
    time.sleep(2)
    submit_button = driver.find_element(By.CLASS_NAME, "btn-primary")
    submit_button.click()
    
    time.sleep(1)
    alert = driver.switch_to.alert
    alert.accept()
    
    time.sleep(2)
    
    #登入
    link_element = driver.find_element(By.XPATH, "//a[@href='/login']")
    link_element.click()
    input_element = driver.find_element(By.NAME, "email")
    input_element.send_keys("my_email")
    input_element = driver.find_element(By.NAME, "password")
    input_element.send_keys("my_pwd")
    
    
    submit_button = driver.find_element(By.CLASS_NAME, "btn-primary")
    submit_button.click()
    time.sleep(2)
    
    #登出
    link_element = driver.find_element(By.XPATH, "//a[text()='{}']".format("登出"))
    link_element.click()
    time.sleep(2)
    
    #錯誤帳密登入
    link_element = driver.find_element(By.XPATH, "//a[@href='/login']")
    link_element.click()
    input_element = driver.find_element(By.NAME, "email")
    input_element.send_keys("wrong_email")
    input_element = driver.find_element(By.NAME, "password")
    input_element.send_keys("wrong_pwd")
    
    
    submit_button = driver.find_element(By.CLASS_NAME, "btn-primary")
    submit_button.click()
    time.sleep(3)
    
    
    #註冊已存在的帳號
    link_element = driver.find_element(By.XPATH, "//a[@href='/register']")
    link_element.click()
    
    input_element = driver.find_element(By.NAME, "username")
    input_element.send_keys("rep_usrname")
    input_element = driver.find_element(By.NAME, "email")
    input_element.send_keys("rep_email")
    input_element = driver.find_element(By.NAME, "password")
    input_element.send_keys("rep_pwd")
    
    time.sleep(2)
    submit_button = driver.find_element(By.CLASS_NAME, "btn-primary")
    submit_button.click()
    time.sleep(4)
    
    driver.quit()
    print("測試通過！")

except Exception as e:
    print(f"測試失敗：{e}")


# In[122]:


#finishing sentence
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")

driver = webdriver.Chrome(options=options)
driver.get("http://localhost:3001/login")

try:
    #登入
    input_element = driver.find_element(By.NAME, "email")
    input_element.send_keys("my_email")
    input_element = driver.find_element(By.NAME, "password")
    input_element.send_keys("my_pwd")
    
    
    submit_button = driver.find_element(By.CLASS_NAME, "btn-primary")
    submit_button.click()
    time.sleep(5)
    
    #到課程頁
    link_element = driver.find_element(By.XPATH, "//a[@href='/course']")
    link_element.click()
    time.sleep(3)
    
    submit_button = driver.find_element(By.CLASS_NAME, "btn-primary")
    submit_button.click()
    time.sleep(3)
    
    #放語音
    submit_button = driver.find_element(By.CLASS_NAME, "play-btn")
    submit_button.click()
    time.sleep(6)
    
    #抓字典
    text_element = driver.find_element(By.CLASS_NAME, "hanji")
    actions = ActionChains(driver)
    actions.move_to_element(text_element).click_and_hold()
    actions.move_by_offset(-24, 0).perform()
    time.sleep(1)
    actions.release().perform()

    time.sleep(5)
    
    #回我的課程查看進度
    link_element = driver.find_element(By.XPATH, "//a[@href='/course']")
    link_element.click()
    time.sleep(6)
    
    driver.quit()
    print("測試通過！")

except Exception as e:
    print(f"測試失敗：{e}")


# In[123]:


#tag
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")

driver = webdriver.Chrome(options=options)
driver.get("http://localhost:3001/login")

try:
    #登入
    input_element = driver.find_element(By.NAME, "email")
    input_element.send_keys("my_email")
    input_element = driver.find_element(By.NAME, "password")
    input_element.send_keys("my_pwd")
    
    
    submit_button = driver.find_element(By.CLASS_NAME, "btn-primary")
    submit_button.click()
    time.sleep(3)
    
    #回我的課程
    link_element = driver.find_element(By.XPATH, "//a[@href='/course']")
    link_element.click()
    time.sleep(3)
    submit_button = driver.find_element(By.CLASS_NAME, "btn-primary")
    submit_button.click()
    time.sleep(3)
    
    #加入新標籤
    submit_button = driver.find_element(By.CLASS_NAME, "add-btn")
    submit_button.click()
    time.sleep(2)
    
    input_element = driver.find_element(By.ID, "formTag")
    input_element.send_keys("tag1")
    input_element.send_keys(Keys.ENTER)
    time.sleep(2)
    
    #輸入空標籤
    input_element = driver.find_element(By.ID, "formTag")
    input_element.send_keys("")
    time.sleep(2)
    input_element.send_keys(Keys.ENTER)
    time.sleep(2)
    
    #輸入重複標籤  
    input_element = driver.find_element(By.ID, "formTag")
    input_element.send_keys("tag1")
    time.sleep(2)
    input_element.send_keys(Keys.ENTER)
    time.sleep(2)
    
    #一次加入數個新標籤
    input_element = driver.find_element(By.ID, "formTag")
    input_element.send_keys("tag2 tag3 tag4")
    time.sleep(2)
    input_element.send_keys(Keys.ENTER)
    time.sleep(2)
    
    #移除標籤
    submit_button = driver.find_element(By.CLASS_NAME, "remove-btn")
    submit_button.click()
    time.sleep(2)
    
    #將字卡加入標籤
    input_element = driver.find_element(By.ID, "formTag")
    input_element.send_keys("tag1")
    input_element.send_keys(Keys.ENTER)
    time.sleep(2)
    
    button_element = driver.find_element(By.XPATH, "//button[text()='{}']".format("完成"))
    button_element.click()
    time.sleep(3)
    
    #查看標籤
    link_element = driver.find_element(By.XPATH, "//a[@href='/vocab']")
    link_element.click()
    time.sleep(5)
    
    driver.quit()
    print("測試通過！")

except Exception as e:
    print(f"測試失敗：{e}")


# In[124]:


#unfamaliar-card
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")

driver = webdriver.Chrome(options=options)
driver.get("http://localhost:3001/login")

try:
    #登入
    input_element = driver.find_element(By.NAME, "email")
    input_element.send_keys("my_email")
    input_element = driver.find_element(By.NAME, "password")
    input_element.send_keys("my_pwd")
    
    
    submit_button = driver.find_element(By.CLASS_NAME, "btn-primary")
    submit_button.click()
    time.sleep(3)
    
    #查看標籤
    link_element = driver.find_element(By.XPATH, "//a[@href='/vocab']")
    link_element.click()
    time.sleep(3)
    
    #編輯標籤
    submit_button = driver.find_element(By.CLASS_NAME, "pen-btn")
    submit_button.click()
    time.sleep(3)
    
    prompt = driver.switch_to.alert
    prompt.send_keys("tag5")
    time.sleep(3)
    prompt.accept()
    time.sleep(3)
    
    #點入標籤
    link_element = driver.find_element(By.XPATH, "//a[@href='/vocab/tag3']")
    link_element.click()
    time.sleep(3)
    
    #放語音
    submit_button = driver.find_element(By.CLASS_NAME, "play-btn")
    submit_button.click()
    time.sleep(6)
    
    #抓字典
    text_element = driver.find_element(By.CLASS_NAME, "hanji")
    actions = ActionChains(driver)
    actions.move_to_element(text_element).click_and_hold()
    actions.move_by_offset(-24, 0).perform()
    time.sleep(1)
    actions.release().perform()

    time.sleep(5)
    
    #字卡上筆記
    submit_button = driver.find_element(By.CLASS_NAME, "pen-btn")
    submit_button.click()
    time.sleep(3)
    
    input_element = driver.find_element(By.CLASS_NAME, "form-control")
    input_element.send_keys("aaaa")
    time.sleep(3)
    button_element = driver.find_element(By.XPATH, "//button[text()='{}']".format("確定"))
    button_element.click()
    time.sleep(3)
    
    #移除字卡
    submit_button = driver.find_element(By.CLASS_NAME, "remove-btn")
    submit_button.click()
    time.sleep(3)
    
    link_element = driver.find_element(By.XPATH, "//a[@href='/vocab']")
    link_element.click()
    time.sleep(3)
    
    #移除標籤
    buttons = driver.find_elements(By.CLASS_NAME, 'remove-btn') 
    buttons[1].click()
    time.sleep(3)
    
    alert = driver.switch_to.alert
    alert.accept()
    
    time.sleep(3)
    
    #確認標籤是否消除
    link_element = driver.find_element(By.XPATH, "//a[@href='/course']")
    link_element.click()
    time.sleep(3)
    
    submit_button = driver.find_element(By.CLASS_NAME, "btn-primary")
    submit_button.click()
    time.sleep(3)
    
    submit_button = driver.find_element(By.CLASS_NAME, "add-btn")
    submit_button.click()
    time.sleep(5)
    
    submit_button = driver.find_element(By.CLASS_NAME, "btn-close")
    submit_button.click()
    time.sleep(2)
    
    driver.quit()
    print("測試通過！")

except Exception as e:
    print(f"測試失敗：{e}")


# In[125]:


#finishing course
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")

driver = webdriver.Chrome(options=options)
driver.get("http://localhost:3001/login")

try:
    #登入
    input_element = driver.find_element(By.NAME, "email")
    input_element.send_keys("my_email")
    input_element = driver.find_element(By.NAME, "password")
    input_element.send_keys("my_pwd")
    submit_button = driver.find_element(By.CLASS_NAME, "btn-primary")
    submit_button.click()
    time.sleep(3)
    
    #回我的課程
    link_element = driver.find_element(By.XPATH, "//a[@href='/course']")
    link_element.click()
    time.sleep(3)
    submit_button = driver.find_element(By.CLASS_NAME, "btn-primary")
    submit_button.click()
    time.sleep(3)
    
    #切換字卡
    for i in range(3):
        submit_button = driver.find_element(By.ID, "next-btn")
        submit_button.click()
        time.sleep(1)
    
    #進入考試
    submit_button = driver.find_element(By.ID, "enter-test-btn")
    submit_button.click()
    time.sleep(1)
    
    #選擇錯誤選項
    submit_button = driver.find_element(By.ID, "B")
    submit_button.click()
    time.sleep(2)
    
    #選擇正確選項
    submit_button = driver.find_element(By.ID, "A")
    submit_button.click()
    time.sleep(2)
    
    #下一題
    submit_button = driver.find_element(By.ID, "next-btn")
    submit_button.click()
    time.sleep(2)
    
    submit_button = driver.find_element(By.ID, "C")
    submit_button.click()
    time.sleep(2)
    submit_button = driver.find_element(By.ID, "next-btn")
    submit_button.click()
    time.sleep(2)
    
    submit_button = driver.find_element(By.ID, "C")
    submit_button.click()
    time.sleep(2)
    submit_button = driver.find_element(By.ID, "next-btn")
    submit_button.click()
    time.sleep(2)
    
    submit_button = driver.find_element(By.ID, "D")
    submit_button.click()
    time.sleep(2)
    submit_button = driver.find_element(By.ID, "next-btn")
    submit_button.click()
    time.sleep(2)
    
    submit_button = driver.find_element(By.ID, "B")
    submit_button.click()
    time.sleep(2)
    
    #測驗完畢
    submit_button = driver.find_element(By.CLASS_NAME, "next-btn")
    submit_button.click()
    time.sleep(2)
    
    #完成一課
    alert = driver.switch_to.alert
    alert.accept()
    
    time.sleep(3)
    
    #查看個人頁面
    link_element = driver.find_element(By.XPATH, "//a[@href='/profile']")
    link_element.click()
    time.sleep(5)
    
    driver.quit()
    print("測試通過！")

except Exception as e:
    print(f"測試失敗：{e}")


# In[127]:


#challenge
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")

driver = webdriver.Chrome(options=options)
driver.get("http://localhost:3001/login")

try:
    #登入
    input_element = driver.find_element(By.NAME, "email")
    input_element.send_keys("my_email")
    input_element = driver.find_element(By.NAME, "password")
    input_element.send_keys("my_pwd")
    submit_button = driver.find_element(By.CLASS_NAME, "btn-primary")
    submit_button.click()
    time.sleep(3)
    
    #到我的挑戰
    link_element = driver.find_element(By.XPATH, "//a[@href='/challenge']")
    link_element.click()
    time.sleep(3)
    
    #增加更多字卡
    link_element = driver.find_element(By.XPATH, "//a[@href='/course']")
    link_element.click()
    time.sleep(3)
    
    submit_button = driver.find_element(By.CLASS_NAME, "btn-primary")
    submit_button.click()
    time.sleep(3)
    
    for i in range(4):
        submit_button = driver.find_element(By.CLASS_NAME, "add-btn")
        submit_button.click()
        time.sleep(1)
        submit_button = driver.find_element(By.CLASS_NAME, "list-group-item-action")
        submit_button.click()
        time.sleep(1)
        button_element = driver.find_element(By.XPATH, "//button[text()='{}']".format("完成"))
        button_element.click()
        time.sleep(2)
        submit_button = driver.find_element(By.ID, "next-btn")
        submit_button.click()
        time.sleep(2)
    
    #到我的挑戰
    link_element = driver.find_element(By.XPATH, "//a[@href='/challenge']")
    link_element.click()
    time.sleep(3)
    
    #所有字卡
    for i in range(5):
        actions = ActionChains(driver)
        actions.key_down(Keys.SPACE).key_up(Keys.SPACE).perform()
        time.sleep(2)
        actions = ActionChains(driver)
        actions.key_down(Keys.RIGHT).key_up(Keys.RIGHT).perform()
        time.sleep(2)
    
    #語音
    actions = ActionChains(driver)
    actions.key_down(Keys.SPACE).key_up(Keys.SPACE).perform()
    time.sleep(2)
    submit_button = driver.find_element(By.CLASS_NAME, "play-btn")
    submit_button.click()
    time.sleep(6)
    
    #不熟悉字卡
    actions = ActionChains(driver)
    actions.key_down(Keys.LEFT).key_up(Keys.LEFT).perform()
    time.sleep(2)
    
    #不熟悉字卡會提前再出現
    for i in range(3):
        actions = ActionChains(driver)
        actions.key_down(Keys.SPACE).key_up(Keys.SPACE).perform()
        time.sleep(2)
        actions = ActionChains(driver)
        actions.key_down(Keys.RIGHT).key_up(Keys.RIGHT).perform()
        time.sleep(3)
    
    #上一張
    actions = ActionChains(driver)
    actions.key_down(Keys.UP).key_up(Keys.UP).perform()
    time.sleep(2)
    
    driver.quit()
    print("測試通過！")
    
except Exception as e:
    print(f"測試失敗：{e}")


# In[ ]:




