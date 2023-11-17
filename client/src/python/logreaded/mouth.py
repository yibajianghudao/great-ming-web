import os

# 创建一个字典用于存储每个姓名的次数和总击杀数
name_data = {}
# windows:
# directory = r"./client/src/python/logreaded\\"

# Linux:
directory = r"./client/src/python/logreaded/"

# 遍历每个月份的文件夹
for month_folder in os.listdir(directory):

    # print(f"begin search {month_folder}")
    if os.path.isdir(os.path.join(directory, month_folder)):
        # print(f"识别到{month_folder}文件夹")
        month_data = {}  # 存储当前月份的数据
        month_name = month_folder  # 月份名称就是文件夹名
        for txt_file in os.listdir(os.path.join(directory, month_folder)):
            if txt_file.endswith('.txt'):
                with open(os.path.join(directory, month_folder, txt_file), 'r') as file:
                    lines = file.readlines()
                    for line in lines:
                        parts = line.split()
                        if len(parts) == 2:
                            name, kills = parts[0], int(parts[1])
                            if name in month_data:
                                month_data[name][0] += kills
                                month_data[name][1] += 1
                            else:
                                month_data[name] = [kills, 1]
        if month_data:
            # 将当前月份的数据写入一个新的文件
            output_file_name = f"{directory}{month_name}.txt"
            with open(output_file_name, 'w') as output_file:
                for name, data in month_data.items():
                    total_kills, count = data[0], data[1]
                    name_data[name] = name_data.get(name, [0, 0])
                    name_data[name][0] += total_kills
                    name_data[name][1] += count
                    output_file.write(f"{name}    {count}    {total_kills}\n")
            print(f"{output_file_name} write successful")


# 创建一个总的统计文件
# with open('summary.txt', 'w') as summary_file:
#     for name, data in name_data.items():
#         total_kills, count = data[0], data[1]
#         summary_file.write(f"{name}\t{count}\t{total_kills}\n")
