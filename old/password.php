<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Forgot Password | Hems</title>

    <link rel="stylesheet" href="./css/index.css">

    <link rel="preconnect" href="https://fonts.googleapis.com">
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

    <section>
        <div class="text-primary-g font-heebo font-bold text-base uppercase md:w-2/3 xl:w-1/3 3xl:w-1/5 mx-auto text-center my-10"> 
            He<span class="text-gray-400">ms</span>
        </div> 
        <div class="xl:bg-white xl:border w-full md:w-2/3 xl:w-1/3 3xl:w-1/5 mx-auto rounded py-14 px-12 drop-shadow-sm">
            <h1 class="font-bold text-2xl text-center">Reset Password</h1>
            <p class="mt-5 text-2xs text-gray-400 tracking-wider leading-relaxed font-sans text-center">It happens. The good thing is we can reset it</p>
            <form class="mt-10" id="passwordform">
                <div>
                    <div class="form-group-auth">
                        <input name="email" id="email" placeholder="Enter your email" type="email" class="font-semibold text-sm focus:outline-none focus:ring-0 bg-transparent border-b-2 border-gray-300 focus:border-primary-g transition ease-linear duration-300 w-full py-2 placeholder:text-xs placeholder:text-gray-500">
                    </div>
                   
                    <div class="flex gap-3 3xl:gap-1 flex-col md:flex-row items-center mt-10">
                        <button id="submit" type="button" class="w-full md:w-max rounded-full text-white text-sm capitalize bg-gradient-to-tr from-emerald-400 via-emerald-500 to-primary-g px-8  py-3 lg:py-2shadow-md font-medium hover:opacity-75 transition duration-300 ease-in-out flex items-center justify-center gap-3">
                            <div class="btnloader" style="display: none;" ></div>
                            <span>Reset</span>
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
    <script src="./js/password.js"></script>
</body>
</html>