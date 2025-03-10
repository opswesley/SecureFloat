const lengthInput = document.getElementById('length');
const lengthValue = document.getElementById('length-value');
const uppercaseCheck = document.getElementById('uppercase');
const lowercaseCheck = document.getElementById('lowercase');
const numbersCheck = document.getElementById('numbers');
const symbolsCheck = document.getElementById('symbols');
const useCustomCheck = document.getElementById('use-custom');
const customPassword = document.getElementById('custom-password');
const mixMode = document.getElementById('mix-mode');
const customOptions = document.getElementById('custom-options');
const generateBtn = document.getElementById('generate');
const passwordField = document.getElementById('password');
const copyBtn = document.getElementById('copy');
const strengthText = document.getElementById('strength-text');
const strengthBar = document.getElementById('strength-bar');

lengthInput.addEventListener('input', () => {
    lengthValue.textContent = lengthInput.value;
});

useCustomCheck.addEventListener('change', () => {
    customOptions.style.display = useCustomCheck.checked ? 'block' : 'none';
});

function getRandomChars(chars, length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;
}

function shuffleString(str) {
    return str.split('').sort(() => Math.random() - 0.5).join('');
}

function calculateStrength(password) {
    if (!password || password.length === 0) {
        strengthText.textContent = 'Força: Nenhuma';
        strengthBar.className = '';
        return;
    }

    const length = password.length;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*()_+[\]{}|;:,.<>?]/.test(password);

    let charTypes = 0;
    if (hasUpper) charTypes++;
    if (hasLower) charTypes++;
    if (hasNumbers) charTypes++;
    if (hasSymbols) charTypes++;

    const charSetSize = (hasUpper ? 26 : 0) + (hasLower ? 26 : 0) + (hasNumbers ? 10 : 0) + (hasSymbols ? 15 : 0);
    const entropy = length * (charSetSize > 0 ? Math.log2(charSetSize) : 0);

    const uniqueChars = new Set(password).size;
    const repetitionPenalty = uniqueChars / length;

    let strengthScore = entropy * repetitionPenalty;

    if (strengthScore < 30 || length < 8) {
        strengthText.textContent = 'Força: Fraca';
        strengthBar.className = 'fraca';
    } else if (strengthScore < 60 || charTypes < 3) {
        strengthText.textContent = 'Força: Média';
        strengthBar.className = 'media';
    } else {
        strengthText.textContent = 'Força: Forte';
        strengthBar.className = 'forte';
    }
}

function generatePassword() {
    const length = parseInt(lengthInput.value);
    const hasUpper = uppercaseCheck.checked;
    const hasLower = lowercaseCheck.checked;
    const hasNumbers = numbersCheck.checked;
    const hasSymbols = symbolsCheck.checked;
    const useCustom = useCustomCheck.checked;
    const customBase = useCustom ? customPassword.value.trim() : '';

    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    let availableChars = '';
    if (hasUpper) availableChars += upperChars;
    if (hasLower) availableChars += lowerChars;
    if (hasNumbers) availableChars += numberChars;
    if (hasSymbols) availableChars += symbolChars;

    if (!useCustom && availableChars === '') {
        passwordField.value = 'Marque ao menos uma opção para gerar a senha!';
        calculateStrength('');
        return;
    }
    if (useCustom && !customBase && availableChars === '') {
        passwordField.value = 'Digite uma senha ou marque uma opção!';
        calculateStrength('');
        return;
    }

    let password = '';

    if (!useCustom || (useCustom && !customBase)) {
        password = getRandomChars(availableChars, length);
    } else {
        let base = customBase;
        const mode = mixMode.value;

        let extraChars = '';
        if (availableChars) {
            extraChars = getRandomChars(availableChars, Math.max(3, length - base.length));
        }

        let combined = '';
        switch (mode) {
            case 'mix':
                combined = shuffleString(base + extraChars);
                break;
            case 'before':
                combined = extraChars + base;
                break;
            case 'middle':
                const midPoint = Math.floor(base.length / 2);
                combined = base.slice(0, midPoint) + extraChars + base.slice(midPoint);
                break;
            case 'after':
                combined = base + extraChars;
                break;
        }

        if (combined.length > length) {
            password = combined.slice(0, length);
        } else if (combined.length < length) {
            const additionalLength = length - combined.length;
            password = combined + getRandomChars(availableChars || base, additionalLength);
        } else {
            password = combined;
        }
    }

    passwordField.value = password;
    calculateStrength(password);
}

function copyPassword() {
    passwordField.select();
    document.execCommand('copy');
    copyBtn.textContent = 'Copiado!';
    copyBtn.classList.add('copied');
    setTimeout(() => {
        copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copiar';
        copyBtn.classList.remove('copied');
    }, 2000);
}

generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyPassword);