// 잔소리 들어주는 앱 JavaScript

// DOM 요소들
const titleInput = document.getElementById('titleInput');
const complaintInput = document.getElementById('complaintInput');
const tagsInput = document.getElementById('tagsInput');
const submitBtn = document.getElementById('submitBtn');
const responseArea = document.getElementById('responseArea');
const responseText = document.getElementById('responseText');
const charCount = document.getElementById('charCount');
const emotionButtons = document.getElementById('emotionButtons');
const historyList = document.getElementById('historyList');
const historyToggleBtn = document.getElementById('historyToggleBtn');
const historySection = document.getElementById('historySection');
const closeHistoryBtn = document.getElementById('closeHistoryBtn');
const toggleIcon = document.getElementById('toggleIcon');
const toggleText = document.getElementById('toggleText');

// 감정 데이터베이스
const emotions = {
    '😢': '슬픔',
    '😠': '화남',
    '😰': '불안',
    '😔': '우울',
    '😤': '짜증',
    '😫': '피곤',
    '😕': '불만',
    '😞': '실망',
    '😡': '분노',
    '😭': '울음'
};

// 잔소리 응답 템플릿
const responses = {
    empathy: [
        "정말 힘드셨겠어요. 그런 상황이라면 누구라도 속상할 수밖에 없을 것 같아요.",
        "당신의 감정이 충분히 이해됩니다. 그런 일이 있었다니 정말 답답하셨을 것 같아요.",
        "그런 일을 겪으셨다니 정말 마음이 아프네요. 혼자 감당하기 어려운 일이었을 거예요.",
        "당신의 기분을 완전히 이해해요. 그런 상황이라면 누구라도 화가 날 수밖에 없을 것 같아요."
    ],
    advice: [
        "이런 상황에서는 잠시 멈춰서 심호흡을 해보는 것도 좋을 것 같아요.",
        "혹시 주변에 도움을 요청할 수 있는 사람이 있는지 생각해보시는 건 어떨까요?",
        "이런 일이 있을 때는 자신을 너무 탓하지 마시고, 충분히 쉬어가시는 것도 중요해요.",
        "작은 것부터 하나씩 해결해나가다 보면 분명 좋은 결과가 있을 거예요."
    ],
    encouragement: [
        "당신은 충분히 잘하고 있어요. 이런 어려운 상황을 견디고 계신 것만으로도 대단해요.",
        "힘든 시간이지만 분명 지나갈 거예요. 당신은 더 강해질 수 있어요.",
        "지금은 어려워 보이지만, 나중에 돌아보면 성장의 계기가 될 수도 있어요.",
        "당신의 노력은 분명히 보상받을 거예요. 포기하지 마세요!"
    ]
};

// 감정 분석 함수
function analyzeEmotion(text) {
    const emotionKeywords = {
        '😢': ['슬프', '눈물', '울고', '우울', '힘들', '아프'],
        '😠': ['화나', '짜증', '열받', '분노', '화내', '빡쳐'],
        '😰': ['불안', '걱정', '무서', '두려', '초조', '긴장'],
        '😔': ['우울', '침울', '기운없', '의욕없', '우울'],
        '😤': ['짜증', '답답', '화나', '열받', '빡쳐'],
        '😫': ['피곤', '지쳐', '힘들', '몸살', '피로'],
        '😕': ['불만', '답답', '아쉬', '실망', '서운'],
        '😞': ['실망', '아쉬', '서운', '섭섭', '후회'],
        '😡': ['분노', '화나', '열받', '빡쳐', '짜증'],
        '😭': ['울고', '눈물', '슬프', '아프', '힘들']
    };

    let detectedEmotions = [];
    let maxScore = 0;
    let dominantEmotion = '😕';

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
        let score = 0;
        keywords.forEach(keyword => {
            if (text.includes(keyword)) {
                score++;
            }
        });
        
        if (score > maxScore) {
            maxScore = score;
            dominantEmotion = emotion;
        }
        
        if (score > 0) {
            detectedEmotions.push(emotion);
        }
    }

    return {
        dominant: dominantEmotion,
        all: detectedEmotions.length > 0 ? detectedEmotions : ['😕']
    };
}

// 응답 생성 함수
function generateResponse(text, emotion) {
    const responseTypes = ['empathy', 'advice', 'encouragement'];
    const randomType = responseTypes[Math.floor(Math.random() * responseTypes.length)];
    
    let response = responses[randomType][Math.floor(Math.random() * responses[randomType].length)];
    
    // 감정에 따른 맞춤 응답 추가
    if (emotion === '😢' || emotion === '😭') {
        response += " 슬픈 마음이 충분히 이해돼요. 혼자 감당하기 어려운 일이었다면 주변 사람들에게 도움을 요청해보세요.";
    } else if (emotion === '😠' || emotion === '😡') {
        response += " 화가 나는 상황이었군요. 하지만 그 감정을 건강하게 표현하는 방법을 찾아보시는 것도 좋을 것 같아요.";
    } else if (emotion === '😰') {
        response += " 불안한 마음이 느껴져요. 이런 때일수록 작은 것부터 차근차근 해결해나가시면 좋을 것 같아요.";
    }
    
    return response;
}

