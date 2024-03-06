/**
 * 这是用于将旧版本的log(readed)转换为新版本log的Java代码
 * 主要是将每行的一个空格换为两个，并且删除"(炮)"字样
 * 并将GBK格式转换为utf-8
 * @author JiangHuDao
 * @version 1.0
 * @time 2024/3/6
 */

"""
import java.io.*;
import java.lang.String;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        File folder = new File("/home/JiangHuDao/Downloads/GreatMingtxt/2022/");
        File[] listOfFiles = folder.listFiles();

        if (listOfFiles != null) {
            for (int i = 0; i < listOfFiles.length; i++) {
                if (listOfFiles[i].isFile()) {
//                    System.out.println("File " + listOfFiles[i].getName());
                    String name = listOfFiles[i].getName();
                    String fileName = "/home/JiangHuDao/Downloads/GreatMingtxt/2022/" + name;
                    String newFileName = "/home/JiangHuDao/Downloads/GreatMingtxt/readed2022/" + name;
                    boolean ret = ReadFile(fileName, newFileName);
                    if (ret) {System.out.println(name + "has been changed");}
                } else if (listOfFiles[i].isDirectory()) {
                    System.out.println("Find Directory:" + listOfFiles[i].getName());
                }
            }
        }

//        String fileName = "0724.txt";
//        String newFileName = "07241.txt";
//
//        ReadFile(fileName, newFileName);
    }

    public static boolean ReadFile(String oldFileName, String newFileName) {
        BufferedReader in = null;
        BufferedWriter out = null;

        try {
            File oldFile = new File(oldFileName);
//            Scanner myReader = new Scanner(oldFile);
            File newFile = new File(newFileName);


            //加入编码字符集
            in = new BufferedReader(new InputStreamReader(new FileInputStream(oldFile), "gbk"));
            //加入编码字符集
            out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(newFile), StandardCharsets.UTF_8));

//            FileWriter newFileWriter = new FileWriter(newFileName);

            String line = "";
            while ((line = in.readLine()) != null) {
                line = line.replace(" ", "    ");
                line = line.replace("(炮)", "");
//                System.out.println(line);
                out.write(line + "\n");
            }
            return true;
        } catch (FileNotFoundException e) {
            System.out.println("file is not fond");
        } catch (IOException e) {
            System.out.println("Read or write Exceptioned");
        } finally {
            if (null != in) {
                try {
                    in.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (null != out) {
                try {
                    out.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return false;
    }
}