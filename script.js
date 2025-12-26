document.addEventListener("DOMContentLoaded", () => {

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let products = JSON.parse(localStorage.getItem("products")) || [];

    const userInfo = document.getElementById("user-info");
    const logoutBtn = document.getElementById("logout-btn");

    // ==================== USER AUTH ====================
    if(userInfo){
        if(currentUser) userInfo.innerText = "Welcome, "+currentUser.username;
        else userInfo.innerHTML = `<a href="signin.html" style="color:white;">Sign In</a>`;
    }

    if(logoutBtn){
        logoutBtn.onclick = ()=>{
            localStorage.removeItem("currentUser");
            location.reload();
        }
    }

    // ==================== LOAD PRODUCTS ====================
    function saveProducts(){
        localStorage.setItem("products", JSON.stringify(products));
    }

    if(document.getElementById("section-items")) loadFeatured();
    if(document.getElementById("product-detail")) loadProductDetail();
    if(document.getElementById("cart-list")) renderCart();
    if(document.getElementById("search-results")) loadSearchResults();
    if(document.getElementById("admin-products")) loadAdminProducts();

    // ==================== FEATURED PRODUCTS ====================
    function loadFeatured(){
        const section = document.getElementById("section-items");
        section.innerHTML="";
        products.slice(0,6).forEach(p=>{
            const div = document.createElement("div");
            div.className="item-card";
            div.innerHTML = `
                <img src="${p.image}" alt="${p.name}">
                <h4>${p.name}</h4>
                <p>₹${p.price}</p>
                <button>Add to Cart</button>
            `;
            div.querySelector("button").onclick = (e)=>{
                e.stopPropagation();
                addToCart(p,1);
            };
            div.onclick = ()=> window.location.href="product.html?id="+p.id;
            section.appendChild(div);
        });
    }

    // ==================== PRODUCT DETAIL PAGE ====================
    function loadProductDetail(){
        const params = new URLSearchParams(window.location.search);
        const id = parseInt(params.get("id"));
        const product = products.find(p=>p.id===id);
        if(!product) return;

        let qty=1;
        const box = document.getElementById("product-detail");
        box.innerHTML = `
            <img src="${product.image}" class="detail-img" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>₹${product.price}</p>
            <div class="qty-box">
                <button id="minus">-</button>
                <span id="qty">1</span>
                <button id="plus">+</button>
            </div>
            <button class="add-btn" id="addBtn">Add to Cart</button>
            <button class="buy-btn" id="buyBtn">Buy Now</button>
        `;

        document.getElementById("plus").onclick = ()=>{
            qty++; 
            document.getElementById("qty").innerText=qty;
        }
        document.getElementById("minus").onclick = ()=>{
            if(qty>1) qty--; 
            document.getElementById("qty").innerText=qty;
        }
        document.getElementById("addBtn").onclick = ()=> addToCart(product,qty);
        document.getElementById("buyBtn").onclick = ()=>{
            addToCart(product,qty);
            window.location.href="cart.html";
        }
    }

    // ==================== ADD TO CART ====================
    function addToCart(product,qty=1){
        const found = cart.find(p=>p.id===product.id);
        if(found) found.quantity += qty;
        else cart.push({...product, quantity:qty});
        localStorage.setItem("cart",JSON.stringify(cart));
        alert("Added to cart 🛒");
        renderCart();
    }

    // ==================== RENDER CART ====================
    function renderCart(){
        const box = document.getElementById("cart-list");
        if(!box) return;
        box.innerHTML="";
        let total=0;
        cart.forEach((p,i)=>{
            total += p.price * p.quantity;
            box.innerHTML += `
                <div class="cart-item">
                    <img src="${p.image}" alt="${p.name}">
                    <div>
                        <h4>${p.name}</h4>
                        <p>₹${p.price}</p>
                        <div class="qty-box">
                            <button onclick="changeQty(${i},-1)">-</button>
                            ${p.quantity}
                            <button onclick="changeQty(${i},1)">+</button>
                        </div>
                        <button onclick="removeItem(${i})">Remove</button>
                    </div>
                </div>
            `;
        });
        if(cart.length>0) box.innerHTML += `<h3>Total: ₹${total}</h3>`;
    }

    window.changeQty = function(i,val){
        cart[i].quantity += val;
        if(cart[i].quantity <=0) cart.splice(i,1);
        localStorage.setItem("cart",JSON.stringify(cart));
        renderCart();
    }

    window.removeItem = function(i){
        cart.splice(i,1);
        localStorage.setItem("cart",JSON.stringify(cart));
        renderCart();
    }

    // ==================== SEARCH ====================
    window.searchProduct = function(){
        const input = document.getElementById("searchInput");
        const keyword = input.value.trim().toLowerCase();
        if(!keyword) return alert("Enter product name");
        localStorage.setItem("lastSearch", keyword);
        const result = products.filter(p=> p.name.toLowerCase().includes(keyword));
        localStorage.setItem("searchResults", JSON.stringify(result));
        window.location.href = "search.html";
    }

    // ==================== LOAD SEARCH RESULTS ====================
    function loadSearchResults(){
        const section = document.getElementById("search-results");
        const input = document.getElementById("searchInput");
        const results = JSON.parse(localStorage.getItem("searchResults")) || [];
        if(input) input.value = localStorage.getItem("lastSearch") || "";

        if(!section) return;
        section.innerHTML = "";

        if(results.length === 0){
            section.innerHTML = "<p style='text-align:center;'>No products found!</p>";
            return;
        }

        results.forEach(p=>{
            const div = document.createElement("div");
            div.className="item-card";
            div.innerHTML = `
                <img src="${p.image}" alt="${p.name}">
                <h4>${p.name}</h4>
                <p>₹${p.price}</p>
                <button>Add to Cart</button>
            `;
            div.querySelector("button").onclick = (e)=>{
                e.stopPropagation();
                addToCart(p,1);
            };
            div.onclick = ()=> window.location.href = "product.html?id="+p.id;
            section.appendChild(div);
        });
    }

    // ==================== ADMIN PAGE ====================
    function loadAdminProducts(){
        const table = document.getElementById("admin-products");
        if(!table) return;
        table.innerHTML = "";

        products.forEach((p,i)=>{
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${p.id}</td>
                <td><input type="text" value="${p.name}" id="name-${i}"></td>
                <td><input type="text" value="${p.image}" id="image-${i}"></td>
                <td><input type="number" value="${p.price}" id="price-${i}"></td>
                <td>
                    <button onclick="updateProduct(${i})">Update</button>
                    <button onclick="deleteProduct(${i})">Delete</button>
                </td>
            `;
            table.appendChild(tr);
        });
    }

    window.addProduct = function(){
        const name = document.getElementById("newName").value.trim();
        const image = document.getElementById("newImage").value.trim();
        const price = parseInt(document.getElementById("newPrice").value);
        if(!name || !image || !price) return alert("All fields required!");
        const id = products.length>0 ? products[products.length-1].id + 1 : 1;
        products.push({id,name,image,price});
        saveProducts();
        loadAdminProducts();
        alert("Product added ✅");
    }

    window.updateProduct = function(i){
        const name = document.getElementById("name-"+i).value.trim();
        const image = document.getElementById("image-"+i).value.trim();
        const price = parseInt(document.getElementById("price-"+i).value);
        if(!name || !image || !price) return alert("All fields required!");
        products[i].name = name;
        products[i].image = image;
        products[i].price = price;
        saveProducts();
        loadAdminProducts();
        alert("Product updated ✅");
    }

    window.deleteProduct = function(i){
        if(!confirm("Are you sure to delete?")) return;
        products.splice(i,1);
        saveProducts();
        loadAdminProducts();
        alert("Product deleted ✅");
    }

    // ==================== SLIDER ====================
    const slider = document.querySelector(".slider");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if(slider){
        let scrollAmount = 0;
        let maxScroll = slider.scrollWidth - slider.clientWidth;
        let autoScroll;

        function startAutoScroll() {
            autoScroll = setInterval(() => {
                scrollAmount += 2;
                if(scrollAmount > maxScroll) scrollAmount = 0;
                slider.scrollTo({ left: scrollAmount, behavior: 'smooth' });
            }, 50);
        }

        function stopAutoScroll() {
            clearInterval(autoScroll);
        }

        slider.addEventListener("mouseenter", stopAutoScroll);
        slider.addEventListener("mouseleave", startAutoScroll);

        prevBtn.addEventListener("click", () => {
            scrollAmount -= 200;
            if(scrollAmount < 0) scrollAmount = 0;
            slider.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        });

        nextBtn.addEventListener("click", () => {
            scrollAmount += 200;
            if(scrollAmount > maxScroll) scrollAmount = maxScroll;
            slider.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        });

        startAutoScroll();
    }

});
document.addEventListener("DOMContentLoaded", () => {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const userInfo = document.getElementById("user-info");
    const logoutBtn = document.getElementById("logout-btn");
    const profileLink = document.getElementById("profile-link");

    // User Authentication
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if(userInfo){
        if(currentUser){
            userInfo.innerText = "Welcome, " + currentUser.username;
            profileLink.style.display = "inline-block";
        } else {
            userInfo.innerHTML = `<a href="signin.html" style="color:white;">Sign In</a>`;
            profileLink.style.display = "none";
        }
    }

    if(logoutBtn){
        logoutBtn.onclick = ()=>{
            localStorage.removeItem("currentUser");
            location.reload();
        }
    }

    // Load Featured Products
    const sectionGrid = document.getElementById("section-items-grid");
    const sectionSlider = document.getElementById("section-items-slider");

    function renderProducts(){
        sectionGrid.innerHTML = "";
        sectionSlider.innerHTML = "";
        products.forEach(p=>{
            // Grid
            const divGrid = document.createElement("div");
            divGrid.className = "item-card";
            divGrid.innerHTML = `
                <img src="${p.image}" alt="${p.name}">
                <h4>${p.name}</h4>
                <p>₹${p.price}</p>
                <button onclick="addToCart(${p.id})">Add to Cart</button>
            `;
            divGrid.onclick = ()=> window.location.href = "product.html?id="+p.id;
            sectionGrid.appendChild(divGrid);

            // Slider
            const divSlider = document.createElement("div");
            divSlider.className = "item-card";
            divSlider.innerHTML = `
                <img src="${p.image}" alt="${p.name}">
                <h4>${p.name}</h4>
                <p>₹${p.price}</p>
                <button onclick="addToCart(${p.id})">Add to Cart</button>
            `;
            divSlider.onclick = ()=> window.location.href = "product.html?id="+p.id;
            sectionSlider.appendChild(divSlider);
        });
    }

    renderProducts();

    // Add to Cart
    window.addToCart = function(id){
        const product = products.find(p=>p.id===id);
        if(!product) return alert("Product not found");

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const found = cart.find(p=>p.id===id);

        if(found) found.quantity += 1;
        else cart.push({...product, quantity:1});

        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Product added to cart 🛒");
    }

    // Search
    window.searchProduct = function(){
        const input = document.getElementById("searchInput");
        const keyword = input.value.trim().toLowerCase();
        if(!keyword) return alert("Enter product name");

        const results = products.filter(p=> p.name.toLowerCase().includes(keyword));
        localStorage.setItem("searchResults", JSON.stringify(results));
        localStorage.setItem("lastSearch", keyword);
        window.location.href = "search.html";
    }

    // Slider Scroll
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    if(sectionSlider){
        let scrollAmount = 0;
        const maxScroll = sectionSlider.scrollWidth - sectionSlider.clientWidth;

        prevBtn.onclick = ()=> {
            scrollAmount -= 200;
            if(scrollAmount < 0) scrollAmount = 0;
            sectionSlider.scrollTo({left: scrollAmount, behavior:"smooth"});
        }

        nextBtn.onclick = ()=> {
            scrollAmount += 200;
            if(scrollAmount > maxScroll) scrollAmount = maxScroll;
            sectionSlider.scrollTo({left: scrollAmount, behavior:"smooth"});
        }
    }
});