// 로딩 애니메이션 표시
function showLoading() {
    submitBtn.innerHTML = '<span class="loading"></span> 처리 중...';
    submitBtn.disabled = true;
}

// 로딩 애니메이션 숨기기
function hideLoading() {
    submitBtn.innerHTML = '💬 잔소리 하기';
    submitBtn.disabled = false;
}

// 응답 표시 함수
function showResponse(text, emotion, response) {
    const analysis = analyzeEmotion(text);
    
    responseText.innerHTML = `
        <div style="margin-bottom: 15px;">
            <strong>감정 분석:</strong> ${analysis.dominant} ${emotions[analysis.dominant]}
        </div>
        <div>
            <strong>응답:</strong><br>
            ${response}
        </div>
    `;
    
    responseArea.classList.remove('hidden');
    responseArea.classList.add('show');
    
    // 스크롤을 응답 영역으로 이동
    responseArea.scrollIntoView({ behavior: 'smooth' });
}

// 폼 초기화 함수
function clearForm() {
    titleInput.value = '';
    complaintInput.value = '';
    tagsInput.value = '';
    charCount.textContent = '0';
    charCount.className = 'char-counter';
    
    // 선택된 감정 버튼 해제
    const selectedBtn = document.querySelector('.emotion-btn.selected');
    if (selectedBtn) {
        selectedBtn.classList.remove('selected');
    }
    
    titleInput.focus();
}

