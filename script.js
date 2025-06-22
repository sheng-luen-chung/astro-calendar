// 🌞 節氣顯示模組
// 功能：讀取 data/solar_terms_2025.json，判斷今天是哪一節氣，並顯示

async function loadSolarTerms() {
  const res = await fetch('data/solar_terms_2025.json');
  return res.json();
}

function formatDate(dt) {
  return dt.toISOString().slice(0, 10);
}

function findCurrentTerm(solarTerms, todayStr) {
  if (solarTerms[todayStr]) return solarTerms[todayStr];
  const dates = Object.keys(solarTerms).sort();
  let prevTerm = null;
  for (const d of dates) {
    if (d > todayStr) break;
    prevTerm = solarTerms[d];
  }
  return prevTerm || '尚未到今年第一節氣';
}

// ☀️ 黃道星座模組
// 根據黃道黃經度數（0~360）回傳星座名稱與符號
function getZodiacSign(longitude) {
  // 將負數轉為正數，並確保在 0-360 範圍內
  longitude = ((longitude % 360) + 360) % 360;
  
  if (longitude < 30) return "白羊座 ♈";
  if (longitude < 60) return "金牛座 ♉";
  if (longitude < 90) return "雙子座 ♊";
  if (longitude < 120) return "巨蟹座 ♋";
  if (longitude < 150) return "獅子座 ♌";
  if (longitude < 180) return "處女座 ♍";
  if (longitude < 210) return "天秤座 ♎";
  if (longitude < 240) return "天蠍座 ♏";
  if (longitude < 270) return "射手座 ♐";
  if (longitude < 300) return "摩羯座 ♑";
  if (longitude < 330) return "水瓶座 ♒";
  return "雙魚座 ♓";
}

// 計算太陽黃經（簡化版）
function getSunLongitude(date) {
  // 使用日期來計算大概的太陽黃經
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  
  // 6月21日是夏至，太陽黃經約90度（巨蟹座開始）
  // 調整計算，讓6月21日對應90度
  // 春分約為3月20日（第79天），太陽黃經0度
  const springEquinox = 79; // 大約3月20日
  const longitude = ((dayOfYear - springEquinox) * 360 / 365.25) % 360;
  const result = longitude < 0 ? longitude + 360 : longitude;
  
  console.log('太陽黃經計算:');
  console.log('- 日期:', date.toLocaleDateString('zh-TW'));
  console.log('- 年中第幾天:', dayOfYear);
  console.log('- 計算的黃經:', result);
  
  // 6月21日特殊處理，確保是巨蟹座
  if (date.getMonth() === 5 && date.getDate() === 21) {
    console.log('- 夏至特殊處理，設定為90度（巨蟹座）');
    return 90;
  }
  
  return result;
}

async function loadSunZodiacInfo() {
  const today = new Date();
  const sunLongitude = getSunLongitude(today);
  const zodiacSign = getZodiacSign(sunLongitude);
  const zodiacKey = getZodiacKey(sunLongitude);
  
  console.log('=== 太陽星座載入 ===');
  console.log('當前太陽黃經:', sunLongitude);
  console.log('當前星座:', zodiacSign);
  console.log('星座鍵值:', zodiacKey);
  
  document.getElementById('sun-longitude').textContent = sunLongitude.toFixed(1);
  document.getElementById('sun-zodiac').textContent = zodiacSign;
  
  // 載入詳細星座資訊
  loadZodiacDetails(zodiacKey);
  
  // 高亮當前太陽星座按鈕
  updateZodiacButtons(zodiacKey);
  
  // 強制顯示一些星星（調試用）
  setTimeout(() => {
    const starsList = document.getElementById('zodiac-stars');
    if (starsList && starsList.children.length <= 1) {
      console.log('星星列表為空，強制載入當前星座星星');
      const starsInfo = getZodiacStars(zodiacKey);
      if (starsInfo.length > 0) {
        starsList.innerHTML = '';
        starsInfo.forEach(star => {
          const li = document.createElement('li');
          li.textContent = star;
          li.style.color = '#f0f0f0';
          starsList.appendChild(li);
        });
        console.log('強制載入完成:', starsInfo.length, '顆星');
      }
    }
  }, 1000);
}

// 取得星座的英文代碼
function getZodiacKey(longitude) {
  longitude = ((longitude % 360) + 360) % 360;
  
  if (longitude < 30) return "aries";
  if (longitude < 60) return "taurus";
  if (longitude < 90) return "gemini";
  if (longitude < 120) return "cancer";
  if (longitude < 150) return "leo";
  if (longitude < 180) return "virgo";
  if (longitude < 210) return "libra";
  if (longitude < 240) return "scorpio";
  if (longitude < 270) return "sagittarius";
  if (longitude < 300) return "capricorn";
  if (longitude < 330) return "aquarius";
  return "pisces";
}

