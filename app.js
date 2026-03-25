document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('new-post-modal');
    const guardianModal = document.getElementById('guardian-check-modal');
    const fabBtn = document.querySelector('.fab-btn');
    const closeBtn = document.getElementById('close-modal');
    const form = document.getElementById('new-post-form');
    const boardContainer = document.querySelector('.board-container');
    const filterBtns = document.querySelectorAll('.cat-btn');
    const categorySelect = document.getElementById('post-category');
    const subtagSelect = document.getElementById('post-subtag'); 
    const safeWalkBtn = document.getElementById('quick-safewalk-btn');

    // Guardian Butonları
    const btnImSafe = document.getElementById('btn-im-safe');
    const btnSOS = document.getElementById('btn-sos');

    // TOAST FABRİKASI (Guardian Desteği)
    function showToast(message, isGuardian = false) {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.classList.add('toast');
        
        if (isGuardian) {
            toast.classList.add('guardian-toast');
            toast.innerHTML = `<span class="material-icons">shield</span> ${message}`;
        } else {
            toast.innerHTML = `<span class="material-icons">check_circle</span> ${message}`;
        }
        
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }

    const subTagsData = {
        coffee: ["Sohbet & Tanışma", "Dertleşme", "Kitap & Kahve", "Kısa Mola"],
        gym: ["Ağırlık & Direnç", "Pilates & Yoga", "Kardiyo", "Grup Dersi"],
        study: ["Sessiz Çalışma", "Sesli Tekrar", "Sınav Sabahlaması", "Proje / Ödev"],
        walk: ["Kampüs İçi", "Akşam Yürüyüşü", "Eve Birlikte Dönüş", "Park / Doğa"]
    };

    categorySelect.addEventListener('change', (e) => {
        const selectedCat = e.target.value;
        const options = subTagsData[selectedCat];
        subtagSelect.innerHTML = ''; 
        options.forEach(tag => {
            const opt = document.createElement('option');
            opt.value = tag; opt.textContent = tag;
            subtagSelect.appendChild(opt);
        });
    });
    categorySelect.dispatchEvent(new Event('change'));

    fabBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });

    // FİLTRELEME (Override Zekası)
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');
            const allCards = boardContainer.querySelectorAll('.post-card');
            
            allCards.forEach(card => {
                if (card.classList.contains('safewalk-card')) {
                    card.style.display = 'block';
                    return; 
                }
                if (filterValue === 'all') card.style.display = 'block';
                else {
                    const hasTag = card.querySelector(`.tag-${filterValue}`);
                    card.style.display = hasTag ? 'block' : 'none';
                }
            });
        });
    });

    // --- WOW! VİZYON: GUARDIAN MODE ETKİLEŞİMİ ---
    boardContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('join-btn')) {
            const btn = e.target;
            const card = btn.closest('.post-card');
            const capacityTextSpan = card.querySelector('.capacity-text span:last-child');
            const fillBar = card.querySelector('.capacity-fill');

            const textParts = capacityTextSpan.innerText.split('/');
            let currentNum = parseInt(textParts[0].trim());
            let maxNum = parseInt(textParts[1].replace('Kişi', '').trim());

            if (currentNum < maxNum) {
                currentNum++;
                capacityTextSpan.innerText = `${currentNum} / ${maxNum} Kişi`;
                fillBar.style.width = `${(currentNum / maxNum) * 100}%`;
                
                btn.innerText = 'Katıldın ✓';
                btn.classList.add('joined');
                
                showToast("Harika! Etkinliğe katıldın.");
                
                // 1 Saniye sonra Guardian Modu Devreye Girer
                setTimeout(() => {
                    showToast("🛡️ Guardian Aktif: Güvenliğin için rotan takip ediliyor.", true);
                    
                    // Mülakat Demosu İçin: 4 Saniye Sonra "İyi misin?" ekranı fırlat
                    setTimeout(() => {
                        guardianModal.classList.remove('hidden');
                    }, 4000);

                }, 1000);
            }
        }
    });

    // Guardian Modal Buton İşlemleri
    btnImSafe.addEventListener('click', () => {
        guardianModal.classList.add('hidden');
        showToast("Harika! Guardian arka planda seni korumaya devam ediyor.", true);
    });

    btnSOS.addEventListener('click', () => {
        guardianModal.innerHTML = `
            <div class="modal-content" style="background: #7F1D1D; border-color: #EF4444;">
                <span class="material-icons" style="font-size: 64px; color: white; animation: shake 0.5s infinite;">campaign</span>
                <h2 style="color:white;">SOS GÖNDERİLDİ!</h2>
                <p style="color:white;">Konumun ve eşleşme detayların seçtiğin 'Trusted Sister'lara ve güvenliğe iletildi.</p>
                <button id="close-sos" class="submit-btn" style="background: white; color: #7F1D1D;">Kapat</button>
            </div>
        `;
        document.getElementById('close-sos').addEventListener('click', () => {
            guardianModal.classList.add('hidden');
            location.reload(); // Sistemi sıfırla
        });
    });

    // Hızlı Güvenli Yürüyüş Kartı Oluşturucu
    safeWalkBtn.addEventListener('click', () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        const safeCard = document.createElement('div');
        safeCard.classList.add('post-card', 'safewalk-card'); 
        safeCard.innerHTML = `
            <div class="card-header">
                <span class="safewalk-badge"><span class="material-icons">campaign</span> ŞİMDİ ÇIKIYOR</span>
                <span class="time">Bugün, ${timeString}</span>
            </div>
            <div class="post-author">
                <img src="https://api.dicebear.com/7.x/lorelei/svg?seed=Lily&backgroundColor=F0EBFA" class="author-avatar">
                <div class="author-info">
                    <span class="author-name">Sen</span>
                    <div class="trust-badge badge-blue"><span class="material-icons">fiber_new</span><span>Yeni Üye (0 Buluşma)</span></div>
                </div>
            </div>
            <h3 class="card-title">Beraber Yürüyelim (Acil)</h3>
            <p class="card-desc">Şu an kampüsteyim ve yola çıkıyorum. Metroya/durağa kadar yürüyecek bir kız kardeş arıyorum.</p>
            <div class="capacity-wrapper">
                <div class="capacity-text"><span>Katılımcı Durumu</span><span>1 / 2 Kişi</span></div>
                <div class="capacity-bar"><div class="capacity-fill" style="width: 50%; background-color: #FF8FA3;"></div></div>
            </div>
            <div class="card-footer">
                <span class="location"><span class="material-icons">place</span> Kampüs İçi <span class="safe-zone-badge">🟢 Güvenli Rota</span></span>
                <button class="join-btn">Ben Geliyorum</button>
            </div>
        `;
        boardContainer.prepend(safeCard);
        showToast("Güvenli yürüyüş çağrın panonun en üstüne sabitlendi!");
    });

    // Normal Form Gönderme
    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        const emailInput = document.getElementById('post-email').value;
        const emailError = document.getElementById('email-error');
        if (!emailInput.endsWith('.edu.tr')) {
            emailError.classList.remove('hidden'); 
            emailError.style.animation = 'none';
            setTimeout(() => emailError.style.animation = '', 10);
            return; 
        } else { emailError.classList.add('hidden'); }

        const category = categorySelect.value;
        const subtag = subtagSelect.value; 
        const capacity = parseInt(document.getElementById('post-capacity').value); 
        const title = document.getElementById('post-title').value;
        const rawTime = document.getElementById('post-time').value;
        const location = document.getElementById('post-location').value;
        const desc = document.getElementById('post-desc').value;

        const dateObj = new Date(rawTime);
        const formattedTime = dateObj.toLocaleDateString('tr-TR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

        let tagClass = "", tagText = "";
        if (category === "coffee") { tagClass = "tag-coffee"; tagText = "☕ Kahve"; }
        else if (category === "gym") { tagClass = "tag-gym"; tagText = "🏋️‍♀️ Spor"; }
        else if (category === "study") { tagClass = "tag-study"; tagText = "📚 Ders"; }
        else if (category === "walk") { tagClass = "tag-walk"; tagText = "🚶‍♀️ Yürüyüş"; }

        const newCard = document.createElement('div');
        newCard.classList.add('post-card');
        newCard.innerHTML = `
            <div class="card-header">
                <div><span class="tag ${tagClass}">${tagText}</span><span class="sub-tag">${subtag}</span></div>
                <span class="time">${formattedTime}</span>
            </div>
            <div class="post-author">
                <img src="https://api.dicebear.com/7.x/lorelei/svg?seed=Lily&backgroundColor=F0EBFA" class="author-avatar">
                <div class="author-info">
                    <span class="author-name">Sen</span>
                    <div class="trust-badge badge-blue"><span class="material-icons">fiber_new</span><span>Yeni Üye (0 Buluşma)</span></div>
                </div>
            </div>
            <h3 class="card-title">${title}</h3>
            <p class="card-desc">${desc}</p>
            <div class="capacity-wrapper">
                <div class="capacity-text"><span>Katılımcı Durumu</span><span>1 / ${capacity} Kişi</span></div>
                <div class="capacity-bar"><div class="capacity-fill" style="width: ${(1 / capacity) * 100}%;"></div></div>
            </div>
            <div class="card-footer">
                <span class="location"><span class="material-icons">place</span> ${location}</span>
                <button class="join-btn">Bana Katıl</button>
            </div>
        `;
        boardContainer.prepend(newCard); 
        form.reset();
        categorySelect.dispatchEvent(new Event('change')); 
        modal.classList.add('hidden');
        document.querySelector('[data-filter="all"]').click(); 
        showToast("İlanın başarıyla panoya asıldı!");
    });
});