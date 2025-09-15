/* ==== Personalization ==== */
const FIXED_PASSCODE = "040824"; // passcode you chose

const LETTER = [
  "You came into my life when I wasn’t even looking for you, and I think that’s the most wholesome moment that has been brought to me in the past year. You are a force to be reckoned with—you light up every room you walk into with that cheeky smile of yours. You have a rare gift for banter—a perfect mix of wittiness and light-hearted charm that captivates everyone around you.",
  "",
  "September has always been the month of alignments and hidden blessings. Every change this month brings is never random; it prepares the way for what’s meant to be. And I truly believe that you are one of those beautiful alignments.",
  "",
  "I know right now is such a confusing phase of life, where you are starting to map out each and every single puzzle piece, brainstorming non-stop to make sure everything falls perfectly into place the way you want it to be. I may not fully understand all those emotions running through you, but one thing for sure is that I will always pray for the very best for you. You already know how hard you work, and you deserve every good thing in life. And with this extra number added to your age (hehe oldie), I know you will only continue to grow wiser and make decisions that’ll lead your life toward certainties.",
  "",
  "This time last year, I remember you had way too many cake slices, even after sharing with everyone around you. That just shows the kind of person you are—the one everyone wants to be around. You’ve got this magnetic energy that makes people feel safe and happy just by being close to you. So, don’t ever stop being your silly, wonderful self, you lil weirdo. I love you forever and always.",
  "",
  "Much love,",
  "Ami"
].join("\n");

const REASONS = [
  "You let me call you froggo or puffer fish, and don't get too grumpy about it.",
  "You annoyingly drag me out of bed just to have a little bit of adventure.",
  "You steal too many chicken and shrimp from my fried rice, and somehow still look innocent about it.",
  "You let me drag you to photobooths to take cute pictures, even though you look insanely awkward, you look like you hate me.",
  "You listen to me even when I don't know how to explain myself.",
  "You love me in all my moods and messiness.",
  "You make me laugh even when I don't feel like smiling.",
  "You always share your desserts even when you know there's no guarantee that I'll share mine.",
  "You are this big kid who needs an unlimited amount of back rubs, which makes my hands tired tired.",
  "You willingly call me just to make sure I have a good night's sleep, which I am forever grateful for."
];

const PHOTOS = [
  { src: "assets/photo1.jpg", alt: "Concert photo", caption: "the concert that started it all" },
  { src: "assets/photo2.jpg", alt: "Fun chaos", caption: "having way too much fun (still recovering from the chaos tbh)" },
  { src: "assets/photo3.jpg", alt: "Kitty cat happiness", caption: "one lil kitty cat = instant happiness potion" },
  { src: "assets/photo4.jpg", alt: "Waterfront sitters", caption: "playing find the toilet at the Rockefeller Center" },
  { src: "assets/photo5.jpg", alt: "Cherry blossoms", caption: "the floppiest cherry blossoms, but loved them anyway" },
  { src: "assets/photo6.jpg", alt: "Another concert", caption: "started DC with a concert, sealed it with another" }
];

const SECRET_MESSAGE =
  "I’m not a pillow, yet I’ll bring you rest.\n" +
  "I’m not a song, yet I’m made with my best.\n" +
  "I’ll travel with me across the sea,\n" +
  "and in Manila, you’ll know what I’ll be.";

/* ==== Elements ==== */
const dots = [...document.querySelectorAll("#dots span")];
const keypad = document.querySelector(".keypad");
const gateCard = document.querySelector(".gate-card.passcode");
const letterSec = document.getElementById("letter");
const gallerySec = document.getElementById("gallery");
const reasonsSec = document.getElementById("reasons");
const outroSec = document.getElementById("outro");
const typedEl = document.getElementById("typed");
const skipBtn = document.getElementById("skipBtn");
const replayBtn = document.getElementById("replayBtn");
const audioSection = document.getElementById("audioSection");
const song = document.getElementById("song");
const secretBtn = document.getElementById("secretBtn");
const secretModal = document.getElementById("secretModal");
document.getElementById("secretText").innerText = SECRET_MESSAGE; // keep line breaks

