// =================================================================================
// 1. ИНИЦИАЛИЗАЦИЯ ПЕРЕМЕННЫХ И ПОДКЛЮЧЕНИЕ DOM-ЭЛЕМЕНТОВ
// =================================================================================
Coloris({ alpha: false }); // ОТКЛЮЧАЮ АЛЬФА-КАНАЛ В ПИПЕТКАХ

const qrTextInput = document.getElementById('qr-text');
const shortenUrlCheckbox = document.getElementById('shorten-url-checkbox');
const shortenUrlLabel = document.getElementById('shorten-url-label');
const originalShortenLabelText = shortenUrlLabel.textContent;
const downloadBtn = document.getElementById('download-btn');
const downloadBtnPng = document.getElementById('download-btn-png');
const copyCodeBtn = document.getElementById('copy-code-btn');
const previewEl = document.getElementById('qr-preview');
const logoSettings = document.getElementById('logo-settings');
const logoUploadInput = document.getElementById('logo-upload-input');
const logoUploadLabel = document.getElementById('logo-upload-label');
const logoPreview = document.getElementById('logo-preview');
const removeLogoWrapper = document.getElementById('remove-logo-wrapper');
const dotScaleSlider = document.getElementById('dot-scale-slider');
const dotScaleValueSpan = document.getElementById('dot-scale-value');
const roundingSlider = document.getElementById('rounding-slider');
const roundingValueSpan = document.getElementById('rounding-value');
const eyeRoundingSlider = document.getElementById('eye-rounding-slider');
const eyeRoundingValueSpan = document.getElementById('eye-rounding-value');
const logoRoundingSlider = document.getElementById('logo-rounding-slider');
const logoRoundingValueSpan = document.getElementById('logo-rounding-value');
const logoSizeSlider = document.getElementById('logo-size-slider');
const logoSizeValueSpan = document.getElementById('logo-size-value');
const internalRoundingSlider = document.getElementById('internal-rounding-slider');
const internalRoundingValueSpan = document.getElementById('internal-rounding-value');
const logoRoundingControl = document.getElementById('logo-rounding-control');
const logoSizeControl = document.getElementById('logo-size-control');
const dotColorControl = document.getElementById('dot-color-control');
const eyeColorControl = document.getElementById('eye-color-control');
const dotColorPicker = document.getElementById('dot-color-picker');
const eyeColorPicker = document.getElementById('eye-color-picker');
const gradientDetails = document.getElementById('gradient-details');
const gradientColorPicker1 = document.getElementById('gradient-color-picker-1');
const gradientColorPicker2 = document.getElementById('gradient-color-picker-2');
const gradientRotationSlider = document.getElementById('gradient-rotation-slider');
const gradientRotationValue = document.getElementById('gradient-rotation-value');
const gradientToggleCheckbox = document.getElementById('gradient-toggle-checkbox');
const gradientSummary = gradientDetails.querySelector('summary');

// ЭЛЕМЕНТЫ ФОНА
const backgroundSettings = document.getElementById('background-settings');
const bgSolidColorControl = document.getElementById('bg-solid-color-control');
const bgSolidColorPicker = document.getElementById('bg-solid-color-picker');

// СЛАЙДЕР ПРОЗРАЧНОСТИ
const bgOpacityControl = document.getElementById('bg-opacity-control');
const bgOpacitySlider = document.getElementById('bg-opacity-slider');
const bgOpacityValue = document.getElementById('bg-opacity-value');

const bgGradientDetails = document.getElementById('bg-gradient-details');
const bgGradientCheckbox = document.getElementById('bg-gradient-checkbox');
const bgGradientSummary = bgGradientDetails.querySelector('summary');
const bgGradientControls = document.getElementById('bg-gradient-controls');
const bgGradientColor1 = document.getElementById('bg-gradient-color-1');
const bgGradientColor2 = document.getElementById('bg-gradient-color-2');
const bgGradientRotationSlider = document.getElementById('bg-gradient-rotation-slider');
const bgGradientRotationValue = document.getElementById('bg-gradient-rotation-value');

const bgImageDetails = document.getElementById('bg-image-details');
const bgImageCheckbox = document.getElementById('bg-image-checkbox');
const bgImageSummary = bgImageDetails.querySelector('summary');
const bgImageControls = document.getElementById('bg-image-controls');
const backgroundUploadInput = document.getElementById('background-upload-input');

const frameTextInput = document.getElementById('frame-text-input');
const frameTextControl = document.getElementById('frame-text-control');
const frameBgColorControl = document.getElementById('frame-bg-color-control');
const frameBgColorPicker = document.getElementById('frame-bg-color-picker');
const frameTextColorControl = document.getElementById('frame-text-color-control');
const frameTextColorPicker = document.getElementById('frame-text-color-picker');
const bottomFrameTextColorControl = document.getElementById('bottom-frame-text-color-control');
const bottomFrameTextColorPicker = document.getElementById('bottom-frame-text-color-picker');

const cropModal = document.getElementById('crop-modal');
const cropModalTitle = document.getElementById('crop-modal-title');
const imageToCrop = document.getElementById('image-to-crop');
const confirmCropBtn = document.getElementById('confirm-crop-btn');
const cancelCropBtn = document.getElementById('cancel-crop-btn');

// =================================================================================
// 2. ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ СОСТОЯНИЯ
// =================================================================================
let font = null;
let cropper = null;
let currentCropTarget = null; 
let cachedShortenedUrl = null;
let uploadedLogo = null;
let uploadedBackground = null;
let cachedQrGeometry = { paths: null, moduleCount: 0 };
let isLogoActive = false;
let isPlaceholderLogoActive = false;
let options = {
    cellSize: 10, padding: 10, dotScale: 1, dotCornerRadius: 2.5, dotInternalCornerRadius: 0,
    finderStyle: { outer: {}, inner: {}, hole: {} }, dotColor: '#000000', eyeColor: '#000000',
    baseLogoSizePercentage: 0.3, logoSizePercentage: 0.3, logoSafeZoneModules: 1, gradientEnabled: false,
    gradientColor1: '#000000', gradientColor2: '#8900d5', gradientType: 'linear', gradientRotation: 90,
    frameType: 'none', frameText: 'Отсканируй меня', frameBgColor: '#FFFFFF', 
    frameTextColor: '#FFFFFF',
    bottomFrameTextColor: '#000000',
    framePadding: 15,
    frameTextHeight: 50, frameCornerRadius: 12, adjustedFrameTextSize: null,
    backgroundCornerRadius: 8
};

// =================================================================================
// 3. ОСНОВНЫЕ ФУНКЦИИ ПРИЛОЖЕНИЯ
// =================================================================================
opentype.load('/qr/fonts/Rubik-Medium.woff', function(err, loadedFont) {
    if (err) { console.error('Шрифт не может быть загружен: ' + err); alert('Не удалось загрузить шрифт для экспорта.'); } 
    else { font = loadedFont; console.log('Шрифт Rubik Medium успешно загружен для экспорта.'); }
});