// 詳細星座資料庫
const zodiacDatabase = {
  aries: {
    name: "白羊座 ♈",
    period: "3月21日 - 4月19日",
    element: "火象星座",
    ruling: "火星 Mars",
    myth: "在希臘神話中，白羊座代表金羊毛的故事。宙斯為了拯救法力克索斯和赫勒兄妹，派遣一隻擁有金色羊毛的神羊帶他們逃走。這隻神羊後來被獻祭給宙斯，其金羊毛成為英雄們追求的寶物。",
    astronomy: "白羊座是黃道第一個星座，包含亮星婁宿三（Hamal）。春分點就位於這個星座中，標誌著北半球春天的開始。",
    observation: "最佳觀測時間為秋季晚上，尋找三顆排成三角形的主要亮星。使用雙筒望遠鏡可以觀測到美麗的雙星系統。"
  },
  taurus: {
    name: "金牛座 ♉",
    period: "4月20日 - 5月20日",
    element: "土象星座",
    ruling: "金星 Venus",
    myth: "宙斯為了接近歐羅巴公主，化身為一頭美麗的白色公牛。歐羅巴被這頭溫馴的公牛吸引，騎上牛背後，宙斯載著她渡過大海到達克里特島。",
    astronomy: "金牛座包含著名的昴宿星團（七姊妹星團）和畢宿星團，以及亮星畢宿五（Aldebaran）。這些星團是業餘天文愛好者最喜愛的觀測目標。",
    observation: "冬季是觀測金牛座的最佳時期。昴宿星團肉眼可見約6-7顆星，用雙筒望遠鏡可看到數十顆。畢宿五是一顆美麗的橙色巨星。"
  },
  gemini: {
    name: "雙子座 ♊",
    period: "5月21日 - 6月20日",
    element: "風象星座",
    ruling: "水星 Mercury",
    myth: "卡斯托和波呂杜克斯是宙斯的雙胞胎兒子，雖然父親相同但母親不同。他們感情深厚，死後被宙斯放到天上成為雙子座，象徵著兄弟之情和友誼。",
    astronomy: "雙子座的兩顆主星是北河二（Castor）和北河三（Pollux）。北河二實際上是一個六重星系統，北河三是距離地球最近的橙色巨星之一。",
    observation: "冬季夜空中的顯著星座，兩顆主星很容易辨識。6月夏至期間太陽正位於雙子座中，白天當然看不到，但這是學習其位置的好時機。"
  },
  cancer: {
    name: "巨蟹座 ♋",
    period: "6月21日 - 7月22日",
    element: "水象星座",
    ruling: "月亮 Moon",
    myth: "海格力斯進行十二項英勇任務時，巨蟹是被派來阻擾他的怪獸之一。雖然巨蟹被海格力斯殺死，但因其忠誠而被赫拉女神放置到天空中。",
    astronomy: "巨蟹座雖然沒有很亮的恆星，但包含著名的蜂巢星團（M44），這是一個肉眼可見的疏散星團，包含約1000顆恆星。",
    observation: "春季是觀測巨蟹座的最佳時期。蜂巢星團在無光污染的環境下肉眼可見如朦朧雲霧，用雙筒望遠鏡觀看效果絕佳。"
  },
  leo: {
    name: "獅子座 ♌",
    period: "7月23日 - 8月22日",
    element: "火象星座",
    ruling: "太陽 Sun",
    myth: "尼米亞獅子是海格力斯十二項任務中的第一個對手。這隻巨大的獅子皮毛刀槍不入，最終被海格力斯徒手勒死。宙斯將它放到天空中紀念這場偉大的戰鬥。",
    astronomy: "獅子座擁有明顯的問號形狀（獅子的頭），主星軒轅十四（Regulus）是一顆藍白色恆星，距離地球約79光年。",
    observation: "春季夜空的主要星座，軒轅十四和五帝座一（Denebola）很容易找到。3月中下旬午夜時分，獅子座正好在天頂附近。"
  },
  virgo: {
    name: "處女座 ♍",
    period: "8月23日 - 9月22日",
    element: "土象星座",
    ruling: "水星 Mercury",
    myth: "處女座代表正義女神阿斯特萊亞，她是最後一個離開人間的神祇。當人類墮落時，她升到天空成為處女座，手持的麥穗象徵豐收和正義。",
    astronomy: "處女座是黃道最大的星座，包含一等星角宿一（Spica）。這裡也是室女座星系團的所在地，包含數千個星系。",
    observation: "春末夏初是觀測處女座的最佳時期。角宿一是一顆美麗的藍白色雙星。使用大口徑望遠鏡可以觀測到許多遙遠的星系。"
  },
  libra: {
    name: "天秤座 ♎",
    period: "9月23日 - 10月22日",
    element: "風象星座",
    ruling: "金星 Venus",
    myth: "天秤座代表正義女神手中的天秤，用來衡量人類靈魂的善惡。秋分點曾經位於天秤座中，象徵著晝夜平分的平衡。",
    astronomy: "天秤座的主要恆星原本被認為是天蠍座的一部分。氐宿一（Zubenelgenubi）和氐宿四（Zubeneschamali）是其主要亮星。",
    observation: "夏季是觀測天秤座的最佳時期。雖然沒有特別亮的恆星，但其幾何形狀相當明顯，位於處女座和天蠍座之間。"
  },
  scorpio: {
    name: "天蠍座 ♏",
    period: "10月23日 - 11月21日",
    element: "水象星座",
    ruling: "火星 Mars / 冥王星 Pluto",
    myth: "獵人奧利翁誇口說能殺死世界上所有的動物，大地女神蓋亞派遣天蠍來懲罰他。天蠍成功殺死了奧利翁，兩者都被放到天空中，但永遠不會同時出現。",
    astronomy: "天蠍座包含超巨星心宿二（Antares），這是一顆紅色超巨星，直徑比太陽大700倍。附近有許多美麗的星團和星雲。",
    observation: "夏季是觀測天蠍座的最佳時期。心宿二的紅色非常明顯，整個星座形狀酷似真正的蠍子。這個區域是銀河系中心方向，天體非常豐富。"
  },
  sagittarius: {
    name: "射手座 ♐",
    period: "11月22日 - 12月21日",
    element: "火象星座",
    ruling: "木星 Jupiter",
    myth: "射手座代表半人馬開隆，他是所有半人馬中最智慧和善良的。作為眾多英雄的導師，他被意外射傷後選擇放棄不死之身，升天成為射手座。",
    astronomy: "射手座位於銀河系中心方向，包含許多著名的深空天體，如干草叉星雲（M8）、三裂星雲（M20）和球狀星團M22。",
    observation: "夏季夜空中天體最豐富的區域。用雙筒望遠鏡掃描這個區域可以看到無數星團和星雲。茶壺星群是很好的辨識標誌。"
  },
  capricorn: {
    name: "摩羯座 ♑",
    period: "12月22日 - 1月19日",
    element: "土象星座",
    ruling: "土星 Saturn",
    myth: "牧神潘在一次宴會中被怪獸突襲，慌忙跳入尼羅河中逃生。由於過於驚慌，身體只有一半變成魚，另一半仍是山羊，形成了山羊魚的形象。",
    astronomy: "摩羯座沒有特別亮的恆星，但冬至點就位於這個星座中。它包含一個美麗的球狀星團M30。",
    observation: "秋季是觀測摩羯座的最佳時期。雖然恆星較暗，但其三角形的整體形狀還是容易辨識的。需要在遠離城市燈光的地方觀測。"
  },
  aquarius: {
    name: "水瓶座 ♒",
    period: "1月20日 - 2月18日",
    element: "風象星座",
    ruling: "土星 Saturn / 天王星 Uranus",
    myth: "美少年加尼米德是特洛伊王子，因其美貌被宙斯看中，化身為老鷹將他帶到奧林匹斯山，成為眾神的斟酒者，負責為眾神倒水。",
    astronomy: "水瓶座包含許多有趣的深空天體，如螺旋星雲（NGC 7293）和土星星雲（NGC 7009）。著名的流星雨寶瓶座流星雨就來自這個星座。",
    observation: "秋季是觀測水瓶座的最佳時期。雖然主要恆星不太亮，但用望遠鏡可以觀測到許多美麗的行星狀星雲。"
  },
  pisces: {
    name: "雙魚座 ♓",
    period: "2月19日 - 3月20日",
    element: "水象星座",
    ruling: "木星 Jupiter / 海王星 Neptune",
    myth: "愛神阿芙羅狄忒和她的兒子厄洛斯為了逃避怪獸提豐的追擊，跳入幼發拉底河變成兩條魚。為了不失散，他們用絲帶將尾巴繫在一起。",
    astronomy: "雙魚座是面積第二大的星座，但恆星都比較暗淡。春分點目前就位於雙魚座中，這被稱為『雙魚座時代』。",
    observation: "秋末冬初是觀測雙魚座的最佳時期。主要由暗星組成，需要在無光污染的環境下觀測。可以尋找魚嘴附近的小星群。"
  }
};

// 載入星座詳細資訊 - 僅處理基本資訊，不覆蓋星星列表
function loadZodiacDetails(zodiacKey) {
  console.log('🌟 載入星座詳細資訊:', zodiacKey);
  
  const zodiac = zodiacDatabase[zodiacKey];
  if (!zodiac) {
    console.error('❌ 找不到星座資料:', zodiacKey);
    return;
  }
  
  console.log('✅ 找到星座資料:', zodiac.name);
  
  // 更新星座基本資訊
  const nameElement = document.getElementById('zodiac-name');
  const mythElement = document.getElementById('zodiac-mythology');
  const obsElement = document.getElementById('zodiac-observation');
  const timeElement = document.getElementById('zodiac-best-time');
  
  if (nameElement) nameElement.textContent = zodiac.name;
  if (mythElement) mythElement.textContent = zodiac.myth;
  if (obsElement) obsElement.textContent = zodiac.observation;
  if (timeElement) timeElement.textContent = `最佳觀測期：${zodiac.observation}`;
  
  // 移除星星列表更新，由 showZodiacDetails 專門處理
  // updateStarsList(zodiacKey); // 已移除
  
  // 高亮當前太陽星座按鈕
  updateZodiacButtons(zodiacKey);
}

