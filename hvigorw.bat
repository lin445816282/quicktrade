@echo off
set NODE_OPTIONS=
set "DEVECO_SDK_HOME=D:\DevEcoStudio\sdk"
set "HVIGOR_HOME=D:\DevEcoStudio\tools\hvigor"
set "NODE_HOME=D:\DevEcoStudio\tools\node"
set "PATH=%NODE_HOME%;%PATH%"
node "%HVIGOR_HOME%\bin\hvigorw.js" %*