async function shortenUrl(longUrl) {
    const apiUrl = `https://clck.ru/--?url=${encodeURIComponent(longUrl)}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) { throw new Error('Сервис clck.ru не отвечает.'); }
        return await response.text();
    } catch (error) {
        console.error("Ошибка при сокращении ссылки:", error);
        alert("Не удалось сократить ссылку.");
        return longUrl;
    }
}

async function generateNewQRCode() {
    let textForQr = qrTextInput.value.trim();
    const originalUrl = textForQr;
    const isUrlRegex = /^(https?:\/\/)/i;
    if (shortenUrlCheckbox.checked && isUrlRegex.test(originalUrl)) {
        if (cachedShortenedUrl && cachedShortenedUrl.original === originalUrl) { textForQr = cachedShortenedUrl.short; shortenUrlLabel.textContent = `${originalShortenLabelText}: ${textForQr}`; }
        else { qrTextInput.disabled = true; shortenUrlCheckbox.disabled = true; try { const shortUrl = await shortenUrl(originalUrl); if (shortUrl !== originalUrl) { textForQr = shortUrl; cachedShortenedUrl = { original: originalUrl, short: textForQr }; shortenUrlLabel.textContent = `${originalShortenLabelText}: ${textForQr}`; } else { shortenUrlCheckbox.checked = false; shortenUrlLabel.textContent = originalShortenLabelText; cachedShortenedUrl = null; } } finally { qrTextInput.disabled = false; shortenUrlCheckbox.disabled = false; } }
    } else { cachedShortenedUrl = null; shortenUrlLabel.textContent = originalShortenLabelText; }
    let text = textForQr;
    if (isUrlRegex.test(text)) { try { text = new URL(text).href; } catch (e) {} } else { try { text = unescape(encodeURIComponent(text)); } catch (e) {} }
    if (!text) { previewEl.innerHTML = ''; downloadBtn.disabled = true; downloadBtnPng.disabled = true; copyCodeBtn.disabled = true; cachedShortenedUrl = null; cachedQrGeometry = { paths: null, moduleCount: 0 }; return; }
    updateOptionsFromUI();
    const qr = qrcode(0, isLogoActive ? 'H' : 'M');
    qr.addData(text);
    qr.make();
    const moduleCount = qr.getModuleCount();
    const cs = options.cellSize, scaleFactor = 100;
    let polygonsToMerge = [];
    const { totalAreaToClearSize } = calculateLogoSizes(moduleCount, isLogoActive);
    for (let r = 0; r < moduleCount; r++) { for (let c = 0; c < moduleCount; c++) { if (qr.isDark(r, c) && !isPartOFFinderPattern(r, c, moduleCount) && !isInsideLogoArea(r, c, moduleCount, totalAreaToClearSize, isLogoActive)) { const x = c * cs + options.padding, y = r * cs + options.padding; polygonsToMerge.push(rectToPolygon(x, y, cs, cs, scaleFactor)); if ((c + 1 < moduleCount) && qr.isDark(r, c + 1) && !isPartOFFinderPattern(r, c + 1, moduleCount) && !isInsideLogoArea(r, c + 1, moduleCount, totalAreaToClearSize, isLogoActive)) polygonsToMerge.push(rectToPolygon(x + cs / 2, y, cs, cs, scaleFactor)); if ((r + 1 < moduleCount) && qr.isDark(r + 1, c) && !isPartOFFinderPattern(r + 1, c, moduleCount) && !isInsideLogoArea(r + 1, c, moduleCount, totalAreaToClearSize, isLogoActive)) polygonsToMerge.push(rectToPolygon(x, y + cs / 2, cs, cs, scaleFactor)); } } }
    const clipper = new ClipperLib.Clipper();
    clipper.AddPaths(polygonsToMerge, ClipperLib.PolyType.ptSubject, true);
    const mergedPaths = new ClipperLib.Paths();
    clipper.Execute(ClipperLib.ClipType.ctUnion, mergedPaths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
    cachedQrGeometry = { paths: mergedPaths, moduleCount: moduleCount };
    updateQrStyles();
}

function updateQrStyles() {
    if (!cachedQrGeometry.paths) return;
    updateOptionsFromUI();
    previewEl.style.backgroundImage = 'none';
    previewEl.style.backgroundColor = 'transparent';
    const offset = (options.cellSize * (options.dotScale - 1) / 2) * 100;
    let finalPaths = cachedQrGeometry.paths;
    if (Math.abs(offset) > 1) { const co = new ClipperLib.ClipperOffset(); const offsetPaths = new ClipperLib.Paths(); co.AddPaths(cachedQrGeometry.paths, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon); co.Execute(offsetPaths, offset); finalPaths = offsetPaths; }
    const mergedSvgPathData = clipperPathsToRoundedSvgPath(finalPaths, options.dotCornerRadius, options.dotInternalCornerRadius, 100);
    previewEl.innerHTML = buildFinalSvg(cachedQrGeometry.moduleCount, mergedSvgPathData, false);
    adjustFrameTextSize();
    const svgEl = previewEl.querySelector('svg');
    const solidOpacity = parseInt(bgOpacitySlider.value, 10);
    const hasBackground = bgGradientCheckbox.checked || (bgImageCheckbox.checked && uploadedBackground) || (bgSolidColorPicker.value !== '' && solidOpacity > 0);
    if (svgEl) { svgEl.classList.toggle('has-shadow', options.frameType !== 'none' || hasBackground); }
    downloadBtn.disabled = false; downloadBtnPng.disabled = false; copyCodeBtn.disabled = false;
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) { alert('Файл слишком большой (макс. 6 МБ).'); logoUploadInput.value = ''; return; }
    currentCropTarget = 'logo';
    const reader = new FileReader();
    reader.onload = (e) => {
        imageToCrop.src = e.target.result;
        cropModalTitle.textContent = 'Настройте ваш логотип';
        cropModal.style.display = 'flex';
        cropper = new Cropper(imageToCrop, { aspectRatio: 1, viewMode: 1, dragMode: 'move', background: false, autoCropArea: 0.9 });
    };
    reader.readAsDataURL(file);
}

function handleBackgroundUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) { alert('Файл слишком большой (макс. 6 МБ).'); backgroundUploadInput.value = ''; return; }
    currentCropTarget = 'background';
    const reader = new FileReader();
    reader.onload = (e) => {
        imageToCrop.src = e.target.result;
        cropModalTitle.textContent = 'Настройте ваш фон';
        cropModal.style.display = 'flex';
        cropper = new Cropper(imageToCrop, { aspectRatio: 1, viewMode: 1, dragMode: 'move', background: false, autoCropArea: 1 });
    };
    reader.readAsDataURL(file);
}

// =================================================================================
// 4. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// =================================================================================

function parseColorForSvg(colorStr) {
    if (!colorStr || colorStr === 'transparent') return { fill: 'none', opacity: 1 };
    if (colorStr.startsWith('#') && colorStr.length === 9) {
        const alphaHex = colorStr.slice(7, 9);
        const alpha = parseInt(alphaHex, 16) / 255;
        const colorHex = colorStr.slice(0, 7);
        if (alpha === 0) return { fill: 'none', opacity: 0 };
        return { fill: colorHex, opacity: alpha.toFixed(2) };
    }
    if (colorStr.startsWith('rgba')) {
         const alpha = parseFloat(colorStr.split(',')[3]);
         if (alpha === 0) return { fill: 'none', opacity: 0 };
    }
    return { fill: colorStr, opacity: 1 };
}

function toggleColorInputsState(isDisabled) { dotColorControl.classList.toggle('disabled-control', isDisabled); eyeColorControl.classList.toggle('disabled-control', isDisabled); }
function toggleLogoSlidersState(isDisabled) { logoRoundingControl.classList.toggle('disabled-control', isDisabled); logoSizeControl.classList.toggle('disabled-control', isDisabled); }
function updateLogoButtonText() { logoUploadLabel.textContent = uploadedLogo ? 'Заменить логотип' : 'Загрузить логотип'; }

// ФУНКЦИЯ ГЕНЕРАЦИИ ТЕКСТА В КРИВЫХ
function generateTextAsPath(text, targetX, targetY, fontSize, colorStr) { 
    if (!font) return ''; 
    const glyphs = font.stringToGlyphs(text); 
    let totalWidth = 0; 
    glyphs.forEach(g => totalWidth += g.advanceWidth); 
    
    const scale = fontSize / font.unitsPerEm; 
    const textWidth = totalWidth * scale; 
    const startX = targetX - (textWidth / 2); 
    
    const finalBaselineY = targetY + (fontSize * 0.35); 
    
    const finalPath = font.getPath(text, startX, finalBaselineY, fontSize); 
    const parsed = parseColorForSvg(colorStr);
    return (finalPath && typeof finalPath.toPathData === 'function') ? `<path fill="${parsed.fill}" fill-opacity="${parsed.opacity}" d="${finalPath.toPathData()}" />` : ''; 
}

function adjustFrameTextSize() {
    const textEl = document.getElementById('frame-text-element');
    
    if (!textEl || !cachedQrGeometry.moduleCount) { 
        options.adjustedFrameTextSize = null; 
        return; 
    }

    // 1. Определяю доступное пространство
    const qrSize = cachedQrGeometry.moduleCount * options.cellSize + options.padding * 2;
    const totalFrameWidth = qrSize + options.framePadding * 2;
    
    const availableWidth = totalFrameWidth - 50; 

    // 2. Определяю максимально допустимый размер шрифта по высоте плашки
    const maxFontSizeByHeight = options.frameTextHeight * 0.50;

    // 3. Сначала пробую применить максимальный размер шрифта
    let fontSize = maxFontSizeByHeight;
    textEl.setAttribute('font-size', fontSize);

    // 4. Измеряю реальную ширину текста при этом размере
    const currentTextWidth = textEl.getComputedTextLength();

    // 5. Если текст получился шире, чем доступное место, вычисляю коэффициент уменьшения
    if (currentTextWidth > availableWidth) {
        fontSize = fontSize * (availableWidth / currentTextWidth);
    }

    // 6. Ставлю ограничение, чтобы текст не стал слишком мелким (минимум 8px)
    fontSize = Math.floor(fontSize);
    if (fontSize < 8) fontSize = 8;

    // 7. Применяю финальный размер и сохраняем его в опции для экспорта
    textEl.setAttribute('font-size', fontSize);
    options.adjustedFrameTextSize = fontSize;
}
function updateOptionsFromUI() { 
    options.logoSizePercentage = options.baseLogoSizePercentage * (parseInt(logoSizeSlider.value, 10) / 100); 
    logoSizeValueSpan.textContent = logoSizeSlider.value; 
    options.dotScale = parseFloat(dotScaleSlider.value) / 100; 
    dotScaleValueSpan.textContent = dotScaleSlider.value; 
    options.dotCornerRadius = (parseInt(roundingSlider.value, 10) / 100) * (options.cellSize / 2); 
    roundingValueSpan.textContent = roundingSlider.value; 
    
    const eyeRoundingValue = parseInt(eyeRoundingSlider.value, 10); 
    eyeRoundingValueSpan.textContent = eyeRoundingValue; 
    if (eyeRoundingValue <= 50) { 
        const t = eyeRoundingValue / 50; 
        options.finderStyle = { method: 'arc', outer: { radius: options.cellSize * 3.5 * t }, inner: { radius: options.cellSize * 1.5 * t }, hole: { radius: options.cellSize * 2.5 * t } }; 
    } else { 
        const t = (eyeRoundingValue - 50) / 50; 
        const kappa = 0.552284749831; 
        const superellipseFactor = kappa + t * (1 - kappa); 
        options.finderStyle = { method: 'bezier', outer: { size: options.cellSize * 7, radius: options.cellSize * 3.5, factor: superellipseFactor }, inner: { size: options.cellSize * 3, radius: options.cellSize * 1.5, factor: superellipseFactor }, hole: { size: options.cellSize * 5, radius: options.cellSize * 2.5, factor: superellipseFactor } }; 
    } 
    
    options.dotInternalCornerRadius = (parseInt(internalRoundingSlider.value, 10) / 100) * (options.cellSize / 2); 
    internalRoundingValueSpan.textContent = internalRoundingSlider.value; 
    options.dotColor = dotColorPicker.value; 
    options.eyeColor = eyeColorPicker.value; 
    options.gradientEnabled = gradientDetails.open; 
    options.gradientColor1 = gradientColorPicker1.value; 
    options.gradientColor2 = gradientColorPicker2.value; 
    options.gradientRotation = parseInt(gradientRotationSlider.value, 10); 
    gradientRotationValue.textContent = options.gradientRotation; 
    toggleColorInputsState(options.gradientEnabled); 
    
    options.frameText = frameTextInput.value; 
    options.frameBgColor = frameBgColorPicker.value; 
    options.frameTextColor = frameTextColorPicker.value; 
    options.bottomFrameTextColor = bottomFrameTextColorPicker.value;

    const isStandardTextFrame = ['full', 'full-top', 'text-panel'].includes(options.frameType);
    const isBottomTextFrame = options.frameType === 'bottom-text';
    frameTextControl.style.display = (isStandardTextFrame || isBottomTextFrame) ? 'block' : 'none'; 
    frameTextColorControl.style.display = isStandardTextFrame ? 'block' : 'none';
    bottomFrameTextColorControl.style.display = isBottomTextFrame ? 'block' : 'none';
    
    if (!isStandardTextFrame && !isBottomTextFrame) options.adjustedFrameTextSize = null; 
    frameBgColorControl.style.display = options.frameType === 'background' ? 'block' : 'none';
    
    bgGradientRotationValue.textContent = bgGradientRotationSlider.value;
    bgOpacityValue.textContent = bgOpacitySlider.value;
}

function generateGradientDef() { if (!options.gradientEnabled) return ''; const qrSize = cachedQrGeometry.moduleCount * options.cellSize + options.padding * 2; let totalWidth = qrSize, totalHeight = qrSize; if (['full', 'full-top', 'text-panel', 'bottom-text'].includes(options.frameType)) { totalWidth += options.framePadding * 2; totalHeight += options.framePadding * 2 + options.frameTextHeight; } else if (['simple', 'background'].includes(options.frameType)) { totalWidth += options.framePadding * 2; totalHeight += options.framePadding * 2; } const angleRad = (options.gradientRotation - 90) * (Math.PI / 180); const cx = totalWidth / 2, cy = totalHeight / 2; const r = Math.sqrt(cx**2 + cy**2); const [x1, y1, x2, y2] = [cx - Math.cos(angleRad) * r, cy - Math.sin(angleRad) * r, cx + Math.cos(angleRad) * r, cy + Math.sin(angleRad) * r]; return `<defs><linearGradient id="qr-gradient" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"><stop offset="0%" stop-color="${options.gradientColor1}"/><stop offset="100%" stop-color="${options.gradientColor2}"/></linearGradient></defs>`; }

function generateBackgroundGradientDef() { 
    if (!bgGradientCheckbox.checked) return ''; 
    const angleRad = (parseInt(bgGradientRotationSlider.value, 10) - 90) * (Math.PI / 180);
    const x1 = 0.5 - 0.5 * Math.cos(angleRad);
    const y1 = 0.5 - 0.5 * Math.sin(angleRad);
    const x2 = 0.5 + 0.5 * Math.cos(angleRad);
    const y2 = 0.5 + 0.5 * Math.sin(angleRad);
    
    const c1 = parseColorForSvg(bgGradientColor1.value);
    const c2 = parseColorForSvg(bgGradientColor2.value);

    return `<defs><linearGradient id="bg-gradient" gradientUnits="objectBoundingBox" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"><stop offset="0%" stop-color="${c1.fill}" stop-opacity="${c1.opacity}"/><stop offset="100%" stop-color="${c2.fill}" stop-opacity="${c2.opacity}"/></linearGradient></defs>`; 
}

function getFrameBackgroundLayer(x, y, w, h, r) {
    if (bgImageCheckbox.checked && uploadedBackground) {
        const cpId = "bg-clip-" + Math.random().toString(36).substr(2, 9);
        return `<defs><clipPath id="${cpId}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/></clipPath></defs>
                <image href="${uploadedBackground.data}" xlink:href="${uploadedBackground.data}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${cpId})" />`;
    }
    else if (bgGradientCheckbox.checked) {
        return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="url(#bg-gradient)"/>`;
    }
    else {
        const rawColor = bgSolidColorPicker.value || '#ffffff';
        const opacity = parseInt(bgOpacitySlider.value, 10) / 100;
        if (opacity === 0) return '';
        return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${rawColor}" fill-opacity="${opacity}"/>`;
    }
}

function generateFrameSvg(moduleCount, useAdjustedFontSize = false, convertTextToPaths = false) { 
    if (options.frameType === 'none') return ''; 
    
    const qrSize = moduleCount * options.cellSize + options.padding * 2; 
    const frameFill = options.gradientEnabled ? 'url(#qr-gradient)' : options.dotColor; 
    const fontSize = useAdjustedFontSize ? (options.adjustedFrameTextSize || (options.frameTextHeight * 0.45)) : (options.frameTextHeight * 0.45); 
    const fontFamily = "'Rubik-Custom', sans-serif"; 
    const totalWidth = qrSize + options.framePadding * 2; 
    let totalHeight = qrSize + options.framePadding * 2; 
    
    if (['full', 'full-top', 'text-panel', 'bottom-text'].includes(options.frameType)) totalHeight += options.frameTextHeight; 
    
    let frameElements = ''; 
    const textColor = (options.frameType === 'bottom-text') ? options.bottomFrameTextColor : options.frameTextColor;

    const shrink = 1;

    const baseWhiteInner = `<rect x="${options.framePadding + shrink}" y="${options.framePadding + shrink}" width="${qrSize - shrink*2}" height="${qrSize - shrink*2}" rx="${options.frameCornerRadius/2}" fill="white"/>`;
    
    const baseWhiteInnerTop = `<rect x="${options.framePadding + shrink}" y="${options.framePadding + options.frameTextHeight + shrink}" width="${qrSize - shrink*2}" height="${qrSize - shrink*2}" rx="${options.frameCornerRadius/2}" fill="white"/>`;

    const baseWhiteFull = `<rect x="0" y="0" width="${totalWidth}" height="${totalHeight}" rx="${options.frameCornerRadius}" fill="white"/>`;

    if (options.frameType === 'full') { 
        const textY = options.framePadding + qrSize + (options.frameTextHeight / 2) + 7; 
        const frameText = convertTextToPaths && font ? generateTextAsPath(options.frameText, totalWidth / 2, textY, fontSize, options.frameTextColor) : `<text id="frame-text-element" x="${totalWidth/2}" y="${textY}" dominant-baseline="middle" font-family="${fontFamily}" font-size="${fontSize}" font-weight="bold" text-anchor="middle" fill="${textColor}">${options.frameText}</text>`; 
        const innerBg = getFrameBackgroundLayer(options.framePadding, options.framePadding, qrSize, qrSize, options.frameCornerRadius/2);
        
        frameElements = `<rect x="0" y="0" width="${totalWidth}" height="${totalHeight}" rx="${options.frameCornerRadius}" fill="${frameFill}"/>${baseWhiteInner}${innerBg}${frameText}`; 
    } 
    else if (options.frameType === 'full-top') { 
        const textY = (options.framePadding + options.frameTextHeight) / 2 + 2; 
        const frameText = convertTextToPaths && font ? generateTextAsPath(options.frameText, totalWidth / 2, textY, fontSize, options.frameTextColor) : `<text id="frame-text-element" x="${totalWidth/2}" y="${textY}" dominant-baseline="middle" font-family="${fontFamily}" font-size="${fontSize}" font-weight="bold" text-anchor="middle" fill="${textColor}">${options.frameText}</text>`; 
        const innerBg = getFrameBackgroundLayer(options.framePadding, options.framePadding + options.frameTextHeight, qrSize, qrSize, options.frameCornerRadius/2);
        
        frameElements = `<rect x="0" y="0" width="${totalWidth}" height="${totalHeight}" rx="${options.frameCornerRadius}" fill="${frameFill}"/>${baseWhiteInnerTop}${innerBg}${frameText}`; 
    } 
    else if (options.frameType === 'text-panel') { 
        const panelY = qrSize + options.framePadding * 2; 
        const panelPath = `M 0,${panelY} H ${totalWidth} V ${totalHeight - options.frameCornerRadius} A ${options.frameCornerRadius},${options.frameCornerRadius} 0 0 1 ${totalWidth - options.frameCornerRadius},${totalHeight} H ${options.frameCornerRadius} A ${options.frameCornerRadius},${options.frameCornerRadius} 0 0 1 0,${totalHeight - options.frameCornerRadius} Z`; 
        const textY = panelY + (options.frameTextHeight / 2); 
        const frameText = convertTextToPaths && font ? generateTextAsPath(options.frameText, totalWidth / 2, textY, fontSize, options.frameTextColor) : `<text id="frame-text-element" x="${totalWidth/2}" y="${textY}" dominant-baseline="middle" font-family="${fontFamily}" font-size="${fontSize}" font-weight="bold" text-anchor="middle" fill="${textColor}">${options.frameText}</text>`; 
        const mainBg = getFrameBackgroundLayer(0, 0, totalWidth, totalHeight, options.frameCornerRadius);
        
        frameElements = `${baseWhiteFull}${mainBg}<path d="${panelPath}" fill="${frameFill}"/>${frameText}`; 
    }
    else if (options.frameType === 'bottom-text') {
        const textY = totalHeight - (options.frameTextHeight / 2) - 8;
        const frameText = convertTextToPaths && font ? generateTextAsPath(options.frameText, totalWidth / 2, textY, fontSize, textColor) : `<text id="frame-text-element" x="${totalWidth/2}" y="${textY}" dominant-baseline="middle" font-family="${fontFamily}" font-size="${fontSize}" font-weight="bold" text-anchor="middle" fill="${textColor}">${options.frameText}</text>`; 
        const mainBg = getFrameBackgroundLayer(0, 0, totalWidth, totalHeight, options.frameCornerRadius);
        
        frameElements = `${baseWhiteFull}${mainBg}${frameText}`;
    }
    else if (options.frameType === 'simple') { 
        const innerBg = getFrameBackgroundLayer(options.framePadding, options.framePadding, qrSize, qrSize, options.frameCornerRadius/2);
        
        frameElements = `<rect x="0" y="0" width="${totalWidth}" height="${totalHeight}" rx="${options.frameCornerRadius}" fill="${frameFill}"/>${baseWhiteInner}${innerBg}`; 
    } 
    else if (options.frameType === 'background') { 
        const mainBg = getFrameBackgroundLayer(0, 0, totalWidth, totalHeight, options.frameCornerRadius);
        frameElements = `${baseWhiteFull}${mainBg}`;
    } 
    return `<g id="frame">${frameElements}</g>`; 
}

function buildFinalSvg(moduleCount, mergedDataPath, useFullResLogo = false, isForDownload = false) { 
    const qrSize = moduleCount * options.cellSize + options.padding * 2; 
    let totalWidth = qrSize, totalHeight = qrSize; 
    if (options.frameType !== 'none') { 
        totalWidth += options.framePadding * 2; 
        totalHeight += options.framePadding * 2; 
        if (['full', 'full-top', 'text-panel', 'bottom-text'].includes(options.frameType)) totalHeight += options.frameTextHeight; 
    } 
    const { logoPlaceholderSize } = calculateLogoSizes(moduleCount, isLogoActive); 
    
    let backgroundGroup = '';
    if (options.frameType === 'none') {
        const bgCornerRadius = options.backgroundCornerRadius;
        backgroundGroup = getFrameBackgroundLayer(0, 0, qrSize, qrSize, bgCornerRadius);
    }

    const dotColorParsed = parseColorForSvg(options.dotColor);
    const dotFillAttribute = options.gradientEnabled ? 'fill="url(#qr-gradient)"' : `fill="${dotColorParsed.fill}" fill-opacity="${dotColorParsed.opacity}"`;

    const qrContentElements = `${backgroundGroup}<g id="data-dots"><path d="${mergedDataPath}" ${dotFillAttribute}/></g>${generateFinderPatternsSvg(moduleCount)}${generateLogoSvg(moduleCount, logoPlaceholderSize, isLogoActive, useFullResLogo) || ''}`; 
    
    const bgGradientDef = generateBackgroundGradientDef();
    const qrGradientDef = generateGradientDef();

    if (options.frameType !== 'none') { 
        let contentTransformY = options.framePadding; 
        if (options.frameType === 'full-top') contentTransformY += options.frameTextHeight; 
        const contentTransform = `transform="translate(${options.framePadding}, ${contentTransformY})"`; 
        return `<svg viewBox="0 0 ${totalWidth} ${totalHeight}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">${bgGradientDef}${qrGradientDef}${generateFrameSvg(moduleCount, useFullResLogo, isForDownload)}<g id="qr-code-content" ${contentTransform}>${qrContentElements}</g></svg>`; 
    } else { 
        return `<svg viewBox="0 0 ${qrSize} ${qrSize}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">${bgGradientDef}${qrGradientDef}<g id="qr-code-content">${qrContentElements}</g></svg>`; 
    } 
}

function downloadSVG() { if (!cachedQrGeometry.paths) return; downloadFile(new Blob([buildFinalSvg(cachedQrGeometry.moduleCount, clipperPathsToRoundedSvgPath(cachedQrGeometry.paths, options.dotCornerRadius, options.dotInternalCornerRadius, 100), true, true)], { type: 'image/svg+xml' }), 'qrcode.svg'); }
async function downloadPNG() { 
    if (!cachedQrGeometry.paths) return; 
    const offset = (options.cellSize * (options.dotScale - 1) / 2) * 100;
    let finalPaths = cachedQrGeometry.paths;
    if (Math.abs(offset) > 1) { const co = new ClipperLib.ClipperOffset(); const offsetPaths = new ClipperLib.Paths(); co.AddPaths(cachedQrGeometry.paths, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon); co.Execute(offsetPaths, offset); finalPaths = offsetPaths; }
    const mergedDataPath = clipperPathsToRoundedSvgPath(finalPaths, options.dotCornerRadius, options.dotInternalCornerRadius, 100);
    const finalSvgString = buildFinalSvg(cachedQrGeometry.moduleCount, mergedDataPath, true, true); 
    
    const { moduleCount } = cachedQrGeometry; 
    const qrSize = moduleCount * options.cellSize + options.padding * 2; 
    let finalWidth = qrSize, finalHeight = qrSize; 
    if (options.frameType !== 'none') { 
        finalWidth += options.framePadding * 2; 
        finalHeight += options.framePadding * 2; 
        if (['full', 'full-top', 'text-panel', 'bottom-text'].includes(options.frameType)) finalHeight += options.frameTextHeight; 
    } 
    const aspectRatio = finalWidth / finalHeight; 
    const desiredWidth = 1024, desiredHeight = desiredWidth / aspectRatio; 
    const canvas = document.createElement('canvas'); 
    canvas.width = desiredWidth; canvas.height = desiredHeight; 
    const ctx = canvas.getContext('2d'); 
    
    const loadImage = src => new Promise((resolve, reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = src; }); 
    try { 
        const qrImg = await loadImage(URL.createObjectURL(new Blob([finalSvgString], {type: 'image/svg+xml;charset=utf-8'}))); 
        ctx.drawImage(qrImg, 0, 0, desiredWidth, desiredHeight); 
        downloadFile(canvas.toDataURL('image/png'), 'qrcode.png'); 
    } catch (e) { console.error("Could not load SVG image for PNG export", e); } 
}
async function copySvgCode() { if (!cachedQrGeometry.paths) return; try { await navigator.clipboard.writeText(buildFinalSvgForDownload(true, true)); copyCodeBtn.textContent = 'Скопировано!'; setTimeout(() => { copyCodeBtn.textContent = 'Скопировать код SVG'; }, 2000); } catch (err) { alert('Не удалось скопировать код.'); } }
// Обертка для совместимости
function buildFinalSvgForDownload(useFullResLogo, convertTextToPaths) {
    const offset = (options.cellSize * (options.dotScale - 1) / 2) * 100;
    let finalPaths = cachedQrGeometry.paths;
    if (Math.abs(offset) > 1) { const co = new ClipperLib.ClipperOffset(); const offsetPaths = new ClipperLib.Paths(); co.AddPaths(cachedQrGeometry.paths, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon); co.Execute(offsetPaths, offset); finalPaths = offsetPaths; }
    const mergedDataPath = clipperPathsToRoundedSvgPath(finalPaths, options.dotCornerRadius, options.dotInternalCornerRadius, 100);
    return buildFinalSvg(cachedQrGeometry.moduleCount, mergedDataPath, useFullResLogo, convertTextToPaths);
}

function handleLogoRemove() { isLogoActive = false; isPlaceholderLogoActive = false; uploadedLogo = null; logoUploadInput.value = ''; removeLogoWrapper.style.display = 'none'; updateLogoButtonText(); generateNewQRCode(); document.querySelectorAll('.preset-logo-wrapper').forEach(el => el.classList.remove('selected')); toggleLogoSlidersState(true); }
function generateLogoSvg(moduleCount, steppedPlaceholderSize, addLogo, useFullResLogo = false) { if (!addLogo || steppedPlaceholderSize <= 0) return null; const center = Math.floor(moduleCount / 2); const halfSteppedPlaceholder = Math.floor(steppedPlaceholderSize / 2); const startModule = center - halfSteppedPlaceholder; const safeZoneX = startModule * options.cellSize + options.padding, safeZoneY = startModule * options.cellSize + options.padding; const safeZoneSize = steppedPlaceholderSize * options.cellSize; const visualClearanceInModules = moduleCount * options.logoSizePercentage; const visualPlaceholderInModules = visualClearanceInModules - (options.logoSafeZoneModules * 2); const visualSize = visualPlaceholderInModules * options.cellSize; const visualX = safeZoneX + (safeZoneSize - visualSize) / 2, visualY = safeZoneY + (safeZoneSize - visualSize) / 2; const logoRoundingValue = parseInt(logoRoundingSlider.value, 10); logoRoundingValueSpan.textContent = logoRoundingValue; let logoStyle = {}; if (logoRoundingValue <= 50) { const t = logoRoundingValue / 50; logoStyle = { method: 'arc', radius: (visualSize / 2) * t }; } else { const t = (logoRoundingValue - 50) / 50; const kappa = 0.552284749831; logoStyle = { method: 'bezier', size: visualSize, radius: visualSize / 2, factor: kappa + t * (1 - kappa) }; } if (isPlaceholderLogoActive) { const fill = options.gradientEnabled ? 'url(#qr-gradient)' : options.dotColor; return `<g id="logo-placeholder">${logoStyle.method === 'bezier' ? `<path d="${createSuperellipsePath(visualX, visualY, logoStyle)}" fill="${fill}"/>` : `<rect x="${visualX}" y="${visualY}" width="${visualSize}" height="${visualSize}" rx="${logoStyle.radius}" fill="${fill}"/>`}</g>`; } if (uploadedLogo) { const clipPath = generateLogoClipPath(visualX, visualY, visualSize, logoStyle); if (uploadedLogo.type === 'svg' && useFullResLogo) { const svgDoc = new DOMParser().parseFromString(uploadedLogo.fullData, "image/svg+xml"); const svgEl = svgDoc.documentElement; ['x', 'y', 'width', 'height', 'preserveAspectRatio'].forEach(attr => svgEl.setAttribute(attr, [visualX, visualY, visualSize, visualSize, 'xMidYMid meet'][['x', 'y', 'width', 'height', 'preserveAspectRatio'].indexOf(attr)])); return `${clipPath}<g id="logo-image" clip-path="url(#logo-clip-path)">${svgEl.outerHTML}</g>`; } else { return `${clipPath}<g id="logo-image" clip-path="url(#logo-clip-path)"><image href="${useFullResLogo ? uploadedLogo.fullData : uploadedLogo.previewData}" xlink:href="${useFullResLogo ? uploadedLogo.fullData : uploadedLogo.previewData}" x="${visualX}" y="${visualY}" width="${visualSize}" height="${visualSize}"/></g>`; } } return null; }
async function loadInitialLogo(url) { isLogoActive = true; try { const isDataUrl = url.startsWith('data:image/svg+xml'); let svgText, svgDataBase64; if (isDataUrl) { svgDataBase64 = url; svgText = atob(url.split(',')[1]); } else { const response = await fetch(url); if (!response.ok) throw new Error('Network response was not ok'); svgText = await response.text(); svgDataBase64 = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgText)))}`; } const img = new Image(); img.onload = () => { uploadedLogo = { type: 'svg', previewData: svgDataBase64, fullData: svgText }; logoPreview.src = svgDataBase64; removeLogoWrapper.style.display = 'flex'; updateLogoButtonText(); generateNewQRCode(); toggleLogoSlidersState(false); }; img.src = svgDataBase64; } catch (error) { console.error('Failed to fetch initial logo:', error); isLogoActive = false; removeLogoWrapper.style.display = 'none'; generateNewQRCode(); toggleLogoSlidersState(true); } }
function initializePresetLogos() {
    const allPresets = document.querySelectorAll('.preset-logo-wrapper:not(.preset-background-item)');
    
    allPresets.forEach(logo => {
        if (logo.id === 'remove-logo-preset' || logo.id === 'upload-logo-preset') return;
        
        logo.addEventListener('click', () => {
            allPresets.forEach(el => el.classList.remove('selected'));
            logo.classList.add('selected');
            
            isPlaceholderLogoActive = (logo.id === 'placeholder-logo-preset');
            
            if (logo.dataset.logoUrl) loadInitialLogo(logo.dataset.logoUrl);
        });
    });
    
    document.getElementById('remove-logo-preset')?.addEventListener('click', handleLogoRemove);
    document.getElementById('upload-logo-preset')?.addEventListener('click', () => logoUploadInput.click());
}function initializePresetFrames() { document.querySelectorAll('.preset-frame-wrapper').forEach(frame => { frame.addEventListener('click', () => { document.querySelectorAll('.preset-frame-wrapper').forEach(el => el.classList.remove('selected')); frame.classList.add('selected'); options.frameType = frame.dataset.frameType; generateNewQRCode(); }); }); }
function clipperPathsToRoundedSvgPath(paths, externalRadius, internalRadius, scale) { let svgPath = ''; for (const path of paths) { let pathData = ''; for (let i = 0; i < path.length; i++) { const p_prev = path[(i - 1 + path.length) % path.length], p_curr = path[i], p_next = path[(i + 1) % path.length]; const v1 = { X: p_prev.X - p_curr.X, Y: p_prev.Y - p_curr.Y }, v2 = { X: p_next.X - p_curr.X, Y: p_next.Y - p_curr.Y }; const crossProduct = v1.X * v2.Y - v1.Y * v2.X; const l1 = Math.hypot(v1.X, v1.Y), l2 = Math.hypot(v2.X, v2.Y); const r = crossProduct < 0 ? externalRadius : internalRadius; if (r > 0.01) { const offset = Math.min(r * scale, l1 / 2, l2 / 2); const u1 = { X: v1.X / l1, Y: v1.Y / l1 }, u2 = { X: v2.X / l2, Y: v2.Y / l2 }; const startArc = { X: p_curr.X + u1.X * offset, Y: p_curr.Y + u1.Y * offset }, endArc = { X: p_curr.X + u2.X * offset, Y: p_curr.Y + u2.Y * offset }; pathData += (i === 0 ? 'M' : 'L') + `${startArc.X/scale} ${startArc.Y/scale} A ${r} ${r} 0 0 ${crossProduct < 0 ? 1 : 0} ${endArc.X/scale} ${endArc.Y/scale} `; } else pathData += (i === 0 ? 'M' : 'L') + `${p_curr.X/scale} ${p_curr.Y/scale} `; } svgPath += pathData + 'Z '; } return svgPath; }
function rectToPolygon(x, y, w, h, scale) { return [{ X: x * scale, Y: y * scale }, { X: (x + w) * scale, Y: y * scale }, { X: (x + w) * scale, Y: (y + h) * scale }, { X: x * scale, Y: (y + h) * scale }]; }
function calculateLogoSizes(moduleCount, addLogo) { if (!addLogo) return { totalAreaToClearSize: 0, logoPlaceholderSize: 0 }; let totalAreaToClearSize = Math.round(moduleCount * options.logoSizePercentage); if (totalAreaToClearSize % 2 === 0) totalAreaToClearSize--; return { totalAreaToClearSize, logoPlaceholderSize: totalAreaToClearSize - (options.logoSafeZoneModules * 2) }; }
function isPartOFFinderPattern(r, c, mc) { return (r < 7 && c < 7) || (r < 7 && c >= mc - 7) || (r >= mc - 7 && c < 7); }
function isInsideLogoArea(r, c, mc, size, addLogo) { if (!addLogo || size <= 0) return false; const center = Math.floor(mc / 2); const half = Math.floor(size / 2); const start = center - half, end = center + half; return r >= start && r <= end && c >= start && c <= end; }
function createSuperellipsePath(x, y, style) { const { size, radius, factor } = style; if (radius === 0) return `M ${x},${y} H ${x + size} V ${y + size} H ${x} Z`; const c = radius * factor; return [`M ${x+radius},${y}`,`L ${x+size-radius},${y}`,`C ${x+size-radius+c},${y} ${x+size},${y+radius-c} ${x+size},${y+radius}`,`L ${x+size},${y+size-radius}`,`C ${x+size},${y+size-radius+c} ${x+size-radius+c},${y+size} ${x+size-radius},${y+size}`,`L ${x+radius},${y+size}`,`C ${x+radius-c},${y+size} ${x},${y+size-radius+c} ${x},${y+size-radius}`,`L ${x},${y+radius}`,`C ${x},${y+radius-c} ${x+radius-c},${y} ${x+radius},${y}`,'Z'].join(' '); }
function generateFinderPatternsSvg(moduleCount) { const p = options.padding, cs = options.cellSize; const eyeScale = 1 + (options.dotScale - 1) * 0.6; const outerFrameThickness = cs * eyeScale; const outerSize = cs * 5 + (2 * outerFrameThickness); const outerOffset = (cs * 7 - outerSize) / 2; const innerDotSize = cs * 3; const innerOffset = (cs * 7 - innerDotSize) / 2; const finderPositions = [[p, p], [p + (moduleCount - 7) * cs, p], [p, p + (moduleCount - 7) * cs]]; const finderFill = options.gradientEnabled ? 'url(#qr-gradient)' : options.eyeColor; 
    
    // Применяю парсер цвета для меток
    let finderFillAttr = '';
    if (options.gradientEnabled) {
        finderFillAttr = 'fill="url(#qr-gradient)"';
    } else {
        const parsed = parseColorForSvg(options.eyeColor);
        finderFillAttr = `fill="${parsed.fill}" fill-opacity="${parsed.opacity}"`;
    }

    return `<g id="finder-patterns">${finderPositions.map(([x, y], i) => { if (options.finderStyle.method === 'bezier') { const outerPath = createSuperellipsePath(x + outerOffset, y + outerOffset, { ...options.finderStyle.outer, size: outerSize, radius: options.finderStyle.outer.radius * (outerSize / (cs * 7)) }); const holePath = createSuperellipsePath(x + cs, y + cs, options.finderStyle.hole); const innerPath = createSuperellipsePath(x + innerOffset, y + innerOffset, { ...options.finderStyle.inner, size: innerDotSize }); return `<g id="finder-pattern-${i+1}"><path d="${outerPath} ${holePath}" ${finderFillAttr} fill-rule="evenodd"/><path d="${innerPath}" ${finderFillAttr}/></g>`; } else { const rOuter = options.finderStyle.outer.radius * (outerSize / (cs * 7)), rInner = options.finderStyle.inner.radius, rHole = options.finderStyle.hole.radius; const outerPath = `M ${x+outerOffset+rOuter},${y+outerOffset} h ${outerSize-2*rOuter} a ${rOuter},${rOuter} 0 0 1 ${rOuter},${rOuter} v ${outerSize-2*rOuter} a ${rOuter},${rOuter} 0 0 1 -${rOuter},${rOuter} h -${outerSize-2*rOuter} a ${rOuter},${rOuter} 0 0 1 -${rOuter},-${rOuter} v -${outerSize-2*rOuter} a ${rOuter},${rOuter} 0 0 1 ${rOuter},-${rOuter}z`; const holePath = `M ${x+cs+rHole},${y+cs} h ${cs*5-2*rHole} a ${rHole},${rHole} 0 0 1 ${rHole},${rHole} v ${cs*5-2*rHole} a ${rHole},${rHole} 0 0 1 -${rHole},${rHole} h -${cs*5-2*rHole} a ${rHole},${rHole} 0 0 1 -${rHole},-${rHole} v -${cs*5-2*rHole} a ${rHole},${rHole} 0 0 1 ${rHole},-${rHole}z`; return `<g id="finder-pattern-${i+1}"><path d="${outerPath} ${holePath}" ${finderFillAttr} fill-rule="evenodd"/><rect x="${x+innerOffset}" y="${y+innerOffset}" width="${innerDotSize}" height="${innerDotSize}" rx="${rInner}" ${finderFillAttr}/></g>`; } }).join('')}</g>`; }
function generateLogoClipPath(x, y, size, style) { const clipPathId = "logo-clip-path"; let clipShape; if (style.method === 'bezier') clipShape = `<path d="${createSuperellipsePath(x, y, style)}"/>`; else clipShape = `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${style.radius}"/>`; return `<defs><clipPath id="${clipPathId}">${clipShape}</clipPath></defs>`; }
function downloadFile(content, fileName) { const a = document.createElement('a'); a.href = (typeof content === 'string' && content.startsWith('data:')) ? content : URL.createObjectURL(content); a.download = fileName; document.body.appendChild(a).click(); document.body.removeChild(a); if (!(typeof content === 'string' && content.startsWith('data:'))) URL.revokeObjectURL(a.href); }