// 히스토리 표시 업데이트
function updateHistoryDisplay() {
    const history = getStoredData();
    
    if (history.length === 0) {
        historyList.innerHTML = '<div class="no-history">아직 기록된 잔소리가 없습니다. 첫 번째 잔소리를 작성해보세요!</div>';
        return;
    }
    
    historyList.innerHTML = history.map(item => `
        <div class="history-item" onclick="showHistoryDetail(${JSON.stringify(item).replace(/"/g, '&quot;')})">
            <div class="history-item-header">
                <div>
                    <span class="history-item-emotion">${item.emotion}</span>
                    <span class="history-item-title">${item.title}</span>
                </div>
                <div class="history-item-date">${formatDate(item.createdAt)}</div>
            </div>
            <div class="history-item-content">${item.content.substring(0, 100)}${item.content.length > 100 ? '...' : ''}</div>
            ${item.tags.length > 0 ? `
                <div class="history-item-tags">
                    ${item.tags.map(tag => `<span class="history-tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

// 날짜 포맷팅 함수
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return '오늘';
    } else if (diffDays === 2) {
        return '어제';
    } else if (diffDays <= 7) {
        return `${diffDays - 1}일 전`;
    } else {
        return date.toLocaleDateString('ko-KR', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
}

// 로컬 스토리지에서 데이터 가져오기
function getStoredData() {
    const data = localStorage.getItem('complaintHistory');
    return data ? JSON.parse(data) : [];
}

// 로컬 스토리지에 데이터 저장하기
function saveToStorage(data) {
    localStorage.setItem('complaintHistory', JSON.stringify(data));
}

// 폼 제출 처리
function handleSubmit() {
    const title = titleInput.value.trim();
    const text = complaintInput.value.trim();
    const tags = tagsInput.value.trim();
    const selectedEmotion = document.querySelector('.emotion-btn.selected');
    
    if (!text) {
        alert('잔소리할 내용을 입력해주세요!');
        complaintInput.focus();
        return;
    }
    
    if (text.length < 10) {
        alert('좀 더 자세히 써주시면 더 좋은 응답을 드릴 수 있어요!');
        complaintInput.focus();
        return;
    }
    
    showLoading();
    
    // 실제 앱에서는 여기서 Firebase에 저장하거나 AI API를 호출할 수 있습니다
    setTimeout(() => {
        const emotion = selectedEmotion ? selectedEmotion.dataset.emotion : '😕';
        const analysis = analyzeEmotion(text);
        const response = generateResponse(text, analysis.dominant);
        
        // 데이터 저장
        const complaintData = {
            id: Date.now(),
            title: title || '제목 없음',
            content: text,
            emotion: emotion,
            tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
            createdAt: new Date().toISOString(),
            response: response
        };
        
        const history = getStoredData();
        history.unshift(complaintData); // 최신 항목을 맨 앞에 추가
        saveToStorage(history);
        
        showResponse(text, emotion, response);
        updateHistoryDisplay();
        hideLoading();
        
        // 폼 초기화
        clearForm();
    }, 1500);
}

// 이벤트 리스너 등록
submitBtn.addEventListener('click', handleSubmit);

complaintInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        handleSubmit();
    }
});

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    titleInput.focus();
    
    // 히스토리는 기본적으로 숨김 상태로 시작
    historySection.classList.add('hidden');
    
    // 환영 메시지 표시
    setTimeout(() => {
        if (!complaintInput.value.trim()) {
            responseText.innerHTML = `
                <div style="text-align: center; color: #718096;">
                    <h4>👋 안녕하세요!</h4>
                    <p>마음 속 이야기를 자유롭게 써보세요.<br>
                    당신의 감정을 이해하고 함께해드릴게요.</p>
                </div>
            `;
            responseArea.classList.remove('hidden');
            responseArea.classList.add('show');
        }
    }, 1000);
});

// 키보드 단축키
document.addEventListener('keydown', (e) => {
    // ESC 키로 응답 영역 숨기기
    if (e.key === 'Escape') {
        responseArea.classList.add('hidden');
        responseArea.classList.remove('show');
        complaintInput.focus();
    }
});

// 텍스트 카운터 기능
function updateCharCount() {
    const text = complaintInput.value;
    const maxLength = 1000;
    
    charCount.textContent = text.length;
    
    if (text.length > maxLength) {
        complaintInput.value = text.substring(0, maxLength);
        charCount.textContent = maxLength;
    }
    
    // 색상 변경
    charCount.className = 'char-counter';
    if (text.length > maxLength * 0.9) {
        charCount.className = 'char-counter danger';
    } else if (text.length > maxLength * 0.8) {
        charCount.className = 'char-counter warning';
    }
}

complaintInput.addEventListener('input', updateCharCount);

// 감정 이모지 버튼 생성
function createEmotionButtons() {
    Object.keys(emotions).forEach(emotion => {
        const btn = document.createElement('button');
        btn.className = 'emotion-btn';
        btn.dataset.emotion = emotion;
        btn.innerHTML = `
            <span>${emotion}</span>
            <span class="emotion-text">${emotions[emotion]}</span>
        `;
        btn.title = emotions[emotion];
        emotionButtons.appendChild(btn);
    });
}

// 감정 버튼 이벤트
function addEmotionButtonEvents() {
    const emotionBtns = document.querySelectorAll('.emotion-btn');
    emotionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            emotionBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });
}

// 히스토리 토글 기능
function toggleHistory() {
    const isHidden = historySection.classList.contains('hidden');
    
    if (isHidden) {
        // 히스토리 보이기
        historySection.classList.remove('hidden');
        setTimeout(() => {
            historySection.classList.add('show');
        }, 10);
        
        // 버튼 텍스트 변경
        toggleIcon.textContent = '📖';
        toggleText.textContent = '기록 숨기기';
        
        // 히스토리 업데이트
        updateHistoryDisplay();
    } else {
        // 히스토리 숨기기
        historySection.classList.remove('show');
        setTimeout(() => {
            historySection.classList.add('hidden');
        }, 400);
        
        // 버튼 텍스트 변경
        toggleIcon.textContent = '📚';
        toggleText.textContent = '기록 보기';
    }
}

// 히스토리 닫기 기능
function closeHistory() {
    historySection.classList.remove('show');
    setTimeout(() => {
        historySection.classList.add('hidden');
    }, 400);
    
    // 버튼 텍스트 변경
    toggleIcon.textContent = '📚';
    toggleText.textContent = '기록 보기';
}

// 히스토리 아이템 클릭 시 상세 보기
function showHistoryDetail(item) {
    const modal = document.createElement('div');
    modal.className = 'history-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${item.emotion} ${item.title}</h3>
                <button class="modal-close-btn">✕</button>
            </div>
            <div class="modal-body">
                <div class="modal-date">${formatDate(item.createdAt)}</div>
                <div class="modal-content-text">${item.content}</div>
                ${item.tags.length > 0 ? `
                    <div class="modal-tags">
                        ${item.tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="modal-response">
                    <h4>AI 응답:</h4>
                    <p>${item.response}</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 모달 닫기 이벤트
    modal.querySelector('.modal-close-btn').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// 이벤트 리스너 등록
historyToggleBtn.addEventListener('click', toggleHistory);
closeHistoryBtn.addEventListener('click', closeHistory);

// 초기화 함수들 호출
createEmotionButtons();
addEmotionButtonEvents();
