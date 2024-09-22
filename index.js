const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3002;

// 슬랙 웹훅 URL
const slackWebhookUrl = 'https://hooks.slack.com/services/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';

// CORS 설정 - 특정 도메인만 허용하도록 설정
app.use(cors({
    origin: ['https://2basekit.com', 'https://2base7950977.imweb.me'], // 허용할 도메인 리스트
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// JSON 데이터 파싱을 위한 미들웨어 설정
app.use(express.json());

// 기본 라우트 - 서버 실행 확인용
app.get('/', (req, res) => {
    res.send('서버가 성공적으로 실행되었습니다!');
});

// 견적서 요청 처리 라우트
app.post('/send-estimate', (req, res) => {
    const { product, volume, quantity, date, customerName, customerEmail } = req.body;

    // 슬랙으로 전송할 메시지 생성
    const slackMessage = {
        text: `새로운 견적서 요청이 도착했습니다!\n제품: ${product}\n용량: ${volume}\n수량: ${quantity}\n날짜: ${date}\n\n고객 이름(업체명): ${customerName}\n이메일: ${customerEmail}`
    };

    // 슬랙 웹훅을 통해 메시지 전송
    axios.post(slackWebhookUrl, slackMessage)
        .then(response => {
            console.log(`슬랙 응답 코드: ${response.status}`); // 응답 코드 출력
            res.send('슬랙으로 견적서 요청이 성공적으로 전송되었습니다!');
        })
        .catch(error => {
            console.error('슬랙 메시지 전송 오류:', error.response ? error.response.data : error.message);
            res.status(500).send('슬랙으로 메시지 전송에 실패했습니다.');
        });
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