function toggleSolidColorInputState() {
    const isGradientActive = bgGradientCheckbox.checked;
    const isImageActive = bgImageCheckbox.checked;
    
    if (isGradientActive || isImageActive) {
        bgSolidColorControl.classList.add('disabled-control');
        bgOpacityControl.classList.add('disabled-control');
    } else {
        bgSolidColorControl.classList.remove('disabled-control');
        bgOpacityControl.classList.remove('disabled-control');
    }
}

function initializePresetBackgrounds() { 
    const allPresets = document.querySelectorAll('.preset-background-item'); 
    document.getElementById('upload-background-preset')?.addEventListener('click', () => backgroundUploadInput.click()); 
    
    
    allPresets.forEach(bg => { 
        bg.addEventListener('click', () => { 
            allPresets.forEach(el => el.classList.remove('selected')); 
            bg.classList.add('selected'); 
            
            bgImageCheckbox.checked = true;
            bgImageDetails.open = true;
            bgGradientCheckbox.checked = false;
            bgGradientDetails.open = false;
            
            toggleSolidColorInputState();

            const bgSrc = bg.dataset.bgSrc; 
            if (bgSrc) { 
                const img = new Image(); 
                img.crossOrigin = "Anonymous"; 
                img.onload = function() { 
                    const canvas = document.createElement('canvas'); 
                    canvas.width = img.width; canvas.height = img.height; 
                    const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0); 
                    uploadedBackground = { type: 'image', data: canvas.toDataURL('image/png') }; 
                    updateQrStyles(); 
                }; 
                img.src = bgSrc; 
            } 
        }); 
    }); 
}

