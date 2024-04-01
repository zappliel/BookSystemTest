# Online-Booking
软件工程基础A组在线预订子系统

此说明仅针对在线预订子系统，针对其他子系统概不负责
## 编码要求
可各自创建分支进行模块开发，在**充分测试**后保证基本稳定运行后可合并至master主分支
## 环境要求
- JDK 17.0.7
- Apache Maven 3.9.1
- Node.js 20.2.0
- MySQL 8.0.33

## 运行方式
### 后端
#### 数据库配置
- 在MySQL中创建schema`zjuse`
- 复制`backend/src/main/resources/application_template.properties`为`backend/src/main/resources/application.properties`，并修改其中的数据库连接配置
#### 编译运行

`cd backend`

清理输出目录并编译项目主代码
`mvn clean compile`

运行主代码
`mvn exec:java -Dexec.mainClass="org.zjuse.Main" -Dexec.cleanupDaemonThreads=false`

- 注意：在Windows下，需要使用`mvn exec:java -D"exec.mainClass"="org.zjuse.Main" -D"exec.cleanupDaemonThreads"=false`命令，来源参考[Unknown lifecycle phase on Maven](https://stackoverflow.com/questions/64299956/unknown-lifecycle-phase-on-maven)

有的时候测试未自动编译，需要手动编译测试代码
`mvn test-compile`

运行所有的测试
`mvn clean test`

运行某个特定的测试
`mvn -Dtest=XXXTest#XXXTest clean test`

打包成jar文件
`mvn clean package`

### 前端
`cd frontend`

安装依赖
`npm install`

运行
`npm start`