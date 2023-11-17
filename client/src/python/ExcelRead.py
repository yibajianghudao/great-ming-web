import pandas as pd
def read_excel_and_save_to_txt(excel_file, sheet_name, column_name, column_come, output_dir):
    # 读取Excel文件
    df = pd.read_excel(excel_file, sheet_name=sheet_name, header=None)
    # 获取指定列的数据
    column_name -= 1  # 数字换为索引值
    column_come -= 1
    column_A = df[column_name].tolist()
    column_B = df[column_come].tolist()

    # 从文件路径中提取文件名（不带扩展名）
    file_name = excel_file.strip('./xlsx')

    # 拼接输出文件的完整路径
    output_file = f'{output_dir}/{file_name}.txt'

    # 打开文件并写入数据
    with open(output_file, 'w') as file:
        for a, b in zip(column_A, column_B):
            if isinstance(b, int):
                file.write(f"{a}    {b}\n")
            else:
                print(f"{a},{b}不是整数，已被抛弃\n")
    return True, output_file


if __name__ == '__main__':
    # 使用示例
    file_path = './7-9月出勤击杀.xlsx'  # 替换为你的Excel文件路径
    sheet_name = 'Sheet1'
    col_name = 1
    col_come = 2
    output_directory = './'  # 替换为你的输出目录路径

    success, output_file = read_excel_and_save_to_txt(file_path, sheet_name, col_name, col_come, output_directory)

    if success:
        print(f"数据已成功写入到文件: {output_file}")
    else:
        print(f"读取数据或写入文件时出错。\n{output_file}")