// =================================================================================
// 5. НАЗНАЧЕНИЕ ОБРАБОТЧИКОВ СОБЫТИЙ И ЗАПУСК ПРИЛОЖЕНИЯ
// =================================================================================
qrTextInput.addEventListener('input', () => { if (shortenUrlCheckbox.checked) { shortenUrlCheckbox.checked = false; shortenUrlLabel.textContent = originalShortenLabelText; } cachedShortenedUrl = null; generateNewQRCode(); });
shortenUrlCheckbox.addEventListener('change', generateNewQRCode);
downloadBtn.addEventListener('click', downloadSVG);
downloadBtnPng.addEventListener('click', downloadPNG);
copyCodeBtn.addEventListener('click', copySvgCode);
dotScaleSlider.addEventListener('input', updateQrStyles);
roundingSlider.addEventListener('input', updateQrStyles);
eyeRoundingSlider.addEventListener('input', updateQrStyles);
logoRoundingSlider.addEventListener('input', updateQrStyles);
logoSizeSlider.addEventListener('input', generateNewQRCode);
internalRoundingSlider.addEventListener('input', updateQrStyles);
logoUploadInput.addEventListener('change', handleLogoUpload);
removeLogoWrapper.addEventListener('click', handleLogoRemove);
dotColorPicker.addEventListener('input', updateQrStyles);
eyeColorPicker.addEventListener('input', updateQrStyles);
gradientColorPicker1.addEventListener('input', updateQrStyles);
gradientColorPicker2.addEventListener('input', updateQrStyles);
gradientRotationSlider.addEventListener('input', updateQrStyles);
gradientSummary.addEventListener('click', (e) => { if (!e.target.closest('.switch')) { e.preventDefault(); gradientToggleCheckbox.checked = !gradientToggleCheckbox.checked; gradientToggleCheckbox.dispatchEvent(new Event('change')); } });
gradientToggleCheckbox.addEventListener('change', () => { gradientDetails.open = gradientToggleCheckbox.checked; });
gradientDetails.addEventListener('toggle', () => { if (gradientToggleCheckbox.checked !== gradientDetails.open) gradientToggleCheckbox.checked = gradientDetails.open; updateQrStyles(); });
frameTextInput.addEventListener('input', () => { if (frameTextInput.value.length > 40) frameTextInput.value = frameTextInput.value.slice(0, 40); updateQrStyles(); });
frameBgColorPicker.addEventListener('input', updateQrStyles);
frameTextColorPicker.addEventListener('input', updateQrStyles); 
bottomFrameTextColorPicker.addEventListener('input', updateQrStyles); 
bgSolidColorPicker.addEventListener('input', updateQrStyles);
bgOpacitySlider.addEventListener('input', () => {
    bgOpacityValue.textContent = bgOpacitySlider.value;
    updateQrStyles();
});

