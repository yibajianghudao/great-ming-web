import pandas as pd

dicts={}
# 读取Excel文件
df = pd.read_excel("./三千营出勤击杀0723.xlsx", sheet_name='Sheet1', header=None)
# 获取指定列的数据
column_A = df[0].tolist()
column_B = df[1].tolist()
column_C = df[2].tolist()
column_D = df[3].tolist()
column_E = df[4].tolist()


print(len(column_A))
print(len(column_B))
print(len(column_C))
print(len(column_D))
print(len(column_D))

for a,b,c,d,e in zip(column_A,column_B,column_C,column_D,column_E):
    a = str(a)
    dicts[a] = {"ranks":b,"company":e,"kills":int(c),"attendance":int(d)}

df = pd.read_excel("./7-9月出勤击杀.xlsx", sheet_name='Sheet1', header=None)

column_A = df[0].tolist()
column_B = df[1].tolist()
column_C = df[2].tolist()
for a,b,c in zip(column_A,column_B,column_C):
    a = str(a)
    key1 = None
    for key in dicts.keys():
        if key.lower() == a.lower():
            key1 = key
            break
    if key1:
        dicts[key1]["attendance"] += int(b)
        dicts[key1]["kills"] += int(c)
        # print(f"{key1}的数据已修改,kills+{b},attendance+{c}\n")
    else:
        print(f"{a}的数据不存在，出勤:{int(b)}，击杀:{int(c)}\n")


print("******************************")
print(dicts)
file_name = ('总出勤击杀2.0')

# 拼接输出文件的完整路径
output_file = f'./{file_name}.txt'

# 打开文件并写入数据
with open(output_file, 'w') as file:
    for a in dicts.items():
        file.write(f"{a}\n")

