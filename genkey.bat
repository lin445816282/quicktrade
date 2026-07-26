@echo off
del D:\QuickTrade\quicktrade.p12 2>nul
"D:\DevEcoStudio\jbr\bin\keytool.exe" -genkeypair -alias quicktrade -keyalg EC -sigalg SHA256withECDSA -keysize 256 -keystore D:\QuickTrade\quicktrade.p12 -storetype PKCS12 -validity 9125 -storepass Alcz8283103 -keypass Alcz8283103 -dname "CN=QuickTrade, OU=Dev, O=XiaoLin, L=SZ, ST=GD, C=CN"
echo DONE
