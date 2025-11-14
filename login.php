<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | Hems</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">
    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;1,700&display=swap"
        rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">

    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@40,400,0,0" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />

    <link rel="stylesheet" href="./css/index.css">
</head>
<body class="h-screen overflow-auto  xl:bg-[#fafafa]" >

    <section>
        <div class="text-primary-g font-heebo font-bold text-base uppercase md:w-2/3 xl:w-1/3 3xl:w-1/5 mx-auto text-center my-10"> 
            He<span class="text-gray-400">ms</span>
        </div> 
        <div class="xl:bg-white xl:border w-full md:w-2/3 xl:w-1/3 3xl:w-1/5 mx-auto rounded py-14 px-12 drop-shadow-sm">
            <h1 class="font-bold text-2xl text-center">Welcome back &#128519;</h1>
            <p class="mt-5 text-xs text-gray-400 tracking-wider leading-relaxed font-sans text-center">Provide your email and password credentials to securely sign in. keep information confidential at all times</p>
            <form class="mt-10" id="loginform" autocomplete="off">
                <div>
                   
                    <div class=" rounded-t border-b-0 flex items-center  bg-[#fafafa]">
                        <span class="h-14 w-14 flex">
                            <span class="material-symbols-outlined m-auto text-gray-300">email</span>
                        </span>
                        <span class="flex flex-col space-y-1">
                            <label for="email" class="text-gray-500 font-normal capitalize text-2xs font-heebo"> email address</label>
                            <input autofocus="on" name="email" id="email" type="email" placeholder="doe@example.com" class="placeholder:text-xs placeholder:text-gray-500 font-semibold text-sm focus:outline-none focus:ring-0 focus:border-transparent bg-transparent">
                        </span>
                    </div>
                    <div class="border-t rounded-b flex items-center  bg-[#fafafa]">
                        <span class="h-14 w-14 flex">
                            <span class="material-symbols-outlined m-auto text-gray-300">lock</span>
                        </span> 
                        <span class="flex flex-col space-y-1">
                            <label for="password" class="text-gray-500 font-normal capitalize text-xs font-heebo">Password</label>
                            <input name="" id="password" type="password" placeholder="******" class="placeholder:text-xs placeholder:text-gray-500 font-semibold text-sm focus:outline-none focus:ring-0 focus:border-transparent bg-transparent">
                        </span>
                    </div>
                     <div class=" rounded-t border-b-0 flex items-center  bg-[#fafafa]">
                        <span class="h-14 w-14 flex">
                            <span class="material-symbols-outlined m-auto text-gray-300">map</span>
                        </span>
                        <span class="flex flex-col space-y-1">
                            <label for="email" class="text-gray-500 font-normal capitalize text-2xs font-heebo"> location</label>
                            <select name="location" id="location" class="w-[165px]  placeholder:text-xs placeholder:text-gray-500 font-semibold text-sm focus:outline-none focus:ring-0 focus:border-transparent bg-transparent">
                                <option value="">-- Select Location --</option>
                            </select>
                        </span>
                    </div>
                     <div id="consentcontainer" class=" rounded-t border-b-0 flex  bg-[#fafafa]">
                        <!--<span class="h-14 w-14 flex">-->
                        <!--    <span class="material-symbols-outlined m-auto text-gray-300">verified_user</span>-->
                        <!--</span>-->
                        <!--<span class="flex items-center gap-2">-->
                        <!--    <input type="checkbox" name="consent" id="consent" class="p-3 placeholder:text-xs placeholder:text-gray-500 font-semibold text-sm focus:outline-none focus:ring-0 focus:border-transparent bg-transparent">-->
                        <!--    <label for="consent" class="text-gray-500 font-normal capitalize text-sm font-heebo">I Agree to the <a class="text-blue-400 underline" href="https://miratechnologiesng.com/privacy">Terms & Conditions</a></label>-->
                        <!--</span>-->
                    </div>
                   <div class="flex items-center justify-between my-5 text-xs text-gray-400 font-normal tracking-wide">
                        <span class="flex items-center space-x-1">
                            <input type="checkbox" checked class="accent-blue-700">
                            <span>Remember me</span>
                        </span>
                        <a href="./password" class="hover:underline decoration-primary-g">Forgot Password?</a>
                   </div>
                    <div class="flex gap-3 3xl:gap-1 flex-col md:flex-row items-center mt-10">
                        <button id="submit" type="button" class="w-full md:w-max rounded-full text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8 py-3 lg:py-2 shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                            <div class="btnloader" style="display: none;"></div>
                            <span>Login</span>
                        </button>
                        <a href="./signup.php" class="w-full md:w-max rounded-full text-gray-600 text-sm capitalize bg-white px-6 py-3 lg:py-2 shadow-sm font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                            <span>Create account</span>
                        </a>
                    </div>
                </div>
            </form>
            
        </div>
    </section>
    <script src="./js/util.js"></script>
    <script src="./js/oreutil.js"></script>
    <script src="./js/login.js"></script>
</body>
</html>