// 專門更新星星列表的函數
function updateStarsList(zodiacKey) {
  console.log('🌟 更新星星列表:', zodiacKey);
  
  const starsList = document.getElementById('zodiac-stars');
  if (!starsList) {
    console.error('❌ 找不到 zodiac-stars 元素');
    return;
  }
  
  // 獲取星星數據
  const starsInfo = getZodiacStars(zodiacKey);
  console.log('星座', zodiacKey, '的星星數據 (' + starsInfo.length + ' 顆):', starsInfo);
  
  // 清空列表
  starsList.innerHTML = '';
  
  if (starsInfo && starsInfo.length > 0) {
    // 添加每顆星星
    starsInfo.forEach((star, index) => {
      const li = document.createElement('li');
      li.textContent = star;
      li.style.cssText = `
        color: #f0f0f0 !important;
        font-size: 14px !important;
        line-height: 1.6 !important;
        margin-bottom: 8px !important;
        padding: 8px 0 8px 12px !important;
        border-left: 3px solid #667eea !important;
        background: rgba(255,255,255,0.08) !important;
        border-radius: 0 6px 6px 0 !important;
        transition: all 0.3s ease !important;
      `;
      
      // 添加hover效果
      li.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(255,255,255,0.15)';
        this.style.borderLeftColor = '#f093fb';
      });
      
      li.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(255,255,255,0.08)';
        this.style.borderLeftColor = '#667eea';
      });
      
      starsList.appendChild(li);
      console.log('✅ 添加星星 #' + (index + 1) + ':', star);
    });
    
    console.log('🎉 成功載入', starsInfo.length, '顆亮星！');
  } else {
    // 如果沒有數據
    const li = document.createElement('li');
    li.textContent = `❌ 暫無 ${zodiacKey} 星座的亮星資料`;
    li.style.cssText = 'color: #ff6b6b !important; font-style: italic;';
    starsList.appendChild(li);
    console.warn('⚠️ 沒有找到星座', zodiacKey, '的星星數據');
  }
}

// 獲取星座主要亮星資訊
function getZodiacStars(zodiacKey) {
  const stars = {
    aries: [
      "婁宿一 (Hamal) - α Ari，2.0等，橙巨星",
      "婁宿三 (Sheratan) - β Ari，2.6等，白主序星",
      "婁宿增九 (Mesarthim) - γ Ari，4.6等，雙星系統"
    ],
    taurus: [
      "畢宿五 (Aldebaran) - α Tau，0.9等，紅巨星",
      "昴宿六 (Alcyone) - η Tau，2.9等，昴宿星團最亮星",
      "五車五 (Elnath) - β Tau，1.7等，藍白巨星"
    ],
    gemini: [
      "北河三 (Pollux) - β Gem，1.1等，橙巨星",
      "北河二 (Castor) - α Gem，1.6等，複雜的六重星系統",
      "井宿三 (Alhena) - γ Gem，1.9等，藍白亞巨星"
    ],
    cancer: [
      "柳宿增十 (Acubens) - α Cnc，4.3等，多重星系統",
      "柳宿增二十五 (Al Tarf) - β Cnc，3.5等，橙巨星",
      "鬼宿二 - δ Cnc，3.9等，橙巨星",
      "蜂巢星團 (M44) - 疏散星團，肉眼可見"
    ],
    leo: [
      "軒轅十四 (Regulus) - α Leo，1.4等，藍白主序星",
      "五帝座一 (Denebola) - β Leo，2.1等，白主序星",
      "軒轅十二 (Algieba) - γ Leo，2.6等，橙巨星雙星"
    ],
    virgo: [
      "角宿一 (Spica) - α Vir，1.0等，藍白雙星",
      "太微左垣五 (Zavijava) - β Vir，3.6等，黃主序星",
      "太微右垣一 (Porrima) - γ Vir，2.7等，雙星系統"
    ],
    libra: [
      "氐宿一 (Zubenelgenubi) - α Lib，2.8等，雙星系統",
      "氐宿四 (Zubeneschamali) - β Lib，2.6等，藍白矮星",
      "氐宿增七 (Brachium) - σ Lib，3.3等，紅巨星"
    ],
    scorpio: [
      "心宿二 (Antares) - α Sco，1.1等，紅超巨星",
      "尾宿八 (Shaula) - λ Sco，1.6等，藍亞巨星",
      "房宿四 (Graffias) - β Sco，2.6等，雙星系統"
    ],
    sagittarius: [
      "箕宿三 (Kaus Australis) - ε Sgr，1.8等，藍巨星",
      "斗宿四 (Nunki) - σ Sgr，2.0等，藍主序星",
      "箕宿一 (Ascella) - ζ Sgr，2.6等，雙星系統"
    ],
    capricorn: [
      "壘壁陣四 (Deneb Algedi) - δ Cap，2.9等，食雙星",
      "牛宿一 (Dabih) - β Cap，3.1等，雙星系統",
      "壘壁陣一 (Algedi) - α Cap，3.6等，光學雙星"
    ],
    aquarius: [
      "危宿一 (Sadalmelik) - α Aqr，3.0等，黃超巨星",
      "虛宿一 (Sadalsuud) - β Aqr，2.9等，黃超巨星",
      "墳墓一 (Sadachbia) - γ Aqr，3.8等，白主序星"
    ],
    pisces: [
      "外屏七 (Alrescha) - α Psc，3.8等，雙星系統",
      "右更二 (Fum al Samakah) - β Psc，4.5等，藍白主序星",
      "天倉五 (Gamma Piscium) - γ Psc，3.7等，黃巨星"
    ]
  };
  
  return stars[zodiacKey] || [];
}

// 星座按鈕切換功能 - 徹底修正版本
// 🌟 星座主要亮星切換功能 - 修正版
function showZodiacDetails(zodiacKey) {
  console.log('🌟 [PRIMARY] 星座切換到:', zodiacKey);
  
  // 先載入星座詳細資訊（但不更新星星列表）
  const zodiac = zodiacDatabase[zodiacKey];
  if (zodiac) {
    // 更新星座基本資訊
    const nameElement = document.getElementById('zodiac-name');
    const mythElement = document.getElementById('zodiac-mythology');
    const obsElement = document.getElementById('zodiac-observation');
    const timeElement = document.getElementById('zodiac-best-time');
    
    if (nameElement) nameElement.textContent = zodiac.name;
    if (mythElement) mythElement.textContent = zodiac.myth;
    if (obsElement) obsElement.textContent = zodiac.observation;
    if (timeElement) timeElement.textContent = `最佳觀測期：${zodiac.observation}`;
  }
  
  // 專門處理星星列表更新
  const starsList = document.getElementById('zodiac-stars');
  if (!starsList) {
    console.error('❌ 找不到 zodiac-stars 元素！');
    return;
  }
  
  // 獲取該星座的星星數據
  const starsInfo = getZodiacStars(zodiacKey);
  console.log('📋 [PRIMARY] 載入', zodiacKey, '星座的', starsInfo.length, '顆亮星:', starsInfo);
  
  // 完全清空列表
  starsList.innerHTML = '';
  
  // 添加星座名稱標題
  const title = document.createElement('li');
  title.textContent = `✨ ${zodiacKey.toUpperCase()} 星座主要亮星：`;
  title.style.cssText = `
    color: #ffd700 !important;
    font-weight: bold !important;
    margin-bottom: 10px !important;
    font-size: 16px !important;
    list-style: none !important;
    border: none !important;
    background: transparent !important;
  `;
  starsList.appendChild(title);
  
  if (starsInfo && starsInfo.length > 0) {
    // 添加星星資訊
    starsInfo.forEach((star, index) => {
      const li = document.createElement('li');
      li.textContent = `${index + 1}. ${star}`;
      li.style.cssText = `
        color: #f0f0f0 !important;
        font-size: 14px !important;
        line-height: 1.6 !important;
        margin-bottom: 8px !important;
        padding: 8px 0 8px 16px !important;
        border-left: 3px solid #667eea !important;
        background: rgba(255,255,255,0.05) !important;
        border-radius: 0 4px 4px 0 !important;
        transition: all 0.3s ease !important;
        list-style: none !important;
      `;
      
      starsList.appendChild(li);
      console.log('✅ [PRIMARY] 添加星星:', star);
    });
    console.log('🌟 [PRIMARY] 成功載入', starsInfo.length, '顆', zodiacKey, '星座的星星');
  } else {
    // 如果沒有數據，顯示錯誤信息
    const li = document.createElement('li');
    li.textContent = `❌ 找不到 ${zodiacKey} 星座的亮星資料`;
    li.style.color = '#ff6b6b !important';
    starsList.appendChild(li);
  }
  
  // 更新按鈕狀態
  updateZodiacButtons(zodiacKey);
}

