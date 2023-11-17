import re
with open('大明出勤击杀.txt', 'r') as file:
    lines = file.readlines()

# 初始化一个空字典来存储结果
result = {}
with open('AllName.txt','w') as namefile:

    # 循环处理每一行
    for line in lines:
        data_string = line.strip('()\n')
        match = re.search(r'\{.*\}', data_string)

        if match:
            dictionary_string = match.group(0)
        else:
            dictionary_string = ''

        # 第一个部分是名字，去除单引号
        name = data_string.split(',')[0].strip("'")
        namefile.write(f"{name}\n")
