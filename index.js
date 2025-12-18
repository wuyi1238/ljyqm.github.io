        // 购物车数据
        let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        let quantity = 1;
        let currentColor = 'black';
        let currentColorName = '黑色';
        let currentSize = 'standard';
        let currentSizeName = '标准版';
        let currentPrice = 1299;
        
        // 结算数据
        let checkoutData = {
            selectedAddress: null,
            selectedPayment: null,
            orderNumber: null
        };
        
        // 收货地址数据
        const addresses = [
            {
                id: 1,
                name: '张三',
                phone: '13800138000',
                address: '上海市浦东新区张江高科技园区科技大厦A座12楼',
                isDefault: true
            },
            {
                id: 2,
                name: '李四',
                phone: '13900139000',
                address: '北京市海淀区中关村大街1号鼎好大厦B座8楼',
                isDefault: false
            },
            {
                id: 3,
                name: '王五',
                phone: '13700137000',
                address: '深圳市南山区科技园腾讯大厦C座15楼',
                isDefault: false
            }
        ];
        
        // 支付方式数据
        const paymentMethods = [
            {
                id: 1,
                name: '支付宝',
                icon: 'fab fa-alipay',
                description: '推荐使用，安全快捷'
            },
            {
                id: 2,
                name: '微信支付',
                icon: 'fab fa-weixin',
                description: '扫码支付，方便快捷'
            },
            {
                id: 3,
                name: '银行卡',
                icon: 'fas fa-credit-card',
                description: '支持储蓄卡/信用卡'
            },
            {
                id: 4,
                name: '货到付款',
                icon: 'fas fa-money-bill-wave',
                description: '收货时现金支付'
            }
        ];
        
        // 切换主图片
        function changeImage(src) {
            document.getElementById('mainImage').src = src;
            
            // 更新缩略图激活状态
            const thumbnails = document.querySelectorAll('.thumbnail');
            thumbnails.forEach(thumb => {
                thumb.classList.remove('active');
            });
            
            event.currentTarget.classList.add('active');
        }
        
        // 选择颜色
        function selectColor(color, colorName) {
            const colorOptions = document.querySelectorAll('.color-option');
            colorOptions.forEach(option => {
                option.classList.remove('active');
            });
            
            event.currentTarget.classList.add('active');
            
            // 根据颜色更新商品标题
            const title = document.querySelector('.product-title');
            const originalText = '极光无线降噪耳机';
            title.textContent = originalText + ' (' + colorName + ')';
            
            currentColor = color;
            currentColorName = colorName;
        }
        
        // 选择版本
        function selectSize(size, sizeName, price) {
            const sizeOptions = document.querySelectorAll('.size-option');
            sizeOptions.forEach(option => {
                option.classList.remove('active');
            });
            
            event.currentTarget.classList.add('active');
            
            // 更新价格
            const currentPriceEl = document.getElementById('currentPrice');
            currentPriceEl.textContent = '¥' + price;
            
            currentSize = size;
            currentSizeName = sizeName;
            currentPrice = price;
        }
        
        // 数量增减
        function increaseQuantity() {
            quantity++;
            document.getElementById('quantity').value = quantity;
        }
        
        function decreaseQuantity() {
            if (quantity > 1) {
                quantity--;
                document.getElementById('quantity').value = quantity;
            }
        }
        
        // 切换标签页
        function switchTab(tabId) {
            // 更新标签页头部
            const tabHeaders = document.querySelectorAll('.tab-header');
            tabHeaders.forEach(header => {
                header.classList.remove('active');
            });
            
            event.currentTarget.classList.add('active');
            
            // 更新标签页内容
            const tabPanels = document.querySelectorAll('.tab-panel');
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
            });
            
            document.getElementById(tabId).classList.add('active');
        }
        
        // 购物车功能
        
        // 打开购物车
        function openCart() {
            document.getElementById('cartSidebar').classList.add('active');
            document.getElementById('cartOverlay').classList.add('active');
            updateCartDisplay();
        }
        
        // 关闭购物车
        function closeCart() {
            document.getElementById('cartSidebar').classList.remove('active');
            document.getElementById('cartOverlay').classList.remove('active');
        }
        
        // 更新购物车显示
        function updateCartDisplay() {
            const cartItemsContainer = document.getElementById('cartItems');
            const cartEmpty = document.getElementById('cartEmpty');
            const cartCount = document.getElementById('cartCount');
            const cartBadge = document.getElementById('cartBadge');
            const cartTotalPrice = document.getElementById('cartTotalPrice');
            
            // 计算购物车总数量和总价
            let totalItems = 0;
            let totalPrice = 0;
            
            cart.forEach(item => {
                totalItems += item.quantity;
                totalPrice += item.price * item.quantity;
            });
            
            // 更新购物车数量
            cartCount.textContent = totalItems;
            cartBadge.textContent = totalItems;
            
            // 更新总价
            cartTotalPrice.textContent = '¥' + totalPrice;
            
            // 如果购物车为空，显示空状态
            if (cart.length === 0) {
                cartEmpty.style.display = 'block';
                cartItemsContainer.innerHTML = '';
                return;
            }
            
            // 隐藏空状态
            cartEmpty.style.display = 'none';
            
            // 生成购物车商品列表
            cartItemsContainer.innerHTML = '';
            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-variant">${item.color} | ${item.size}</div>
                        <div class="cart-item-price">¥${item.price}</div>
                        <div class="cart-item-actions">
                            <div class="cart-item-quantity">
                                <button class="cart-qty-btn" onclick="changeCartQuantity(${index}, -1)">-</button>
                                <input type="text" class="cart-qty-input" value="${item.quantity}" readonly>
                                <button class="cart-qty-btn" onclick="changeCartQuantity(${index}, 1)">+</button>
                            </div>
                            <button class="cart-item-remove" onclick="removeFromCart(${index})">删除</button>
                        </div>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
        }
        
        // 添加到购物车
        function addToCart() {
            // 创建商品对象
            const product = {
                id: Date.now(), // 使用时间戳作为唯一ID
                name: '极光无线降噪耳机',
                color: currentColorName,
                size: currentSizeName,
                price: currentPrice,
                quantity: quantity,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
            };
            
            // 检查购物车中是否已有相同配置的商品
            const existingItemIndex = cart.findIndex(item => 
                item.color === product.color && 
                item.size === product.size && 
                item.price === product.price
            );
            
            if (existingItemIndex !== -1) {
                // 如果已有相同商品，增加数量
                cart[existingItemIndex].quantity += product.quantity;
            } else {
                // 否则添加新商品
                cart.push(product);
            }
            
            // 保存到本地存储
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            
            // 更新购物车显示
            updateCartDisplay();
            
            // 显示添加成功提示
            showNotification(`已成功添加 ${quantity} 件商品到购物车`);
            
            // 重置数量
            quantity = 1;
            document.getElementById('quantity').value = quantity;
        }
        
        // 修改购物车商品数量
        function changeCartQuantity(index, change) {
            cart[index].quantity += change;
            
            // 确保数量至少为1
            if (cart[index].quantity < 1) {
                cart[index].quantity = 1;
            }
            
            // 保存到本地存储
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            
            // 更新购物车显示
            updateCartDisplay();
        }
        
        // 从购物车移除商品
        function removeFromCart(index) {
            cart.splice(index, 1);
            
            // 保存到本地存储
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            
            // 更新购物车显示
            updateCartDisplay();
        }
        
        // 显示通知
        function showNotification(message) {
            const notification = document.getElementById('cartNotification');
            const notificationText = document.getElementById('notificationText');
            
            notificationText.textContent = message;
            notification.classList.add('active');
            
            // 3秒后自动隐藏
            setTimeout(() => {
                notification.classList.remove('active');
            }, 3000);
        }
        
        // 查看购物车（完整页面）
        function viewCart() {
            alert('跳转到完整购物车页面...');
            // 在实际应用中，这里应该跳转到购物车页面
        }
        
        // 结算功能
        
        // 打开结算页面
        function checkout() {
            if (cart.length === 0) {
                alert('购物车为空，请先添加商品');
                return;
            }
            
            // 关闭购物车侧边栏
            closeCart();
            
            // 打开结算页面
            document.getElementById('checkoutModal').classList.add('active');
            
            // 初始化结算页面
            initializeCheckout();
        }
        
        // 关闭结算页面
        function closeCheckout() {
            document.getElementById('checkoutModal').classList.remove('active');
        }
        
        // 初始化结算页面
        function initializeCheckout() {
            // 重置步骤
            goToStep(1);
            
            // 加载地址
            loadAddresses();
            
            // 加载支付方式
            loadPaymentMethods();
            
            // 加载订单摘要
            loadOrderSummary();
        }
        
        // 跳转到指定步骤
        function goToStep(step) {
            // 更新步骤指示器
            const steps = document.querySelectorAll('.checkout-step');
            steps.forEach((stepEl, index) => {
                stepEl.classList.remove('active', 'completed');
                if (index + 1 < step) {
                    stepEl.classList.add('completed');
                } else if (index + 1 === step) {
                    stepEl.classList.add('active');
                }
            });
            
            // 显示对应步骤的内容
            const sections = document.querySelectorAll('.checkout-section');
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            if (step === 1) {
                document.getElementById('addressSection').classList.add('active');
            } else if (step === 2) {
                document.getElementById('paymentSection').classList.add('active');
            } else if (step === 3) {
                document.getElementById('confirmSection').classList.add('active');
            } else if (step === 4) {
                document.getElementById('confirmationSection').classList.add('active');
            }
        }
        
        // 加载地址
        function loadAddresses() {
            const addressList = document.getElementById('addressList');
            addressList.innerHTML = '';
            
            addresses.forEach(address => {
                const addressItem = document.createElement('div');
                addressItem.className = `address-item ${address.isDefault ? 'selected' : ''}`;
                addressItem.innerHTML = `
                    <div class="address-header">
                        <div class="address-name">${address.name} ${address.phone}</div>
                        ${address.isDefault ? '<div class="default-badge">默认</div>' : ''}
                    </div>
                    <div class="address-details">${address.address}</div>
                `;
                
                addressItem.addEventListener('click', () => {
                    // 移除所有地址的选择状态
                    document.querySelectorAll('.address-item').forEach(item => {
                        item.classList.remove('selected');
                    });
                    
                    // 添加当前地址的选择状态
                    addressItem.classList.add('selected');
                    
                    // 保存选择的地址
                    checkoutData.selectedAddress = address;
                });
                
                addressList.appendChild(addressItem);
                
                // 设置默认地址
                if (address.isDefault && !checkoutData.selectedAddress) {
                    checkoutData.selectedAddress = address;
                }
            });
        }
        
        // 添加新地址
        function addNewAddress() {
            const name = prompt('请输入收货人姓名：');
            if (!name) return;
            
            const phone = prompt('请输入手机号码：');
            if (!phone) return;
            
            const address = prompt('请输入详细地址：');
            if (!address) return;
            
            const newAddress = {
                id: addresses.length + 1,
                name,
                phone,
                address,
                isDefault: false
            };
            
            addresses.push(newAddress);
            loadAddresses();
            
            // 选择新添加的地址
            checkoutData.selectedAddress = newAddress;
            
            showNotification('新地址添加成功！');
        }
        
        // 加载支付方式
        function loadPaymentMethods() {
            const paymentMethodsContainer = document.getElementById('paymentMethods');
            paymentMethodsContainer.innerHTML = '';
            
            paymentMethods.forEach(payment => {
                const paymentMethod = document.createElement('div');
                paymentMethod.className = 'payment-method';
                paymentMethod.innerHTML = `
                    <div class="payment-icon">
                        <i class="${payment.icon}"></i>
                    </div>
                    <div class="payment-name">${payment.name}</div>
                    <div class="payment-desc">${payment.description}</div>
                `;
                
                paymentMethod.addEventListener('click', () => {
                    // 移除所有支付方式的选择状态
                    document.querySelectorAll('.payment-method').forEach(item => {
                        item.classList.remove('selected');
                    });
                    
                    // 添加当前支付方式的选择状态
                    paymentMethod.classList.add('selected');
                    
                    // 保存选择的支付方式
                    checkoutData.selectedPayment = payment;
                });
                
                paymentMethodsContainer.appendChild(paymentMethod);
                
                // 设置默认支付方式
                if (payment.id === 1 && !checkoutData.selectedPayment) {
                    checkoutData.selectedPayment = payment;
                    paymentMethod.classList.add('selected');
                }
            });
        }
        
        // 加载订单摘要
        function loadOrderSummary() {
            const orderSummary = document.getElementById('orderSummary');
            
            // 计算订单总金额
            let subtotal = 0;
            let shippingFee = 0;
            let discount = 0;
            
            cart.forEach(item => {
                subtotal += item.price * item.quantity;
            });
            
            // 计算运费（满299包邮）
            if (subtotal < 299) {
                shippingFee = 15;
            }
            
            // 计算总金额
            const total = subtotal + shippingFee - discount;
            
            // 生成订单摘要HTML
            orderSummary.innerHTML = `
                <div class="order-items">
                    ${cart.map(item => `
                        <div class="order-item">
                            <div class="order-item-name">${item.name} (${item.color}, ${item.size}) × ${item.quantity}</div>
                            <div class="order-item-price">¥${item.price * item.quantity}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="order-totals">
                    <div class="order-total-row">
                        <div class="order-total-label">商品小计</div>
                        <div class="order-total-value">¥${subtotal}</div>
                    </div>
                    <div class="order-total-row">
                        <div class="order-total-label">运费</div>
                        <div class="order-total-value">${shippingFee === 0 ? '免运费' : `¥${shippingFee}`}</div>
                    </div>
                    <div class="order-total-row">
                        <div class="order-total-label">优惠</div>
                        <div class="order-total-value">-¥${discount}</div>
                    </div>
                    <div class="order-total-row final">
                        <div class="order-total-label">实付金额</div>
                        <div class="order-total-value">¥${total}</div>
                    </div>
                </div>
            `;
        }
        
        // 提交订单
        function placeOrder() {
            // 检查地址和支付方式是否已选择
            if (!checkoutData.selectedAddress) {
                alert('请选择收货地址');
                return;
            }
            
            if (!checkoutData.selectedPayment) {
                alert('请选择支付方式');
                return;
            }
            
            // 生成订单号
            checkoutData.orderNumber = 'ORDER' + Date.now();
            
            // 更新确认页面信息
            document.getElementById('orderNumber').textContent = `订单号： ${checkoutData.orderNumber}`;
            document.getElementById('selectedPayment').textContent = checkoutData.selectedPayment.name;
            document.getElementById('selectedAddress').textContent = checkoutData.selectedAddress.address;
            
            // 跳转到确认页面
            goToStep(4);
            
            // 清空购物车
            cart = [];
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            updateCartDisplay();
            
            // 显示订单成功通知
            setTimeout(() => {
                showNotification('订单提交成功！订单号：' + checkoutData.orderNumber);
            }, 500);
        }
        
        // 查看订单详情
        function viewOrderDetails() {
            alert('跳转到订单详情页面...\n订单号：' + checkoutData.orderNumber);
            closeCheckout();
        }
        
        // 立即购买
        function buyNow() {
            // 先添加到购物车
            addToCart();
            
            // 然后跳转到结算
            setTimeout(() => {
                checkout();
            }, 500);
        }
        
        // 页面加载后初始化
        document.addEventListener('DOMContentLoaded', function() {
            console.log('商品详情页面加载完成');
            
            // 初始化购物车显示
            updateCartDisplay();
            
            // 点击遮罩层关闭购物车
            document.getElementById('cartOverlay').addEventListener('click', closeCart);
            
            // 点击结算页面遮罩层关闭结算页面
            document.getElementById('checkoutModal').addEventListener('click', function(e) {
                if (e.target === this) {
                    closeCheckout();
                }
            });
        });