const express = require('express');
const cors = require('cors'); // CORS 모듈 불러오기
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3002;  // Render가 제공하는 동적 포트 사용

// 슬랙 웹훅 URL
const slackWebhookUrl = 'https://hooks.slack.com/services/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';

// CORS 설정 - 특정 도메인만 허용하도록 설정
app.use(cors({
    origin: 'https://2basekit.com', // 아임웹 도메인 주소로 변경
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// JSON 데이터 파싱을 위한 미들웨어 설정
app.use(express.json());

app.get('/', (req, res) => {
    res.send('서버가 성공적으로 실행되었습니다!');
});

app.post('/send-estimate', (req, res) => {
    const estimateData = {
        product: req.body.product,
        volume: req.body.volume,
        quantity: req.body.quantity,
        date: req.body.date,
        customerName: req.body.customerName,
        customerEmail: req.body.customerEmail
    };

    axios.post(slackWebhookUrl, {
        text: `새로운 견적서 요청이 도착했습니다!\n제품: ${estimateData.product}\n용량: ${estimateData.volume}\n수량: ${estimateData.quantity}\n날짜: ${estimateData.date}\n\n고객 이름(업체명): ${estimateData.customerName}\n이메일: ${estimateData.customerEmail}`
    })
    .then(response => {
        res.send('슬랙으로 견적서 요청이 성공적으로 전송되었습니다!');
    })
    .catch(error => {
        console.error('슬랙 메시지 전송 오류:', error);
        res.status(500).send('슬랙으로 메시지 전송에 실패했습니다.');
    });
});

app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});