// ЛОГИКА ДЛЯ СВИТЧЕРОВ ФОНА (ГРАДИЕНТ)
bgGradientSummary.addEventListener('click', (e) => {
    if (!e.target.closest('.switch')) {
        e.preventDefault();
        bgGradientCheckbox.checked = !bgGradientCheckbox.checked;
        bgGradientCheckbox.dispatchEvent(new Event('change'));
    }
});
bgGradientCheckbox.addEventListener('change', () => {
    bgGradientDetails.open = bgGradientCheckbox.checked;
    if (bgGradientCheckbox.checked) {
        bgImageCheckbox.checked = false;
        bgImageDetails.open = false;
    }
    toggleSolidColorInputState();
    updateQrStyles();
});
bgGradientDetails.addEventListener('toggle', () => {
    if (bgGradientCheckbox.checked !== bgGradientDetails.open) {
        bgGradientCheckbox.checked = bgGradientDetails.open;
        bgGradientCheckbox.dispatchEvent(new Event('change'));
    }
});

// ЛОГИКА ДЛЯ СВИТЧЕРОВ ФОНА (КАРТИНКА)
bgImageSummary.addEventListener('click', (e) => {
    if (!e.target.closest('.switch')) {
        e.preventDefault();
        bgImageCheckbox.checked = !bgImageCheckbox.checked;
        bgImageCheckbox.dispatchEvent(new Event('change'));
    }
});
bgImageCheckbox.addEventListener('change', () => {
    bgImageDetails.open = bgImageCheckbox.checked;
    if (bgImageCheckbox.checked) {
        bgGradientCheckbox.checked = false;
        bgGradientDetails.open = false;
    } 
    toggleSolidColorInputState();
    updateQrStyles();
});
bgImageDetails.addEventListener('toggle', () => {
    if (bgImageCheckbox.checked !== bgImageDetails.open) {
        bgImageCheckbox.checked = bgImageDetails.open;
        bgImageCheckbox.dispatchEvent(new Event('change'));
    }
});

