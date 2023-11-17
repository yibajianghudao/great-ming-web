import re
import time

import requests
# 打开txt文件以读取
with open('大明出勤击杀.txt', 'r') as file:
    lines = file.readlines()

# 初始化一个空字典来存储结果
result = {}

# 循环处理每一行
for line in lines:
    data_string = line.strip('()\n')
    match = re.search(r'\{.*\}', data_string)

    if match:
        dictionary_string = match.group(0)
    else:
        dictionary_string = ''

    # 第一个部分是名字，去除单引号
    name = data_string.split(',')[0]
    # print(name)
    result_value = name+','+dictionary_string
    name, data = eval(f"({result_value})")

    # 构建最终的字典格式
    result[name] = data
# print(result)
# print(len(result.keys()))

# 定义API的URL
url = 'http://localhost:3000/register'  # 请替换为实际的API URL

for namek,datav in result.items():
    # 定义请求参数
    data = {
        "username": namek,
        "tag": "NewPlayer",
        "ranks": datav['ranks'],
        "company": datav['company'],
        "kills": datav['kills'],
        "attendance": datav['attendance'],
        "balance": 0,
        "password": "123456",
        "enrollmentTime": "2023-09-24"
    }

    # 发送POST请求
    response = requests.post(url, json=data)

    # 检查响应
    if response.status_code == 200:
        print(f"{namek}注册成功")
    else:
        print("注册失败，错误信息:", response.json())
    time.sleep(0.1)


