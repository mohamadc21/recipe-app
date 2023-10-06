const form = document.getElementById("form");
const searchEl = document.getElementById("search");
const favMeals = document.getElementById("fav-meals");
const main = document.querySelector("main");
const modal = document.getElementById("modal");
const closeModalOverlay = document.getElementById("modal-close");
const closeModalBtn = document.getElementById("close-modal");


function getRandomMeal() {
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(res => res.json())
    .then(resData => {
        const meal = resData.meals[0];
        addMeal(meal, random = true);
    });
}

getRandomMeal();


function getMealById(id) {
    fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id)
    .then(res => res.json())
    .then(resData => {
        const meal = resData.meals[0];
        addLikedMeals(meal);
    })
}


function getMealBySearch(search) {
    fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + search)
    .then(res => res.json())
    .then(resData => {
        const meals = resData.meals;
        console.log(meals);
        if(meals) {
        main.innerHTML = '';
            meals.forEach(meal => {
                addMeal(meal, random = false);
            })
        } else alert("no meal founded.");
    })
}

function addMeal(meal, random = false) {

    const mealEl = document.createElement("div");
    mealEl.className = "meal";

    mealEl.innerHTML = `
        ${random === true ? `<span class="random">Random Recipe</span>` : ``} 
        <div class="meal-img">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="meal-content">
            <h4>${meal.strMeal}</h4>
            <button class="like-btn" id="like-btn">
                <i class="far fa-heart"></i>
                <i class="fas fa-heart"></i>
            </button>
        </div>
    `

    const likeBtn = mealEl.querySelector("#like-btn");
    likeBtn.addEventListener("click", () => {
        if(likeBtn.classList.contains("active")) {
            removeMealFromLS(meal.idMeal);
            likeBtn.classList.remove("active");
        } else {
            setMealsToLS(meal.idMeal);
            likeBtn.classList.add("active");
        }
        fetchLikedMeals();
    })

    main.appendChild(mealEl);
}

function setMealsToLS(mealId) {
    const meals = getMealsFromLS();
    localStorage.setItem("meals", JSON.stringify([...meals, mealId]));
}

function removeMealFromLS(meal) {
    const meaIds = getMealsFromLS();

    localStorage.setItem("meals", JSON.stringify(meaIds.filter(mealId => mealId !== meal)))
}

function getMealsFromLS() {
    const mealsIds = JSON.parse(localStorage.getItem("meals"));
    return mealsIds === null ? [] : mealsIds;
}


function fetchLikedMeals() {
    favMeals.innerHTML = "";
    const mealIds = getMealsFromLS();
    mealIds.forEach(mealId => {
        return getMealById(mealId);
    });
}

fetchLikedMeals();

function addLikedMeals(meal) {
    const li = document.createElement("li");
    li.innerHTML = `
        <div class="meal-img">
            <img src="${meal.strMealThumb}">
        </div>
        <button class="remove-fav" id="remove-fav">
            <i class="fas fa-minus"></i>
        </button>
        <span>${meal.strMeal}</span>
    `
    const removeBtn = li.querySelector("#remove-fav");
    removeBtn.addEventListener("click", () => {
        removeMealFromLS(meal.idMeal);
        fetchLikedMeals();
    })

    const img = li.querySelector("img");

    img.addEventListener("click", () => {
        modal.classList.add("active");
        const modalContent = modal.querySelector(".modal-content");
        modalContent.innerHTML = `
            <h3>${meal.strMeal}</h3>
            <div class="modal-img">
                <img src="${meal.strMealThumb}">
            </div>
            <p class="desc">
                ${meal.strInstructions}
            </p>
        `
        document.body.style.overflow = "hidden"
    })

    favMeals.appendChild(li);
}

closeModalOverlay.addEventListener("click", () => {
    modal.classList.remove("active");
    document.body.style.overflow = "auto"
});

closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    document.body.style.overflow = "auto"
});


form.addEventListener("submit", (e) => {
    e.preventDefault();
    let value = searchEl.value;
    if(value.trim() != "") {
        getMealBySearch(value);
    } else alert("type some text in input.");
    searchEl.value = '';
});



// settings
setInterval(() => {
    if(main.childElementCount === 1) {
        main.querySelector("div").style.width = "100%";
        main.querySelector("div img").style.height = "450px";
    }
}, 100)

function year() {
    return new Date().getFullYear();
}