const PASS_LEN = FIXED_PASSCODE.length;
let entered = "";

/* ==== Confetti (with waves) ==== */
const confettiCanvas = document.getElementById("confetti");
const ctx = confettiCanvas.getContext("2d");
let particles = [];
function resizeCanvas(){ confettiCanvas.width = innerWidth; confettiCanvas.height = innerHeight; }
addEventListener("resize", resizeCanvas); resizeCanvas();

function makeConfettiBurst(x = innerWidth/2, y = innerHeight/3, opts = {}){
  const {
    count = 160,
    spread = 6,
    baseVy = -10,
    gravity = 0.18,
    palette = ["#ff6ea9","#7ccaff","#ffd166","#95d5b2","#cdb4db"],
    sizeMin = 3,
    sizeMax = 9
  } = opts;
  for (let i = 0; i < count; i++){
    particles.push({
      x, y,
      vx: (Math.random()*2 - 1) * (spread*2),
      vy: Math.random()*spread + baseVy,
      size: Math.random()*(sizeMax-sizeMin) + sizeMin,
      color: palette[(Math.random()*palette.length)|0],
      life: 0,
      g: gravity
    });
  }
  if (particles.length > 4000) particles = particles.slice(-4000);
}
function updateConfetti(){
  ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
  for (const p of particles){
    p.vy += p.g; p.x += p.vx; p.y += p.vy; p.life++;
    ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.size, p.size);
  }
  particles = particles.filter(p => p.y < innerHeight + 40 && p.life < 600);
  requestAnimationFrame(updateConfetti);
}
updateConfetti();
function confettiWaves({waves = 3, interval = 500, fromX, fromY} = {}){
  for (let i = 0; i < waves; i++){
    setTimeout(()=> makeConfettiBurst(fromX ?? innerWidth/2, fromY ?? innerHeight/3, {
      count: 160 + Math.floor(Math.random()*40),
      spread: 6 + Math.random()*3,
      baseVy: -9 - Math.random()*3,
      gravity: 0.18 + Math.random()*0.03
    }), i * interval);
  }
}

/* ==== Passcode ==== */
function renderDots(){ dots.forEach((d,i)=> d.classList.toggle("filled", i < entered.length)); }
function resetInput(animated=false){
  entered = ""; renderDots();
  if (animated){ gateCard.classList.add("shake"); setTimeout(()=> gateCard.classList.remove("shake"), 350); }
}
function submitIfComplete(){
  if (entered.length !== PASS_LEN) return;
  if (entered === FIXED_PASSCODE){
    confettiWaves({waves:3, interval:500});
    // no autoplay — let him click play himself
    document.getElementById("gate").classList.add("hidden");
    letterSec.classList.remove("hidden");
    typeLetter(LETTER);
    setTimeout(()=> confettiWaves({waves:2, interval:400}), 600);
  } else {
    resetInput(true);
  }
}

keypad.addEventListener("click", (e)=>{
  const key = e.target.closest(".key")?.dataset.key;
  if (!key) return;
  if (/^\d$/.test(key)){
    if (entered.length < PASS_LEN){ entered += key; renderDots(); submitIfComplete(); }
  } else if (key === "del"){
    entered = entered.slice(0,-1); renderDots();
  } else if (key === "clear"){
    resetInput();
  }
});
document.addEventListener("keydown", (e)=>{
  if (e.key >= "0" && e.key <= "9"){
    if (entered.length < PASS_LEN){ entered += e.key; renderDots(); submitIfComplete(); }
  } else if (e.key === "Backspace"){
    entered = entered.slice(0,-1); renderDots();
  } else if (e.key === "Escape"){
    resetInput();
  } else if (e.key === "Enter"){
    submitIfComplete();
  }
});
renderDots();

