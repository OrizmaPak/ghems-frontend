<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Signup | Hems</title>

    <link rel="stylesheet" href="./css/index.css">

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
</head>
<body class="h-screen overflow-hidden  xl:bg-[#fafafa]" >

    <section class="h-full overflow-y-auto">
        <div class="text-primary-g font-heebo font-bold text-base uppercase md:w-2/3 xl:w-1/3 3xl:w-2/5 mx-auto text-center mt-10 lg:mb-10"> 
            He<span class="text-gray-400">ms</span>
        </div> 
        <div class="xl:bg-white xl:border w-full xl:w-1/2 3xl:w-2/5 mx-auto rounded py-14 px-12 drop-shadow-sm pt-4">
            <h1 class="font-bold text-2xl text-center">Sign Up</h1>
            <p class="mt-5 text-xs text-gray-400 tracking-wider leading-relaxed font-sans text-center">Provide the information below to register a new account</p>
            <form class="mt-10" id="signupform" autocomplete="of">
                <div class="flex flex-col gap-4">

                    <div class="flex flex-col lg:flex-row items-start gap-3">
                        <div class=" rounded-t border-b-0 flex items-center  bg-[#fafafa] w-full">
                            <span class="h-14 w-14 flex">
                                <span class="material-symbols-outlined m-auto text-gray-300">map</span>
                            </span>
                            <span class="flex flex-col space-y-1">
                                <label for="email" class="text-gray-500 font-normal capitalize text-2xs font-heebo"> location</label>
                                <select name="location" id="location" class="w-[465px]  placeholder:text-xs placeholder:text-gray-500 font-semibold text-sm focus:outline-none focus:ring-0 focus:border-transparent bg-transparent">
                                    <option value="">-- Select Location --</option>
                                </select>
                            </span>
                        </div>
                    </div> 
                    <div class="flex flex-col lg:flex-row items-start gap-3">
                        <div class="form-group-auth">
                            <label for="firstname" class="text-gray-500 font-normal capitalize text-2xs font-heebo">first name</label>
                            <input name="firstname" id="firstname" type="text" class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                        </div>
                        <div class="form-group-auth">
                            <label for="lastname" class="text-gray-500 font-normal capitalize text-2xs font-heebo">last name</label>
                            <input name="lastname" id="lastname" type="text" class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                        </div>
                        <div class="form-group-auth">
                            <label for="othernames" class="text-gray-500 font-normal capitalize text-2xs font-heebo">other names</label>
                            <input name="othernames" id="othernames" type="text" class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                        </div>
                    </div>

                    <div class="flex flex-col lg:flex-row items-start gap-3">
                        <div class="form-group-auth">
                            <label for="email" class="text-gray-500 font-normal capitalize text-2xs font-heebo">email</label>
                            <input name="email" id="email" type="email" class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                        </div>
                        <div class="form-group-auth">
                            <label for="phone" class="text-gray-500 font-normal capitalize text-2xs font-heebo">phone</label>
                            <input name="phone" id="phone" type="tel" class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                        </div>
                        <div class="form-group-auth">
                            <label for="address" class="text-gray-500 font-normal capitalize text-2xs font-heebo">address</label>
                            <input name="address" id="address" type="text" class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                        </div>
                    </div>

                    <div class="flex flex-col lg:flex-row items-start gap-3">
                        <div class="form-group-auth">
                            <label for="role" class="text-gray-500 font-normal capitalize text-2xs font-heebo">role</label>
                            <select readonly="readonly" name="role" id="role" class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                                <option value="STAFF" selected="selected">STAFF</option>
                            </select>
                        </div>
                        <div class="form-group-auth">
                            <label for="password" class="text-gray-500 font-normal capitalize text-2xs font-heebo">password</label>
                            <input name="password" id="password" type="password" class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                        </div>
                        <div class="form-group-auth">
                            <label for="confirmpassword" class="text-gray-500 font-normal capitalize text-2xs font-heebo">confirmpassword</label>
                            <input  id="confirmpassword" type="password" class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full">
                        </div>
                    </div>
                
                    <div class="flex gap-3 3xl:gap-1 flex-col md:flex-row items-center mt-10">
                        <button id="submit" type="button" class="w-full md:w-max rounded-full text-white text-sm capitalize bg-gradient-to-tr from-blue-400 via-blue-500 to-primary-g px-8  py-3 lg:py-2shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                            <div class="btnloader" style="display: none;" ></div>
                            <span>Signup</span>
                        </button>
                        <a href="./login" class="w-full md:w-max rounded-full text-gray-600 text-sm capitalize bg-white px-6  py-3 lg:py-2 shadow-sm font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                            <span>Login account</span>
                        </a>
                    </div>
                </div>
            </form>
            
        </div>
    </section>
    <script src="./js/util.js"></script>
    <script src="./js/signup.js"></script>
</body>
</html>