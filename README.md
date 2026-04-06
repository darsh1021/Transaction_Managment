We will firstly go on with role based access 

ROLE BASED ACCESS CONTROL 
simple I will be using User Model & Role Enum 

And Stateless & Scalability we will be going with : JWT 
Why not session then --> Session sucks in backend server handling 1 session --- 1 backend instancs, We can use redis to handle those avoiding that I am going with jwt 
Jwt allow multiple instances and uses token so no need to synchronize 

-->User Model 
enum based roles : viewer , analyst and admin  
--> why analyst?? I know admin can do things if you hire me then you cant trust me that much about giving your whole database access to me, so make me analyst

Model fields : file : User.js 
username , email, password , role , status , lastlogin , timestamp 
In this same file  Register-->Encyption  Login --> comparePassword

file :  authMiddleware.js
  Auth Middleware Philosophy:
  - protect: Authentication - "Who are you?" (Identifies the user)
  - authorize: Authorization - "What are you allowed to do?" (Checks access rights)
  
  Scalability:
  - authorize() uses a rest parameter (...) to handle any number of roles.

Decoupling 
It is the architectural practice of ensuring that different part of your system dont over-share information or depend too heavily on each other.
the most common decoupling is seprating the service(Business Logic)  from the  contollers(HTTPLayer)
ex : authcotroller(waiter) and authService(chef) 

Services 
authService.js
This file will handle login and register token creation which will be used by login & register controllers 
if we decided to change the auth jwt or secreats then we have clear one file to handle only no extra mess, Easy Migration DB


Contollers 
file : userController 
Added register and login controllers which will be used to use service and create the user and handle them 

Router 
file : authRoute
Added the router for login and signup 

2. Financial Records Management (Phase 2)
Create backend support for financial data such as transactions or entries.

file : userController 
Created to see all users and if you want to change <b>role & status</b>  or permissions as Admin

file:FinancialRecord.js 
Model for tracking the finance

file :recordService.js
This service handles the busincess logic for data fetching , updating and deleting

file: recordController.js
for getting or adding the data 

file:recordRoutes.js
The routes for creating request and response life cycle for handling the records 

Done with the second module

Continueing with phase 3 that is summary and dashboard 

For getting summary we have 
Way 1 : $facet stage only once. $facet enables various aggregations on the same set of input documents, without needing to retrieve the input documents multiple times.

for less data it provide faster computation and calculation for each time user open dashboard it is good for an MVP

Way 2 : PreCompute 
Compute as data arrives o(1) which is basically store the summary of the old data and use it to comput new result 
It is suitable for
10K – 1M records
Frequent dashboard usage
Growing app

Way 3  :Redis and asynchronous processing
At huge scale, you separate computation from request handling by using background workers to precompute data and Redis to serve it instantly, ensuring high performance and low database load.

<img width="1194" height="1316" alt="image" src="https://github.com/user-attachments/assets/b258fb13-9706-40db-8742-e176e523911d" />

Controller → Service → Cache Utility → Redis

Created  new Utils folder which contains redis.js
It connects the redis.js and handle the port , host , retry and lazyConnect : Redis connect when needed 

retry after delay 
Attempt	Delay
1	50ms
2	100ms
10	500ms
Max	2000ms

call getCache if data exits return else  call the setCache store Cache and store it in the db

Way 4 : I just understand we can create Redis + Async +  Worker 
for heavy task like aggreagation we can use worker which will reduce the extra waiting time required in case of time and easy to handle user requests 
(In future)

also added the redis and facet  which will handle some medium upto 10000 queries and work properly 

Validation and error handling already added and error responses also added 

***extras added 
Authentication using tokens or sessions
Search support Filter engine is added in getRecords 
Unit tests or integration tests
API documentation