/* ==== Section reveal by progress ==== */
function revealByProgress(pct){
  if (pct >= 0.35 && gallerySec.classList.contains("hidden")){
    gallerySec.classList.remove("hidden");
    setupCarousel();
  }
  if (pct >= 0.75 && reasonsSec.classList.contains("hidden")){
    reasonsSec.classList.remove("hidden");
    buildReasons();
  }
  if (pct >= 1 && outroSec.classList.contains("hidden")){
    outroSec.classList.remove("hidden");
  }
  if (pct >= 1 && audioSection.classList.contains("hidden")){
    audioSection.classList.remove("hidden");
  }  
}

/* ==== Letter typing ==== */
let typing;
function typeLetter(text){
  typedEl.textContent = "";
  clearInterval(typing);
  const total = text.length;
  let i = 0;

  typing = setInterval(()=>{
    typedEl.textContent += text[i] ?? "";
    i++;
    const pct = Math.min(i / total, 1);
    revealByProgress(pct);

    if (i >= total){
      clearInterval(typing);
      revealByProgress(1);
    }
  }, 28);
}

skipBtn.addEventListener("click", ()=>{
  clearInterval(typing);
  typedEl.textContent = LETTER;
  revealByProgress(1);
});

replayBtn.addEventListener("click", ()=>{
  gallerySec.classList.add("hidden");
  reasonsSec.classList.add("hidden");
  outroSec.classList.add("hidden");
  typeLetter(LETTER);
});

/* ==== Carousel ==== */
let idx = 0;
const imgEl = document.getElementById("carouselImg");
const capEl = document.getElementById("caption");
function show(i){
  const item = PHOTOS[(i + PHOTOS.length) % PHOTOS.length];
  imgEl.src = item.src;
  imgEl.alt = item.alt;
  capEl.textContent = item.caption;
  idx = (i + PHOTOS.length) % PHOTOS.length;
}
function setupCarousel(){
  show(0);
  document.getElementById("prevBtn").addEventListener("click", ()=> show(idx - 1));
  document.getElementById("nextBtn").addEventListener("click", ()=> show(idx + 1));
  // swipe on mobile
  let startX = null;
  imgEl.addEventListener("touchstart", e=> startX = e.touches[0].clientX);
  imgEl.addEventListener("touchend", e=>{
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40){ dx > 0 ? show(idx - 1) : show(idx + 1); }
    startX = null;
  });
}

/* ==== Reasons grid (auto-size) ==== */
function sizeReasonCards(){
  const flips = document.querySelectorAll("#reasonGrid .flip");
  flips.forEach(f => {
    const front = f.querySelector(".front");
    const back  = f.querySelector(".back");
    const maxH = Math.max(front.scrollHeight, back.scrollHeight) + 28; // padding room
    f.style.height = maxH + "px";
  });
}

function buildReasons(){
  const grid = document.getElementById("reasonGrid");
  grid.innerHTML = "";
  REASONS.forEach((r,i)=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="flip" tabindex="0" role="button" aria-label="Reason ${i+1}">
        <div class="face front"><strong>#${i+1}</strong></div>
        <div class="face back"><p>${r}</p></div>
      </div>`;
    grid.appendChild(card);
  });
  // after layout, size cards to fit content
  requestAnimationFrame(sizeReasonCards);
}
// keep sizes correct on viewport changes
addEventListener("resize", () => requestAnimationFrame(sizeReasonCards));

/* ==== Secret modal ==== */
secretBtn.addEventListener("click", ()=>{
  document.getElementById("secretModal").showModal();
  confettiWaves({waves:2, interval:400});
});
document.addEventListener("keydown", (e)=>{
  if (e.key === "Escape" && secretModal.open) secretModal.close();
});

/* ==== Preload remaining images ==== */
addEventListener("load", ()=>{
  PHOTOS.slice(1).forEach(p=>{
    const img = new Image();
    img.src = p.src;
  });
});
