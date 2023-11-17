import os
import chardet
import codecs

def find_TK(str1):
    #str1="19:11:31 - C8C_SPC_Preacher teamkilled 61e_Yorkist. "
    #str_ch=" 20:07:25 - 74th_KnWe_dunh[kfive]误 杀 7PUSL_IV_RN_Sierz_BT。  "
    #str_ch_mount=" 20:07:18 - 25thNIR_inf_Rec_FA误 杀 18thRUG_2Lt_genossen的 马 。  "
    check_str=""
    tk_name=""
    y=11
    if '马' not in str1:
        for x in range(11,len(str1)):#skip the time
            check_str+=str1[x]
            if ("误 杀") in check_str:
                y=x-2
                break
        for x in range(11, y):
            tk_name+=str1[x]

        return tk_name.replace(" ", "")
def process_log_files(input_dir, output_dir):
    file_list = os.listdir(input_dir)

    for file in file_list:
        input_path = os.path.join(input_dir, file)
        output_file_name = file.split('_')[2] + file.split('_')[3] + ".txt"
        output_mouth = os.path.join(output_dir, file.split('_')[2])
        output_path = os.path.join(output_mouth, output_file_name)


        # 检测文件编码
        with open(input_path, 'rb') as rawdata:
            result = chardet.detect(rawdata.read(10000))

        encoding = result['encoding']

        try:
            with codecs.open(input_path, 'r', encoding) as f:
                result = {}
                for line in f.readlines():
                    line_list = line.split(' ')
                    if len(line_list) > 3:
                        if line_list[3][0:9] == "GreatMing":
                            name_list = line_list[3].split('_')
                            group = name_list[1]
                            if len(name_list) > 3:
                                name_ = line_list[3][9:]
                                name_list_ = name_.split('_')
                                name = name_list_[2]
                                if len(name_list_) > 4:
                                    name = name_list_[2] + '_' + name_list_[3]
                                # if line_list[4][0] == '<' and "20:10:00" < line_list[1] < "21:30：00":
                                if line_list[4][0] == '<':
                                    if name not in result.keys():
                                        result[name] = 0
                                    result[name] += 1
                                tk = find_TK(line)
                                if tk:
                                    # print(tk)
                                    # print(line)
                                    name_tk_ = tk[9:]
                                    name_tk_list_ = name_tk_.split('_')
                                    name_tk = name_tk_list_[2]
                                    if len(name_tk_list_) > 4:
                                        name_tk = name_list_[2] + '_' + name_list_[3]
                                    result[name_tk] -= 1
                                    # print(f"{name_tk}击杀了一名友军")






                with open(output_path, 'w', encoding='utf-8') as output_file:
                    for i, j in result.items():
                        output_file.write(f"{i}    {j}\n")

                print(f"{input_path} read over")
        except UnicodeDecodeError:
            print(f"{input_path} Unable to decode to UTF-8 encoding!")







# 在Node.js服务器中执行Python脚本时，脚本的当前工作目录与Python脚本所在的目录不同。
# Windows平台:
# input_directory = r"./client/src/python/log\\"
# output_directory = r"./client/src/python/logreaded\\"
# Linux平台:
input_directory = r"./client/src/python/log/"
output_directory = r"./client/src/python/logreaded/"
process_log_files(input_directory, output_directory)