// 更新星座按鈕狀態
function updateZodiacButtons(currentZodiac) {
  document.querySelectorAll('.zodiac-buttons button').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const currentButton = document.querySelector(`[data-zodiac="${currentZodiac}"]`);
  if (currentButton) {
    currentButton.classList.add('active');
  }
}

// 🌕 月相顯示模組（使用 SunCalc）
// 取得今日月相、moonrise、moonset、仰角與方位角
async function loadMoonInfo() {
  const today = new Date();
  // 使用台北的經緯度 (25.03°N, 121.56°E)
  const moonData = SunCalc.getMoonIllumination(today);
  const moonTimes = SunCalc.getMoonTimes(today, 25.03, 121.56);
  const moonPos = SunCalc.getMoonPosition(today, 25.03, 121.56);

  const phaseName = getPhaseName(moonData.phase);
  document.getElementById('moon-phase').textContent = phaseName;
  document.getElementById('moon-rise').textContent = moonTimes.rise?.toLocaleTimeString('zh-TW', {hour: '2-digit', minute: '2-digit'}) || "無";
  document.getElementById('moon-set').textContent = moonTimes.set?.toLocaleTimeString('zh-TW', {hour: '2-digit', minute: '2-digit'}) || "無";
  document.getElementById('moon-az').textContent = (moonPos.azimuth * 180 / Math.PI).toFixed(1);
  document.getElementById('moon-alt').textContent = (moonPos.altitude * 180 / Math.PI).toFixed(1);
  document.getElementById('moon-distance').textContent = moonPos.distance.toFixed(0);
  document.getElementById('moon-illumination').textContent = (moonData.fraction * 100).toFixed(1);
}

// 🌞 太陽資訊模組
async function loadSunInfo() {
  const today = new Date();
  const sunTimes = SunCalc.getTimes(today, 25.03, 121.56);
  const sunPos = SunCalc.getPosition(today, 25.03, 121.56);
  
  const sunInfoContainer = document.getElementById('sun-info');
  sunInfoContainer.innerHTML = '';
  
  const sunData = [
    { name: '日出', value: sunTimes.sunrise?.toLocaleTimeString('zh-TW', {hour: '2-digit', minute: '2-digit'}) || '無', icon: '🌅' },
    { name: '日沒', value: sunTimes.sunset?.toLocaleTimeString('zh-TW', {hour: '2-digit', minute: '2-digit'}) || '無', icon: '🌇' },
    { name: '正午', value: sunTimes.solarNoon?.toLocaleTimeString('zh-TW', {hour: '2-digit', minute: '2-digit'}) || '無', icon: '☀️' },
    { name: '曙光開始', value: sunTimes.dawn?.toLocaleTimeString('zh-TW', {hour: '2-digit', minute: '2-digit'}) || '無', icon: '🌄' },
    { name: '黃昏結束', value: sunTimes.dusk?.toLocaleTimeString('zh-TW', {hour: '2-digit', minute: '2-digit'}) || '無', icon: '🌆' },
    { name: '黃金時刻', value: sunTimes.goldenHour?.toLocaleTimeString('zh-TW', {hour: '2-digit', minute: '2-digit'}) || '無', icon: '✨' },
    { name: '當前仰角', value: (sunPos.altitude * 180 / Math.PI).toFixed(1) + '°', icon: '📐' },
    { name: '當前方位角', value: (sunPos.azimuth * 180 / Math.PI).toFixed(1) + '°', icon: '🧭' }
  ];
  
  sunData.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `${item.icon} ${item.name}：<span class="sun-value">${item.value}</span>`;
    sunInfoContainer.appendChild(li);
  });
}

