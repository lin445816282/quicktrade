@echo off
cd /d D:\QuickTrade

REM Step 1: Generate CSR from existing p12
"D:\DevEcoStudio\jbr\bin\keytool.exe" -certreq -alias quicktrade -keystore D:\QuickTrade\quicktrade.p12 -storetype PKCS12 -storepass Alcz8283103 -file D:\QuickTrade\quicktrade.csr

REM Step 2: Generate debug profile using provisionsigntool
java -jar "D:\DevEcoStudio\sdk\default\openharmony\toolchains\lib\hap-sign-tool.jar" generate-profile -keyAlias quicktrade -keyPwd Alcz8283103 -keystoreFile D:\QuickTrade\quicktrade.p12 -keystorePwd Alcz8283103 -outFile D:\QuickTrade\quicktrade.p7b -signAlg SHA256withECDSA -subject "CN=QuickTrade, OU=Dev, O=XiaoLin, L=SZ, ST=GD, C=CN" -issuer "CN=QuickTrade, OU=Dev, O=XiaoLin, L=SZ, ST=GD, C=CN" 2>&1

echo DONE