bgGradientColor1.addEventListener('input', updateQrStyles);
bgGradientColor2.addEventListener('input', updateQrStyles);
bgGradientRotationSlider.addEventListener('input', updateQrStyles);

confirmCropBtn.addEventListener('click', () => {
    if (!cropper) return;
    const canvas = cropper.getCroppedCanvas({ width: 512, height: 512, imageSmoothingQuality: 'high' });
    const croppedImageDataURL = canvas.toDataURL('image/png');
    if (currentCropTarget === 'logo') {
        isLogoActive = true;
        isPlaceholderLogoActive = false;
        document.querySelectorAll('.preset-logo-wrapper').forEach(el => el.classList.remove('selected'));
        uploadedLogo = { type: 'raster', previewData: croppedImageDataURL, fullData: croppedImageDataURL };
        logoPreview.src = croppedImageDataURL;
        removeLogoWrapper.style.display = 'flex';
        updateLogoButtonText();
        toggleLogoSlidersState(false);
    } else if (currentCropTarget === 'background') {
        uploadedBackground = { type: 'image', data: croppedImageDataURL };
        document.querySelectorAll('.preset-background-item').forEach(el => el.classList.remove('selected'));
        bgImageCheckbox.checked = true;
        bgImageDetails.open = true;
        bgGradientCheckbox.checked = false;
        bgGradientDetails.open = false;
        toggleSolidColorInputState();
    }
    generateNewQRCode();
    cropModal.style.display = 'none';
    cropper.destroy();
    cropper = null;
    logoUploadInput.value = '';
    backgroundUploadInput.value = '';
});

cancelCropBtn.addEventListener('click', () => {
    cropModal.style.display = 'none';
    if (cropper) cropper.destroy();
    cropper = null;
    logoUploadInput.value = '';
    backgroundUploadInput.value = '';
});

backgroundUploadInput.addEventListener('change', handleBackgroundUpload);

document.fonts.ready.then(() => {
    console.log('Все CSS шрифты загружены.');
    generateNewQRCode();
});

initializePresetLogos();
initializePresetFrames();
initializePresetBackgrounds();
gradientToggleCheckbox.checked = gradientDetails.open;

toggleColorInputsState(gradientDetails.open);
toggleLogoSlidersState(!isLogoActive);
toggleSolidColorInputState(); 

frameTextControl.style.display = 'none';
frameTextColorControl.style.display = 'none';
frameBgColorControl.style.display = 'none';