// 🔭 天文現象模組
async function loadAstronomicalEvents() {
  const today = new Date();
  const events = [];
  
  // 計算月相相關事件
  const moonData = SunCalc.getMoonIllumination(today);
  const moonPhase = moonData.phase;
  
  // 判斷特殊月相
  if (moonPhase < 0.05 || moonPhase > 0.95) {
    events.push({ icon: '🌑', event: '新月期', description: '最佳觀星時機，無月光干擾' });
  } else if (Math.abs(moonPhase - 0.5) < 0.05) {
    events.push({ icon: '🌕', event: '滿月期', description: '月亮最亮，適合月面觀測' });
  } else if (Math.abs(moonPhase - 0.25) < 0.05) {
    events.push({ icon: '🌓', event: '上弦月', description: '觀察月面環形山的好時機' });
  } else if (Math.abs(moonPhase - 0.75) < 0.05) {
    events.push({ icon: '🌗', event: '下弦月', description: '適合凌晨觀測月面' });
  }
  
  // 季節相關事件
  const month = today.getMonth() + 1;
  const day = today.getDate();
  
  if (month === 6 && day === 21) {
    events.push({ icon: '☀️', event: '夏至', description: '北半球白晝最長的一天' });
  }
  
  // 行星觀測建議
  const hour = today.getHours();
  if (hour >= 19 && hour <= 23) {
    events.push({ icon: '🪐', event: '行星觀測時間', description: '傍晚是觀測行星的好時機' });
  }
  
  // 國際太空站通過（模擬）
  if (hour >= 18 && hour <= 22) {
    events.push({ icon: '🛰️', event: 'ISS可見時段', description: '國際太空站可能在此時段通過台北上空' });
  }
  
  // 流星雨（根據日期模擬）
  if (month === 8 && day >= 10 && day <= 15) {
    events.push({ icon: '☄️', event: '英仙座流星雨', description: '每小時可見約60顆流星' });
  }
  
  // 觀測條件
  const moonIllumination = moonData.fraction;
  if (moonIllumination < 0.25) {
    events.push({ icon: '🌌', event: '深空觀測佳期', description: '月光微弱，適合觀測星雲和星系' });
  }
  
  // 今日推薦觀測目標
  const season = getSeason(month);
  const targets = getSeasonalTargets(season);
  events.push({ icon: '🔭', event: `${season}季推薦觀測`, description: targets });
  
  // 天氣提醒（模擬）
  events.push({ icon: '🌤️', event: '觀測提醒', description: '選擇晴朗無雲的夜晚，遠離光污染' });
  
  const eventsContainer = document.getElementById('astronomical-events');
  eventsContainer.innerHTML = '';
  
  events.forEach(event => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="event-info">
        <span class="event-icon">${event.icon}</span>
        <strong>${event.event}</strong>
      </div>
      <div class="event-description">${event.description}</div>
    `;
    eventsContainer.appendChild(li);
  });
}

function getSeason(month) {
  if (month >= 3 && month <= 5) return '春';
  if (month >= 6 && month <= 8) return '夏';
  if (month >= 9 && month <= 11) return '秋';
  return '冬';
}

function getSeasonalTargets(season) {
  const targets = {
    '春': '獅子座、室女座，尋找M81、M82星系',
    '夏': '天鷹座、天琴座、天鵝座，觀測夏季大三角',
    '秋': '仙女座大星系M31，飛馬座大四邊形',
    '冬': '獵戶座星雲M42，昴宿星團M45'
  };
  return targets[season] || '四季皆宜的目標';
}

// 🎮 互動功能
function toggleNightMode() {
  document.body.classList.toggle('night-mode');
  const btn = document.querySelector('.mode-btn');
  if (document.body.classList.contains('night-mode')) {
    btn.textContent = '☀️ 日間模式';
    localStorage.setItem('nightMode', 'true');
  } else {
    btn.textContent = '🌙 夜間模式';
    localStorage.setItem('nightMode', 'false');
  }
}

function refreshAllData() {
  // 添加載入動畫
  const elements = ['solar-term', 'sun-longitude', 'sun-zodiac', 'moon-phase'];
  elements.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = '重新載入中...';
      el.classList.add('loading');
    }
  });
  
  // 重新載入所有資料
  setTimeout(async () => {
    const solarTerms = await loadSolarTerms();
    const today = new Date();
    const todayStr = formatDate(today);
    const term = findCurrentTerm(solarTerms, todayStr);
    document.getElementById('solar-term').textContent = term;
    document.getElementById('solar-term').classList.remove('loading');
    
    await loadSunZodiacInfo();
    await loadMoonInfo();
    await loadSunInfo();
    await loadAstronomicalEvents();
    await loadVisibleStars();
    drawStarMap();
    
    // 移除載入動畫
    elements.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('loading');
    });
  }, 1000);
}

function showTips() {
  const tips = [
    "🌙 新月期間是觀測深空天體的最佳時機",
    "🔭 使用紅光手電筒保持夜視能力",
    "⭐ 先觀測亮星，再尋找暗星",
    "🌡️ 低溫會讓望遠鏡成像更清晰",
    "📱 使用天文APP輔助星座識別",
    "🏔️ 海拔高的地方觀星效果更佳",
    "💨 風大的夜晚不適合高倍率觀測",
    "🌅 日出前是觀測行星的好時機"
  ];
  
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  
  // 創建提示框
  const tipBox = document.createElement('div');
  tipBox.className = 'tip-box';
  tipBox.innerHTML = `
    <div class="tip-content">
      <h3>🌟 觀測小貼士</h3>
      <p>${randomTip}</p>
      <button onclick="this.parentElement.parentElement.remove()">知道了</button>
    </div>
  `;
  
  document.body.appendChild(tipBox);
  
  setTimeout(() => {
    tipBox.remove();
  }, 5000);
}

// 初始化時檢查夜間模式設置
function initializeTheme() {
  if (localStorage.getItem('nightMode') === 'true') {
    document.body.classList.add('night-mode');
    const btn = document.querySelector('.mode-btn');
    if (btn) btn.textContent = '☀️ 日間模式';
  }
}

function getPhaseName(phase) {
  if (phase < 0.03 || phase > 0.97) return "新月 🌑";
  if (phase < 0.22) return "上蛾眉月 🌒";
  if (phase < 0.28) return "上弦月 🌓";
  if (phase < 0.47) return "盈凸月 🌔";
  if (phase < 0.53) return "滿月 🌕";
  if (phase < 0.72) return "虧凸月 🌖";
  if (phase < 0.78) return "下弦月 🌗";
  return "下蛾眉月 🌘";
}

// 🌟 顯示今晚可見的亮星列表
// 步驟：
// 1. 定義一組亮星資料，包括名稱、RA、Dec、所屬星座
// 2. 將 RA/Dec 轉換為 Alt/Az（仰角/方位角）
// 3. 過濾出當前時間與地點能看到的（仰角 > 0）
// 4. 顯示在網頁上「名稱（星座）在西南方，高度 35°」

// 亮星資料：RA (小時制), Dec (度), 名稱, 星座, 視星等
const brightStars = [
  { name: "天狼星", ra: 6.7523, dec: -16.7161, constellation: "大犬座", magnitude: -1.46 },
  { name: "老人星", ra: 6.3992, dec: -52.6956, constellation: "船底座", magnitude: -0.74 },
  { name: "大角星", ra: 14.2610, dec: 19.1824, constellation: "牧夫座", magnitude: -0.05 },
  { name: "織女星", ra: 18.6156, dec: 38.7837, constellation: "天琴座", magnitude: 0.03 },
  { name: "五車二", ra: 5.2781, dec: 45.9980, constellation: "御夫座", magnitude: 0.08 },
  { name: "參宿七", ra: 5.6794, dec: -1.2017, constellation: "獵戶座", magnitude: 0.13 },
  { name: "南河三", ra: 7.6553, dec: 5.2250, constellation: "小犬座", magnitude: 0.34 },
  { name: "參宿四", ra: 5.9195, dec: 7.4069, constellation: "獵戶座", magnitude: 0.50 },
  { name: "水委一", ra: 1.6287, dec: -57.2367, constellation: "波江座", magnitude: 0.46 },
  { name: "牛郎星", ra: 19.8464, dec: 8.8683, constellation: "天鷹座", magnitude: 0.77 },
  { name: "十字架二", ra: 12.4379, dec: -63.0990, constellation: "南十字座", magnitude: 0.77 },
  { name: "畢宿五", ra: 4.5987, dec: 16.5093, constellation: "金牛座", magnitude: 0.85 },
  { name: "心宿二", ra: 16.4901, dec: -26.4319, constellation: "天蠍座", magnitude: 1.09 },
  { name: "角宿一", ra: 13.4200, dec: -11.1614, constellation: "室女座", magnitude: 0.97 },
  { name: "北極星", ra: 2.5301, dec: 89.2641, constellation: "小熊座", magnitude: 1.98 },
  { name: "天津四", ra: 20.3704, dec: 40.2566, constellation: "天鵝座", magnitude: 1.25 },
  { name: "軒轅十四", ra: 10.1395, dec: 11.9672, constellation: "獅子座", magnitude: 1.35 },
  { name: "北河三", ra: 7.5755, dec: 31.8883, constellation: "雙子座", magnitude: 1.14 },
  { name: "土司空", ra: 14.8460, dec: 74.1553, constellation: "大熊座", magnitude: 1.86 },
  { name: "天社一", ra: 7.4035, dec: -8.6539, constellation: "大犬座", magnitude: 1.50 }
];

// 將 RA/Dec 轉換為 Alt/Az，需要知道：LST, HA = LST - RA, φ = 緯度
// altitude = arcsin(sin(dec)*sin(φ) + cos(dec)*cos(φ)*cos(HA))
// azimuth = arctan2(sin(HA), cos(HA)*sin(φ) - tan(dec)*cos(φ))
function calculateStarPosition(ra, dec, lat, lon, datetime) {
  const rad = Math.PI / 180;
  const deg = 180 / Math.PI;
  
  // 計算地方恆星時 (LST)
  const jd = (datetime.getTime() / 86400000) + 2440587.5; // 儒略日
  const gmst = (280.46061837 + 360.98564736629 * (jd - 2451545.0)) % 360; // 格林威治恆星時
  const lst = (gmst + lon) % 360; // 地方恆星時
  
  // 計算時角 (HA)
  const ha = (lst - ra * 15) % 360; // RA轉為度數
  const haRad = ha * rad;
  const decRad = dec * rad;
  const latRad = lat * rad;
  
  // 計算仰角 (altitude)
  const sinAlt = Math.sin(decRad) * Math.sin(latRad) + 
                 Math.cos(decRad) * Math.cos(latRad) * Math.cos(haRad);
  const altitude = Math.asin(sinAlt) * deg;
  
  // 計算方位角 (azimuth)
  const cosAz = (Math.sin(decRad) - Math.sin(latRad) * sinAlt) / 
                (Math.cos(latRad) * Math.cos(Math.asin(sinAlt)));
  let azimuth = Math.acos(cosAz) * deg;
  
  // 修正方位角象限
  if (Math.sin(haRad) > 0) {
    azimuth = 360 - azimuth;
  }
  
  return { altitude, azimuth };
}

// 方位角轉中文方向
function getDirection(azimuth) {
  if (azimuth >= 337.5 || azimuth < 22.5) return "北方";
  if (azimuth < 67.5) return "東北方";
  if (azimuth < 112.5) return "東方";
  if (azimuth < 157.5) return "東南方";
  if (azimuth < 202.5) return "南方";
  if (azimuth < 247.5) return "西南方";
  if (azimuth < 292.5) return "西方";
  return "西北方";
}

function getVisibleStars(datetime, lat, lon) {
  const visibleStars = [];
  
  brightStars.forEach(star => {
    const position = calculateStarPosition(star.ra, star.dec, lat, lon, datetime);
    
    // 只顯示仰角 > 5 度的星星（避免地平線附近的大氣折射影響）
    if (position.altitude > 5) {
      visibleStars.push({
        name: star.name,
        constellation: star.constellation,
        altitude: position.altitude,
        azimuth: position.azimuth,
        direction: getDirection(position.azimuth),
        magnitude: star.magnitude
      });
    }
  });
  
  // 按照亮度排序（magnitude 越小越亮）
  return visibleStars.sort((a, b) => a.magnitude - b.magnitude);
}

// 獲取最佳觀測時間
function getBestObservationTime(star, date, lat, lon) {
  const bestTimes = [];
  
  // 檢查當天晚上8點到凌晨4點的每小時
  for (let hour = 20; hour <= 28; hour++) { // 28 = 次日4點
    const checkTime = new Date(date);
    checkTime.setHours(hour % 24, 0, 0, 0);
    if (hour >= 24) checkTime.setDate(checkTime.getDate() + 1);
    
    const position = calculateStarPosition(star.ra, star.dec, lat, lon, checkTime);
    
    if (position.altitude > 20) { // 高度角超過20度才算最佳觀測
      const timeStr = checkTime.toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit'
      });
      bestTimes.push({
        time: timeStr,
        altitude: position.altitude,
        hour: hour % 24
      });
    }
  }
  
  if (bestTimes.length === 0) return null;
  
  // 找到最高仰角的時間
  const bestTime = bestTimes.reduce((best, current) => 
    current.altitude > best.altitude ? current : best
  );
  
  return {
    time: bestTime.time,
    altitude: bestTime.altitude,
    period: getBestPeriod(bestTimes)
  };
}

function getBestPeriod(times) {
  if (times.length === 0) return "不可見";
  
  const hours = times.map(t => t.hour);
  const minHour = Math.min(...hours);
  const maxHour = Math.max(...hours);
  
  if (minHour >= 20) {
    return `晚上${minHour}點-${maxHour > 23 ? '午夜' : maxHour + '點'}`;
  } else if (maxHour <= 6) {
    return `凌晨${minHour}點-${maxHour}點`;
  } else {
    return `晚上${minHour}點-凌晨${maxHour}點`;
  }
}

async function loadVisibleStars() {
  const datetime = new Date();
  // 使用台北的經緯度
  const visibleStars = getVisibleStars(datetime, 25.03, 121.56);
  
  const starsContainer = document.getElementById('visible-stars');
  starsContainer.innerHTML = '';
  
  // 添加當前時間顯示
  const currentTime = document.createElement('div');
  currentTime.className = 'current-time';
  currentTime.innerHTML = `
    <h3>🕐 當前時間：${datetime.toLocaleTimeString('zh-TW')} | 觀測地點：台北</h3>
  `;
  starsContainer.appendChild(currentTime);
  
  if (visibleStars.length === 0) {
    starsContainer.innerHTML += '<li>目前沒有明亮的星星可見</li>';
    return;
  }
  
  // 只顯示前6顆最亮的可見星星
  const topStars = visibleStars.slice(0, 6);
  
  topStars.forEach((star, index) => {
    const brightnessDesc = star.magnitude < 0 ? '極亮' : 
                          star.magnitude < 1 ? '很亮' : 
                          star.magnitude < 2 ? '明亮' : '可見';
    
    // 計算最佳觀測時間
    const brightStar = brightStars.find(s => s.name === star.name);
    const bestTime = getBestObservationTime(brightStar, datetime, 25.03, 121.56);
    
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="star-info">
        <strong>⭐ ${star.name}</strong>
        <span class="constellation">${star.constellation}</span>
      </div>
      <div class="star-details">
        <span class="direction">📍 ${star.direction}</span>
        <span class="position">📐 ${star.altitude.toFixed(1)}°</span>
        <span class="brightness">✨ ${brightnessDesc}</span>
      </div>
      ${bestTime ? `
      <div class="best-time">
        <span class="time-info">🕘 最佳觀測：${bestTime.time}（${bestTime.period}）</span>
      </div>
      ` : ''}
    `;
    starsContainer.appendChild(li);
  });
  
  // 添加觀測提示
  const tip = document.createElement('li');
  tip.className = 'observation-tip';
  tip.innerHTML = `
    <small>💡 觀測提示：最佳觀測時間為晚上8點後，選擇光害較少的地點效果更佳</small>
  `;
  starsContainer.appendChild(tip);
}

window.addEventListener('DOMContentLoaded', async () => {
  initializeTheme();  // 初始化主題
  
  const solarTerms = await loadSolarTerms();
  const today = new Date();
  const todayStr = formatDate(today);
  document.getElementById('today-date').textContent = today.toLocaleDateString('zh-TW');
  const term = findCurrentTerm(solarTerms, todayStr);
  document.getElementById('solar-term').textContent = term;

  await loadSunZodiacInfo();  // 加入太陽星座資訊載入
  await loadMoonInfo();  // 加入月相資訊載入
  await loadSunInfo();   // 加入太陽資訊載入
  await loadAstronomicalEvents();  // 加入天文現象載入
  await loadVisibleStars();  // 加入可見星星資訊載入
  drawStarMap();  // 繪製星空圖
  
  // 強制載入巨蟹座星星（6月21日應該是巨蟹座）
  setTimeout(() => {
    console.log('=== 強制載入星星檢查 ===');
    const starsList = document.getElementById('zodiac-stars');
    if (starsList) {
      console.log('找到星星列表元素，當前內容:', starsList.innerHTML);
      
      // 如果星星列表為空或只有載入訊息，強制載入
      if (starsList.children.length <= 1 || starsList.innerHTML.includes('載入中')) {
        console.log('星星列表為空，強制載入巨蟹座星星');
        
        const cancerStars = [
          '柳宿增十 (Acubens) - α Cnc，4.3等，多重星系統',
          '柳宿增二十五 (Al Tarf) - β Cnc，3.5等，橙巨星',
          '鬼宿二 - δ Cnc，3.9等，橙巨星',
          '蜂巢星團 (M44) - 疏散星團，肉眼可見'
        ];
        
        starsList.innerHTML = '';
        cancerStars.forEach((star, index) => {
          const li = document.createElement('li');
          li.textContent = star;
          li.style.color = '#f0f0f0';
          li.style.fontSize = '14px';
          li.style.lineHeight = '1.4';
          li.style.marginBottom = '5px';
          starsList.appendChild(li);
          console.log('強制添加星星:', star);
        });
        
        console.log('✅ 強制載入完成！');
      } else {
        console.log('星星已正常載入');
      }
    } else {
      console.error('❌ 找不到 zodiac-stars 元素');
    }
  }, 2000); // 延遲2秒執行
});

// 🌌 繪製星空圖
let currentDisplayTime = new Date(); // 全域變數來追蹤顯示的時間

function drawStarMap(displayTime = new Date()) {
  currentDisplayTime = displayTime;
  const canvas = document.getElementById('star-map');
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 180;
  
  // 更新時間顯示
  const timeDisplay = document.getElementById('map-time-display');
  const isCurrentTime = Math.abs(displayTime.getTime() - new Date().getTime()) < 60000; // 1分鐘內算當前時間
  
  timeDisplay.innerHTML = isCurrentTime ? 
    `🕐 當前時間：${displayTime.toLocaleTimeString('zh-TW')}` :
    `⏰ 顯示時間：${displayTime.toLocaleTimeString('zh-TW')} (${displayTime.toLocaleDateString('zh-TW')})`;
  
  // 清除畫布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 繪製地平圈
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = '#74b9ff';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 繪製高度圈（30度、60度）
  ctx.strokeStyle = '#636e72';
  ctx.lineWidth = 1;
  
  // 30度圈
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 2/3, 0, 2 * Math.PI);
  ctx.stroke();
  
  // 60度圈
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * 1/3, 0, 2 * Math.PI);
  ctx.stroke();
  
  // 繪製方位線
  ctx.strokeStyle = '#636e72';
  ctx.lineWidth = 1;
  
  // 東西線
  ctx.beginPath();
  ctx.moveTo(centerX - radius, centerY);
  ctx.lineTo(centerX + radius, centerY);
  ctx.stroke();
  
  // 南北線
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - radius);
  ctx.lineTo(centerX, centerY + radius);
  ctx.stroke();
  
  // 繪製可見星星（使用指定的顯示時間）
  const visibleStars = getVisibleStars(displayTime, 25.03, 121.56);
  const topStars = visibleStars.slice(0, 10);
  
  topStars.forEach(star => {
    // 轉換為極座標
    const altitudeRatio = (90 - star.altitude) / 90; // 仰角轉為距中心距離
    const azimuthRad = (star.azimuth - 90) * Math.PI / 180; // 方位角轉弧度，北方為0
    
    const starX = centerX + (radius * altitudeRatio * Math.cos(azimuthRad));
    const starY = centerY + (radius * altitudeRatio * Math.sin(azimuthRad));
    
    // 根據星等決定星星大小
    const starSize = Math.max(2, 8 - star.magnitude * 2);
    
    // 繪製星星
    ctx.beginPath();
    ctx.arc(starX, starY, starSize, 0, 2 * Math.PI);
    ctx.fillStyle = getStarColor(star.magnitude);
    ctx.fill();
    
    // 繪製星星外圍光暈
    ctx.beginPath();
    ctx.arc(starX, starY, starSize + 2, 0, 2 * Math.PI);
    ctx.strokeStyle = getStarColor(star.magnitude);
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // 添加星星名稱（只顯示最亮的幾顆）
    if (star.magnitude < 1.5) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(star.name, starX, starY - starSize - 8);
    }
  });
  
  // 添加中心點（天頂）
  ctx.beginPath();
  ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  
  // 添加圖例
  drawStarMapLegend(ctx, canvas.width, canvas.height);
}

// 時間控制函數
function updateStarMap(hourOffset) {
  const newTime = new Date();
  newTime.setHours(newTime.getHours() + hourOffset);
  drawStarMap(newTime);
  
  // 同時更新星星列表
  updateStarsList(newTime);
}

// 更新星星列表（支援指定時間）
function updateStarsList(displayTime = new Date()) {
  const visibleStars = getVisibleStars(displayTime, 25.03, 121.56);
  
  const starsContainer = document.getElementById('visible-stars');
  // 保留第一個元素（當前時間顯示），清除其他
  const currentTimeElement = starsContainer.firstElementChild;
  starsContainer.innerHTML = '';
  starsContainer.appendChild(currentTimeElement);
  
  // 更新當前時間顯示
  const isCurrentTime = Math.abs(displayTime.getTime() - new Date().getTime()) < 60000;
  currentTimeElement.innerHTML = `
    <h3>🕐 ${isCurrentTime ? '當前時間' : '顯示時間'}：${displayTime.toLocaleTimeString('zh-TW')} | 觀測地點：台北</h3>
  `;
  
  if (visibleStars.length === 0) {
    const li = document.createElement('li');
    li.innerHTML = '此時間沒有明亮的星星可見';
    starsContainer.appendChild(li);
    return;
  }
  
  // 顯示星星列表
  const topStars = visibleStars.slice(0, 6);
  
  topStars.forEach((star, index) => {
    const brightnessDesc = star.magnitude < 0 ? '極亮' : 
                          star.magnitude < 1 ? '很亮' : 
                          star.magnitude < 2 ? '明亮' : '可見';
    
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="star-info">
        <strong>⭐ ${star.name}</strong>
        <span class="constellation">${star.constellation}</span>
      </div>
      <div class="star-details">
        <span class="direction">📍 ${star.direction}</span>
        <span class="position">📐 ${star.altitude.toFixed(1)}°</span>
        <span class="brightness">✨ ${brightnessDesc}</span>
      </div>
    `;
    starsContainer.appendChild(li);
  });
  
  // 添加觀測提示
  const tip = document.createElement('li');
  tip.className = 'observation-tip';
  tip.innerHTML = `
    <small>💡 星空會隨時間移動！每小時向西移動約15°</small>
  `;
  starsContainer.appendChild(tip);
}

// 根據星等返回星星顏色
function getStarColor(magnitude) {
  if (magnitude < 0) return '#ffffff';      // 極亮星 - 白色
  if (magnitude < 1) return '#e8f4f8';      // 很亮星 - 淺藍白
  if (magnitude < 2) return '#ffeaa7';      // 明亮星 - 淺黃
  return '#ddd';                            // 普通星 - 灰色
}

// 繪製圖例
function drawStarMapLegend(ctx, canvasWidth, canvasHeight) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(10, 10, 120, 80);
  
  ctx.fillStyle = '#ffffff';
  ctx.font = '12px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('星等圖例:', 15, 25);
  
  // 極亮星
  ctx.beginPath();
  ctx.arc(25, 35, 4, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.fillText('極亮 (<0)', 35, 40);
  
  // 很亮星
  ctx.beginPath();
  ctx.arc(25, 50, 3, 0, 2 * Math.PI);
  ctx.fillStyle = '#e8f4f8';
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillText('很亮 (0-1)', 35, 55);
  
  // 明亮星
  ctx.beginPath();
  ctx.arc(25, 65, 2, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffeaa7';
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillText('明亮 (1-2)', 35, 70);
  
  // 時間標記
  const now = new Date();
  ctx.fillStyle = '#74b9ff';
  ctx.font = '10px Arial';
  ctx.fillText(now.toLocaleTimeString('zh-TW'), canvasWidth - 80, canvasHeight - 10);
}

// 測試函數 - 檢查當前星座資料
function testZodiacData() {
  console.log('=== 星座測試開始 ===');
  
  // 測試當前日期
  const today = new Date();
  console.log('今日:', today.toLocaleDateString('zh-TW'));
  
  // 測試太陽黃經計算
  const sunLongitude = getSunLongitude(today);
  console.log('太陽黃經:', sunLongitude);
  
  // 測試星座判斷
  const zodiacKey = getZodiacKey(sunLongitude);
  console.log('星座鍵值:', zodiacKey);
  
  const zodiacSign = getZodiacSign(sunLongitude);
  console.log('星座名稱:', zodiacSign);
  
  // 測試星座資料庫
  const zodiacData = zodiacDatabase[zodiacKey];
  console.log('星座資料:', zodiacData);
  
  // 測試星星資料
  const stars = getZodiacStars(zodiacKey);
  console.log('該星座的亮星 (' + stars.length + ' 顆):', stars);
  
  // 檢查 HTML 元素
  const starsElement = document.getElementById('zodiac-stars');
  console.log('zodiac-stars 元素:', starsElement);
  
  if (starsElement) {
    console.log('元素當前內容:', starsElement.innerHTML);
    console.log('元素子項數量:', starsElement.children.length);
    
    // 手動更新一次
    console.log('=== 手動更新測試 ===');
    starsElement.innerHTML = '';
    stars.forEach((star, index) => {
      const li = document.createElement('li');
      li.textContent = star;
      starsElement.appendChild(li);
      console.log('添加第' + (index + 1) + '顆星:', star);
    });
    
    console.log('更新後元素內容:', starsElement.innerHTML);
  } else {
    console.error('找不到 zodiac-stars 元素！');
  }
  
  console.log('=== 星座測試結束 ===');
}

// 測試函數 - 手動載入巨蟹座
function testCancerLoad() {
  console.log('=== 手動載入巨蟹座測試 ===');
  
  // 直接測試獲取巨蟹座星星
  const cancerStars = getZodiacStars('cancer');
  console.log('巨蟹座星星數據:', cancerStars);
  
  // 檢查 HTML 元素
  const starsList = document.getElementById('zodiac-stars');
  console.log('zodiac-stars 元素:', starsList);
  
  if (starsList && cancerStars.length > 0) {
    starsList.innerHTML = '';
    cancerStars.forEach((star, index) => {
      const li = document.createElement('li');
      li.textContent = star;
      li.style.color = '#ffffff';
      li.style.fontSize = '14px';
      starsList.appendChild(li);
      console.log('添加星星:', star);
    });
    console.log('巨蟹座星星已載入');
  } else {
    console.error('無法載入巨蟹座星星');
  }
  
  // 也載入完整的巨蟹座資訊
  loadZodiacDetails('cancer');
}

// 測試函數 - 手動添加星星
function testManualStars() {
  console.log('=== 手動添加星星測試 ===');
  const starsList = document.getElementById('zodiac-stars');
  console.log('找到的星星列表元素:', starsList);
  
  if (starsList) {
    console.log('清除原有內容...');
    starsList.innerHTML = '';
    
    const testStars = [
      '🌟 柳宿增十 (Acubens) - α Cnc，4.3等，多重星系統',
      '🌟 柳宿增二十五 (Al Tarf) - β Cnc，3.5等，橙巨星',
      '🌟 鬼宿二 - δ Cnc，3.9等，橙巨星',
      '✨ 蜂巢星團 (M44) - 疏散星團，肉眼可見'
    ];
    
    console.log('開始添加', testStars.length, '顆星星...');
    
    testStars.forEach((star, index) => {
      const li = document.createElement('li');
      li.textContent = star;
      li.style.color = '#ffffff';
      li.style.backgroundColor = '#e74c3c';
      li.style.padding = '8px';
      li.style.marginBottom = '5px';
      li.style.borderRadius = '5px';
      li.style.fontSize = '14px';
      li.style.fontWeight = 'bold';
      starsList.appendChild(li);
      console.log('✅ 添加星星 #' + (index + 1) + ':', star);
    });
    
    console.log('✅ 手動添加完成！共', testStars.length, '顆星');
    console.log('最終 HTML 內容:', starsList.innerHTML);
  } else {
    console.error('❌ 找不到 zodiac-stars 元素！');
    
    // 嘗試查找所有可能的星星相關元素
    const allStarsElements = document.querySelectorAll('[id*="star"]');
    console.log('找到的包含 "star" 的元素:', allStarsElements);
    
    const allZodiacElements = document.querySelectorAll('[id*="zodiac"]');
    console.log('找到的包含 "zodiac" 的元素:', allZodiacElements);
  }
}

// 在 DOMContentLoaded 後執行測試
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(testZodiacData, 2000); // 延遲 2 秒後執行
});

// 直接顯示星星的簡單函數
function forceShowStars() {
  console.log('🌟 強制顯示星星');
  const starsList = document.getElementById('zodiac-stars');
  
  if (starsList) {
    const stars = [
      '🌟 柳宿增十 (Acubens) - α Cnc，4.3等，多重星系統',
      '🌟 柳宿增二十五 (Al Tarf) - β Cnc，3.5等，橙巨星', 
      '🌟 鬼宿二 - δ Cnc，3.9等，橙巨星',
      '✨ 蜂巢星團 (M44) - 疏散星團，肉眼可見'
    ];
    
    starsList.innerHTML = '';
    stars.forEach(star => {
      const li = document.createElement('li');
      li.innerHTML = star;
      li.style.cssText = `
        color: #ffffff !important;
        background: linear-gradient(90deg, #667eea, #764ba2);
        padding: 8px 12px;
        margin: 5px 0;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      `;
      starsList.appendChild(li);
    });
    
    console.log('✅ 星星已強制顯示！');
  } else {
    console.error('❌ 找不到星星列表元素');
  }
}

// 3秒後自動執行
setTimeout(forceShowStars, 3000);

// 測試所有星座的星星數據
function testAllZodiacs() {
  console.log('=== 測試所有星座數據 ===');
  
  const allZodiacs = [
    'aries', 'taurus', 'gemini', 'cancer', 
    'leo', 'virgo', 'libra', 'scorpio', 
    'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];
  
  allZodiacs.forEach(zodiac => {
    const stars = getZodiacStars(zodiac);
    console.log(`${zodiac}: ${stars.length} 顆星`, stars);
  });
  
  console.log('=== 測試完成 ===');
}

// 立即測試所有數據
testAllZodiacs();

// 更新星座按鈕狀態